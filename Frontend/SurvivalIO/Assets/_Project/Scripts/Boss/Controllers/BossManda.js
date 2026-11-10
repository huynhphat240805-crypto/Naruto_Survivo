/* ============================================================================
   MODULE: src/Boss/BossManda.js
   Hành Vi & Kỹ Năng Boss Rắn Khổng Lồ Manda (Orochimaru) Xuất Hiện Phút Thứ 5
   ============================================================================ */

// Bảng tọa độ frame chuẩn Orochimaru (1152x720 px, lấy trọn vẹn đầu, tóc và tay xòe)
const OROCHIMARU_FRAMES = {
    // Hàng trên: Di chuyển & Nghỉ
    idle:   { sx: 12,  sy: 20,  sw: 115, sh: 180 }, // Sprite 1: Đứng thở
    run1:   { sx: 150, sy: 25,  sw: 120, sh: 175 }, // Sprite 2: Bước chân 1
    run2:   { sx: 290, sy: 28,  sw: 125, sh: 172 }, // Sprite 3: Bước chân 2

    // Hàng dưới: Tung chiêu / Tấn công cận chiến (ĐÃ ĐẨY SY CAO LÊN TỪ Y=200 ĐỂ LẤY ĐỦ ĐẦU VÀ TÓC)
    attack: { sx: 195, sy: 200, sw: 150, sh: 165 }  // Sprite 4: Đủ đỉnh tóc, mặt, tay xòe và chân
};
window.OROCHIMARU_FRAMES = OROCHIMARU_FRAMES;

