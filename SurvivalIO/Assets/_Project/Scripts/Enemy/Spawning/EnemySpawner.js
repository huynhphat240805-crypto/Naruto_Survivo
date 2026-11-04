/* ============================================================================
   MODULE: src/Enemy/EnemySpawner.js
   Hệ thống Sinh Quái Vật Theo Đợt (Wave Spawner) & Cấu hình Chỉ số Kẻ Địch
   Phút 0-2: Đạo Tặc, Phút 2-5: Zetsu Trắng, Phút 5: Boss Manda, Phút 10: Akatsuki
   ============================================================================ */

window.EnemyConfigs = {
    bandit: {
        type: 'bandit',
        name: 'Đạo Tặc',
        radius: 14,
        baseHp: 24,
        baseSpeed: 78,
        damage: 10,
        expValue: 5,
        isBoss: false
    },
    rain_ninja: {
        type: 'rain_ninja',
        name: 'Ninja Làng Mưa',
        radius: 15,
        baseHp: 38,
        baseSpeed: 92,
        damage: 14,
        expValue: 8,
        isBoss: false
    },
    zetsu: {
        type: 'zetsu',
        name: 'Zetsu Trắng',
        radius: 13,
        baseHp: 30,
        baseSpeed: 122,
        damage: 12,
        expValue: 7,
        isBoss: false
    }
};

window.EnemySpawner = {
    // Sinh quái từ 4 cạnh ngoài viền màn hình
    spawnEnemy(game, forcedType = null) {
        const p = game.player;
        if (!p) return;

        const canvas = game.canvas || { width: window.innerWidth, height: window.innerHeight };
        const margin = 80;
        const halfW = canvas.width / 2 + margin;
        const halfH = canvas.height / 2 + margin;
        const side = Math.floor(Math.random() * 4);
        let sx = p.x;
        let sy = p.y;

        if (side === 0) { sx += (Math.random() * 2 - 1) * halfW; sy -= halfH; }
        else if (side === 1) { sx += halfW; sy += (Math.random() * 2 - 1) * halfH; }
        else if (side === 2) { sx += (Math.random() * 2 - 1) * halfW; sy += halfH; }
        else { sx -= halfW; sy += (Math.random() * 2 - 1) * halfH; }

        const mins = game.elapsedTime / 60;
        let type = forcedType;

        if (!type) {
            if (mins < 2) {
                type = Math.random() < 0.6 ? 'bandit' : 'rain_ninja';
            } else if (mins < 5) {
                type = Math.random() < 0.78 ? 'zetsu' : 'rain_ninja';
            } else {
                const r = Math.random();
                type = r < 0.55 ? 'zetsu' : (r < 0.8 ? 'rain_ninja' : 'bandit');
            }
        }

        // Tăng máu quái theo thời gian sinh tồn
        const scale = 1 + mins * 0.22;

        if (type === 'boss_manda') {
            window.BossManda.spawn(game, sx, sy);
            return;
        }

        if (type === 'boss_akatsuki') {
            window.BossAkatsuki.spawn(game, sx, sy);
            return;
        }

        const cfg = window.EnemyConfigs[type] || window.EnemyConfigs.bandit;
        game.enemies.push({
            id: game.enemyIdCounter++,
            type: cfg.type,
            name: cfg.name,
            x: sx,
            y: sy,
            radius: cfg.radius,
            hp: Math.round(cfg.baseHp * scale),
            maxHp: Math.round(cfg.baseHp * scale),
            speed: cfg.baseSpeed + Math.random() * 20,
            damage: cfg.damage,
            expValue: cfg.expValue,
            isBoss: false,
            hitFlash: 0,
            angle: 0
        });
    },

    // Cập nhật nhịp sinh quái
    update(dt, game) {
        const mins = game.elapsedTime / 60;

        // Mốc 5 phút: Triệu hồi Boss Rắn Khổng Lồ Manda
        if (mins >= 5 && !game.bossSpawned5m) {
            game.bossSpawned5m = true;
            this.spawnEnemy(game, 'boss_manda');
            if (window.MusicController) window.MusicController.setBossPhase(true);
        }

        // Mốc 10 phút: Triệu hồi Boss Thủ Lĩnh Akatsuki
        if (mins >= 10 && !game.bossSpawned10m) {
            game.bossSpawned10m = true;
            this.spawnEnemy(game, 'boss_akatsuki');
            if (window.MusicController) window.MusicController.setBossPhase(true);
        }

        game.spawnTimer -= dt;
        if (game.spawnTimer <= 0) {
            // Phút 2-5: Bầy Zetsu Trắng cực đông
            const maxEnemies = mins >= 2 && mins < 5 ? 95 : 75;
            const interval = mins < 2 ? 0.65 : (mins < 5 ? 0.25 : 0.32);
            game.spawnTimer = interval;

            if (game.enemies.length < maxEnemies) {
                const batch = (mins >= 2 && mins < 5) ? 3 : 2;
                for (let i = 0; i < batch; i++) this.spawnEnemy(game);
            }
        }
    }
};

