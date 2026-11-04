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
            e.angle = Math.atan2(dy, dx);

            // 1. Quái tự động tìm đường bám sát người chơi
            e.x += (dx / dist) * e.speed * dt;
            e.y += (dy / dist) * e.speed * dt;

            // 2. Kỹ năng đặc biệt của Boss nếu là Boss
            if (e.isBoss) {
                if (e.type === 'boss_manda' && window.BossManda) {
                    window.BossManda.update(dt, e, game);
                } else if (e.type === 'boss_akatsuki' && window.BossAkatsuki) {
                    window.BossAkatsuki.update(dt, e, game);
                }
            }

            // 3. Tấn công cận chiến khi áp sát người chơi
            if (dist < e.radius + p.radius - 2) {
                e.attackCooldown = (e.attackCooldown || 0) - dt;
                if (e.attackCooldown <= 0) {
                    e.attackCooldown = 0.55;
                    window.DamageSystem.damagePlayer(game, e.damage);
                }
            }
        }
    }
};

