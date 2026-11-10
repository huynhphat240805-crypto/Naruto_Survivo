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

            // Xử lý đạn quái / kiếm Orochimaru bắn vào Naruto
            if (proj.type === 'enemy_proj' || proj.type === 'kusanagi_blade') {
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

            // Xử lý Vệt Sóng Kiếm Khí Khổng Lồ Susanoo (hinhanh_skill_player_itachi_chuan.png)
            if (proj.type === 'susanoo_slash') {
                const step = (proj.speed || 540) * dt;
                proj.distanceTraveled = (proj.distanceTraveled || 0) + step;
                const progress = Math.min(1.0, proj.distanceTraveled / (proj.maxDistance || 400));
                proj.progress = progress;

                // Quét xuyên thấu 100% bầy quái trên đường bay
                if (game.enemies && game.enemies.length > 0) {
                    for (let j = 0; j < game.enemies.length; j++) {
                        const e = game.enemies[j];
                        if (e.dead) continue;
                        const dist = Math.hypot(e.x - proj.x, e.y - proj.y);
                        if (dist <= proj.radius + e.radius) {
                            const lastHit = proj.hitEnemies.get(e) || 0;
                            // Cooldown trúng đòn mỗi 50px quãng đường hoặc lần đầu
                            if (proj.distanceTraveled - lastHit >= 50 || lastHit === 0) {
                                proj.hitEnemies.set(e, proj.distanceTraveled);
                                const knockDirX = proj.vx >= 0 ? 1 : -1;
                                
                                // Gây sát thương khủng x4 kèm hất văng quái ra xa theo hướng sóng kiếm
                                window.DamageSystem.damageEnemy(
                                    game,
                                    e,
                                    proj.damage,
                                    115, // Đẩy lùi cực mạnh
                                    proj.x - knockDirX * 45,
                                    proj.y,
                                    '#f97316'
                                );

                                // HIỆU ỨNG [🔥 BỐC CHÁY] (IGNITE / BURN ON HIT):
                                // Dính trạng thái bốc cháy kéo dài 3 giây, trừ máu mỗi 0.5s
                                e.burnTimer = 3.0;
                                e.burnTick = 0;
                                e.burnDmg = Math.max(18, Math.round(proj.damage * 0.12));

                                if (game.spawnExplosionParticles) {
                                    game.spawnExplosionParticles(e.x, e.y, '#f97316', 6);
                                    game.spawnExplosionParticles(e.x, e.y, '#fde047', 4);
                                }
                            }
                        }
                    }
                }

                // Tan biến khi bay hết tầm xa tối đa (maxDistance = 400px)
                if (proj.progress >= 1.0) {
                    game.projectiles.splice(i, 1);
                    continue;
                }
            }

            if (proj.life <= 0 && (proj.type === 'enemy_proj' || proj.type === 'kusanagi_blade')) {
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
            } else if (proj.type === 'kusanagi_blade' || proj.subType === 'kusanagi') {
                // Đòn đánh Kiếm Kusanagi / Luồng Chakra bóng tối sắc nét của Orochimaru
                const angle = Math.atan2(proj.vy, proj.vx);
                ctx.rotate(angle);

                // Lưỡi kiếm Kusanagi sắc nhọn Pixel Art (không tạo bóng tròn tím)
                ctx.fillStyle = "#f8fafc";
                ctx.beginPath();
                ctx.moveTo(14, 0);
                ctx.lineTo(-10, -3.5);
                ctx.lineTo(-6, 0);
                ctx.lineTo(-10, 3.5);
                ctx.closePath();
                ctx.fill();

                // Chuôi kiếm & viền luồng Chakra bóng tối sắc bén
                ctx.strokeStyle = "#a855f7";
                ctx.lineWidth = 1.4;
                ctx.stroke();

                ctx.fillStyle = "#475569";
                ctx.fillRect(-13, -1.5, 4, 3);
            } else if (proj.type === 'susanoo_slash') {
                // Vệt Sóng Kiếm Khí Khổng Lồ từ hinhanh_skill_player_itachi_chuan.png
                const slashImg = window.PlayerSprite?.cleanSlashSprite || window.PlayerSprite?.slashImg || window.SpriteRenderer?.cleanSlashSprite;
                const progress = proj.progress || 0;

                // TÍNH TOÁN FRAME THEO TỈ LỆ QUÃNG ĐƯỜNG ĐÃ BAY:
                // 0% -> 20%: Frame 1 (sx = 0) -> Đốm lửa vừa bùng phát từ mũi kiếm
                // 20% -> 65%: Frame 2 (sx = fw) -> Vệt chém bán nguyệt nở to CỰC ĐẠI
                // 65% -> 85%: Frame 3 (sx = fw * 2) -> Vệt kiếm xé gió phân tán thành các dải lửa
                // 85% -> 100%: Frame 4 (sx = fw * 3) -> Tàn khói và tro lửa mờ dần rồi tan biến
                let frameIdx = 0;
                let w = 120, h = 180;

                if (progress < 0.20) {
                    frameIdx = 0;
                    w = 120;
                    h = 180;
                } else if (progress < 0.65) {
                    frameIdx = 1;
                    w = 190; // Nở to CỰC ĐẠI
                    h = 270;
                } else if (progress < 0.85) {
                    frameIdx = 2;
                    w = 170;
                    h = 240;
                } else {
                    frameIdx = 3;
                    w = 150;
                    h = 210;
                }

                ctx.save();
                if (proj.facing < 0) {
                    ctx.scale(-1, 1);
                }

                // 85% -> 100%: Tàn khói và tro lửa mờ dần rồi tan biến
                if (progress >= 0.85) {
                    const fade = Math.max(0, 1 - (progress - 0.85) / 0.15);
                    ctx.globalAlpha = fade;
                }

                // Bật chế độ pha trộn ánh sáng để vết chém phát sáng rực lửa và triệt tiêu hoàn toàn viền xám thừa
                ctx.globalCompositeOperation = 'lighter';

                ctx.shadowColor = "#f97316";
                ctx.shadowBlur = 25;

                if (slashImg) {
                    const imgW = slashImg.width || 1024;
                    const imgH = slashImg.height || 572;
                    const fw = imgW / 4;
                    const fh = imgH;
                    const sx = frameIdx * fw;
                    const sy = 0;

                    ctx.drawImage(slashImg, sx, sy, fw, fh, -w * 0.45, -h * 0.5, w, h);
                } else {
                    // Fallback hình sóng bán nguyệt rực lửa
                    const fg = ctx.createRadialGradient(0, 0, 10, 0, 0, w * 0.5);
                    fg.addColorStop(0, '#ffffff');
                    fg.addColorStop(0.3, '#fde047');
                    fg.addColorStop(0.7, '#ea580c');
                    fg.addColorStop(1, 'rgba(185, 28, 28, 0)');
                    ctx.fillStyle = fg;
                    ctx.beginPath();
                    ctx.arc(0, 0, w * 0.5, -Math.PI * 0.4, Math.PI * 0.4);
                    ctx.lineTo(-w * 0.2, 0);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            } else if (proj.type === 'enemy_proj') {
                // Đạn quái / Boss thường
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

