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

    // 2. Vẽ Shinobi (Naruto, Sasuke, Kakashi, Sakura, Itachi, Anbu, Phân Thân)
    drawShinobi(ctx, x, y, radius, time, facing, isClone = false, isSixPaths = false, hpRatio = 1, ninjaType = 'naruto') {
        ctx.save();
        ctx.translate(x, y);

        // Bóng dưới chân
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.85, radius * 0.8, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hào quang Lục Đạo hoặc Chakra Cửu Vĩ / Lôi Độn
        if (isSixPaths && !isClone) {
            ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, radius + 7 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
            ctx.stroke();
        } else if (ninjaType === 'sasuke') {
            // Tia sét chidori mờ quanh người Sasuke
            ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, radius + 4 + Math.sin(time * 12) * 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Hiệu ứng nhún nhảy khi chạy
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

    // 3. Vẽ các loại Quái Vật & Boss
    drawEnemy(ctx, enemy, time) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        // Bóng dưới chân
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(0, enemy.radius * 0.85, enemy.radius * 0.85, enemy.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        const wobble = Math.sin(time * 10 + enemy.id) * 2;
        ctx.translate(0, wobble);

        if (enemy.type === 'bandit') {
            ctx.fillStyle = "#78350f";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#fde68a";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(-enemy.radius * 0.7, -4, enemy.radius * 1.4, 8);
        } else if (enemy.type === 'rain_ninja') {
            ctx.fillStyle = "#4c1d95";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ca8a04";
            ctx.beginPath();
            ctx.moveTo(-enemy.radius * 1.1, 0);
            ctx.lineTo(0, -enemy.radius * 0.95);
            ctx.lineTo(enemy.radius * 1.1, 0);
            ctx.closePath();
            ctx.fill();
        } else if (enemy.type === 'zetsu') {
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
            // BOSS PHÚT 5: Rắn Khổng Lồ Manda
            for (let i = 4; i >= 1; i--) {
                const segOffset = i * 16;
                const sway = Math.sin(time * 7 - i * 0.8) * 12;
                ctx.fillStyle = i % 2 === 0 ? "#581c87" : "#7e22ce";
                ctx.beginPath();
                ctx.arc(-Math.cos(enemy.angle) * segOffset + sway, -Math.sin(enemy.angle) * segOffset, enemy.radius * (1 - i * 0.12), 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#c084fc";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.fillStyle = "#6b21a8";
            ctx.beginPath();
            ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#facc15";
            ctx.stroke();
            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.arc(-10, -8, 6, 0, Math.PI * 2);
            ctx.arc(10, -8, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(-11, -12, 2, 8);
            ctx.fillRect(9, -12, 2, 8);
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

        ctx.restore();
    }
};

