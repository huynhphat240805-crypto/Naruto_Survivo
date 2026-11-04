/* ============================================================================
   MODULE: src/Combat/HitboxCollision.js
   Kiểm tra Va Chạm Hình Tròn (Circle Hitbox) giữa Đạn/Chiêu Thức và Quái Vật
   ============================================================================ */

window.HitboxCollision = {
    // Kiểm tra va chạm giữa 2 hình tròn
    checkCircle(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return (dx * dx + dy * dy) <= (r1 + r2) * (r1 + r2);
    },

    // Xử lý toàn bộ va chạm của đạn người chơi
    checkProjectilesCollision(dt, game) {
        const p = game.player;
        if (!p) return;

        for (let i = game.projectiles.length - 1; i >= 0; i--) {
            const proj = game.projectiles[i];
            if (proj.type === 'enemy_proj') continue; // Đạn quái xử lý riêng

            // ================================================================
            // 1. RASENSHURIKEN 6★ (Xuyên thấu, lực hút lốc xoáy, nổ mái vòm cực đại)
            // ================================================================
            if (proj.type === 'rasenshuriken') {
                proj.tickTimer = (proj.tickTimer || 0) + dt;

                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const dx = proj.x - e.x;
                    const dy = proj.y - e.y;
                    const dist = Math.hypot(dx, dy);

                    // Lực hút Vortex Suction
                    if (dist < 220 && dist > 15) {
                        const pullForce = (220 - dist) * 1.8 * dt;
                        e.x += (dx / dist) * pullForce;
                        e.y += (dy / dist) * pullForce;
                    }

                    // Sát thương xoáy liên tục mỗi 0.15s
                    if (dist < proj.radius + e.radius && proj.tickTimer >= 0.15) {
                        window.DamageSystem.damageEnemy(game, e, proj.damage * 0.45, 6, proj.x, proj.y, '#38bdf8');
                        game.spawnExplosionParticles(e.x, e.y, '#38bdf8', 2);
                    }
                }
                if (proj.tickTimer >= 0.15) proj.tickTimer = 0;

                // Nổ cực đại khi hết thời gian bay
                if (proj.life <= 0) {
                    window.Camera.shake(0.4, 10);
                    if (window.SFXController) window.SFXController.fireball();
                    game.spawnExplosionParticles(proj.x, proj.y, '#38bdf8', 32);
                    game.spawnExplosionParticles(proj.x, proj.y, '#ffffff', 20);
                    game.spawnExplosionParticles(proj.x, proj.y, '#67e8f9', 18);

                    const blastRadius = 170;
                    for (let j = 0; j < game.enemies.length; j++) {
                        const target = game.enemies[j];
                        if (target.dead) continue;
                        if (Math.hypot(target.x - proj.x, target.y - proj.y) <= blastRadius) {
                            window.DamageSystem.damageEnemy(game, target, proj.damage * 3.5, 45, proj.x, proj.y, '#67e8f9');
                        }
                    }
                    game.projectiles.splice(i, 1);
                }
                continue;
            }

            // ================================================================
            // 2. FLAME WALL 6★ (Sóng Lửa Vòng Cung - Hào Hỏa Diệt Khước)
            // ================================================================
            if (proj.type === 'flame_wall') {
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const dist = Math.hypot(proj.x - e.x, proj.y - e.y);
                    if (dist < proj.radius + e.radius) {
                        e.flameHitCd = (e.flameHitCd || 0) - dt;
                        if (e.flameHitCd <= 0) {
                            e.flameHitCd = 0.22;
                            window.DamageSystem.damageEnemy(game, e, proj.damage, 25, proj.x, proj.y, '#f97316');
                            game.spawnExplosionParticles(e.x, e.y, '#f97316', 3);
                        }
                    }
                }
                if (proj.life <= 0) {
                    game.projectiles.splice(i, 1);
                }
                continue;
            }

            // ================================================================
            // 3. CÁC NHẪN THUẬT KHÁC: HÀO HỎA CẦU & KUNAI / SHURIKEN
            // ================================================================
            let removed = false;
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                const dist = Math.hypot(proj.x - e.x, proj.y - e.y);

                if (dist < proj.radius + e.radius) {
                    if (proj.type === 'fireball') {
                        // Hào Hỏa Cầu nổ AoE diện rộng
                        game.spawnExplosionParticles(proj.x, proj.y, '#f97316', 26);
                        for (let k = 0; k < game.enemies.length; k++) {
                            const target = game.enemies[k];
                            if (target.dead) continue;
                            if (Math.hypot(target.x - proj.x, target.y - proj.y) <= proj.aoeRadius) {
                                window.DamageSystem.damageEnemy(game, target, proj.damage, 30, proj.x, proj.y, '#fb923c');
                            }
                        }
                        game.projectiles.splice(i, 1);
                        removed = true;
                        break;
                    } else {
                        // Shuriken / Kunai Nổ
                        window.DamageSystem.damageEnemy(
                            game,
                            e,
                            proj.damage,
                            14,
                            proj.x,
                            proj.y,
                            proj.isEvolved ? '#f59e0b' : '#fde047'
                        );

                        if (proj.explosive) {
                            const expRad = proj.isEvolved ? 95 : 55;
                            const expCount = proj.isEvolved ? 16 : 10;
                            game.spawnExplosionParticles(proj.x, proj.y, '#f59e0b', expCount);
                            for (let k = 0; k < game.enemies.length; k++) {
                                const near = game.enemies[k];
                                if (near !== e && !near.dead && Math.hypot(near.x - proj.x, near.y - proj.y) < expRad) {
                                    window.DamageSystem.damageEnemy(
                                        game,
                                        near,
                                        proj.damage * (proj.isEvolved ? 0.8 : 0.5),
                                        12,
                                        proj.x,
                                        proj.y,
                                        '#fb923c'
                                    );
                                }
                            }
                        }

                        proj.pierce--;
                        if (proj.pierce <= 0) {
                            game.projectiles.splice(i, 1);
                            removed = true;
                            break;
                        }
                    }
                }
            }

            if (!removed && proj.life <= 0) {
                game.projectiles.splice(i, 1);
            }
        }
    }
};

