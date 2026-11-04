/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Fireball.js
   Nhẫn Thuật: Hỏa Độn: Hào Hỏa Cầu & 6★ Hỏa Độn: Hào Hỏa Diệt Khước
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

window.JutsuCatalog.fireball = {
    id: 'fireball',
    type: 'active',
    name: 'Hỏa Độn: Hào Hỏa Cầu',
    icon: '🔥',
    category: 'Nhẫn Thuật Hỏa Độn',
    color: '#f97316',
    maxLevel: 5,
    pairId: 'ketan',
    pairName: 'Kết Ấn',
    pairIcon: '📜',
    evolution: {
        id: 'haohoadictkhuoc',
        name: 'Hỏa Độn: Hào Hỏa Diệt Khước',
        icon: '🌋',
        category: 'Thức Tỉnh 6★ • Hỏa Độn',
        desc: 'Bắn một bức tường sóng lửa hình vòng cung quét sạch góc trước mặt.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phóng quả cầu lửa khổng lồ phát nổ diện rộng (AoE) thiêu đốt quái vật.";
        if (lv === 2) return "Tăng 30% sát thương nổ và mở rộng phạm vi thiêu đốt.";
        if (lv === 3) return "Bắn 2 Hào Hỏa Cầu cùng lúc quét sạch đám đông.";
        if (lv === 4) return "Tăng tốc độ bay và sát thương bộc phá Hỏa Độn diện rộng.";
        if (lv === 5) return "Đạt cấp 5★! Phóng 3 Đại Hỏa Cầu đồng loạt thiêu rụi chiến trường.";
        return "Đạt cấp tối đa!";
    }
};

window.FireballSkill = {
    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const fireballLv = p.skills.fireball || 0;
        if (fireballLv <= 0) return;

        p.cooldowns.fireball -= dt;
        if (p.cooldowns.fireball <= 0) {
            const target = game.findNearestEnemy(p.x, p.y, 800);
            if (target) {
                const isGoukaMekkyaku = fireballLv >= 6;
                if (isGoukaMekkyaku) {
                    // 6★: Bắn một bức tường sóng lửa hình vòng cung quét sạch góc trước mặt
                    p.cooldowns.fireball = Math.max(1.1, 2.1 * cdMult);
                    if (window.SFXController) window.SFXController.fireball();
                    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
                    const waveCount = 9;
                    const arcSpan = 2.1;

                    for (let i = 0; i < waveCount; i++) {
                        const a = baseAngle - (arcSpan / 2) + (i * arcSpan / (waveCount - 1));
                        game.projectiles.push({
                            type: 'flame_wall',
                            x: p.x + Math.cos(a) * 24,
                            y: p.y + Math.sin(a) * 24,
                            vx: Math.cos(a) * 380,
                            vy: Math.sin(a) * 380,
                            radius: 25,
                            aoeRadius: 100,
                            damage: Math.round(230 * (p.damageMultiplier || 1)),
                            pierce: 999,
                            life: 1.5,
                            rotation: a
                        });
                    }
                    if (window.Camera) window.Camera.shake(0.25, 8);
                    game.spawnExplosionParticles(p.x, p.y, '#f97316', 22);
                } else {
                    // Cấp thường 1-5
                    p.cooldowns.fireball = Math.max(0.9, (2.8 - fireballLv * 0.2) * cdMult);
                    const ballCount = fireballLv >= 5 ? 3 : (fireballLv >= 3 ? 2 : 1);
                    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);

                    if (window.SFXController) window.SFXController.fireball();
                    for (let i = 0; i < ballCount; i++) {
                        const a = baseAngle + (i - (ballCount - 1) / 2) * 0.28;
                        game.projectiles.push({
                            type: 'fireball',
                            x: p.x,
                            y: p.y,
                            vx: Math.cos(a) * 320,
                            vy: Math.sin(a) * 320,
                            radius: 18 + fireballLv * 2,
                            aoeRadius: 85 + fireballLv * 12,
                            damage: (42 + fireballLv * 22) * (p.damageMultiplier || 1),
                            life: 2.2
                        });
                    }
                }
            }
        }
    }
};

