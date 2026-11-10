/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Fireball.js
   HỆ HỎA (FIRE NINJUTSU) - 4 KỸ NĂNG & TIẾN HÓA 6★ (PIXELFX CANVAS RENDERER)
   1. Hào Hỏa Cầu (Fireball) -> 🌟 Hào Hỏa Diệt Khước
   2. Hỏa Long Viêm Đạn (Flamethrower) -> 🌟 Hỏa Long Thần Hỏa
   3. Thiên Thạch Rơi (Meteor Call) -> 🌟 Địa Bộc Thiên Tinh
   4. Hỏa Phong Long Quyển (Fire Tornado) -> 🌟 Hỏa Long Cuồng Phong
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 1. Hào Hỏa Cầu (Fireball)
window.JutsuCatalog.fireball = {
    id: 'fireball',
    type: 'active',
    name: 'Hỏa Độn: Hào Hỏa Cầu',
    icon: '🔥',
    category: 'Nhẫn Thuật Hệ Hỏa',
    color: '#f97316',
    maxLevel: 5,
    pairId: 'area',
    pairName: 'Phạm Vi Chiêu',
    pairIcon: '🌐',
    evolution: {
        id: 'haohoadictkhuoc',
        name: 'Hỏa Độn: Hào Hỏa Diệt Khước',
        icon: '🌋',
        category: 'Thức Tỉnh 6★ • Hệ Hỏa',
        desc: 'Biển lửa cuộn sóng quét sạch bản đồ, diện tích nổ x3, thiêu đốt thiêu rụi toàn bộ kẻ địch.'
    },
    getDesc(lv) {
        if (lv === 1) return "Bắn cầu lửa phát nổ diện rộng, thiêu đốt kẻ địch trong 3s.";
        if (lv === 2) return "Tăng +35% Bán kính nổ và +25% sát thương thiêu đốt.";
        if (lv === 3) return "Bắn đồng thời 2 cầu lửa tỏa hình chữ V về phía trước.";
        if (lv === 4) return "Bắn 3 cầu lửa, giảm -20% thời gian hồi chiêu.";
        if (lv === 5) return "Đạt cấp 5★! Cầu lửa cực đại gây nổ chấn động dữ dội.";
        return "Đạt cấp tối đa!";
    }
};

// 2. Hỏa Long Viêm Đạn (Flamethrower)
window.JutsuCatalog.flamethrower = {
    id: 'flamethrower',
    type: 'active',
    name: 'Hỏa Độn: Hỏa Long Viêm Đạn',
    icon: '🐲',
    category: 'Nhẫn Thuật Hệ Hỏa',
    color: '#ea580c',
    maxLevel: 5,
    pairId: 'duration',
    pairName: 'Thời Gian',
    pairIcon: '⏳',
    evolution: {
        id: 'hoalong_thanhoa',
        name: 'Hỏa Long Thần Hỏa',
        icon: '🔱',
        category: 'Thức Tỉnh 6★ • Hệ Hỏa',
        desc: 'Rồng lửa xoay 360° bao bọc thân chủ, liên tục thiêu rụi mọi kẻ địch áp sát.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phun luồng lửa rồng liên tục trước mặt thiêu rụi quái vật áp sát.";
        if (lv === 2) return "Mở rộng góc phun lửa và tăng tầm xa ngọn lửa +30%.";
        if (lv === 3) return "Tăng sát thương thiêu đốt mỗi giây thêm +40%.";
        if (lv === 4) return "Luồng lửa để lại vệt lửa trên đất gây sát thương kéo dài.";
        if (lv === 5) return "Đạt cấp 5★! Luồng hỏa diễm cuộn trào thiêu rụi mọi lớp phòng ngự.";
        return "Đạt cấp tối đa!";
    }
};

