/* ============================================================================
   MODULE: src/Items/DropItems.js
   Hạt Chakra EXP rơi ra, Đồng Ryo vàng, Kim Cương & Cơ Chế Hút Nam Châm (Magnet)
   ============================================================================ */

window.DropItems = {
    // Quái chết rơi ngọc Chakra EXP & Kim Cương
    dropOnEnemyDeath(enemy, game) {
        const expBonus = 1 + (game.player ? (game.player.expBonus || 0) : 0);

        if (enemy.isBoss) {
            game.diamonds += 25;
            game.spawnExplosionParticles(enemy.x, enemy.y, '#f43f5e', 35);
            // Mưa 15 hạt Chakra lớn
            for (let i = 0; i < 15; i++) {
                game.orbs.push({
                    x: enemy.x + (Math.random() - 0.5) * 90,
                    y: enemy.y + (Math.random() - 0.5) * 90,
                    exp: Math.round((enemy.expValue / 15) * expBonus),
                    radius: 8,
                    isDiamond: i % 3 === 0
                });
            }
        } else {
            if (Math.random() < 0.18) game.diamonds += 1;
            game.spawnExplosionParticles(enemy.x, enemy.y, '#38bdf8', 7);
            game.orbs.push({
                x: enemy.x,
                y: enemy.y,
                exp: Math.max(1, Math.round(enemy.expValue * expBonus)),
                radius: 6,
                isDiamond: false
            });
        }
    },

    // Cập nhật lực hút nam châm và thu thập ngọc
    update(dt, game) {
        const p = game.player;
        if (!p) return;

        for (let i = game.orbs.length - 1; i >= 0; i--) {
            const orb = game.orbs[i];
            const dx = p.x - orb.x;
            const dy = p.y - orb.y;
            const dist = Math.hypot(dx, dy);

            // Lực hút trong tầm Magnet
            if (dist < p.magnetRange) {
                const pullSpeed = 420 + (p.magnetRange - dist) * 2.5;
                orb.x += (dx / dist) * pullSpeed * dt;
                orb.y += (dy / dist) * pullSpeed * dt;
            }

            // Thu thập ngọc
            if (dist < p.radius + orb.radius + 6) {
                if (window.SFXController) window.SFXController.orbPickup();
                p.exp += orb.exp;
                if (orb.isDiamond) game.diamonds += 2;
                game.orbs.splice(i, 1);

                // Kiểm tra thăng cấp
                if (p.exp >= p.expToNext) {
                    if (window.LevelUpManager) {
                        window.LevelUpManager.triggerLevelUp(game);
                    }
                    break;
                }
            }
        }
    },

    // Vẽ toàn bộ ngọc lên canvas
    render(ctx, camX, camY, game) {
        for (let i = 0; i < game.orbs.length; i++) {
            const orb = game.orbs[i];
            const ox = orb.x - camX;
            const oy = orb.y - camY;

            ctx.fillStyle = orb.isDiamond ? "#22d3ee" : "#38bdf8";
            ctx.beginPath();
            ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
            ctx.fill();

            // Đốm sáng trên ngọc
            ctx.fillStyle = "#e0f2fe";
            ctx.beginPath();
            ctx.arc(ox - 1.5, oy - 1.5, orb.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

