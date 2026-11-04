/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Clone.js
   Nhẫn Thuật: Kage Bunshin (Phân Thân Chi Thuật) & 6★ Đa Trọng Phân Thân Chi Thuật
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

window.JutsuCatalog.clones = {
    id: 'clones',
    type: 'active',
    name: 'Kage Bunshin (Phân Thân Chi Thuật)',
    icon: '👥',
    category: 'Cấm Thuật Bí Truyền',
    color: '#34d399',
    maxLevel: 5,
    pairId: 'theluc',
    pairName: 'Thể Lực',
    pairIcon: '💚',
    evolution: {
        id: 'datrongphanthuc',
        name: 'Đa Trọng Phân Thân Chi Thuật',
        icon: '🥷',
        category: 'Thức Tỉnh 6★ • Cấm Thuật',
        desc: 'Tạo ra 6 phân thân chạy xung quanh tự động ném phi tiêu và đánh quái.'
    },
    getDesc(lv) {
        if (lv === 1) return "Triệu hồi 1 Ảnh Phân Thân chạy hộ vệ quanh Naruto và tự ném phi tiêu.";
        if (lv === 2) return "Triệu hồi thêm +1 Ảnh Phân Thân (tổng cộng 2 phân thân).";
        if (lv === 3) return "Tăng tốc độ ném phi tiêu và tầm bắn của toàn bộ phân thân.";
        if (lv === 4) return "Triệu hồi thêm +1 Ảnh Phân Thân (tổng cộng 3 phân thân).";
        if (lv === 5) return "Đạt cấp 5★! Triệu hồi 4 Ảnh Phân Thân ném Kunai Nổ sát thương cao.";
        return "Đạt cấp tối đa!";
    }
};

window.CloneSkill = {
    sync(game) {
        const p = game.player;
        if (!p) return;
        const lv = p.skills.clones || 0;
        const isEvolved = lv >= 6;
        const desiredCount = lv === 0 ? 0 : (isEvolved ? 6 : Math.min(4, lv));

        while (game.clones.length < desiredCount) {
            const idx = game.clones.length;
            game.clones.push({
                angleOffset: (Math.PI * 2 * idx) / Math.max(1, desiredCount),
                x: p.x,
                y: p.y,
                shootTimer: 0.3 * idx,
                taiCooldown: 0
            });
            game.spawnExplosionParticles(p.x, p.y, isEvolved ? '#f59e0b' : '#e2e8f0', 14);
        }
        while (game.clones.length > desiredCount) {
            game.clones.pop();
        }
        for (let i = 0; i < game.clones.length; i++) {
            game.clones[i].angleOffset = (Math.PI * 2 * i) / game.clones.length;
        }
    },

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const clonesLv = p.skills.clones || 0;
        if (clonesLv <= 0) return;

        const isMultiClones = clonesLv >= 6;
        const orbitDist = isMultiClones ? 64 : 52;
        const rotSpeed = isMultiClones ? 2.2 : 1.4;

        for (let i = 0; i < game.clones.length; i++) {
            const cl = game.clones[i];
            cl.angleOffset += rotSpeed * dt;
            const targetX = p.x + Math.cos(cl.angleOffset) * orbitDist;
            const targetY = p.y + Math.sin(cl.angleOffset) * orbitDist;
            cl.x += (targetX - cl.x) * 11 * dt;
            cl.y += (targetY - cl.y) * 11 * dt;

            // Tự động ném phi tiêu hỗ trợ
            cl.shootTimer -= dt;
            if (cl.shootTimer <= 0) {
                const enemy = game.findNearestEnemy(cl.x, cl.y, 600);
                if (enemy) {
                    cl.shootTimer = isMultiClones ? Math.max(0.28, 0.38 * cdMult) : Math.max(0.42, (1.1 - clonesLv * 0.1) * cdMult);
                    const ang = Math.atan2(enemy.y - cl.y, enemy.x - cl.x);
                    game.projectiles.push({
                        type: 'shuriken',
                        x: cl.x,
                        y: cl.y,
                        vx: Math.cos(ang) * 460,
                        vy: Math.sin(ang) * 460,
                        radius: isMultiClones ? 9 : 7,
                        damage: (isMultiClones ? 38 : (14 + clonesLv * 7)) * (p.damageMultiplier || 1),
                        explosive: isMultiClones || clonesLv >= 5,
                        isEvolved: isMultiClones,
                        pierce: isMultiClones ? 2 : 1,
                        life: 1.4,
                        rotation: ang
                    });
                }
            }

            // Chiêu 6★: Phân thân đánh giáp lá cà (Taijutsu) khi quái áp sát
            if (isMultiClones) {
                cl.taiCooldown = (cl.taiCooldown || 0) - dt;
                if (cl.taiCooldown <= 0) {
                    for (let j = 0; j < game.enemies.length; j++) {
                        const e = game.enemies[j];
                        if (e.dead) continue;
                        if (Math.hypot(e.x - cl.x, e.y - cl.y) < 48) {
                            cl.taiCooldown = 0.25;
                            window.DamageSystem.damageEnemy(game, e, 55 * (p.damageMultiplier || 1), 32, cl.x, cl.y, '#f59e0b');
                            game.spawnExplosionParticles(e.x, e.y, '#fde047', 6);
                            break;
                        }
                    }
                }
            }
        }
    }
};