// 3. Thiên Thạch Rơi (Meteor Call)
window.JutsuCatalog.meteor = {
    id: 'meteor',
    type: 'active',
    name: 'Hỏa Độn: Thiên Thạch Rơi',
    icon: '☄️',
    category: 'Nhẫn Thuật Hệ Hỏa',
    color: '#ef4444',
    maxLevel: 5,
    pairId: 'dame',
    pairName: 'Uy Lực',
    pairIcon: '⚔️',
    evolution: {
        id: 'diabocthientinh',
        name: 'Địa Bộc Thiên Tinh',
        icon: '🌑',
        category: 'Thức Tỉnh 6★ • Bí Thuật Hỏa Thạch',
        desc: 'Mưa thiên thạch rung chuyển toàn màn hình, hút gom quái và nổ hủy diệt toàn diện.'
    },
    getDesc(lv) {
        if (lv === 1) return "Triệu hồi thiên thạch rực lửa từ trên trời giáng xuống quái đông nhất.";
        if (lv === 2) return "Tăng bán kính nổ thiên thạch và tạo sóng chấn động rung màn hình.";
        if (lv === 3) return "Triệu hồi 2 quả thiên thạch liên tiếp giáng xuống.";
        if (lv === 4) return "Tăng +40% Sát thương va chạm và vùng dung nham bốc cháy.";
        if (lv === 5) return "Đạt cấp 5★! 3 thiên thạch hủy diệt càn quét chiến trường.";
        return "Đạt cấp tối đa!";
    }
};

// 4. Hỏa Phong Long Quyển (Fire Tornado)
window.JutsuCatalog.fire_tornado = {
    id: 'fire_tornado',
    type: 'active',
    name: 'Hỏa Phong Long Quyển',
    icon: '🌪️',
    category: 'Nhẫn Thuật Hệ Hỏa',
    color: '#f59e0b',
    maxLevel: 5,
    pairId: 'speed',
    pairName: 'Thuấn Thân',
    pairIcon: '🍃',
    evolution: {
        id: 'hoalong_cuongphong',
        name: 'Hỏa Long Cuồng Phong',
        icon: '🔥',
        category: 'Thức Tỉnh 6★ • Hỏa Phong',
        desc: '3 lốc lửa khổng lồ tự động săn quái trên toàn bản đồ, cuốn thiêu sạch bầy quái.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tạo lốc xoáy lửa di động tự hút và thiêu đốt quái trên đường đi.";
        if (lv === 2) return "Tăng kích thước lốc xoáy và tốc độ di chuyển của lốc.";
        if (lv === 3) return "Tăng thời gian duy trì của lốc xoáy lên 6 giây.";
        if (lv === 4) return "Tạo 2 lốc xoáy lửa di chuyển ngược chiều nhau.";
        if (lv === 5) return "Đạt cấp 5★! Lốc xoáy lửa bùng cháy dữ dội với lực hút cực mạnh.";
        return "Đạt cấp tối đa!";
    }
};

