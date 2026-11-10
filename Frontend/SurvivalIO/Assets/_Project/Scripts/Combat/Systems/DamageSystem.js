/* ============================================================================
   MODULE: src/Combat/DamageSystem.js
   Công thức tính Sát Thương, Bạo Kích x1.5, Giảm Thiệt Hại & Đòn Đẩy Lùi (Knockback)
   Chuẩn kiến trúc SurvivorIO Combat Damage System
   ============================================================================ */

window.DamageSystem = {
    // Gây sát thương lên quái vật
    damageEnemy(game, enemy, rawDamage, knockback = 0, sourceX = null, sourceY = null, color = '#fde047') {
        if (!enemy || enemy.dead) return;

        const p = game.player;
        const isCrit = Math.random() < (p ? (p.critChance || 0) : 0);
        const critMult = isCrit ? 1.5 : 1.0;
        const dmgMult = p ? (p.damageMultiplier || 1) : 1;
        const dmg = Math.max(1, Math.round(rawDamage * dmgMult * critMult));

        enemy.hp -= dmg;
        enemy.hitFlash = 0.08; // Nháy sáng trắng 0.08s chuẩn yêu cầu

        if (isCrit) {
            if (window.SFXController) window.SFXController.crit();
            game.addFloatingText(enemy.x, enemy.y - enemy.radius - 6, `💥 BẠO KÍCH! -${dmg}`, '#f97316', enemy.isBoss ? 20 : 15);
        } else {
            game.addFloatingText(enemy.x, enemy.y - enemy.radius, `-${dmg}`, color, enemy.isBoss ? 17 : 13);
        }

        // Đẩy lùi kẻ địch (Knockback) - không áp dụng cho Boss
        if (knockback > 0 && !enemy.isBoss) {
            const sx = sourceX !== null ? sourceX : (p ? p.x : 0);
            const sy = sourceY !== null ? sourceY : (p ? p.y : 0);
            const dx = enemy.x - sx;
            const dy = enemy.y - sy;
            const dist = Math.hypot(dx, dy) || 1;
            enemy.x += (dx / dist) * knockback;
            enemy.y += (dy / dist) * knockback;
        }

        // Kiểm tra quái chết
        if (enemy.hp <= 0 && !enemy.dead) {
            window.EnemyHealth.onDeath(enemy, game);
        }
    },

    // Gây sát thương lên người chơi Shinobi
    damagePlayer(game, rawDamage) {
        const p = game.player;
        if (!p || p.hp <= 0) return;

        let reduction = (p.damageReduction || 0);
        // Buff Susanoo: Giảm 50% sát thương nhận vào từ quái
        if (p.isSusanoo) {
            reduction = 1 - (1 - reduction) * 0.5;
        }
        const dmgTaken = Math.max(1, Math.round(rawDamage * (1 - reduction)));
        p.hp -= dmgTaken;
        window.Camera.shake(0.2, 8);
        game.addFloatingText(p.x, p.y - 20, `-${dmgTaken}`, '#ef4444', 16);
        game.spawnExplosionParticles(p.x, p.y, '#ef4444', 10);

        if (p.hp <= 0) {
            game.triggerGameOver();
        }
    }
};

