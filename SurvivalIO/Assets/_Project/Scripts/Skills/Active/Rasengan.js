/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Rasengan.js
   Nhẫn Thuật: Rasengan (Loa Toàn Hoàn) & 6★ Phong Độn: Rasenshuriken
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

window.JutsuCatalog.rasengan = {
    id: 'rasengan',
    type: 'active',
    name: 'Rasengan (Loa Toàn Hoàn)',
    icon: '🌀',
    category: 'Nhẫn Thuật Phong Độn',
    color: '#38bdf8',
    maxLevel: 5,
    pairId: 'hutchakra',
    pairName: 'Hút Chakra',
    pairIcon: '🧲',
    evolution: {
        id: 'rasenshuriken',
        name: 'Phong Độn: Rasenshuriken',
        icon: '💠',
        category: 'Thức Tỉnh 6★ • Phong Độn',
        desc: 'Phóng phi tiêu gió xoáy khổng lồ bay xuyên qua đàn quái, hút quái vào tâm và nổ cực đại.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tạo cầu Chakra xoay tròn quanh người, gây sát thương và đẩy lùi quái.";
        if (lv === 2) return "Tạo thêm +1 cầu Rasengan xoay quanh và mở rộng quỹ đạo.";
        if (lv === 3) return "Tăng 35% sát thương xoáy và tốc độ quay của cầu năng lượng.";
        if (lv === 4) return "Tạo thành 3 cầu Rasengan bao bọc vững chắc quanh bản thân.";
        if (lv === 5) return "Đạt cấp 5★! 4 cầu Loa Toàn Hoàn nghiền nát mọi kẻ địch áp sát.";
        return "Đạt cấp tối đa!";
    }
};

window.RasenganSkill = {
    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const rasenganLv = p.skills.rasengan || 0;
        if (rasenganLv <= 0) return;

        const isRasenshuriken = rasenganLv >= 6;
        const rotSpeed = isRasenshuriken ? 5.8 : (3.4 + rasenganLv * 0.35);
        p.rasenganAngle = (p.rasenganAngle || 0) + rotSpeed * dt;
        const orbCount = isRasenshuriken ? 4 : (1 + Math.floor(rasenganLv / 2));
        const orbitRadius = isRasenshuriken ? 95 : (68 + rasenganLv * 5);
        const orbRadius = isRasenshuriken ? 22 : (15 + rasenganLv * 1.5);
        const tickDmg = (isRasenshuriken ? 36 : (14 + rasenganLv * 8)) * (p.damageMultiplier || 1);

        for (let i = 0; i < orbCount; i++) {
            const ang = p.rasenganAngle + (Math.PI * 2 * i) / orbCount;
            const rx = p.x + Math.cos(ang) * orbitRadius;
            const ry = p.y + Math.sin(ang) * orbitRadius;

            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                const dist = Math.hypot(e.x - rx, e.y - ry);
                if (dist < e.radius + orbRadius) {
                    e.rasenganCooldown = (e.rasenganCooldown || 0) - dt;
                    if (e.rasenganCooldown <= 0) {
                        e.rasenganCooldown = 0.20;
                        window.DamageSystem.damageEnemy(game, e, tickDmg, isRasenshuriken ? 38 : 26, rx, ry, '#38bdf8');
                        game.spawnExplosionParticles(rx, ry, isRasenshuriken ? '#67e8f9' : '#38bdf8', 4);
                    }
                }
            }
        }

        // Kỹ năng Thức Tỉnh 6★: Phóng phi tiêu gió lốc xoáy Rasenshuriken
        if (isRasenshuriken) {
            p.cooldowns.rasenshuriken = (p.cooldowns.rasenshuriken || 0) - dt;
            if (p.cooldowns.rasenshuriken <= 0) {
                const target = game.findNearestEnemy(p.x, p.y, 800);
                if (target) {
                    p.cooldowns.rasenshuriken = Math.max(1.1, 2.1 * cdMult);
                    const ang = Math.atan2(target.y - p.y, target.x - p.x);
                    if (window.SFXController) window.SFXController.rasengan();

                    game.projectiles.push({
                        type: 'rasenshuriken',
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(ang) * 360,
                        vy: Math.sin(ang) * 360,
                        radius: 36,
                        damage: 48 * (p.damageMultiplier || 1),
                        life: 2.3,
                        pierce: 999,
                        rotation: 0,
                        tickTimer: 0
                    });
                    game.spawnExplosionParticles(p.x, p.y, '#38bdf8', 16);
                }
            }
        }
    }
};

