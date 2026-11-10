/* ============================================================================
   MODULE: src/Core/GameManager.js
   Quản lý Trạng thái Trò chơi: Menu, Playing, LevelUp, GameOver, Paused
   Điều phối Vòng đời, Thực thể Thực chiến & Hiệu ứng Chiến trường
   ============================================================================ */

// Tự động nạp MapController nếu chưa có trong DOM (Clean Architecture: Core/Map/)
if (typeof document !== 'undefined' && !window.MapController) {
    const s = document.createElement('script');
    s.src = 'SurvivalIO/Assets/_Project/Scripts/Core/Controllers/MapController.js';
    s.onerror = () => {
        const s2 = document.createElement('script');
        s2.src = './Assets/_Project/Scripts/Core/Controllers/MapController.js';
        document.head.appendChild(s2);
    };
    document.head.appendChild(s);
}

window.GameStates = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    LEVEL_UP: 'LEVEL_UP',
    GAME_OVER: 'GAME_OVER',
    PAUSED: 'PAUSED'
};

window.GameManager = {
    canvas: null,
    ctx: null,
    state: window.GameStates.MENU,
    elapsedTime: 0,
    kills: 0,
    diamonds: 0,
    enemyIdCounter: 1,

    player: null,
    enemies: [],
    projectiles: [],
    orbs: [],
    particles: [],
    floatingTexts: [],
    lightningArcs: [],
    kirinStrikes: [],
    clones: [],

    bossSpawned5m: false,
    bossSpawned10m: false,
    spawnTimer: 0,

    remainingRerolls: 0,
    remainingBans: 0,
    bannedSkills: new Set(),
    wasdTimeout: null,

    // Nền sống động Lobby
    lobby: {
        initialized: false,
        time: 0,
        leaves: [],
        ninjas: []
    },

    // Khởi tạo GameManager với Canvas
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (window.MapController && typeof window.MapController.init === 'function') {
            try {
                window.MapController.init();
            } catch (err) {
                console.error("Lỗi MapController init:", err);
            }
        }
        this.initLobby();
    },

    // Khởi tạo nền sống động Làng Lá trong Lobby
    initLobby() {
        this.lobby.initialized = true;
        this.lobby.time = 0;
        this.lobby.leaves = [];
        this.lobby.ninjas = [];

        // 35 lá rơi Konoha
        for (let i = 0; i < 35; i++) {
            this.lobby.leaves.push({
                x: Math.random() * (this.canvas ? this.canvas.width : window.innerWidth),
                y: Math.random() * (this.canvas ? this.canvas.height : window.innerHeight),
                size: 6 + Math.random() * 8,
                speedX: 25 + Math.random() * 45,
                speedY: 20 + Math.random() * 30,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 3,
                color: Math.random() > 0.4 ? '#4ade80' : '#facc15'
            });
        }

        // 5 Nhẫn giả tự do chạy nhảy luyện tập trên nền cỏ Làng Lá
        const ambientTypes = ['clone', 'clone', 'sasuke', 'kakashi', 'anbu'];
        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;
        for (let i = 0; i < ambientTypes.length; i++) {
            const rx = w * 0.15 + Math.random() * w * 0.7;
            const ry = h * 0.25 + Math.random() * h * 0.6;
            this.lobby.ninjas.push({
                id: i,
                type: ambientTypes[i],
                x: rx,
                y: ry,
                targetX: rx + (Math.random() - 0.5) * 350,
                targetY: ry + (Math.random() - 0.5) * 250,
                speed: 75 + Math.random() * 60,
                facing: Math.random() > 0.5 ? 1 : -1,
                animTime: Math.random() * 10,
                idleTimer: Math.random() * 2
            });
        }
    },

    // Cập nhật nền Lobby
    updateLobby(dt) {
        if (!this.lobby.initialized) this.initLobby();
        this.lobby.time += dt;

        // Camera chuyển động nghệ thuật quanh thảo nguyên Làng Lá
        window.Camera.x = Math.sin(this.lobby.time * 0.25) * 60;
        window.Camera.y = Math.cos(this.lobby.time * 0.18) * 40;

        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;

        // Cập nhật lá rơi
        for (const lf of this.lobby.leaves) {
            lf.x += (lf.speedX + Math.sin(this.lobby.time * 2 + lf.y * 0.02) * 15) * dt;
            lf.y += lf.speedY * dt;
            lf.angle += lf.rotSpeed * dt;
            if (lf.x > w + 30) lf.x = -30;
            if (lf.y > h + 30) lf.y = -30;
        }

        // Cập nhật nhẫn giả
        for (const n of this.lobby.ninjas) {
            n.animTime += dt;
            if (n.idleTimer > 0) {
                n.idleTimer -= dt;
                continue;
            }
            const dx = n.targetX - n.x;
            const dy = n.targetY - n.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 15) {
                n.idleTimer = 1.0 + Math.random() * 2.5;
                n.targetX = w * 0.1 + Math.random() * w * 0.8 + window.Camera.x;
                n.targetY = h * 0.2 + Math.random() * h * 0.7 + window.Camera.y;
            } else {
                const vx = (dx / dist) * n.speed;
                const vy = (dy / dist) * n.speed;
                n.x += vx * dt;
                n.y += vy * dt;
                n.facing = vx >= 0 ? 1 : -1;
            }
        }

        if (window.LobbyView && typeof window.LobbyView.renderShowcase === 'function') {
            window.LobbyView.renderShowcase(this.lobby.time);
        }
    },

    // Vẽ nền Lobby
    renderLobby() {
        const camX = window.Camera.x;
        const camY = window.Camera.y;
        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;

        // Vẽ sân cỏ Làng Lá
        window.SpriteRenderer.drawBattlefield(this.ctx, camX, camY, w, h);

        // Vẽ các nhẫn giả tự do chạy nhảy
        if (this.lobby.ninjas) {
            for (const n of this.lobby.ninjas) {
                window.SpriteRenderer.drawShinobi(
                    this.ctx,
                    n.x - camX,
                    n.y - camY,
                    18,
                    n.animTime,
                    n.facing,
                    n.type === 'clone',
                    false,
                    1,
                    n.type
                );
            }
        }

        // Vẽ lá rơi Konoha
        if (this.lobby.leaves) {
            for (const lf of this.lobby.leaves) {
                this.ctx.save();
                this.ctx.translate(lf.x, lf.y);
                this.ctx.rotate(lf.angle);
                this.ctx.fillStyle = lf.color;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, lf.size, lf.size * 0.5, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = "rgba(0,0,0,0.25)";
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    },

    // Bắt đầu một trận chiến sinh tồn mới
    startNewRun(customStartingSkill = null) {
        if (window.SFXController) {
            window.SFXController.init();
            window.SFXController.uiClick();
        }
        if (window.MusicController) {
            window.MusicController.startBGM();
        }

        this.state = window.GameStates.PLAYING;
        this.elapsedTime = 0;
        this.kills = 0;
        this.diamonds = 0;
        this.enemies = [];
        this.projectiles = [];
        this.orbs = [];
        this.particles = [];
        this.floatingTexts = [];
        this.lightningArcs = [];
        this.kirinStrikes = [];
        this.clones = [];
        this.bossSpawned5m = false;
        this.bossSpawned10m = false;
        this.spawnTimer = 0;

        // Khởi tạo Player qua PlayerStats
        this.player = window.PlayerStats.createPlayer(customStartingSkill);

        // Khởi tạo lượt Reroll và Ban từ TalentTree
        const talents = window.StorageManager.data.talents || {};
        this.remainingRerolls = talents.reroll || 0;
        this.remainingBans = talents.ban || 0;
        this.bannedSkills = new Set();

        // Đặt Camera bám ngay tâm nhân vật
        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;
        window.Camera.setPosition(this.player.x - w / 2, this.player.y - h / 2);

        // Hiển thị HUD và đóng tất cả modal
        if (window.HUDView) window.HUDView.show();
        if (window.LobbyView) window.LobbyView.hide();
        if (window.LevelUpModal) window.LevelUpModal.hide();
        if (window.GameOverModal) window.GameOverModal.hide();

        // Khởi tạo lại bản đồ vô tận theo ải đã chọn
        if (window.MapController && typeof window.MapController.onMatchStart === 'function') {
            try {
                window.MapController.onMatchStart();
            } catch (err) {
                console.error("Lỗi MapController onMatchStart:", err);
            }
        }

        // Đồng bộ phân thân Kage Bunshin
        if (window.SkillSystem) window.SkillSystem.syncClones(this);
        if (window.HUDView) window.HUDView.update(this.player, this);

        // Khởi đầu nhẫn thuật tại 00:00: Nếu chưa có kỹ năng chủ động nào, kích hoạt Modal chọn 1 chiêu tấn công
        if (!this.player.acquiredActive || this.player.acquiredActive.length === 0) {
            this.state = window.GameStates.LEVEL_UP;
            if (window.LevelUpModal) {
                window.LevelUpModal.show(this, true);
            }
        }
    },

    // Tìm kẻ địch gần nhất quanh tọa độ (x, y)
    findNearestEnemy(x, y, maxDist = 750) {
        let nearest = null;
        let bestDistSq = maxDist * maxDist;
        for (let i = 0; i < this.enemies.length; i++) {
            const e = this.enemies[i];
            if (e.dead) continue;
            const dx = e.x - x;
            const dy = e.y - y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDistSq) {
                bestDistSq = d2;
                nearest = e;
            }
        }
        return nearest;
    },

    // Thêm chữ sát thương / thông báo nổi
    addFloatingText(x, y, text, color = '#ffffff', size = 14) {
        if (this.floatingTexts.length > 50) this.floatingTexts.shift();
        this.floatingTexts.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y - 10,
            text,
            color,
            size,
            life: 0.65,
            maxLife: 0.65
        });
    },

    // Tạo chùm hạt nổ / khói
    spawnExplosionParticles(x, y, color, count = 14) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length > 180) this.particles.shift();
            const ang = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 160;
            this.particles.push({
                x, y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                radius: 2.5 + Math.random() * 4,
                color,
                life: 0.35 + Math.random() * 0.35,
                maxLife: 0.7
            });
        }
    },

    // Tạo làn khói trắng "Bùm" (Poof Smoke Particle) thế thân khi quái chết
    spawnPoofSmoke(x, y, count = 16) {
        const colors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'];
        for (let i = 0; i < count; i++) {
            if (this.particles.length > 200) this.particles.shift();
            const ang = Math.random() * Math.PI * 2;
            const spd = 20 + Math.random() * 85;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 14,
                y: y + (Math.random() - 0.5) * 14,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd * 0.7 - 25,
                radius: 4.5 + Math.random() * 6.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0.35 + Math.random() * 0.25,
                maxLife: 0.6
            });
        }
    },

    // Triệu hồi Lôi Độn: Kỳ Lân (Kirin - Thức Tỉnh 6★)
    triggerKirinStrike(tx, ty) {
        if (window.SFXController) window.SFXController.chidori();
        window.Camera.shake(0.45, 12);
        this.addFloatingText(tx, ty - 35, "🌩️ KỲ LÂN (KIRIN)!", "#22d3ee", 22);
        this.spawnExplosionParticles(tx, ty, '#22d3ee', 36);
        this.spawnExplosionParticles(tx, ty, '#ffffff', 22);
        this.spawnExplosionParticles(tx, ty, '#38bdf8', 18);

        this.kirinStrikes.push({
            tx, ty,
            life: 0.48,
            maxLife: 0.48
        });

        // Sát thương nổ lan diện rộng x3 quy mô
        const dmg = Math.round(380 * (this.player ? (this.player.damageMultiplier || 1) : 1));
        const aoeRadius = 200;
        for (let i = 0; i < this.enemies.length; i++) {
            const e = this.enemies[i];
            if (e.dead) continue;
            const dist = Math.hypot(e.x - tx, e.y - ty);
            if (dist <= aoeRadius) {
                window.DamageSystem.damageEnemy(this, e, dmg, 50, tx, ty, '#22d3ee');
            }
        }
    },

    // Cập nhật toàn bộ Logic theo delta time dt
    update(dt) {
        if (this.state === window.GameStates.MENU) {
            this.updateLobby(dt);
            return;
        }

        if (this.state !== window.GameStates.PLAYING) return;

        this.elapsedTime += dt;
        const p = this.player;
        if (!p) return;

        // 1. Tự lành vết thương từ thiên phú
        if (p.hpRegen > 0 && p.hp < p.maxHp) {
            p.hp = Math.min(p.maxHp, p.hp + p.hpRegen * dt);
        }

        // 2. Di chuyển nhân vật qua PlayerController
        window.PlayerController.update(dt, p, this);

        // 3. Camera bám theo người chơi
        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;
        window.Camera.update(dt, p.x, p.y, w, h);

        // 4. Sinh quái theo thời gian (EnemySpawner)
        window.EnemySpawner.update(dt, this);

        // 5. Tự động thi triển nhẫn thuật (SkillSystem & EvolutionSystem)
        window.SkillSystem.updateAutoSkills(dt, this);

        // 6. Cập nhật vị trí đạn & va chạm (Projectiles & HitboxCollision)
        window.Projectiles.update(dt, this);
        window.HitboxCollision.checkProjectilesCollision(dt, this);

        // Cập nhật Bản Đồ Vô Tận (an toàn, không làm sập update loop)
        if (window.MapController && typeof window.MapController.update === 'function') {
            try {
                window.MapController.update(dt, this);
            } catch (err) {
                console.error("Lỗi MapController update:", err);
            }
        }

        // 7. Cập nhật di chuyển & hành vi quái vật (EnemyMovement & Boss)
        window.EnemyMovement.update(dt, this);

        // 8. Cập nhật hút hạt Chakra EXP & Ryo (DropItems)
        window.DropItems.update(dt, this);

        // 9. Cập nhật hiệu ứng hạt nổ, tia sét, chữ nổi
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.life -= dt;
            if (pt.life <= 0) this.particles.splice(i, 1);
        }
        for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
            this.lightningArcs[i].life -= dt;
            if (this.lightningArcs[i].life <= 0) this.lightningArcs.splice(i, 1);
        }
        for (let i = this.kirinStrikes.length - 1; i >= 0; i--) {
            this.kirinStrikes[i].life -= dt;
            if (this.kirinStrikes[i].life <= 0) this.kirinStrikes.splice(i, 1);
        }
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 28 * dt;
            ft.life -= dt;
            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }

        // 10. Cập nhật HUD hiển thị
        if (window.HUDView) window.HUDView.update(p, this);
    },

    // Vẽ toàn bộ thế giới 2D
    render() {
        if (!this.ctx) return;
        this.ctx.save();

        if (this.state === window.GameStates.MENU) {
            this.renderLobby();
            this.ctx.restore();
            return;
        }

        const camX = (window.Camera && typeof window.Camera.getRenderX === 'function') ? window.Camera.getRenderX() : (this.player ? this.player.x - w / 2 : 0);
        const camY = (window.Camera && typeof window.Camera.getRenderY === 'function') ? window.Camera.getRenderY() : (this.player ? this.player.y - h / 2 : 0);
        const w = this.canvas ? this.canvas.width : window.innerWidth;
        const h = this.canvas ? this.canvas.height : window.innerHeight;

        // 1. Vẽ nền Bản Đồ Vô Tận Dạng Chunk (MapController) - Bọc try-catch an toàn tuyệt đối
        if (window.MapController && typeof window.MapController.render === 'function') {
            try {
                window.MapController.render(this.ctx, window.Camera || { x: camX, y: camY }, this.player, this);
            } catch (err) {
                console.error("Lỗi MapController render:", err);
                this.ctx.fillStyle = '#4a8528';
                this.ctx.fillRect(0, 0, w, h);
            }
        } else {
            this.ctx.fillStyle = '#4a8528';
            this.ctx.fillRect(0, 0, w, h);
        }

        if (this.player) {
            const p = this.player;

            // 2. Vòng hút Chakra mờ
            this.ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(p.x - camX, p.y - camY, p.magnetRange, 0, Math.PI * 2);
            this.ctx.stroke();

            // 3. Vẽ hạt Chakra EXP & Đá
            window.DropItems.render(this.ctx, camX, camY, this);

            // 4. Vẽ phân thân Kage Bunshin
            for (let i = 0; i < this.clones.length; i++) {
                const cl = this.clones[i];
                const isMulti = (p.skills.clones || 0) >= 6;
                if (isMulti) {
                    this.ctx.save();
                    this.ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
                    this.ctx.beginPath();
                    this.ctx.arc(cl.x - camX, cl.y - camY, 18, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                }
                window.SpriteRenderer.drawShinobi(
                    this.ctx,
                    cl.x - camX,
                    cl.y - camY,
                    14,
                    this.elapsedTime,
                    p.facing,
                    true,
                    isMulti,
                    1,
                    p.ninjaType || 'naruto',
                    p.isMoving !== false
                );
            }

            // 5. Vẽ Quái vật & Boss
            for (let i = 0; i < this.enemies.length; i++) {
                const e = this.enemies[i];
                window.SpriteRenderer.drawEnemy(
                    this.ctx,
                    { ...e, x: e.x - camX, y: e.y - camY, facing: (p.x < e.x ? -1 : 1) },
                    this.elapsedTime,
                    p
                );
            }

            // 6. Vẽ Nhân vật chính Shinobi
            const isSixPaths = p.level >= 32;
            window.SpriteRenderer.drawShinobi(
                this.ctx,
                p.x - camX,
                p.y - camY,
                p.radius,
                this.elapsedTime,
                p.facing,
                false,
                isSixPaths,
                p.hp / p.maxHp,
                p.ninjaType || 'naruto',
                p.isMoving !== false
            );

            // 7. Vẽ Cầu Rasengan hộ thể xoay quanh
            const rasenganLv = p.skills.rasengan || 0;
            if (rasenganLv > 0) {
                const isRasenshuriken = rasenganLv >= 6;
                const orbCount = isRasenshuriken ? 4 : (1 + Math.floor(rasenganLv / 2));
                const orbitRadius = isRasenshuriken ? 95 : (68 + rasenganLv * 5);
                const orbRadius = isRasenshuriken ? 22 : (15 + rasenganLv * 1.5);

                for (let i = 0; i < orbCount; i++) {
                    const ang = p.rasenganAngle + (Math.PI * 2 * i) / orbCount;
                    const rx = p.x - camX + Math.cos(ang) * orbitRadius;
                    const ry = p.y - camY + Math.sin(ang) * orbitRadius;

                    const grad = this.ctx.createRadialGradient(rx, ry, 2, rx, ry, orbRadius);
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(0.5, '#38bdf8');
                    grad.addColorStop(1, isRasenshuriken ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.15)');

                    this.ctx.fillStyle = grad;
                    this.ctx.beginPath();
                    this.ctx.arc(rx, ry, orbRadius, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = isRasenshuriken ? "#fef08a" : "#bae6fd";
                    this.ctx.lineWidth = isRasenshuriken ? 3 : 2;
                    this.ctx.beginPath();
                    this.ctx.arc(rx, ry, orbRadius * 0.75, this.elapsedTime * 14, this.elapsedTime * 14 + Math.PI * 1.4);
                    this.ctx.stroke();
                }
            }

            // 8. Vẽ Đạn / Nhẫn Thuật Bay qua Projectiles
            window.Projectiles.render(this.ctx, camX, camY, this);

            // 9. Vẽ Tia Sét Lôi Độn Chidori
            for (let i = 0; i < this.lightningArcs.length; i++) {
                const arc = this.lightningArcs[i];
                this.ctx.strokeStyle = "#67e8f9";
                this.ctx.lineWidth = 3.5;
                this.ctx.beginPath();
                const x1 = arc.x1 - camX, y1 = arc.y1 - camY;
                const x2 = arc.x2 - camX, y2 = arc.y2 - camY;
                const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 26;
                const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 26;
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(midX, midY);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }

            // 9.5. Vẽ Đạo Lôi Điện Kỳ Lân (Kirin)
            for (let i = 0; i < this.kirinStrikes.length; i++) {
                const ks = this.kirinStrikes[i];
                const alpha = Math.max(0, ks.life / ks.maxLife);
                const ktx = ks.tx - camX;
                const kty = ks.ty - camY;

                this.ctx.save();
                this.ctx.globalAlpha = alpha;

                const ringGrad = this.ctx.createRadialGradient(ktx, kty, 10, ktx, kty, 190);
                ringGrad.addColorStop(0, 'rgba(34, 211, 238, 0.85)');
                ringGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
                ringGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
                this.ctx.fillStyle = ringGrad;
                this.ctx.beginPath();
                this.ctx.arc(ktx, kty, 190, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 14;
                this.ctx.shadowColor = "#22d3ee";
                this.ctx.shadowBlur = 32;
                this.ctx.beginPath();
                this.ctx.moveTo(ktx + (Math.random() - 0.5) * 40, -100);
                this.ctx.lineTo(ktx + (Math.random() - 0.5) * 50, kty * 0.35);
                this.ctx.lineTo(ktx + (Math.random() - 0.5) * 35, kty * 0.7);
                this.ctx.lineTo(ktx, kty);
                this.ctx.stroke();

                this.ctx.strokeStyle = "#22d3ee";
                this.ctx.lineWidth = 6;
                this.ctx.stroke();

                for (let b = 0; b < 3; b++) {
                    const bang = Math.random() * Math.PI * 2;
                    const blen = 60 + Math.random() * 80;
                    this.ctx.strokeStyle = "#67e8f9";
                    this.ctx.lineWidth = 2.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(ktx, kty);
                    this.ctx.lineTo(ktx + Math.cos(bang) * blen, kty + Math.sin(bang) * blen);
                    this.ctx.stroke();
                }

                this.ctx.restore();
            }

            // 10. Vẽ Hạt hiệu ứng & Chữ số nổi
            for (let i = 0; i < this.particles.length; i++) {
                const pt = this.particles[i];
                this.ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
                this.ctx.fillStyle = pt.color;
                this.ctx.beginPath();
                this.ctx.arc(pt.x - camX, pt.y - camY, pt.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;

            for (let i = 0; i < this.floatingTexts.length; i++) {
                const ft = this.floatingTexts[i];
                this.ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
                this.ctx.font = `800 ${ft.size}px 'Be Vietnam Pro', sans-serif`;
                this.ctx.fillStyle = ft.color;
                this.ctx.textAlign = "center";
                this.ctx.fillText(ft.text, ft.x - camX, ft.y - camY);
            }
            this.ctx.globalAlpha = 1;
        }

        // Vẽ Joystick ảo
        window.PlayerController.renderJoystick(this.ctx);

        this.ctx.restore();
    },

    // Kích hoạt kết thúc trận chiến khi cạn HP
    triggerGameOver() {
        if (this.state === window.GameStates.GAME_OVER) return;
        this.player.hp = 0;
        this.state = window.GameStates.GAME_OVER;
        if (window.MusicController) window.MusicController.stopBGM();

        // Ghi nhận thành tích vào StorageManager
        const earnedRyo = window.StorageManager.recordRun(
            this.elapsedTime,
            this.player.level,
            this.kills,
            this.diamonds
        );

        if (window.GameOverModal) {
            window.GameOverModal.show(this, earnedRyo);
        }
    },

    // Quay lại Lobby từ màn hình kết thúc
    backToLobby() {
        this.state = window.GameStates.MENU;
        if (window.HUDView) window.HUDView.hide();
        if (window.GameOverModal) window.GameOverModal.hide();
        if (window.LobbyView) {
            window.LobbyView.show();
            window.LobbyView.syncStats();
        }
    }
};

// Aliases cho tương thích ngược nếu có đoạn code cũ gọi Game.xxx
window.Game = window.GameManager;

