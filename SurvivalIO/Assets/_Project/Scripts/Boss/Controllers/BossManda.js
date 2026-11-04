/* ============================================================================
   MODULE: src/Boss/BossManda.js
   Hành Vi & Kỹ Năng Boss Rắn Khổng Lồ Manda (Orochimaru) Xuất Hiện Phút Thứ 5
   ============================================================================ */

window.BossManda = {
    config: {
        type: 'boss_manda',
        name: 'RẮN KHỔNG LỒ MANDA (OROCHIMARU)',
        radius: 36,
        hp: 2600,
        speed: 118,
        damage: 28,
        expValue: 180,
        isBoss: true,
        skillTimer: 3.0
    },

    spawn(game, sx, sy) {
        if (window.SFXController) window.SFXController.bossSpawn();
        window.Camera.shake(0.45, 12);

        game.enemies.push({
            id: game.enemyIdCounter++,
            type: this.config.type,
            name: this.config.name,
            x: sx,
            y: sy,
            radius: this.config.radius,
            hp: this.config.hp,
            maxHp: this.config.hp,
            speed: this.config.speed,
            damage: this.config.damage,
            expValue: this.config.expValue,
            isBoss: true,
            skillTimer: this.config.skillTimer,
            hitFlash: 0,
            angle: 0
        });

        game.addFloatingText(game.player.x, game.player.y - 50, "⚠️ BOSS MANDA XUẤT HIỆN!", "#c084fc", 20);
    },

    update(dt, enemy, game) {
        enemy.skillTimer -= dt;
        if (enemy.skillTimer <= 0) {
            // Manda phun 5 cầu độc Xà Chú hình quạt
            enemy.skillTimer = 3.2;
            for (let k = -2; k <= 2; k++) {
                const a = enemy.angle + k * 0.22;
                game.projectiles.push({
                    type: 'enemy_proj',
                    color: '#a855f7',
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(a) * 250,
                    vy: Math.sin(a) * 250,
                    radius: 10,
                    damage: 16,
                    life: 3.0
                });
            }
        }
    }
};

