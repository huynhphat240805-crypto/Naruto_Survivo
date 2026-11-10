/* ============================================================================
   MODULE: src/Player/PlayerController.js
   Điều Khiển Người Chơi, Hệ Thống Nhân Vật Itachi & Chiêu Nộ Hóa Susanoo
   ============================================================================ */

window.PlayerController = {
    keys: {},
    pointerInput: {
        active: false,
        startX: 0,
        startY: 0,
        currX: 0,
        currY: 0
    },
    initialized: false,

    init(canvas) {
        if (this.initialized) return;
        this.initialized = true;

        // Bàn phím
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Kích hoạt chiêu nộ Susanoo bằng phím SPACE
            if (e.code === 'Space') {
                e.preventDefault();
                const g = window.GameManager;
                if (g && g.state === window.GameStates.PLAYING && g.player) {
                    this.triggerSusanoo(g.player, g);
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Chuột & Cảm ứng kéo thả (Virtual Joystick)
        const onPointerDown = (clientX, clientY) => {
            this.pointerInput.active = true;
            this.pointerInput.startX = clientX;
            this.pointerInput.startY = clientY;
            this.pointerInput.currX = clientX;
            this.pointerInput.currY = clientY;
        };

        const onPointerMove = (clientX, clientY) => {
            if (!this.pointerInput.active) return;
            this.pointerInput.currX = clientX;
            this.pointerInput.currY = clientY;
        };

        const onPointerUp = () => {
            this.pointerInput.active = false;
        };

        if (canvas) {
            canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', onPointerUp);

            canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchend', onPointerUp);
            window.addEventListener('touchcancel', onPointerUp);
        }
    },

    // Kích hoạt trạng thái Susanoo (30s)
    triggerSusanoo(player, game) {
        if (!player || player.hp <= 0) return;
        if (player.isSusanoo) return;

        // Kiểm tra hồi chiêu
        if (player.susanooCooldown > 0) {
            if (game && game.addFloatingText) {
                game.addFloatingText(player.x, player.y - 35, `⏳ Chờ hồi chiêu (${Math.ceil(player.susanooCooldown)}s)`, '#f87171', 14);
            }
            return;
        }

        // Bắt đầu Hóa Thần Giáp Susanoo
        player.isSusanoo = true;
        player.susanooDuration = 30.0;     // Duy trì 30 giây
        player.susanooSlashTimer = 1.0;    // Phát chém đầu tiên sau 1.0s
        player.susanooSlashAnim = 0;
        player.susanooPendingWave = 0;

        if (window.Camera && window.Camera.shake) window.Camera.shake(0.5, 15);
        if (window.SFXController && window.SFXController.summonReveal) {
            window.SFXController.summonReveal();
        }

        if (game) {
            if (game.addFloatingText) {
                game.addFloatingText(player.x, player.y - 75, "🔥 THẦN GIÁP SUSANOO THỨC TỈNH (30s)!", "#f59e0b", 24);
            }
            if (game.spawnExplosionParticles) {
                game.spawnExplosionParticles(player.x, player.y, '#f97316', 36);
                game.spawnExplosionParticles(player.x, player.y, '#fde047', 24);
                game.spawnExplosionParticles(player.x, player.y, '#ea580c', 20);
            }
        }
    },

    // Phóng Vệt Sóng Kiếm Khí Khổng Lồ từ ảnh hinhanh_skill_player_itachi_chuan.png
    spawnSusanooWave(player, game) {
        if (!player || !game || !game.projectiles) return;

        let dirX = player.facing >= 0 ? 1 : -1;
        let dirY = 0;

        // Tìm quái vật phía trước để tự động định hướng nhẹ
        if (game.enemies && game.enemies.length > 0) {
            let target = null;
            let minDist = 450;
            for (let i = 0; i < game.enemies.length; i++) {
                const e = game.enemies[i];
                if (e.dead) continue;
                const dx = e.x - player.x;
                const dy = e.y - player.y;
                if ((dx * dirX) > 0) { // Quái nằm phía trước hướng nhìn
                    const d = Math.hypot(dx, dy);
                    if (d < minDist) {
                        minDist = d;
                        target = e;
                    }
                }
            }
            if (target) {
                const angle = Math.atan2(target.y - player.y, target.x - player.x);
                dirX = Math.cos(angle);
                dirY = Math.sin(angle);
            }
        }

        const speed = 540;
        const maxDist = 400; // maxDistance = 400px tầm xa tối đa
        const baseDmg = Math.round(180 * (player.damageMultiplier || 1));
        const waveDmg = baseDmg * 4; // x4 sát thương khủng

        const proj = {
            type: 'susanoo_slash',
            x: player.x + dirX * 35,
            y: player.y - 10 + dirY * 20,
            vx: dirX * speed,
            vy: dirY * speed,
            speed: speed,
            distanceTraveled: 0,
            maxDistance: maxDist,
            progress: 0,
            facing: dirX >= 0 ? 1 : -1,
            radius: 95,
            damage: waveDmg,
            pierce: 99999, // Xuyên thấu 100% bầy quái
            hitEnemies: new Map(), // Tránh lặp sát thương tức thời trên 1 quái
            rotation: Math.atan2(dirY, dirX)
        };

        game.projectiles.push(proj);

        // Hiệu ứng rung màn hình và âm thanh bộc phá
        if (window.Camera && window.Camera.shake) window.Camera.shake(0.35, 12);
        if (window.SFXController && window.SFXController.fireball) window.SFXController.fireball();

        if (game.spawnExplosionParticles) {
            game.spawnExplosionParticles(player.x + dirX * 45, player.y - 12, '#f97316', 28);
            game.spawnExplosionParticles(player.x + dirX * 45, player.y - 12, '#fde047', 18);
        }
    },

    // Cập nhật di chuyển và trạng thái Susanoo cho nhân vật
    update(dt, player, gameRef) {
        if (!player) return;
        const game = gameRef || window.GameManager;

        // Khởi tạo các thuộc tính Susanoo nếu chưa có
        if (player.susanooCooldown === undefined) player.susanooCooldown = 0;
        if (player.isSusanoo === undefined) player.isSusanoo = false;
        if (player.susanooDuration === undefined) player.susanooDuration = 0;
        if (player.susanooSlashTimer === undefined) player.susanooSlashTimer = 0;
        if (player.susanooSlashAnim === undefined) player.susanooSlashAnim = 0;
        if (player.susanooPendingWave === undefined) player.susanooPendingWave = 0;

        // ====================================================================
        // QUẢN LÝ TIẾN TRÌNH SUSANOO
        // ====================================================================
        if (player.isSusanoo) {
            player.susanooDuration -= dt;

            // Đếm thời gian animation vung kiếm
            if (player.susanooSlashAnim > 0) {
                player.susanooSlashAnim = Math.max(0, player.susanooSlashAnim - dt);
            }

            // Đếm thời điểm sinh sóng chém (ngay thời điểm vung hạ kiếm)
            if (player.susanooPendingWave > 0) {
                player.susanooPendingWave -= dt;
                if (player.susanooPendingWave <= 0) {
                    player.susanooPendingWave = 0;
                    this.spawnSusanooWave(player, game);
                }
            }

            // Chu kỳ vung kiếm chém mỗi 3 - 4 giây
            player.susanooSlashTimer -= dt;
            if (player.susanooSlashTimer <= 0) {
                player.susanooSlashTimer = 3.5;       // Cứ mỗi 3.5 giây lặp lại
                player.susanooSlashAnim = 0.45;       // Animation vung kiếm tổng cộng 0.45s
                player.susanooPendingWave = 0.15;     // Sau 0.15s windup giơ kiếm là chém xuống
            }

            // Hết 30 giây: Trở về dạng Itachi bình thường
            if (player.susanooDuration <= 0) {
                player.isSusanoo = false;
                player.susanooCooldown = 45.0; // Bắt đầu đếm hồi chiêu 45s
                player.susanooSlashAnim = 0;
                player.susanooPendingWave = 0;

                if (window.Camera && window.Camera.shake) window.Camera.shake(0.2, 6);
                if (game && game.addFloatingText) {
                    game.addFloatingText(player.x, player.y - 50, "✨ SUSANOO HẾT HIỆU LỰC (Hồi 45s)", "#94a3b8", 18);
                }
            }
        } else {
            // Đếm ngược hồi chiêu 45s
            if (player.susanooCooldown > 0) {
                player.susanooCooldown = Math.max(0, player.susanooCooldown - dt);
            }
        }

        // ====================================================================
        // ĐIỀU KHIỂN DI CHUYỂN
        // ====================================================================
        let mx = 0, my = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) my -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) my += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) mx += 1;

        // Kéo chuột / Cảm ứng ảo
        if (this.pointerInput.active) {
            const dx = this.pointerInput.currX - this.pointerInput.startX;
            const dy = this.pointerInput.currY - this.pointerInput.startY;
            const dist = Math.hypot(dx, dy);
            if (dist > 10) {
                mx = dx / dist;
                my = dy / dist;
            }
        }

        // ====================================================================
        // CƠ CHẾ ĐỊA HÌNH VŨNG NƯỚC: LÀM CHẬM 30% (SLOW DEBUFF 30%)
        // ====================================================================
        let inWater = false;
        const mapCtrl = (game && game.map) || window.MapController;
        if (mapCtrl && typeof mapCtrl.isWaterAt === 'function') {
            inWater = mapCtrl.isWaterAt(player.x, player.y);
        } else if (mapCtrl && mapCtrl.puddles && mapCtrl.puddles.length > 0) {
            for (let i = 0; i < mapCtrl.puddles.length; i++) {
                const pud = mapCtrl.puddles[i];
                if (pud.width !== undefined && pud.height !== undefined) {
                    // Kiểm tra va chạm hộp chữ nhật AABB [p.x, p.y, p.width, p.height]
                    if (player.x >= pud.x && player.x <= pud.x + pud.width &&
                        player.y >= pud.y && player.y <= pud.y + pud.height) {
                        inWater = true;
                        break;
                    }
                } else if (Math.hypot(player.x - pud.x, player.y - pud.y) < pud.radius) {
                    inWater = true;
                    break;
                }
            }
        }

        player.isInWater = inWater;

        // Tốc độ di chuyển: Tăng 20% khi hóa Susanoo, và GIẢM 30% (còn 70%) khi lội qua vũng nước
        let speedFactor = 1.0;
        if (player.isSusanoo) speedFactor *= 1.2;
        if (inWater) {
            speedFactor *= 0.7; // Người chơi bị làm chậm 30%: Tốc độ di chuyển giảm còn 70% (currentSpeed = baseSpeed * 0.7)
        }

        const effectiveSpeed = player.speed * speedFactor;

        // Chuẩn hóa vector và di chuyển
        if (mx !== 0 || my !== 0) {
            const len = Math.hypot(mx, my);
            mx /= len;
            my /= len;
            player.x += mx * effectiveSpeed * dt;
            player.y += my * effectiveSpeed * dt;
            if (mx !== 0) player.facing = mx >= 0 ? 1 : -1;
            player.isMoving = true;

            // Hiệu ứng văng bọt nước nhỏ (water splashes) dưới chân khi di chuyển trong nước
            if (inWater) {
                player.waterSplashTimer = (player.waterSplashTimer || 0) + dt;
                if (player.waterSplashTimer >= 0.12) {
                    player.waterSplashTimer = 0;
                    if (game && game.spawnExplosionParticles) {
                        game.spawnExplosionParticles(player.x, player.y + 12, '#93c5fd', 4);
                        game.spawnExplosionParticles(player.x, player.y + 12, '#ffffff', 2);
                    }
                }
            }
        } else {
            player.isMoving = false;
        }
    },

    // Vẽ Joystick ảo
    renderJoystick(ctx) {
        if (!this.pointerInput.active) return;

        ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.pointerInput.startX, this.pointerInput.startY, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
        ctx.beginPath();
        ctx.arc(this.pointerInput.currX, this.pointerInput.currY, 18, 0, Math.PI * 2);
        ctx.fill();
    }
};

