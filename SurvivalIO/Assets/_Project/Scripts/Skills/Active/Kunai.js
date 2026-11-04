/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Kunai.js
   Nhẫn Thuật: Phi Tiêu Kunai & 6★ Kunai Bão Nổ Liên Hoàn
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

window.JutsuCatalog.shuriken = {
    id: 'shuriken',
    type: 'active',
    name: 'Phi Tiêu Kunai',
    icon: '✴️',
    category: 'Vũ Khí Nhẫn Cụ',
    color: '#fbbf24',
    maxLevel: 5,
    pairId: 'uyluc',
    pairName: 'Uy Lực',
    pairIcon: '⚔️',
    evolution: {
        id: 'kunai_storm',
        name: 'Kunai Bão Nổ Liên Hoàn',
        icon: '💥',
        category: 'Thức Tỉnh 6★ • Nhẫn Cụ',
        desc: 'Ném liên tục 12 Kunai gắn bùa nổ xung quanh, phát nổ lan diện rộng x3 sát thương.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tự động ném phi tiêu Kunai sắc bén về phía kẻ địch gần nhất.";
        if (lv === 2) return "Tăng thêm +1 Kunai và tăng 25% tốc độ ném.";
        if (lv === 3) return "Gắn thêm Bùa Nổ diện rộng gây sát thương nổ lan.";
        if (lv === 4) return "Phóng chùm 4 Kunai nổ uy lực cao và xuyên phá kẻ địch.";
        if (lv === 5) return "Đạt cấp 5★! Phóng 5 Kunai nổ bạo kích liên hồi.";
        return "Đạt cấp tối đa!";
    }
};

window.KunaiSkill = {
    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const shurikenLv = p.skills.shuriken || 0;
        if (shurikenLv <= 0) return;

        p.cooldowns.shuriken -= dt;
        if (p.cooldowns.shuriken <= 0) {
            const target = game.findNearestEnemy(p.x, p.y, 750);
            if (target) {
                const isStorm = shurikenLv >= 6;
                if (isStorm) {
                    // 6★: Ném liên tục 12 Kunai gắn bùa nổ xung quanh 360 độ
                    p.cooldowns.shuriken = Math.max(0.32, 0.45 * cdMult);
                    if (window.SFXController) window.SFXController.shuriken();
                    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
                    const count = 12;

                    for (let i = 0; i < count; i++) {
                        const a = baseAngle + (i * Math.PI * 2 / count);
                        game.projectiles.push({
                            type: 'shuriken',
                            x: p.x,
                            y: p.y,
                            vx: Math.cos(a) * 520,
                            vy: Math.sin(a) * 520,
                            radius: 10,
                            damage: Math.round((18 + 5 * 9) * 3 * (p.damageMultiplier || 1)),
                            explosive: true,
                            isEvolved: true,
                            pierce: 3,
                            life: 1.8,
                            rotation: a
                        });
                    }
                    game.spawnExplosionParticles(p.x, p.y, '#f59e0b', 8);
                } else {
                    // Cấp thường 1-5
                    p.cooldowns.shuriken = Math.max(0.2, (0.85 - shurikenLv * 0.08) * cdMult);
                    const count = 1 + Math.floor(shurikenLv / 2);
                    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
                    const spread = 0.18;

                    if (window.SFXController) window.SFXController.shuriken();
                    for (let i = 0; i < count; i++) {
                        const a = baseAngle + (i - (count - 1) / 2) * spread;
                        game.projectiles.push({
                            type: 'shuriken',
                            x: p.x,
                            y: p.y,
                            vx: Math.cos(a) * 480,
                            vy: Math.sin(a) * 480,
                            radius: 9,
                            damage: (18 + shurikenLv * 9) * (p.damageMultiplier || 1),
                            explosive: shurikenLv >= 3,
                            isEvolved: false,
                            pierce: shurikenLv >= 4 ? 2 : 1,
                            life: 1.6,
                            rotation: a
                        });
                    }
                }
            }
        }
    }
};