window.BossManda = {
    bossImg: null,
    cleanBossSprite: null,
    isLoaded: false,
    _isLoading: false,

    maxHp: 260000,
    hp: 260000,

    config: {
        type: 'boss_manda',
        name: 'OROCHIMARU',
        radius: 36,
        hp: 260000,
        speed: 118,
        damage: 28,
        expValue: 180,
        isBoss: true,
        skillTimer: 3.0
    },

    // 1. Load ảnh và lọc nền trong suốt (Chroma Clean)
    initSprite() {
        if (this.isLoaded || this._isLoading) return;
        this._isLoading = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const primarySrc = prefix + 'Assets/_Project/Textures/Boss/boss_orochimaru.png';
        const fallbackSrc = isRoot 
            ? './Assets/_Project/Textures/Boss/boss_orochimaru.png' 
            : './SurvivalIO/Assets/_Project/Textures/Boss/boss_orochimaru.png';

        this.bossImg = new Image();
        const img = this.bossImg;

        let triedFallback = false;
        img.onload = () => {
            console.log(`🐍 [BossOrochimaru]: Nạp thành công ảnh Boss Orochimaru từ ${img.src}!`);
            try {
                // Nạp ảnh qua một Canvas phụ để lọc sạch các hạt xám/nhiễu nền còn sót lại (r, g, b > 140 và ít màu -> alpha = 0)
                const offCanvas = document.createElement('canvas');
                offCanvas.width = img.width || 1152;
                offCanvas.height = img.height || 720;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const diff = max - min;
                    // Lọc sạch hạt xám nhiễu ngoài nền
                    if ((r > 155 && g > 155 && b > 155 && diff < 12) || (r >= 68 && r <= 92 && g >= 68 && g <= 92 && b >= 68 && b <= 92 && diff < 8)) {
                        d[i+3] = 0; // Biến thành trong suốt 100%
                    } else if (a > 15) {
                        d[i+3] = 255; // Khóa cứng 100% đặc hoàn toàn, chống mờ xuyên thấu các pixel áo/da
                    }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanBossSprite = offCanvas;
            } catch (err) {
                console.warn("[BossOrochimaru]: Fallback sang ảnh gốc:", err);
                this.cleanBossSprite = img;
            }
            this.isLoaded = true;

            // Đồng bộ sang SpriteRenderer
            if (window.SpriteRenderer) {
                window.SpriteRenderer.cleanOrochimaruSprite = this.cleanBossSprite;
                window.SpriteRenderer.isOrochimaruLoaded = true;
            }
        };

        img.onerror = () => {
            if (!triedFallback) {
                triedFallback = true;
                console.warn(`[BossOrochimaru]: Chuyển sang fallback: ${fallbackSrc}`);
                img.src = fallbackSrc;
            } else {
                console.error(`[BossOrochimaru]: Thất bại khi nạp boss_orochimaru.png từ cả 2 đường dẫn!`);
            }
        };

        img.src = primarySrc;
    },

    spawn(game, sx, sy) {
        if (!this.isLoaded) this.initSprite();
        if (window.SFXController) window.SFXController.bossSpawn();
        window.Camera.shake(0.45, 12);

        game.enemies.push({
            id: game.enemyIdCounter++,
            type: this.config.type,
            name: this.config.name,
            x: sx,
            y: sy,
            radius: this.config.radius,
            hp: this.config.hp,
            maxHp: this.config.hp,
            speed: this.config.speed,
            damage: this.config.damage,
            expValue: this.config.expValue,
            isBoss: true,
            skillTimer: this.config.skillTimer,
            hitFlash: 0,
            angle: 0
        });

        game.addFloatingText(game.player.x, game.player.y - 50, "⚠️ OROCHIMARU XUẤT HIỆN!", "#c084fc", 20);
    },

    update(dt, enemy, game) {
        if (!this.isLoaded) this.initSprite();

        // Cập nhật trạng thái tấn công / áp sát
        const p = game.player;
        if (p) {
            const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
            enemy.distToPlayer = dist;
            if (dist <= 80) {
                enemy.isAttacking = true;
            } else if (enemy.skillTimer > 0.8) {
                enemy.isAttacking = false;
            }
        }

        enemy.skillTimer -= dt;
        if (enemy.skillTimer <= 0) {
            // Orochimaru phóng tia Kiếm Kusanagi / luồng Chakra bóng tối sắc nét hình quạt (không tạo khối tròn tím)
            enemy.skillTimer = 3.2;
            for (let k = -2; k <= 2; k++) {
                const a = enemy.angle + k * 0.22;
                game.projectiles.push({
                    type: 'kusanagi_blade',
                    subType: 'kusanagi',
                    color: '#c084fc',
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(a) * 280,
                    vy: Math.sin(a) * 280,
                    radius: 8,
                    damage: 18,
                    life: 2.8
                });
            }
        }
    },

    // Hàm vẽ trực tiếp Orochimaru Pixel Art với độ mờ khóa cứng 100%
    draw(ctx, enemy, time, player = null) {
        const spriteSource = this.cleanBossSprite || this.bossImg;
        if (!spriteSource) return;

        const distToP = enemy.distToPlayer !== undefined 
            ? enemy.distToPlayer 
            : (player ? Math.hypot(player.x - enemy.x, player.y - enemy.y) : 999);
        const isAttacking = Boolean(enemy.isAttacking || distToP <= 80 || (enemy.skillTimer !== undefined && enemy.skillTimer < 0.8));

        const destWidth = isAttacking ? 72 : 64;
        const destHeight = isAttacking ? 94 : 92;

        // Vẽ bóng đen dưới chân trước khi vẽ Boss để tạo chiều sâu nổi bật khỏi mặt đất
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, destWidth * 0.35, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        let isFacingLeft = false;
        if (typeof enemy.facing !== 'undefined') {
            isFacingLeft = enemy.facing === -1;
        } else if (player) {
            isFacingLeft = player.x < enemy.x;
        }

        ctx.save();
        if (isFacingLeft) {
            ctx.scale(-1, 1);
        }

        let currentFrame;
        let f;
        if (isAttacking) {
            f = OROCHIMARU_FRAMES.attack;
            currentFrame = 'attack';
        } else {
            const isRun1 = Math.floor(time * 5.5) % 2 === 0;
            currentFrame = isRun1 ? 'run1' : 'run2';
            f = isRun1 ? OROCHIMARU_FRAMES.run1 : OROCHIMARU_FRAMES.run2;
        }

        // 1. ÁP DỤNG KỸ THUẬT LỚP LÓT THÂN CHỐNG XUYÊN NỀN (SOLID BODY UNDERCOAT CHO MỌI ANIMATION):
        // Khối lót màu xám tro bao phủ đúng phần thân áo và ngực cho tất cả animation
        ctx.save();
        ctx.fillStyle = '#d1d5db'; // Màu xám tro đúng màu áo Kimono
        ctx.beginPath();
        
        // Nếu đang chạy thì thân áo hơi nghiêng/chúi về phía trước
        const isRunning = (currentFrame === 'run1' || currentFrame === 'run2');
        const offsetX = isRunning ? 6 : 0; // Hơi dồn về trước khi chạy theo hướng nhìn
        const offsetY = -destHeight * 0.44;
        
        ctx.ellipse(offsetX, offsetY, destWidth * 0.23, destHeight * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. KHÓA CỨNG ĐỘ ĐẬM VÀ CHẾ ĐỘ HÒA TRỘN (FORCE FULL OPACITY):
        ctx.save();
        ctx.globalAlpha = 1.0; // Bắt buộc 100% đặc, không cho phép xuyên thấu
        ctx.globalCompositeOperation = 'source-over'; // Chế độ vẽ đè phủ hoàn toàn lên nền cỏ

        // 3. MULTIPASS DRAW (VẼ ĐÈ 4 LẦN CÙNG VỊ TRÍ):
        // Phục hồi 100% độ đậm và sắc nét cho các pixel áo bị giảm alpha cho cả đứng lẫn chạy
        for (let i = 0; i < 4; i++) {
            ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -destWidth / 2, -destHeight + 15, destWidth, destHeight);
        }

        // Nháy sáng trắng khi trúng đòn
        if (enemy.hitFlash > 0) {
            ctx.save();
            try {
                ctx.globalAlpha = 0.85;
                ctx.filter = "brightness(3) saturate(0)";
                ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -destWidth / 2, -destHeight + 15, destWidth, destHeight);
            } catch (_) {}
            ctx.restore();
        }

        ctx.restore(); // restore globalAlpha & globalCompositeOperation
        ctx.restore(); // restore scale
    }
};

// Bí danh tương thích
window.BossOrochimaru = window.BossManda;

// Tự động kích hoạt nạp ảnh ngay lập tức
if (typeof window !== 'undefined') {
    try { window.BossManda.initSprite(); } catch (_) {}
}