// ============================================================================
// HỆ THỐNG NẠP SPRITESHEET NHÂN VẬT & SUSANOO (CHROMA CLEAN ALGORITHM)
// ============================================================================
window.PlayerSprite = {
    playerImg: null,
    cleanPlayerSprite: null,

    itachiImg: null,
    cleanItachiSprite: null,

    susanooImg: null,
    cleanSusanooSprite: null,

    slashImg: null,
    cleanSlashSprite: null,

    isLoaded: false,
    _isLoading: false,

    // Hàm lọc sạch hạt nền trắng / xám sáng thành trong suốt (Chroma Clean)
    chromaClean(img, label) {
        try {
            const offCanvas = document.createElement('canvas');
            const targetW = (label === 'Naruto' && img.width > 1200) ? 1024 : (img.width || 1024);
            const targetH = (label === 'Naruto' && img.width > 1200) ? 572 : (img.height || 572);
            offCanvas.width = targetW;
            offCanvas.height = targetH;
            const offCtx = offCanvas.getContext('2d');
            offCtx.drawImage(img, 0, 0, targetW, targetH);

            const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i+1], b = d[i+2];

                if (label === 'Susanoo') {
                    // 1. Lọc ô trắng: R > 230 && G > 230 && B > 230 -> gán Alpha = 0
                    if (r > 230 && g > 230 && b > 230) {
                        d[i+3] = 0;
                    }
                    // 2. Lọc ô caro xám: Là màu trung tính (|R-G| <= 15, |G-B| <= 15, |R-B| <= 15) và nằm trong dải xám sáng 160 <= R, G, B <= 235 -> gán Alpha = 0
                    else if (Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15 &&
                             r >= 160 && r <= 235 && g >= 160 && g <= 235 && b >= 160 && b <= 235) {
                        d[i+3] = 0;
                    }
                } else if (label === 'SlashWave') {
                    // 1. Lọc nền đen: R < 35 && G < 35 && B < 35 -> gán Alpha = 0
                    if (r < 35 && g < 35 && b < 35) {
                        d[i+3] = 0;
                    } else {
                        const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
                        // 2. Lọc nền tối / xám trung tính: max(|R-G|, |G-B|, |R-B|) <= 12 và độ sáng R, G, B < 140 -> gán Alpha = 0
                        if (maxDiff <= 12 && r < 140 && g < 140 && b < 140) {
                            d[i+3] = 0;
                        }
                        // 3. Lọc nền xám sáng / trắng thừa của ảnh nếu có
                        else if (r > 225 && g > 225 && b > 225) {
                            d[i+3] = 0;
                        } else if (maxDiff <= 15 && r > 160 && g > 160 && b > 160) {
                            d[i+3] = 0;
                        }
                    }
                } else {
                    // Mặc định cho Naruto / Itachi người thường
                    if (r > 215 && g > 215 && b > 215) {
                        d[i+3] = 0;
                    } else if (r > 160 && g > 160 && b > 160 && Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15) {
                        d[i+3] = 0;
                    }
                }
            }
            offCtx.putImageData(imgData, 0, 0);
            return offCanvas;
        } catch (err) {
            console.warn(`[PlayerSprite]: Fallback sang ảnh gốc cho ${label}:`, err);
            return img;
        }
    },

    init() {
        if (this.isLoaded || this._isLoading) return;
        this._isLoading = true;

        const isRoot = typeof window !== 'undefined' && window.location 
            ? !window.location.pathname.includes('/SurvivalIO/') : true;
        const prefix = isRoot ? './SurvivalIO/' : './';

        const basePath = prefix + 'Assets/_Project/Textures/Player/';
        const fallbackBase = isRoot 
            ? './Assets/_Project/Textures/Player/' 
            : './SurvivalIO/Assets/_Project/Textures/Player/';

        let loadedCount = 0;
        const checkDone = () => {
            loadedCount++;
            if (loadedCount >= 3) {
                this.isLoaded = true;
                if (window.SpriteRenderer) {
                    window.SpriteRenderer.cleanPlayerSprite = this.cleanPlayerSprite;
                    window.SpriteRenderer.cleanItachiSprite = this.cleanItachiSprite;
                    window.SpriteRenderer.cleanSusanooSprite = this.cleanSusanooSprite;
                    window.SpriteRenderer.cleanSlashSprite = this.cleanSlashSprite;
                    window.SpriteRenderer.isPlayerSpriteLoaded = true;
                }
            }
        };

        // 1. Nạp sprite Naruto (player_naruto.png)
        this.playerImg = new Image();
        this.playerImg.onload = () => {
            this.cleanPlayerSprite = this.chromaClean(this.playerImg, 'Naruto');
            if (window.SpriteRenderer) {
                window.SpriteRenderer.cleanPlayerSprite = this.cleanPlayerSprite;
                window.SpriteRenderer.isPlayerSpriteLoaded = true;
            }
            checkDone();
        };
        this.playerImg.onerror = () => {
            if (!this.playerImg._triedAlt) {
                this.playerImg._triedAlt = true;
                this.playerImg.src = basePath + 'naruto_player.png';
            } else {
                this.playerImg.src = fallbackBase + 'player_naruto.png';
            }
        };
        this.playerImg.src = basePath + 'player_naruto.png';

        // 2. Nạp sprite Itachi người thường (player_itachi.png)
        this.itachiImg = new Image();
        this.itachiImg.onload = () => {
            this.cleanItachiSprite = this.chromaClean(this.itachiImg, 'Itachi');
            if (window.SpriteRenderer) {
                window.SpriteRenderer.cleanItachiSprite = this.cleanItachiSprite;
            }
            checkDone();
        };
        this.itachiImg.onerror = () => {
            this.itachiImg.src = fallbackBase + 'player_itachi.png';
        };
        this.itachiImg.src = basePath + 'player_itachi.png';

        // 3. Nạp sprite Thần Giáp Susanoo mới (skill_player_itachi_2.png)
        this.susanooImg = new Image();
        this.susanooImg.onload = () => {
            this.cleanSusanooSprite = this.chromaClean(this.susanooImg, 'Susanoo');
            if (window.SpriteRenderer) window.SpriteRenderer.cleanSusanooSprite = this.cleanSusanooSprite;
            checkDone();
        };
        this.susanooImg.onerror = () => {
            this.susanooImg.src = fallbackBase + 'skill_player_itachi_2.png';
        };
        this.susanooImg.src = basePath + 'skill_player_itachi_2.png';

        // 4. Nạp vệt sóng kiếm khí chuẩn (skill_player_itachi_chuan.png)
        this.slashImg = new Image();
        this.slashImg.onload = () => {
            this.cleanSlashSprite = this.chromaClean(this.slashImg, 'SlashWave');
            if (window.SpriteRenderer) window.SpriteRenderer.cleanSlashSprite = this.cleanSlashSprite;
            checkDone();
        };
        this.slashImg.onerror = () => {
            this.slashImg.src = fallbackBase + 'skill_player_itachi_chuan.png';
        };
        this.slashImg.src = basePath + 'skill_player_itachi_chuan.png';
    }
};

// Tự động kích hoạt nạp ảnh ngay lập tức
if (typeof window !== 'undefined') {
    try { window.PlayerSprite.init(); } catch (_) {}
}
