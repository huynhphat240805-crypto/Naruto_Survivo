/* ============================================================================
   MODULE: src/Weapons/Projectiles.js
   Hệ thống Đạn Phi Tiêu Kunai, Shuriken, Rasenshuriken, Hào Hỏa Cầu & Đạn Kẻ Địch
   ============================================================================ */

window.Projectiles = {
    // Cập nhật vị trí & thời gian sống toàn bộ đạn
    update(dt, game) {
        for (let i = game.projectiles.length - 1; i >= 0; i--) {
            const proj = game.projectiles[i];
            proj.x += proj.vx * dt;
            proj.y += proj.vy * dt;
            proj.life -= dt;
            if (proj.rotation !== undefined) proj.rotation += 18 * dt;

            // Xử lý đạn quái bắn vào Naruto
            if (proj.type === 'enemy_proj') {
                const p = game.player;
                if (p) {
                    const distToPlayer = Math.hypot(proj.x - p.x, proj.y - p.y);
                    if (distToPlayer < proj.radius + p.radius) {
                        window.DamageSystem.damagePlayer(game, proj.damage);
                        game.projectiles.splice(i, 1);
                        continue;
                    }
                }
            }

            if (proj.life <= 0 && proj.type === 'enemy_proj') {
                game.projectiles.splice(i, 1);
            }
        }
    },

    // Vẽ toàn bộ đạn lên Canvas
    render(ctx, camX, camY, game) {
        for (let i = 0; i < game.projectiles.length; i++) {
            const proj = game.projectiles[i];
            const px = proj.x - camX;
            const py = proj.y - camY;

            ctx.save();
            ctx.translate(px, py);

            if (proj.type === 'shuriken') {
                ctx.rotate(proj.rotation || 0);
                if (proj.isEvolved) {
                    // Kunai Bão Nổ 6★: Lưỡi dao vàng sắc nét kèm bùa nổ đỏ
                    ctx.fillStyle = "#fbbf24";
                    ctx.shadowColor = "#f59e0b";
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.moveTo(proj.radius + 8, 0);
                    ctx.lineTo(-proj.radius + 2, -4);
                    ctx.lineTo(-proj.radius - 2, 0);
                    ctx.lineTo(-proj.radius + 2, 4);
                    ctx.closePath();
                    ctx.fill();

                    // Bùa nổ đỏ
                    ctx.fillStyle = "#ef4444";
                    ctx.fillRect(-proj.radius - 8, -2, 7, 4);
                    ctx.strokeStyle = "#fef08a";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(-proj.radius - 8, -2, 7, 4);
                } else {
                    // Phi tiêu thường / Shuriken 4 cánh
                    ctx.fillStyle = proj.explosive ? "#f59e0b" : "#e2e8f0";
                    for (let b = 0; b < 4; b++) {
                        ctx.rotate(Math.PI / 2);
                        ctx.beginPath();
                        ctx.moveTo(0, -3);
                        ctx.lineTo(proj.radius + 4, 0);
                        ctx.lineTo(0, 3);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.fillStyle = "#0f172a";
                    ctx.beginPath();
                    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (proj.type === 'rasenshuriken') {
                // 6★ Phong Độn: Rasenshuriken - 4 cánh gió xoáy khổng lồ
                ctx.rotate(proj.rotation || 0);

                const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, proj.radius * 0.55);
                coreGrad.addColorStop(0, '#ffffff');
                coreGrad.addColorStop(0.6, '#38bdf8');
                coreGrad.addColorStop(1, 'rgba(14, 165, 233, 0.2)');
                ctx.fillStyle = coreGrad;
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius * 0.55, 0, Math.PI * 2);
                ctx.fill();

                // 4 Cánh gió xoáy
                ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                for (let b = 0; b < 4; b++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.beginPath();
                    ctx.moveTo(0, -6);
                    ctx.quadraticCurveTo(proj.radius * 0.8, -proj.radius * 0.55, proj.radius * 1.35, 0);
                    ctx.quadraticCurveTo(proj.radius * 0.5, proj.radius * 0.5, 0, 6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }

                // Vòng sóng bão
                ctx.strokeStyle = 'rgba(103, 232, 249, 0.75)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius * 1.15, 0, Math.PI * 1.6);
                ctx.stroke();
            } else if (proj.type === 'flame_wall') {
                // 6★ Hào Hỏa Diệt Khước: Sóng lửa hình vòng cung
                const fg = ctx.createRadialGradient(0, 0, 2, 0, 0, proj.radius);
                fg.addColorStop(0, '#ffffff');
                fg.addColorStop(0.3, '#fde047');
                fg.addColorStop(0.65, '#ea580c');
                fg.addColorStop(1, 'rgba(185, 28, 28, 0.15)');
                ctx.fillStyle = fg;
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(251, 146, 60, 0.9)';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius * 0.85, -Math.PI * 0.6, Math.PI * 0.6);
                ctx.stroke();
            } else if (proj.type === 'fireball') {
                // Hào Hỏa Cầu
                const fg = ctx.createRadialGradient(0, 0, 3, 0, 0, proj.radius);
                fg.addColorStop(0, '#fef08a');
                fg.addColorStop(0.55, '#f97316');
                fg.addColorStop(1, 'rgba(220, 38, 38, 0.2)');
                ctx.fillStyle = fg;
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (proj.type === 'enemy_proj') {
                // Đạn quái / Boss
                ctx.fillStyle = proj.color || '#ef4444';
                ctx.beginPath();
                ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
        }
    }
};

