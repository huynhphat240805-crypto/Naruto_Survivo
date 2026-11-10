/* ============================================================================
   MODULE: src/Enemy/EnemyMovement.js
   Hành Vi Di Chuyển Tự Động Tìm Đường Bao Vây Naruto & Tấn Công Cận Chiến
   ============================================================================ */

window.EnemyMovement = {
    update(dt, game) {
        const p = game.player;
        if (!p) return;

        for (let i = game.enemies.length - 1; i >= 0; i--) {
            const e = game.enemies[i];
            if (e.dead) {
                game.enemies.splice(i, 1);
                continue;
            }

            if (e.hitFlash > 0) e.hitFlash -= dt;

            const dx = p.x - e.x;
            const dy = p.y - e.y;
            const dist = Math.hypot(dx, dy) || 1;
            e.distToPlayer = dist;
            e.angle = Math.atan2(dy, dx);
            e.facing = dx < 0 ? -1 : 1; // Hướng mặt: -1 nếu Naruto ở bên trái (lật hình scale(-1, 1))

            // Trạng thái Tấn công: Boss Orochimaru kích hoạt khi <= 80px, quái Ninja thường khi <= 45px
            const attackThreshold = (e.type === 'boss_manda') ? 80 : 45;
            if (dist <= attackThreshold) {
                e.isAttacking = true;
                e.attackHoldTimer = (e.attackHoldTimer || 0) + dt;
                e.attackCooldown = (e.attackCooldown || 0) - dt;
                if (e.attackCooldown <= 0) {
                    e.attackCooldown = (e.type === 'boss_manda') ? 0.6 : 0.3; // Boss đánh có nhịp ra chiêu
                    window.DamageSystem.damagePlayer(game, e.damage);
                }
            } else {
                // Khi Naruto chạy thoát ra xa: Tự động thu đòn và chuyển về tư thế chạy đuổi tiếp
                e.isAttacking = false;
                e.attackHoldTimer = 0;
            }

            // 1. Quái tự động tìm đường bám sát người chơi
            // Cơ chế địa hình vũng nước: Quái khi lội qua vũng nước bị giảm 20 - 30% tốc độ để người chơi kite
            let inWater = false;
            const mapCtrl = (game && game.map) || window.MapController;
            if (mapCtrl && typeof mapCtrl.isWaterAt === 'function') {
                inWater = mapCtrl.isWaterAt(e.x, e.y);
            } else if (mapCtrl && mapCtrl.puddles && mapCtrl.puddles.length > 0) {
                for (let k = 0; k < mapCtrl.puddles.length; k++) {
                    const pud = mapCtrl.puddles[k];
                    if (pud.width !== undefined && pud.height !== undefined) {
                        // Kiểm tra va chạm hộp chữ nhật AABB [p.x, p.y, p.width, p.height]
                        if (e.x >= pud.x && e.x <= pud.x + pud.width &&
                            e.y >= pud.y && e.y <= pud.y + pud.height) {
                            inWater = true;
                            break;
                        }
                    } else if (Math.hypot(e.x - pud.x, e.y - pud.y) < pud.radius) {
                        inWater = true;
                        break;
                    }
                }
            }

            e.isInWater = inWater;

            let speedFactor = e.isAttacking ? 0.45 : 1.0;
            if (inWater) {
                speedFactor *= 0.7; // Quái vật bị làm chậm chính xác 30% (speed * 0.7) khi lội nước để người chơi dễ dàng kite
            }

            const moveSpeed = e.speed * speedFactor;
            e.x += (dx / dist) * moveSpeed * dt;
            e.y += (dy / dist) * moveSpeed * dt;

            // 2. Kỹ năng đặc biệt của Boss nếu là Boss
            if (e.isBoss) {
                if (e.type === 'boss_manda' && window.BossManda) {
                    window.BossManda.update(dt, e, game);
                } else if (e.type === 'boss_akatsuki' && window.BossAkatsuki) {
                    window.BossAkatsuki.update(dt, e, game);
                }
            }
        }
    }
};

