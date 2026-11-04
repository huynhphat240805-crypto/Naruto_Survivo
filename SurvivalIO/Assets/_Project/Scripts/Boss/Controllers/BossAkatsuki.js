/* ============================================================================
   MODULE: src/Boss/BossAkatsuki.js
   Hành Vi & Kỹ Năng Boss Thủ Lĩnh Akatsuki (Itachi & Kisame) Xuất Hiện Phút Thứ 10
   ============================================================================ */

window.BossAkatsuki = {
    config: {
        type: 'boss_akatsuki',
        name: 'THỦ LĨNH AKATSUKI (ITACHI & KISAME)',
        radius: 32,
        hp: 5200,
        speed: 132,
        damage: 36,
        expValue: 350,
        isBoss: true,
        skillTimer: 2.4
    },

    spawn(game, sx, sy) {
        if (window.SFXController) window.SFXController.bossSpawn();
        window.Camera.shake(0.6, 16);

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

        game.addFloatingText(game.player.x, game.player.y - 50, "☁️ BOSS AKATSUKI GIÁNG LÂM!", "#f43f5e", 20);
    },

    update(dt, enemy, game) {
        enemy.skillTimer -= dt;
        if (enemy.skillTimer <= 0) {
            // Akatsuki phóng Hắc Hỏa Amaterasu 8 hướng 360 độ
            enemy.skillTimer = 2.6;
            const shots = 8;
            for (let k = 0; k < shots; k++) {
                const a = enemy.angle + (Math.PI * 2 * k) / shots;
                game.projectiles.push({
                    type: 'enemy_proj',
                    color: '#ef4444',
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(a) * 280,
                    vy: Math.sin(a) * 280,
                    radius: 11,
                    damage: 20,
                    life: 3.2
                });
            }
        }
    }
};

