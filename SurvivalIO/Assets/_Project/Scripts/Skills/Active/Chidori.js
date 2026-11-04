/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Chidori.js
   Nhẫn Thuật: Lôi Độn: Chidori (Thiên Điểu) & 6★ Lôi Độn: Kỳ Lân (Kirin)
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

window.JutsuCatalog.chidori = {
    id: 'chidori',
    type: 'active',
    name: 'Lôi Độn: Chidori (Thiên Điểu)',
    icon: '⚡',
    category: 'Nhẫn Thuật Lôi Độn',
    color: '#22d3ee',
    maxLevel: 5,
    pairId: 'thuanthan',
    pairName: 'Thuấn Thân',
    pairIcon: '🍃',
    evolution: {
        id: 'kirin',
        name: 'Lôi Độn: Kỳ Lân - Kirin',
        icon: '🌩️',
        category: 'Thức Tỉnh 6★ • Lôi Độn',
        desc: 'Cứ mỗi 2 giây triệu hồi một đạo lôi điện khổng lồ đánh thẳng vào khu vực đông quái nhất.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phóng tia sét Thiên Điểu giật chuỗi lan truyền qua 3 kẻ địch.";
        if (lv === 2) return "Tăng số mục tiêu giật sét lên 4 và +25% sát thương Lôi Độn.";
        if (lv === 3) return "Giảm thời gian hồi chiêu và tăng bán kính phóng tia sét.";
        if (lv === 4) return "Tia sét giật chuỗi 5 kẻ địch và tạo hiệu ứng tê liệt đẩy lùi.";
        if (lv === 5) return "Đạt cấp 5★! Sấm sét giật liên hoàn 7 mục tiêu uy lực cực lớn.";
        return "Đạt cấp tối đa!";
    }
};

window.ChidoriSkill = {
    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const chidoriLv = p.skills.chidori || 0;
        if (chidoriLv <= 0) return;

        p.cooldowns.chidori -= dt;
        if (p.cooldowns.chidori <= 0 && game.enemies.length > 0) {
            const firstTarget = game.findNearestEnemy(p.x, p.y, 500);
            if (firstTarget) {
                p.cooldowns.chidori = Math.max(0.65, (2.0 - chidoriLv * 0.15) * cdMult);
                if (window.SFXController) window.SFXController.chidori();

                const maxChains = 3 + chidoriLv;
                const hitSet = new Set();
                let currX = p.x;
                let currY = p.y;
                let nextEnemy = firstTarget;

                for (let c = 0; c < maxChains && nextEnemy; c++) {
                    hitSet.add(nextEnemy.id);
                    game.lightningArcs.push({
                        x1: currX, y1: currY,
                        x2: nextEnemy.x, y2: nextEnemy.y,
                        life: 0.24
                    });
                    const chainDmg = (28 + chidoriLv * 16) * (p.damageMultiplier || 1);
                    window.DamageSystem.damageEnemy(game, nextEnemy, chainDmg, 12, currX, currY, '#22d3ee');
                    game.spawnExplosionParticles(nextEnemy.x, nextEnemy.y, '#22d3ee', 5);

                    currX = nextEnemy.x;
                    currY = nextEnemy.y;
                    nextEnemy = null;
                    let bestD = 280 * 280;
                    for (let k = 0; k < game.enemies.length; k++) {
                        const candidate = game.enemies[k];
                        if (hitSet.has(candidate.id) || candidate.dead) continue;
                        const d2 = (candidate.x - currX) ** 2 + (candidate.y - currY) ** 2;
                        if (d2 < bestD) {
                            bestD = d2;
                            nextEnemy = candidate;
                        }
                    }
                }
            }
        }

        // Kỹ năng Thức Tỉnh 6★: Lôi Độn: Kỳ Lân - Kirin
        if (chidoriLv >= 6) {
            p.kirinTimer = (p.kirinTimer || 0) - dt;
            if (p.kirinTimer <= 0 && game.enemies.length > 0) {
                p.kirinTimer = Math.max(1.1, 2.0 * cdMult);

                let bestTarget = null;
                let maxNeighbors = -1;

                for (let k = 0; k < game.enemies.length; k++) {
                    const candidate = game.enemies[k];
                    if (candidate.dead) continue;
                    if (candidate.isBoss) {
                        bestTarget = candidate;
                        break;
                    }
                    let neighbors = 0;
                    for (let m = 0; m < game.enemies.length; m++) {
                        const other = game.enemies[m];
                        if (!other.dead && Math.hypot(other.x - candidate.x, other.y - candidate.y) < 180) {
                            neighbors++;
                        }
                    }
                    if (neighbors > maxNeighbors) {
                        maxNeighbors = neighbors;
                        bestTarget = candidate;
                    }
                }

                if (bestTarget) {
                    game.triggerKirinStrike(bestTarget.x, bestTarget.y);
                }
            }
        }
    }
};

