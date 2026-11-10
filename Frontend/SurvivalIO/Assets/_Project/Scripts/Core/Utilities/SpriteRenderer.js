/* ============================================================================
   MODULE: src/Core/SpriteRenderer.js
   Vẽ Thế Giới Chiến Trường Làng Lá, Sprite Nhẫn Giả & Quái Vật Canvas 2D
   ============================================================================ */

window.SpriteRenderer = {
    // 1. Vẽ nền thảo nguyên chiến trường Làng Lá vô tận
    drawBattlefield(ctx, camX, camY, width, height) {
        ctx.fillStyle = "#14261c";
        ctx.fillRect(0, 0, width, height);

        const tileSize = 120;
        const startCol = Math.floor(camX / tileSize) - 1;
        const endCol = Math.floor((camX + width) / tileSize) + 1;
        const startRow = Math.floor(camY / tileSize) - 1;
        const endRow = Math.floor((camY + height) / tileSize) + 1;

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const wx = c * tileSize - camX;
                const wy = r * tileSize - camY;
                const hash = Math.abs((c * 73856093) ^ (r * 19349663)) % 100;

                // Ô cỏ tối sáng đan xen nhẹ
                if ((c + r) % 2 === 0) {
                    ctx.fillStyle = "rgba(25, 48, 34, 0.45)";
                    ctx.fillRect(wx, wy, tileSize, tileSize);
                }

                // Vẽ bụi cỏ, đá hoặc phi tiêu cắm trên đất cố định theo hash
                if (hash < 18) {
                    ctx.fillStyle = "#1f3d2b";
                    ctx.beginPath();
                    ctx.arc(wx + 40, wy + 55, 14, 0, Math.PI * 2);
                    ctx.arc(wx + 55, wy + 50, 10, 0, Math.PI * 2);
                    ctx.fill();
                } else if (hash >= 18 && hash < 24) {
                    // Đá cổ chiến trường
                    ctx.fillStyle = "#334155";
                    ctx.beginPath();
                    ctx.ellipse(wx + 70, wy + 70, 14, 9, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (hash === 25) {
                    // Ấn chú cổ trên mặt đất
                    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(wx + 60, wy + 60, 34, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }
    },

    // Cấu hình Spritesheet & Hoạt ảnh Nhân Vật Chính (Naruto & Itachi & Thần Giáp Susanoo)
    cleanPlayerSprite: null,
    cleanItachiSprite: null,
    cleanSusanooSprite: null,
    cleanSlashSprite: null,
    isPlayerSpriteLoaded: false,
    _loadingPlayerSprite: false,

    narutoFrames: {
        idle: { sx: 40, sy: 115, sw: 180, sh: 335 },
        run: [
            { sx: 265, sy: 110, sw: 215, sh: 340 },
            { sx: 515, sy: 100, sw: 240, sh: 350 },
            { sx: 765, sy: 110, sw: 245, sh: 340 }
        ]
    },

    itachiFrames: {
        idle: { sx: 69, sy: 152, sw: 135, sh: 277 },
        run: [
            { sx: 282, sy: 152, sw: 174, sh: 277 },
            { sx: 534, sy: 152, sw: 187, sh: 272 },
            { sx: 790, sy: 152, sw: 178, sh: 277 }
        ]
    },

    susanooFrames: {
        idle:   { sx: 21,  sy: 30,  sw: 276, sh: 280 }, // Đứng thủ thế uy nghiêm
        run:    { sx: 323, sy: 30,  sw: 352, sh: 315 }, // Sải bước dũng mãnh, chuyển động nhịp nhàng
        windup: { sx: 725, sy: 10,  sw: 272, sh: 278 }, // Giơ Thần Kiếm Totsuka qua đầu
        slash:  { sx: 618, sy: 312, sw: 393, sh: 242 }  // Vung Thần Kiếm Totsuka chém quét cực mạnh
    },

    // Tự động khử nền trắng thành trong suốt (Chroma Clean)
    initPlayerSprite() {
        if (window.PlayerSprite && window.PlayerSprite.cleanPlayerSprite) {
            this.cleanPlayerSprite = window.PlayerSprite.cleanPlayerSprite;
            this.isPlayerSpriteLoaded = true;
            return;
        }
        if (this.cleanPlayerSprite || this._loadingPlayerSprite) return;
        this._loadingPlayerSprite = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const primarySrc = prefix + 'Assets/_Project/Textures/Player/player_naruto.png';
        const fallbackSrc = isRoot 
            ? './Assets/_Project/Textures/Player/player_naruto.png' 
            : './SurvivalIO/Assets/_Project/Textures/Player/player_naruto.png';

        const img = new Image();
        this.playerImg = img;

        let triedFallback = false;
        img.onload = () => {
            try {
                const offCanvas = document.createElement('canvas');
                const targetW = (img.width > 1200) ? 1024 : (img.width || 1024);
                const targetH = (img.width > 1200) ? 572 : (img.height || 571);
                offCanvas.width = targetW;
                offCanvas.height = targetH;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0, targetW, targetH);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    // Lọc sạch hạt nền trắng hoặc xám sáng (r, g, b > 215):
                    if (d[i] > 215 && d[i+1] > 215 && d[i+2] > 215) {
                        d[i+3] = 0; // Biến thành trong suốt 100%
                    }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanPlayerSprite = offCanvas;
                this.isPlayerSpriteLoaded = true;
            } catch (err) {
                console.warn("[SpriteRenderer]: Fallback sang ảnh gốc Naruto:", err);
                this.cleanPlayerSprite = img;
                this.isPlayerSpriteLoaded = true;
            }
        };

        img.onerror = () => {
            if (!triedFallback) {
                triedFallback = true;
                img.src = prefix + 'Assets/_Project/Textures/Player/naruto_player.png';
            } else {
                img.src = fallbackSrc;
            }
        };

        img.src = primarySrc;
    },

    // Tự load sprite Itachi từ player_itachi.png
    initItachiSprite() {
        if (window.PlayerSprite && window.PlayerSprite.cleanItachiSprite) {
            this.cleanItachiSprite = window.PlayerSprite.cleanItachiSprite;
            return;
        }
        if (this.cleanItachiSprite || this._loadingItachiSprite) return;
        this._loadingItachiSprite = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const src = prefix + 'Assets/_Project/Textures/Player/player_itachi.png';
        const fallback = isRoot
            ? './Assets/_Project/Textures/Player/player_itachi.png'
            : './SurvivalIO/Assets/_Project/Textures/Player/player_itachi.png';

        const img = new Image();
        let triedFallback = false;
        img.onload = () => {
            try {
                const offCanvas = document.createElement('canvas');
                offCanvas.width = img.width;
                offCanvas.height = img.height;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i+1], b = d[i+2];
                    // Xóa nền xám (neutral gray: delta <= 15, avg > 160)
                    const avg = (r + g + b) / 3;
                    const delta = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg));
                    if (avg > 160 && delta <= 15) { d[i+3] = 0; continue; }
                    // Xóa nền trắng
                    if (r > 215 && g > 215 && b > 215) { d[i+3] = 0; }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanItachiSprite = offCanvas;
            } catch (err) {
                this.cleanItachiSprite = img;
            }
        };
        img.onerror = () => {
            if (!triedFallback) { triedFallback = true; img.src = fallback; }
        };
        img.src = src;
    },

    // Tự động khử nền và nạp sprite Susanoo (skill_player_itachi_2.png)
    initSusanooSprite() {
        if (window.PlayerSprite && window.PlayerSprite.cleanSusanooSprite) {
            this.cleanSusanooSprite = window.PlayerSprite.cleanSusanooSprite;
            return;
        }
        if (this.cleanSusanooSprite || this._loadingSusanooSprite) return;
        this._loadingSusanooSprite = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const src = prefix + 'Assets/_Project/Textures/Player/skill_player_itachi_2.png';
        const fallback = isRoot
            ? './Assets/_Project/Textures/Player/skill_player_itachi_2.png'
            : './SurvivalIO/Assets/_Project/Textures/Player/skill_player_itachi_2.png';

        const img = new Image();
        let triedFallback = false;
        img.onload = () => {
            try {
                const offCanvas = document.createElement('canvas');
                offCanvas.width = img.width;
                offCanvas.height = img.height;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i+1], b = d[i+2];
                    // 1. Lọc ô trắng: R > 230 && G > 230 && B > 230 -> gán Alpha = 0
                    if (r > 230 && g > 230 && b > 230) {
                        d[i+3] = 0;
                    }
                    // 2. Lọc ô caro xám: Là màu trung tính (|R-G| <= 15, |G-B| <= 15, |R-B| <= 15) và nằm trong dải xám sáng 160 <= R, G, B <= 235 -> gán Alpha = 0
                    else if (Math.abs(r - g) <= 15 && Math.abs(g - b) <= 15 && Math.abs(r - b) <= 15 &&
                             r >= 160 && r <= 235 && g >= 160 && g <= 235 && b >= 160 && b <= 235) {
                        d[i+3] = 0;
                    }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanSusanooSprite = offCanvas;
            } catch (err) {
                this.cleanSusanooSprite = img;
            }
        };
        img.onerror = () => {
            if (!triedFallback) { triedFallback = true; img.src = fallback; }
        };
        img.src = src;
    },

    // Tự động khử nền và nạp vệt sóng kiếm SlashWave (skill_player_itachi_chuan.png)
    initSlashSprite() {
        if (window.PlayerSprite && window.PlayerSprite.cleanSlashSprite) {
            this.cleanSlashSprite = window.PlayerSprite.cleanSlashSprite;
            return;
        }
        if (this.cleanSlashSprite || this._loadingSlashSprite) return;
        this._loadingSlashSprite = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const src = prefix + 'Assets/_Project/Textures/Player/skill_player_itachi_chuan.png';
        const fallback = isRoot
            ? './Assets/_Project/Textures/Player/skill_player_itachi_chuan.png'
            : './SurvivalIO/Assets/_Project/Textures/Player/skill_player_itachi_chuan.png';

        const img = new Image();
        let triedFallback = false;
        img.onload = () => {
            try {
                const offCanvas = document.createElement('canvas');
                offCanvas.width = img.width;
                offCanvas.height = img.height;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(img, 0, 0);
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                const d = imgData.data;
                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i+1], b = d[i+2];
                    // 1. Lọc nền đen: R < 35 && G < 35 && B < 35
                    if (r < 35 && g < 35 && b < 35) {
                        d[i+3] = 0;
                    } else {
                        const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
                        // 2. Lọc nền tối / xám trung tính: max(|R-G|, |G-B|, |R-B|) <= 12 và độ sáng R, G, B < 140
                        if (maxDiff <= 12 && r < 140 && g < 140 && b < 140) {
                            d[i+3] = 0;
                        } else if (r > 225 && g > 225 && b > 225) {
                            d[i+3] = 0;
                        } else if (maxDiff <= 15 && r > 160 && g > 160 && b > 160) {
                            d[i+3] = 0;
                        }
                    }
                }
                offCtx.putImageData(imgData, 0, 0);
                this.cleanSlashSprite = offCanvas;
            } catch (err) {
                this.cleanSlashSprite = img;
            }
        };
        img.onerror = () => {
            if (!triedFallback) { triedFallback = true; img.src = fallback; }
        };
        img.src = src;
    },

    // 2. Vẽ Shinobi (Naruto Pixel Art Hoạt Ảnh Chạy, Sasuke, Kakashi, Sakura, Itachi, Anbu, Phân Thân)
    drawShinobi(ctx, x, y, radius, time, facing, isClone = false, isSixPaths = false, hpRatio = 1, ninjaType = 'naruto', isMoving = true) {
        ctx.save();
        ctx.translate(x, y);

        // Bóng dưới chân
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.85 + 2, radius * 0.85, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hiệu ứng gợn sóng nước & bọt nước dưới chân khi lội qua vũng nước (Water Ripples & Splashes)
        const playerRef = (!isClone && window.GameManager) ? window.GameManager.player : null;
        if (playerRef && playerRef.isInWater) {
            ctx.save();
            const rip1 = radius * 0.9 + Math.sin(time * 7) * 3;
            const rip2 = radius * 1.35 + Math.cos(time * 7) * 4;

            // Vòng sóng nước gợn 1
            ctx.strokeStyle = "rgba(147, 197, 253, 0.85)";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.ellipse(0, radius * 0.85 + 2, rip1, rip1 * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Vòng sóng nước gợn 2
            ctx.strokeStyle = "rgba(191, 219, 254, 0.55)";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.ellipse(0, radius * 0.85 + 2, rip2, rip2 * 0.36, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Các hạt bọt nước nhỏ văng tung tóe dưới chân khi di chuyển
            if (isMoving) {
                ctx.fillStyle = "rgba(224, 242, 254, 0.9)";
                for (let s = 0; s < 4; s++) {
                    const sAngle = time * 8 + s * 1.57;
                    const sDist = rip1 * 0.75;
                    const spX = Math.cos(sAngle) * sDist;
                    const spY = radius * 0.85 + 2 + Math.sin(sAngle) * (sDist * 0.38) - Math.abs(Math.sin(time * 12 + s)) * 4;
                    ctx.beginPath();
                    ctx.arc(spX, spY, 1.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        // Hào quang Lục Đạo hoặc Chakra Cửu Vĩ / Lôi Độn
        if (isSixPaths && !isClone) {
            ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, -10, radius + 14 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
            ctx.stroke();
        } else if (ninjaType === 'sasuke') {
            // Tia sét chidori mờ quanh người Sasuke
            ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, -10, radius + 8 + Math.sin(time * 12) * 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        const isSusanoo = Boolean(playerRef && playerRef.isSusanoo);

        // ====================================================================
        // 1. TRẠNG THÁI BIẾN HÌNH SUSANOO (THẦN GIÁP CAM KHỔNG LỒ)
        // ====================================================================
        const susanooSource = this.cleanSusanooSprite || window.PlayerSprite?.cleanSusanooSprite || window.PlayerSprite?.susanooImg;
        if (isSusanoo && susanooSource) {
            ctx.save();
            if (facing < 0) ctx.scale(-1, 1);

            // Chọn frame Susanoo: Vung chém / Chạy dũng mãnh / Đứng yên
            let f;
            let destHeight = 135;
            let destWidth = 130;

            if (playerRef.susanooSlashAnim > 0) {
                // Đang trong hoạt ảnh vung kiếm chém
                if (playerRef.susanooSlashAnim > 0.20) {
                    f = this.susanooFrames.windup;
                    destHeight = 135;
                    destWidth = Math.round(destHeight * (f.sw / f.sh));
                } else {
                    f = this.susanooFrames.slash;
                    destHeight = 130;
                    destWidth = Math.round(destHeight * (f.sw / f.sh));
                }
            } else if (isMoving) {
                // Đang di chuyển -> Frame bước chạy dũng mãnh
                f = this.susanooFrames.run;
                destHeight = 138;
                destWidth = Math.round(destHeight * (f.sw / f.sh));
            } else {
                // Đứng yên -> Frame đứng uy nghiêm
                f = this.susanooFrames.idle;
                destHeight = 135;
                destWidth = Math.round(destHeight * (f.sw / f.sh));
            }

            // 1. THÊM BÓNG ĐỔ TIẾP ĐẤT (GROUND CONTACT SHADOW)
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(0, 0, destWidth * 0.35, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 2. HẠ THẤP TỌA ĐỘ VẼ ĐỂ CHÂN TIẾP ĐẤT 100%
            // Hào quang Chakra rực lửa bao quanh Susanoo
            ctx.shadowColor = "#f97316";
            ctx.shadowBlur = 22 + Math.sin(time * 8) * 6;

            // Hạ chân Susanoo tiếp đất chuẩn xác như các nhân vật khác
            const drawY = -destHeight + 30;
            const imgWidth = susanooSource.width || 1024;
            const imgHeight = susanooSource.height || 572;
            const scaleX = imgWidth / 1024;
            const scaleY = imgHeight / 572;
            ctx.drawImage(
                susanooSource,
                f.sx * scaleX, f.sy * scaleY, f.sw * scaleX, f.sh * scaleY,
                -destWidth / 2, drawY, destWidth, destHeight
            );

            ctx.restore();
            ctx.restore();
            return;
        }

        // Tự động kích hoạt nạp sprite nếu chưa có
        if (!this.cleanPlayerSprite && !this._loadingPlayerSprite) {
            this.initPlayerSprite();
        }
        if (!this.cleanItachiSprite && !this._loadingItachiSprite) {
            this.initItachiSprite();
        }

        // ====================================================================
        // 2. TRẠNG THÁI ITACHI NGƯỜI THƯỜNG (player_itachi.png)
        // ====================================================================
        const itachiSource = this.cleanItachiSprite || window.PlayerSprite?.cleanItachiSprite || window.PlayerSprite?.itachiImg || this.itachiImg;
        if ((ninjaType === 'itachi' || (!isClone && playerRef && playerRef.ninjaType === 'itachi')) && itachiSource) {
            ctx.save();
            if (isClone) ctx.globalAlpha = 0.85;
            if (facing < 0) ctx.scale(-1, 1);

            let f;
            if (isMoving) {
                const runIdx = Math.floor(time / 0.12) % 3;
                f = this.itachiFrames.run[runIdx];
            } else {
                f = this.itachiFrames.idle;
            }

            const w = 46;
            const h = 60;
            ctx.drawImage(itachiSource, f.sx, f.sy, f.sw, f.sh, -w / 2, -h + 16, w, h);

            ctx.restore();
            ctx.restore();
            return;
        }

        const spriteSource = this.cleanPlayerSprite || window.PlayerSprite?.cleanPlayerSprite || window.PlayerSprite?.playerImg || this.playerImg;
        const isLoaded = Boolean((this.isPlayerSpriteLoaded && this.cleanPlayerSprite) || (window.PlayerSprite && window.PlayerSprite.cleanPlayerSprite) || (spriteSource && (spriteSource.width > 0 || spriteSource.complete)));

        // BỘ SPRITE PIXEL ART CHÍNH CHỦ CÓ HOẠT ẢNH CHẠY (ANIMATED NARUTO)
        if (ninjaType === 'naruto' && spriteSource && (isLoaded || spriteSource.complete)) {
            ctx.save();

            // Phân thân bóng mờ nhẹ
            if (isClone) {
                ctx.globalAlpha = 0.85;
            }

            // Đổi hướng: Nếu facing < 0 thì lật ngược scale(-1, 1) sang trái
            if (facing < 0) {
                ctx.scale(-1, 1);
            }

            // Chọn frame: Đang di chuyển -> chu kỳ chạy 3 frames (0.12s); Đứng yên -> frame idle
            let f;
            if (isMoving) {
                const runIdx = Math.floor(time / 0.12) % 3;
                f = this.narutoFrames.run[runIdx];
            } else {
                f = this.narutoFrames.idle;
            }

            // Kích thước hiển thị: rộng ~44px, cao ~58px
            const w = 44;
            const h = 58;
            ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -w / 2, -h + 16, w, h);

            ctx.restore(); // restore scale
            ctx.restore(); // restore translate
            return;
        }

        // Hiệu ứng nhún nhảy khi chạy (thủ tục)
        const bob = Math.sin(time * 14) * 2.5;
        ctx.translate(0, bob);

        // Dải băng bảo vệ trán bay phấp phới phía sau
        const dir = facing >= 0 ? -1 : 1;
        let tieColor = "#ef4444";
        if (isClone) tieColor = "#38bdf8";
        else if (ninjaType === 'sasuke') tieColor = "#3b82f6";
        else if (ninjaType === 'kakashi') tieColor = "#15803d";
        else if (ninjaType === 'sakura') tieColor = "#f43f5e";
        else if (ninjaType === 'itachi') tieColor = "#991b1b";

        ctx.strokeStyle = tieColor;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(dir * 6, -radius * 0.45);
        ctx.quadraticCurveTo(dir * 18, -radius * 0.6 + Math.sin(time * 16) * 5, dir * 24, -radius * 0.2);
        ctx.stroke();

        // Thân áo theo nhân vật
        let bodyColor = isSixPaths ? "#f59e0b" : "#f97316";
        let collarColor = "#0f172a";
        let hairColor = "#facc15";
        let faceColor = "#fde68a";

        if (ninjaType === 'sasuke') {
            bodyColor = "#1e293b";
            collarColor = "#2563eb";
            hairColor = "#090d16";
        } else if (ninjaType === 'kakashi') {
            bodyColor = "#166534";
            collarColor = "#0f172a";
            hairColor = "#cbd5e1";
        } else if (ninjaType === 'sakura') {
            bodyColor = "#e11d48";
            collarColor = "#ffe4e6";
            hairColor = "#f472b6";
        } else if (ninjaType === 'itachi') {
            bodyColor = "#090d16";
            collarColor = "#991b1b";
            hairColor = "#020617";
        } else if (ninjaType === 'anbu') {
            bodyColor = "#334155";
            collarColor = "#475569";
            hairColor = "#0f172a";
        }

        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, 2, radius * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1e293b";
        ctx.stroke();

        // Cổ áo
        ctx.fillStyle = collarColor;
        ctx.beginPath();
        ctx.arc(0, -2, radius * 0.62, 0, Math.PI);
        ctx.fill();

        // Mây đỏ Akatsuki trên áo Itachi
        if (ninjaType === 'itachi') {
            ctx.fillStyle = "#dc2626";
            ctx.beginPath();
            ctx.arc(-4, 3, 3, 0, Math.PI * 2);
            ctx.arc(4, 4, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Khuôn mặt
        ctx.fillStyle = faceColor;
        ctx.beginPath();
        ctx.arc(0, -4, radius * 0.58, 0, Math.PI * 2);
        ctx.fill();

        // Khẩu trang Kakashi
        if (ninjaType === 'kakashi') {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(-radius * 0.45, -3, radius * 0.9, radius * 0.5);
        }

        // Mặt nạ Cáo ANBU
        if (ninjaType === 'anbu') {
            ctx.fillStyle = "#f8fafc";
            ctx.beginPath();
            ctx.arc(0, -4, radius * 0.56, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(-4, -4, 2, 0, Math.PI);
            ctx.arc(4, -4, 2, 0, Math.PI);
            ctx.stroke();
        }

        // Băng trán Làng Lá
        if (ninjaType !== 'anbu') {
            ctx.fillStyle = "#334155";
            ctx.fillRect(-radius * 0.55, -radius * 0.65, radius * 1.1, 6);
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(-radius * 0.25, -radius * 0.62, radius * 0.5, 4);

            // Vạch gạch ngang nếu là Ninja Lưu Vong (Itachi)
            if (ninjaType === 'itachi') {
                ctx.strokeStyle = "#dc2626";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(-radius * 0.2, -radius * 0.5);
                ctx.lineTo(radius * 0.2, -radius * 0.5);
                ctx.stroke();
            }
        }

        // Mái tóc
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        if (ninjaType === 'kakashi') {
            ctx.moveTo(-radius * 0.6, -radius * 0.5);
            ctx.lineTo(-radius * 0.2, -radius * 1.2);
            ctx.lineTo(radius * 0.2, -radius * 1.3);
            ctx.lineTo(radius * 0.65, -radius * 0.8);
            ctx.lineTo(radius * 0.6, -radius * 0.5);
        } else if (ninjaType === 'sakura') {
            ctx.arc(0, -radius * 0.6, radius * 0.55, Math.PI, 0);
        } else if (ninjaType === 'sasuke' || ninjaType === 'itachi') {
            ctx.moveTo(-radius * 0.7, -radius * 0.4);
            ctx.lineTo(-radius * 0.4, -radius * 1.1);
            ctx.lineTo(0, -radius * 0.75);
            ctx.lineTo(radius * 0.4, -radius * 1.1);
            ctx.lineTo(radius * 0.7, -radius * 0.4);
        } else {
            ctx.moveTo(-radius * 0.65, -radius * 0.6);
            ctx.lineTo(-radius * 0.35, -radius * 1.15);
            ctx.lineTo(0, -radius * 0.78);
            ctx.lineTo(radius * 0.35, -radius * 1.15);
            ctx.lineTo(radius * 0.65, -radius * 0.6);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Thanh máu nhỏ ngay dưới chân nhân vật trong trận
        if (!isClone && hpRatio < 1) {
            const bw = 42, bh = 5;
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.fillRect(x - bw / 2, y + radius + 8, bw, bh);
            ctx.fillStyle = hpRatio > 0.35 ? "#22c55e" : "#ef4444";
            ctx.fillRect(x - bw / 2 + 1, y + radius + 9, (bw - 2) * Math.max(0, hpRatio), bh - 2);
        }
    },

    // Cấu hình Spritesheet & Animation Quái Vật Rừng Làng Lá
    cleanNinjaSprite: null,
    isNinjaSpriteLoaded: false,
    _loadingNinjaSprite: false,

    enemyFrames: {
        run: [
            { sx: 30, sy: 200, sw: 120, sh: 170 },
            { sx: 160, sy: 200, sw: 120, sh: 170 },
            { sx: 290, sy: 200, sw: 120, sh: 170 }
        ],
        attack: { sx: 340, sy: 380, sw: 140, sh: 180 }
    },

    // Spritesheet & Animation Boss Orochimaru (1152x720 px)
    cleanOrochimaruSprite: null,
    isOrochimaruLoaded: false,
    _loadingOrochimaruSprite: false,

    orochimaruFrames: {
        // Hàng trên: Di chuyển & Nghỉ
        idle:   { sx: 12,  sy: 20,  sw: 115, sh: 180 }, // Sprite 1: Đứng thở
        run1:   { sx: 150, sy: 25,  sw: 120, sh: 175 }, // Sprite 2: Bước chân 1
        run2:   { sx: 290, sy: 28,  sw: 125, sh: 172 }, // Sprite 3: Bước chân 2
        run: [
            { sx: 150, sy: 25,  sw: 120, sh: 175 },
            { sx: 290, sy: 28,  sw: 125, sh: 172 }
        ],
        // Hàng dưới: Tung chiêu / Tấn công cận chiến (ĐÃ ĐẨY SY CAO LÊN TỪ Y=200 ĐỂ LẤY ĐỦ ĐỈNH ĐẦU VÀ TÓC)
        attack: { sx: 195, sy: 200, sw: 150, sh: 165 }  // Sprite 4: Đủ đỉnh tóc, mặt, tay xòe và chân
    },

    // Nạp và lọc sạch nền trong suốt (Chroma Clean) cho Boss Orochimaru
    initOrochimaruSprite() {
        if (window.BossManda && window.BossManda.cleanBossSprite) {
            this.cleanOrochimaruSprite = window.BossManda.cleanBossSprite;
            this.isOrochimaruLoaded = true;
            return;
        }
        if (this.cleanOrochimaruSprite || this._loadingOrochimaruSprite) return;
        this._loadingOrochimaruSprite = true;

        const isRoot = !window.location.pathname.includes('/SurvivalIO/');
        const prefix = isRoot ? './SurvivalIO/' : './';
        const primarySrc = prefix + 'Assets/_Project/Textures/Boss/boss_orochimaru.png';
        const fallbackSrc = isRoot 
            ? './Assets/_Project/Textures/Boss/boss_orochimaru.png' 
            : './SurvivalIO/Assets/_Project/Textures/Boss/boss_orochimaru.png';

        const img = new Image();
        this.bossImg = img;

        let triedFallback = false;
        img.onload = () => {
            try {
                // Nạp qua Canvas phụ để lọc sạch các hạt xám/nhiễu nền còn sót lại (r, g, b > 140 và ít màu -> alpha = 0)
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
                this.cleanOrochimaruSprite = offCanvas;
                this.isOrochimaruLoaded = true;
            } catch (err) {
                console.warn("[SpriteRenderer]: Fallback sang ảnh gốc Orochimaru:", err);
                this.cleanOrochimaruSprite = img;
                this.isOrochimaruLoaded = true;
            }
        };

        img.onerror = () => {
            if (!triedFallback) {
                triedFallback = true;
                img.src = fallbackSrc;
            }
        };

        img.src = primarySrc;
    },

    // Thuật toán Chroma Clean: Lọc sạch 100% hạt trắng/xám sáng viền ngoài
    initEnemySprite() {
        if (window.EnemySprite && window.EnemySprite.cleanNinjaSprite) {
            this.cleanNinjaSprite = window.EnemySprite.cleanNinjaSprite;
            this.isNinjaSpriteLoaded = true;
            return;
        }
        if (this.cleanNinjaSprite || this._loadingNinjaSprite) return;
        this._loadingNinjaSprite = true;

        const isRoot = typeof window !== 'undefined' && window.location 
            ? !window.location.pathname.includes('/SurvivalIO/') : true;
        const prefix = isRoot ? './SurvivalIO/' : './';
        const primarySrc = prefix + 'Assets/_Project/Textures/Enemy/ninja_enemy.png';
        const fallbackSrc = isRoot 
            ? './Assets/_Project/Textures/Enemy/ninja_enemy.png' 
            : './SurvivalIO/Assets/_Project/Textures/Enemy/ninja_enemy.png';

        const img = new Image();
        let triedFallback = false;
        img.onload = () => {
            try {
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
                this.isNinjaSpriteLoaded = true;
            } catch (err) {
                console.warn("[SpriteRenderer]: Fallback to raw enemy spritesheet:", err);
                this.cleanNinjaSprite = img;
                this.isNinjaSpriteLoaded = true;
            }
        };
        img.onerror = () => {
            if (!triedFallback) {
                triedFallback = true;
                img.src = fallbackSrc;
            }
        };
        img.src = primarySrc;
    },

    // 3. Vẽ các loại Quái Vật & Boss
    drawEnemy(ctx, enemy, time, player = null) {
        const spriteSource = this.cleanNinjaSprite || window.EnemySprite?.cleanNinjaSprite || window.EnemySprite?.spriteImg || window.EnemySprite?.img;
        const isSpriteReady = (this.isNinjaSpriteLoaded && this.cleanNinjaSprite) || (window.EnemySprite && window.EnemySprite.isLoaded);

        if (!spriteSource && !this._loadingNinjaSprite) {
            this.initEnemySprite();
        }

        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        const isNinjaType = enemy.type === 'bandit' || enemy.type === 'rogue_ninja' || enemy.type === 'rain_ninja';

        if (isNinjaType) {
            // Có bóng đổ mờ elip rgba(0, 0, 0, 0.25) dưới chân mỗi tên Ninja
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.beginPath();
            ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Hiệu ứng gợn sóng nước dưới chân quái khi lội qua vũng nước
            if (enemy.isInWater) {
                ctx.save();
                const eRip = 14 + Math.sin(time * 6 + (enemy.x || 0)) * 2.5;
                ctx.strokeStyle = "rgba(147, 197, 253, 0.65)";
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.ellipse(0, 16, eRip, eRip * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // Xác định hướng đổi mặt: Mũi dao Kunai và hướng chạy luôn hướng về phía Naruto:
            // Nếu Naruto ở bên trái quái: dùng ctx.scale(-1, 1) lật ngược hình mượt mà sang trái
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

            // Kiểm tra trạng thái: Tấn công (khoảng cách <= 45px) hoặc Chạy (> 45px)
            const isAttacking = Boolean(enemy.isAttacking || (enemy.distToPlayer !== undefined && enemy.distToPlayer <= 45));

            if (isSpriteReady && spriteSource) {
                if (isAttacking) {
                    // B. TRẠNG THÁI TẤN CÔNG (Khoảng cách <= 45px) - Dáng đâm Kunai cắm thẳng vào Naruto
                    const f = this.enemyFrames.attack;
                    ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -18, -39, 44, 55);

                    // Khi bị Naruto bắn trúng: Nháy sáng trắng 0.08s
                    if (enemy.hitFlash > 0) {
                        ctx.save();
                        try {
                            ctx.globalAlpha = 0.88;
                            ctx.filter = "brightness(3) saturate(0)";
                            ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -18, -39, 44, 55);
                        } catch (_) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                            ctx.beginPath();
                            ctx.ellipse(0, -10, 18, 26, 0, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                } else {
                    // A. TRẠNG THÁI CHẠY (Khoảng cách > 45px) - Lặp 3 frames hàng trên (chu kỳ 0.12s)
                    const frameIdx = Math.floor((time + (enemy.id || 0) * 0.05) / 0.12) % 3;
                    const f = this.enemyFrames.run[frameIdx];

                    // Kích thước hiển thị trong game: rộng ~38px, cao ~52px
                    ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -19, -36, 38, 52);

                    // Khi bị Naruto bắn trúng: Nháy sáng trắng 0.08s
                    if (enemy.hitFlash > 0) {
                        ctx.save();
                        try {
                            ctx.globalAlpha = 0.88;
                            ctx.filter = "brightness(3) saturate(0)";
                            ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -19, -36, 38, 52);
                        } catch (_) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                            ctx.beginPath();
                            ctx.ellipse(0, -10, 16, 24, 0, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                }
            } else {
                // Fallback nếu ảnh CHƯA tải xong: vẽ hình tròn tạm
                ctx.fillStyle = '#78350f';
                ctx.beginPath();
                ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore(); // restore scale

            // Thanh máu nhỏ trên đầu khi bị mất máu
            if (enemy.hp < enemy.maxHp) {
                const barW = 28;
                const barH = 3.5;
                const pct = Math.max(0, enemy.hp / enemy.maxHp);
                ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
                ctx.fillRect(-barW / 2, -44, barW, barH);
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(-barW / 2, -44, barW * pct, barH);
            }

            ctx.restore(); // restore translate
            return;
        }

        // Bóng dưới chân cho quái khác
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(0, enemy.radius * 0.85, enemy.radius * 0.85, enemy.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        const wobble = Math.sin(time * 10 + enemy.id) * 2;
        ctx.translate(0, wobble);

        if (enemy.type === 'zetsu') {
            ctx.fillStyle = "#e2e8f0";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#16a34a";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius + 2, 0.2, Math.PI - 0.2);
            ctx.stroke();
            ctx.fillStyle = "#eab308";
            ctx.beginPath();
            ctx.arc(-4, -2, 2.5, 0, Math.PI * 2);
            ctx.arc(4, -2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (enemy.type === 'boss_manda') {
            // BOSS PHÚT 5: Boss Orochimaru Pixel Art (1152x720 px)
            const spriteSource = this.cleanOrochimaruSprite || window.BossManda?.cleanBossSprite || window.BossManda?.bossImg;
            const isLoaded = (this.isOrochimaruLoaded && this.cleanOrochimaruSprite) || (window.BossManda && window.BossManda.isLoaded);

            if (!spriteSource && !this._loadingOrochimaruSprite) {
                this.initOrochimaruSprite();
            }

            // Kiểm tra trạng thái tấn công: Khoảng cách <= 80px hoặc skillTimer < 0.8s
            const distToP = enemy.distToPlayer !== undefined 
                ? enemy.distToPlayer 
                : (player ? Math.hypot(player.x - enemy.x, player.y - enemy.y) : 999);
            const isAttacking = Boolean(enemy.isAttacking || distToP <= 80 || (enemy.skillTimer !== undefined && enemy.skillTimer < 0.8));

            let f;
            let destWidth, destHeight;
            let currentFrame;

            if (isAttacking) {
                // Frame 4: Tung chiêu / Tấn công cận chiến (Đã lấy đủ đỉnh tóc, mặt, tay xòe và chân)
                f = this.orochimaruFrames.attack;
                currentFrame = 'attack';
                destWidth = 72;
                destHeight = 94;
            } else {
                // Hàng trên: Di chuyển chạy 2 bước chân (chu kỳ bước chân mượt mà)
                const runIdx = Math.floor(time * 5.5) % 2;
                currentFrame = runIdx === 0 ? 'run1' : 'run2';
                f = this.orochimaruFrames.run[runIdx];
                destWidth = 64;
                destHeight = 92;
            }

            // Vẽ bóng đen dưới chân trước khi vẽ Boss để tạo chiều sâu nổi bật khỏi mặt đất
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 0, destWidth * 0.35, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // 2. Vẽ Sprite Boss Orochimaru Pixel Art
            if (isLoaded && spriteSource) {
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

                // 1. ÁP DỤNG KỸ THUẬT LỚP LÓT THÂN CHỐNG XUYÊN NỀN (SOLID BODY UNDERCOAT CHO MỌI ANIMATION):
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

                // Nháy sáng trắng khi trúng đòn (bọc an toàn, khôi phục ngay không rò rỉ globalAlpha)
                if (enemy.hitFlash > 0) {
                    ctx.save();
                    try {
                        ctx.globalAlpha = 0.85;
                        ctx.filter = "brightness(3) saturate(0)";
                        ctx.drawImage(spriteSource, f.sx, f.sy, f.sw, f.sh, -destWidth / 2, -destHeight + 15, destWidth, destHeight);
                    } catch (_) {}
                    ctx.restore();
                }

                // Luôn gọi ctx.restore() ngay sau khi vẽ xong Boss để không làm rò rỉ độ mờ sang các frame sau
                ctx.restore();
                ctx.restore(); // restore scale
            } else {
                // Fallback khi ảnh đang nạp: vẽ bóng mờ hình người pixel art tạm thời
                ctx.fillStyle = "rgba(30, 20, 50, 0.65)";
                ctx.beginPath();
                ctx.ellipse(0, -25, 18, 30, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (enemy.type === 'boss_akatsuki') {
            // BOSS PHÚT 10: Thủ Lĩnh Akatsuki
            ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius + 8 + Math.sin(time * 10) * 4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "#090d16";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#dc2626";
            ctx.stroke();

            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(-10, 8, 6, 0, Math.PI * 2);
            ctx.arc(-4, 8, 5, 0, Math.PI * 2);
            ctx.arc(10, -6, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(-8, -8, 4.5, 0, Math.PI * 2);
            ctx.arc(8, -8, 4.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Hiệu ứng nháy trắng khi trúng đòn
        if (enemy.hitFlash > 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Hiệu ứng [🔥 BỐC CHÁY] (Ignite / Burn on hit từ Sóng Kiếm Susanoo)
        if (enemy.burnTimer && enemy.burnTimer > 0) {
            ctx.save();
            const flameTime = time * 12;
            const r = enemy.radius || 18;
            for (let f = 0; f < 3; f++) {
                const angle = (f * Math.PI * 2) / 3 + flameTime * 0.25;
                const fx = Math.cos(angle) * (r * 0.45);
                const fy = -r * 0.4 + Math.sin(angle) * 5 - (Math.abs(Math.sin(flameTime + f * 2.2)) * 8);
                const flameRadius = 4 + (Math.sin(flameTime * 1.5 + f) + 1) * 2;

                const grad = ctx.createRadialGradient(fx, fy, 1, fx, fy, flameRadius);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.3, '#fde047');
                grad.addColorStop(0.7, '#f97316');
                grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(fx, fy, flameRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        ctx.restore();
    }
};

// Tự động khởi tạo và lọc sạch vành trắng Spritesheet Quái Vật, Boss & Naruto
if (typeof window !== 'undefined' && window.SpriteRenderer) {
    try { window.SpriteRenderer.initEnemySprite(); } catch (_) {}
    try { window.SpriteRenderer.initOrochimaruSprite(); } catch (_) {}
    try { window.SpriteRenderer.initPlayerSprite(); } catch (_) {}
    try { window.SpriteRenderer.initItachiSprite(); } catch (_) {}
}

