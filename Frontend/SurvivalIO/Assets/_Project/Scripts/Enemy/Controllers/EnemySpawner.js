/* ============================================================================
   MODULE: src/Enemy/EnemySpawner.js
   Hệ thống Sinh Quái Vật Theo Đợt (Wave Spawner) & Cấu hình Chỉ số Kẻ Địch
   Phút 0-2: Đạo Tặc & Ninja Phản Bội (Rừng Làng Lá), Phút 2-5: Zetsu Trắng, Phút 5: Boss Manda, Phút 10: Akatsuki
   ============================================================================ */

window.EnemyConfigs = {
    bandit: {
        type: 'bandit',
        name: 'Đạo Tặc Rừng Làng Lá',
        radius: 14,
        baseHp: 2400, // Tăng gấp 100 lần (từ 24 lên 2400)
        baseSpeed: 78,
        damage: 10,
        expValue: 5,
        isBoss: false
    },
    rogue_ninja: {
        type: 'rogue_ninja',
        name: 'Ninja Phản Bội Làng Lá',
        radius: 15,
        baseHp: 3800, // Tăng gấp 100 lần (từ 38 lên 3800)
        baseSpeed: 94, // Nhanh hơn 20% so với Đạo Tặc (78 * 1.2 = 93.6)
        damage: 14,
        expValue: 8,
        isBoss: false
    },
    rain_ninja: {
        type: 'rogue_ninja',
        name: 'Ninja Phản Bội Làng Lá',
        radius: 15,
        baseHp: 3800, // Tăng gấp 100 lần (từ 38 lên 3800)
        baseSpeed: 94,
        damage: 14,
        expValue: 8,
        isBoss: false
    },
    zetsu: {
        type: 'zetsu',
        name: 'Zetsu Trắng',
        radius: 13,
        baseHp: 3000, // Tăng gấp 100 lần (từ 30 lên 3000)
        baseSpeed: 122,
        damage: 12,
        expValue: 7,
        isBoss: false
    }
};

window.EnemySpawner = {
    // Sinh quái từ 4 cạnh ngoài viền màn hình
    spawnEnemy(game, forcedType = null) {
        const p = game.player;
        if (!p) return;

        const canvas = game.canvas || { width: window.innerWidth, height: window.innerHeight };
        const margin = 80;
        const halfW = canvas.width / 2 + margin;
        const halfH = canvas.height / 2 + margin;
        const side = Math.floor(Math.random() * 4);
        let sx = p.x;
        let sy = p.y;

        if (side === 0) { sx += (Math.random() * 2 - 1) * halfW; sy -= halfH; }
        else if (side === 1) { sx += halfW; sy += (Math.random() * 2 - 1) * halfH; }
        else if (side === 2) { sx += (Math.random() * 2 - 1) * halfW; sy += halfH; }
        else { sx -= halfW; sy += (Math.random() * 2 - 1) * halfH; }

        const mins = game.elapsedTime / 60;
        let type = forcedType;

        if (!type) {
            if (mins < 1) {
                // Phút 0-1: Đạo Tặc Rừng Làng Lá (xuất hiện từ 0:00)
                type = 'bandit';
            } else if (mins < 2) {
                // Phút 1-2: Ninja Phản Bội Làng Lá xuất hiện (từ 1:00 trở đi, tốc độ nhanh hơn 20%)
                type = Math.random() < 0.55 ? 'bandit' : 'rogue_ninja';
            } else if (mins < 5) {
                type = Math.random() < 0.72 ? 'zetsu' : 'rogue_ninja';
            } else {
                const r = Math.random();
                type = r < 0.5 ? 'zetsu' : (r < 0.78 ? 'rogue_ninja' : 'bandit');
            }
        }

        // Tăng máu quái theo thời gian sinh tồn
        const scale = 1 + mins * 0.22;

        if (type === 'boss_manda') {
            window.BossManda.spawn(game, sx, sy);
            return;
        }

        if (type === 'boss_akatsuki') {
            window.BossAkatsuki.spawn(game, sx, sy);
            return;
        }

        const cfg = window.EnemyConfigs[type] || window.EnemyConfigs.bandit;
        game.enemies.push({
            id: game.enemyIdCounter++,
            type: cfg.type,
            name: cfg.name,
            x: sx,
            y: sy,
            radius: cfg.radius,
            hp: Math.round(cfg.baseHp * scale),
            maxHp: Math.round(cfg.baseHp * scale),
            speed: cfg.baseSpeed + Math.random() * 20,
            damage: cfg.damage,
            expValue: cfg.expValue,
            isBoss: false,
            hitFlash: 0,
            angle: 0
        });
    },

    // Cập nhật nhịp sinh quái
    update(dt, game) {
        const mins = game.elapsedTime / 60;

        // Mốc 5 phút: Triệu hồi Boss Rắn Khổng Lồ Manda
        if (mins >= 5 && !game.bossSpawned5m) {
            game.bossSpawned5m = true;
            this.spawnEnemy(game, 'boss_manda');
            if (window.MusicController) window.MusicController.setBossPhase(true);
        }

        // Mốc 10 phút: Triệu hồi Boss Thủ Lĩnh Akatsuki
        if (mins >= 10 && !game.bossSpawned10m) {
            game.bossSpawned10m = true;
            this.spawnEnemy(game, 'boss_akatsuki');
            if (window.MusicController) window.MusicController.setBossPhase(true);
        }

        game.spawnTimer -= dt;
        if (game.spawnTimer <= 0) {
            // Phút 2-5: Bầy Zetsu Trắng cực đông
            const maxEnemies = mins >= 2 && mins < 5 ? 95 : 75;
            const interval = mins < 2 ? 0.65 : (mins < 5 ? 0.25 : 0.32);
            game.spawnTimer = interval;

            if (game.enemies.length < maxEnemies) {
                const batch = (mins >= 2 && mins < 5) ? 3 : 2;
                for (let i = 0; i < batch; i++) this.spawnEnemy(game);
            }
        }
    }
};