// ============================================================================
// HỆ THỐNG CẬP NHẬT & HIỆU ỨNG VẼ CANVAS HỆ HỎA (PIXELFX STYLE)
// ============================================================================
window.FireJutsu = {
    fireballs: [],
    flamePuffs: [],
    meteors: [],
    tornadoes: [],

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const areaMult = p.areaMultiplier || 1;
        const dameMult = p.damageMultiplier || 1;
        p.cooldowns = p.cooldowns || {};

        // 1. Cập nhật Hào Hỏa Cầu
        const fbLv = p.skills.fireball || 0;
        if (fbLv > 0) {
            p.cooldowns.fireball = (p.cooldowns.fireball || 0) - dt;
            if (p.cooldowns.fireball <= 0) {
                const isEvo = fbLv >= 6 || p.evolvedSkills?.fireball;
                p.cooldowns.fireball = (isEvo ? 1.4 : Math.max(0.7, 2.2 - fbLv * 0.25)) * cdMult;

                const count = isEvo ? 3 : (fbLv >= 4 ? 3 : (fbLv >= 3 ? 2 : 1));
                const target = game.findNearestEnemy ? game.findNearestEnemy(p.x, p.y, 650) : null;
                const baseAngle = target ? Math.atan2(target.y - p.y, target.x - p.x) : (p.facing === -1 ? Math.PI : 0);

                for (let i = 0; i < count; i++) {
                    const spread = count > 1 ? (i - (count - 1) / 2) * (isEvo ? 0.35 : 0.25) : 0;
                    const ang = baseAngle + spread;
                    this.fireballs.push({
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(ang) * (isEvo ? 360 : 300),
                        vy: Math.sin(ang) * (isEvo ? 360 : 300),
                        radius: (isEvo ? 26 : 14 + fbLv * 2) * areaMult,
                        damage: Math.round((isEvo ? 140 : 26 + fbLv * 12) * dameMult),
                        isEvo: isEvo,
                        life: 1.8,
                        sparks: []
                    });
                }
                if (window.SFXController) window.SFXController.fireball();
            }
        }

        // Cập nhật đạn Hào Hỏa Cầu
        for (let i = this.fireballs.length - 1; i >= 0; i--) {
            const fb = this.fireballs[i];
            fb.x += fb.vx * dt;
            fb.y += fb.vy * dt;
            fb.life -= dt;

            // Hạt lửa đuôi PixelFX
            if (Math.random() < 0.6) {
                fb.sparks.push({
                    x: fb.x - fb.vx * 0.04 + (Math.random() - 0.5) * 8,
                    y: fb.y - fb.vy * 0.04 + (Math.random() - 0.5) * 8,
                    r: Math.random() * (fb.isEvo ? 8 : 5) + 2,
                    color: Math.random() < 0.5 ? '#ffc23d' : '#f2561d',
                    life: 0.3,
                    maxLife: 0.3
                });
            }

            for (let s = fb.sparks.length - 1; s >= 0; s--) {
                fb.sparks[s].life -= dt;
                if (fb.sparks[s].life <= 0) fb.sparks.splice(s, 1);
            }

            // Va chạm quái vật -> Nổ AoE
            let hit = false;
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - fb.x, e.y - fb.y) < fb.radius + e.radius) {
                    hit = true;
                    break;
                }
            }

            if (hit || fb.life <= 0) {
                // Kích hoạt nổ AoE & Thiêu đốt
                const blastRadius = fb.radius * (fb.isEvo ? 3.2 : 2.0);
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - fb.x, e.y - fb.y);
                    if (d <= blastRadius + e.radius) {
                        window.DamageSystem.damageEnemy(game, e, fb.damage, false, fb.isEvo ? 14 : 8);
                        // Hiệu ứng thiêu đốt 3s
                        e.burnTimer = 3.0;
                        e.burnDmg = Math.round(fb.damage * 0.22);
                    }
                }
                // Hiệu ứng nổ hạt lửa
                if (game.spawnExplosionParticles) {
                    game.spawnExplosionParticles(fb.x, fb.y, fb.isEvo ? '#f59e0b' : '#ef4444', fb.isEvo ? 36 : 18);
                    game.spawnExplosionParticles(fb.x, fb.y, '#ffffff', fb.isEvo ? 16 : 8);
                }
                if (fb.isEvo && window.Camera) window.Camera.shake(0.3, 10);
                this.fireballs.splice(i, 1);
            }
        }

        // 2. Cập nhật Hỏa Long Viêm Đạn (Flamethrower)
        const ftLv = p.skills.flamethrower || 0;
        if (ftLv > 0) {
            p.cooldowns.flamethrower = (p.cooldowns.flamethrower || 0) - dt;
            const isEvo = ftLv >= 6 || p.evolvedSkills?.flamethrower;

            // Phun lửa theo nhịp liên tục
            if (p.cooldowns.flamethrower <= 0) {
                p.cooldowns.flamethrower = 0.08; // 12-14 tia lửa mỗi giây
                const baseAng = isEvo ? (game.elapsedTime * 6.0) : (p.facing === -1 ? Math.PI : 0);
                const spread = isEvo ? 0 : (Math.random() - 0.5) * 0.45;
                const ang = baseAng + spread;
                const spd = (isEvo ? 320 : 260) + Math.random() * 40;

                this.flamePuffs.push({
                    x: p.x + Math.cos(ang) * 16,
                    y: p.y + Math.sin(ang) * 16,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd,
                    r: (isEvo ? 12 : 7 + ftLv) * areaMult,
                    maxR: (isEvo ? 34 : 20 + ftLv * 2) * areaMult,
                    damage: Math.round((isEvo ? 24 : 8 + ftLv * 3) * dameMult),
                    life: isEvo ? 0.75 : 0.5,
                    maxLife: isEvo ? 0.75 : 0.5,
                    isEvo: isEvo
                });
            }
        }

        // Cập nhật luồng lửa
        for (let i = this.flamePuffs.length - 1; i >= 0; i--) {
            const fp = this.flamePuffs[i];
            fp.x += fp.vx * dt;
            fp.y += fp.vy * dt;
            fp.life -= dt;
            const prog = 1 - fp.life / fp.maxLife;
            const curR = fp.r + (fp.maxR - fp.r) * prog;

            // Gây sát thương quét
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - fp.x, e.y - fp.y) < curR + e.radius) {
                    window.DamageSystem.damageEnemy(game, e, fp.damage, false, 3);
                    e.burnTimer = 2.0;
                    e.burnDmg = Math.round(fp.damage * 0.35);
                }
            }

            if (fp.life <= 0) this.flamePuffs.splice(i, 1);
        }

        // 3. Cập nhật Thiên Thạch Rơi (Meteor Call)
        const mtLv = p.skills.meteor || 0;
        if (mtLv > 0) {
            p.cooldowns.meteor = (p.cooldowns.meteor || 0) - dt;
            if (p.cooldowns.meteor <= 0) {
                const isEvo = mtLv >= 6 || p.evolvedSkills?.meteor;
                p.cooldowns.meteor = (isEvo ? 2.2 : Math.max(1.8, 4.5 - mtLv * 0.4)) * cdMult;

                const count = isEvo ? 4 : (mtLv >= 3 ? 2 : 1);
                for (let k = 0; k < count; k++) {
                    let tx = p.x + (Math.random() - 0.5) * 550;
                    let ty = p.y + (Math.random() - 0.5) * 450;
                    if (game.enemies.length > 0 && Math.random() < 0.75) {
                        const rndE = game.enemies[Math.floor(Math.random() * game.enemies.length)];
                        if (rndE && !rndE.dead) {
                            tx = rndE.x + (Math.random() - 0.5) * 40;
                            ty = rndE.y + (Math.random() - 0.5) * 40;
                        }
                    }

                    this.meteors.push({
                        tx: tx,
                        ty: ty,
                        x: tx + 240,
                        y: ty - 400,
                        blastRadius: (isEvo ? 130 : 65 + mtLv * 10) * areaMult,
                        damage: Math.round((isEvo ? 360 : 85 + mtLv * 25) * dameMult),
                        delay: k * 0.28,
                        progress: 0,
                        isEvo: isEvo,
                        crashed: false
                    });
                }
            }
        }

        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const m = this.meteors[i];
            if (m.delay > 0) {
                m.delay -= dt;
                continue;
            }
            m.progress += dt * 2.8; // Rơi trong ~0.35s
            m.x = m.tx + 240 * (1 - m.progress);
            m.y = (m.ty - 400) + 400 * m.progress;

            if (m.progress >= 1 && !m.crashed) {
                m.crashed = true;
                if (window.Camera) window.Camera.shake(m.isEvo ? 0.6 : 0.35, m.isEvo ? 16 : 9);
                if (window.SFXController) window.SFXController.bossSpawn();

                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - m.tx, e.y - m.ty);
                    if (d <= m.blastRadius + e.radius) {
                        window.DamageSystem.damageEnemy(game, e, m.damage, true, 18);
                        e.burnTimer = 4.0;
                        e.burnDmg = Math.round(m.damage * 0.25);
                        if (m.isEvo) {
                            // Hút vào tâm thiên thạch
                            e.x += (m.tx - e.x) * 0.45;
                            e.y += (m.ty - e.y) * 0.45;
                        }
                    }
                }

                if (game.spawnExplosionParticles) {
                    game.spawnExplosionParticles(m.tx, m.ty, '#ef4444', 40);
                    game.spawnExplosionParticles(m.tx, m.ty, '#facc15', 24);
                }
                this.meteors.splice(i, 1);
            }
        }

        // 4. Cập nhật Hỏa Phong Long Quyển (Fire Tornado)
        const torLv = p.skills.fire_tornado || 0;
        if (torLv > 0) {
            p.cooldowns.fire_tornado = (p.cooldowns.fire_tornado || 0) - dt;
            const isEvo = torLv >= 6 || p.evolvedSkills?.fire_tornado;
            const maxActive = isEvo ? 3 : (torLv >= 4 ? 2 : 1);

            if (p.cooldowns.fire_tornado <= 0 && this.tornadoes.length < maxActive) {
                p.cooldowns.fire_tornado = (isEvo ? 2.5 : Math.max(2.0, 5.0 - torLv * 0.4)) * cdMult;
                const ang = Math.random() * Math.PI * 2;
                this.tornadoes.push({
                    x: p.x + Math.cos(ang) * 45,
                    y: p.y + Math.sin(ang) * 45,
                    vx: Math.cos(ang) * (isEvo ? 180 : 120),
                    vy: Math.sin(ang) * (isEvo ? 180 : 120),
                    radius: (isEvo ? 75 : 42 + torLv * 6) * areaMult,
                    damage: Math.round((isEvo ? 45 : 14 + torLv * 4) * dameMult),
                    life: isEvo ? 8.0 : (5.0 + torLv * 0.5),
                    isEvo: isEvo,
                    rot: 0
                });
            }
        }

        for (let i = this.tornadoes.length - 1; i >= 0; i--) {
            const tor = this.tornadoes[i];
            tor.life -= dt;
            tor.rot += 12 * dt;

            // Tự động săn quái gần nhất nếu là bản 6★
            if (tor.isEvo && game.enemies.length > 0) {
                let nearest = null, minDist = 800;
                for (let k = 0; k < game.enemies.length; k++) {
                    const e = game.enemies[k];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - tor.x, e.y - tor.y);
                    if (d < minDist) { minDist = d; nearest = e; }
                }
                if (nearest) {
                    const toAng = Math.atan2(nearest.y - tor.y, nearest.x - tor.x);
                    tor.vx += Math.cos(toAng) * 260 * dt;
                    tor.vy += Math.sin(toAng) * 260 * dt;
                    const spd = Math.hypot(tor.vx, tor.vy);
                    if (spd > 220) { tor.vx = (tor.vx / spd) * 220; tor.vy = (tor.vy / spd) * 220; }
                }
            }

            tor.x += tor.vx * dt;
            tor.y += tor.vy * dt;

            // Hút và đốt cháy quái trong vòng xoáy
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                const d = Math.hypot(e.x - tor.x, e.y - tor.y);
                if (d < tor.radius + e.radius) {
                    // Hút nhẹ về tâm
                    e.x += (tor.x - e.x) * 0.08;
                    e.y += (tor.y - e.y) * 0.08;
                    window.DamageSystem.damageEnemy(game, e, tor.damage * dt * 4, false, 0);
                    e.burnTimer = 2.0;
                    e.burnDmg = Math.round(tor.damage * 0.3);
                }
            }

            if (tor.life <= 0) this.tornadoes.splice(i, 1);
        }
    },

    // Vẽ Canvas 2D toàn bộ hiệu ứng Hệ Hỏa
    render(ctx, camX, camY) {
        // 1. Vẽ bóng cảnh báo thiên thạch & thiên thạch rơi
        for (let i = 0; i < this.meteors.length; i++) {
            const m = this.meteors[i];
            const gx = m.tx - camX;
            const gy = m.ty - camY;

            // Vòng tròn hồng ngoại báo trước điểm rơi
            ctx.save();
            ctx.strokeStyle = m.isEvo ? "rgba(239, 68, 68, 0.85)" : "rgba(249, 115, 22, 0.75)";
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(gx, gy, m.blastRadius * Math.min(1, m.progress * 1.5), 0, Math.PI * 2);
            ctx.stroke();

            // Khối cầu thiên thạch rực lửa
            if (m.progress > 0) {
                const mx = m.x - camX;
                const my = m.y - camY;
                const rad = m.isEvo ? 38 : 22;

                // Đuôi lửa thiên thạch
                ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
                ctx.beginPath();
                ctx.moveTo(mx + 60, my - 100);
                ctx.lineTo(mx - rad, my);
                ctx.lineTo(mx + rad, my);
                ctx.closePath();
                ctx.fill();

                // Quả cầu đá cháy rực
                const g = ctx.createRadialGradient(mx, my, 2, mx, my, rad);
                g.addColorStop(0, '#ffffff');
                g.addColorStop(0.3, '#fef08a');
                g.addColorStop(0.65, '#ea580c');
                g.addColorStop(1, '#7f1d1d');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(mx, my, rad, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 2. Vẽ Hào Hỏa Cầu & Biển Lửa
        for (let i = 0; i < this.fireballs.length; i++) {
            const fb = this.fireballs[i];
            const fx = fb.x - camX;
            const fy = fb.y - camY;

            ctx.save();
            // Vẽ hạt đuôi
            for (let s = 0; s < fb.sparks.length; s++) {
                const sp = fb.sparks[s];
                ctx.fillStyle = sp.color;
                ctx.globalAlpha = Math.max(0, sp.life / sp.maxLife);
                ctx.beginPath();
                ctx.arc(sp.x - camX, sp.y - camY, sp.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Quả cầu lửa chính
            ctx.globalAlpha = 1.0;
            const grad = ctx.createRadialGradient(fx, fy, 2, fx, fy, fb.radius);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.25, '#fde047');
            grad.addColorStop(0.6, '#f97316');
            grad.addColorStop(1, fb.isEvo ? 'rgba(185, 28, 28, 0.15)' : 'rgba(239, 68, 68, 0.05)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(fx, fy, fb.radius, 0, Math.PI * 2);
            ctx.fill();

            // Vành hào quang lửa xoay
            ctx.strokeStyle = fb.isEvo ? '#facc15' : '#fb923c';
            ctx.lineWidth = fb.isEvo ? 4.5 : 2.5;
            ctx.beginPath();
            ctx.arc(fx, fy, fb.radius * 0.85, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Vẽ Luồng Hỏa Long Viêm Đạn
        for (let i = 0; i < this.flamePuffs.length; i++) {
            const fp = this.flamePuffs[i];
            const px = fp.x - camX;
            const py = fp.y - camY;
            const prog = 1 - fp.life / fp.maxLife;
            const curR = fp.r + (fp.maxR - fp.r) * prog;

            ctx.save();
            ctx.globalAlpha = Math.max(0, fp.life / fp.maxLife);
            const fg = ctx.createRadialGradient(px, py, 1, px, py, curR);
            fg.addColorStop(0, '#ffffff');
            fg.addColorStop(0.3, fp.isEvo ? '#fde047' : '#fed7aa');
            fg.addColorStop(0.7, fp.isEvo ? '#ea580c' : '#f97316');
            fg.addColorStop(1, 'rgba(194, 65, 12, 0)');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(px, py, curR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Vẽ Hỏa Phong Long Quyển (Lốc Xoáy Lửa)
        for (let i = 0; i < this.tornadoes.length; i++) {
            const tor = this.tornadoes[i];
            const tx = tor.x - camX;
            const ty = tor.y - camY;

            ctx.save();
            ctx.translate(tx, ty);
            ctx.rotate(tor.rot);

            // 4 Vòng xoắn ốc lửa PixelFX
            for (let b = 0; b < 4; b++) {
                ctx.rotate(Math.PI / 2);
                ctx.strokeStyle = b % 2 === 0 ? "#ea580c" : "#facc15";
                ctx.lineWidth = tor.isEvo ? 6 : 3.5;
                ctx.beginPath();
                ctx.arc(0, 0, tor.radius * (0.4 + b * 0.18), 0, Math.PI * 0.85);
                ctx.stroke();
            }

            // Tâm lốc xoáy rực lửa
            const tg = ctx.createRadialGradient(0, 0, 2, 0, 0, tor.radius * 0.45);
            tg.addColorStop(0, '#ffffff');
            tg.addColorStop(0.5, '#f97316');
            tg.addColorStop(1, 'rgba(234, 88, 12, 0)');
            ctx.fillStyle = tg;
            ctx.beginPath();
            ctx.arc(0, 0, tor.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
};

window.FireballSkill = window.FireJutsu;