// ============================================================================
// HỆ THỐNG NẠP SPRITESHEET QUÁI VẬT NINJA RỪNG LÀNG LÁ
// Đường dẫn: SurvivalIO/Assets/_Project/Textures/Enemy/ninja_enemy.png
// ============================================================================
window.EnemySprite = {
    spriteImg: null,
    cleanNinjaSprite: null,
    isLoaded: false,
    _isLoading: false,

    init() {
        if (this.isLoaded || this._isLoading) return;
        this._isLoading = true;

        const isRoot = typeof window !== 'undefined' && window.location 
            ? !window.location.pathname.includes('/SurvivalIO/') : true;
        const prefix = isRoot ? './SurvivalIO/' : './';
        const primarySrc = prefix + 'Assets/_Project/Textures/Enemy/ninja_enemy.png';
        const fallbackSrc = isRoot 
            ? './Assets/_Project/Textures/Enemy/ninja_enemy.png' 
            : './SurvivalIO/Assets/_Project/Textures/Enemy/ninja_enemy.png';

        this.spriteImg = new Image();
        const img = this.spriteImg;

        let triedFallback = false;
        img.onload = () => {
            console.log(`🍥 [EnemySprite]: Nạp thành công ảnh quái vật Ninja từ ${img.src}!`);
            try {
                // Thuật toán Chroma Clean: Lọc sạch 100% hạt trắng/xám sáng viền ngoài
                const offCanvas = document.createElement('canvas');
                offCanvas.width = img.width || 1024;
                offCanvas.height = img.height || 765;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    if (d[i] > 210 && d[i+1] > 210 && d[i+2] > 210) {
                        d[i+3] = 0; // Biến thành trong suốt 100%
                    }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanNinjaSprite = offCanvas;
            } catch (err) {
                console.warn("[EnemySprite]: Chroma clean fallback sang ảnh gốc:", err);
                this.cleanNinjaSprite = img;
            }
            this.isLoaded = true;

            // Đồng bộ ngay lập tức sang SpriteRenderer
            if (window.SpriteRenderer) {
                window.SpriteRenderer.cleanNinjaSprite = this.cleanNinjaSprite;
                window.SpriteRenderer.isNinjaSpriteLoaded = true;
            }
        };

        img.onerror = () => {
            if (!triedFallback) {
                triedFallback = true;
                console.warn(`[EnemySprite]: Không nạp được từ ${img.src}, chuyển sang fallback: ${fallbackSrc}`);
                img.src = fallbackSrc;
            } else {
                console.error(`[EnemySprite]: Thất bại khi nạp ninja_enemy.png từ cả 2 đường dẫn!`);
            }
        };

        img.src = primarySrc;
    }
};

// Tự động kích hoạt nạp ảnh ngay lập tức
if (typeof window !== 'undefined') {
    try { window.EnemySprite.init(); } catch (_) {}
}

