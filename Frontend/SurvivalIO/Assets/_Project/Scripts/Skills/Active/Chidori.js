/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Chidori.js
   HỆ LÔI (LIGHTNING NINJUTSU) - 4 KỸ NĂNG & TIẾN HÓA 6★ (PIXELFX CANVAS RENDERER)
   5. Thiên Điểu Sét Lan (Chain Lightning) -> 🌟 Lôi Thần Kirin Bão Tố
   6. Kirin Thiên Lôi (Lightning Strike) -> 🌟 Lôi Thiết Thần Phạt
   7. Lôi Giáp Hộ Thể (Lightning Armor) -> 🌟 Lôi Thể Lục Đạo
   8. Lôi Cầu Tĩnh Điện (Plasma Orb) -> 🌟 Lôi Cầu Trùng Kích
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 5. Thiên Điểu Sét Lan (Chain Lightning)
window.JutsuCatalog.chidori = {
    id: 'chidori',
    type: 'active',
    name: 'Lôi Độn: Thiên Điểu Sét Lan',
    icon: '⚡',
    category: 'Nhẫn Thuật Hệ Lôi',
    color: '#06b6d4',
    maxLevel: 5,
    pairId: 'cooldown',
    pairName: 'Kết Ấn',
    pairIcon: '📜',
    evolution: {
        id: 'kirin_storm',
        name: 'Lôi Thần Kirin Bão Tố',
        icon: '🌩️',
        category: 'Thức Tỉnh 6★ • Hệ Lôi',
        desc: 'Kirin giáng sét toàn map không giới hạn mục tiêu, làm chậm 50% và giật sét liên tục.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phóng tia sét giật chuỗi lan truyền qua 3 quái, làm chậm 50% trong 2s.";
        if (lv === 2) return "Tăng số lượng mục tiêu giật chuỗi lên 5 quái và +25% sát thương.";
        if (lv === 3) return "Giảm thời gian hồi chiêu và mở rộng bán kính nhảy cóc tia sét.";
        if (lv === 4) return "Sét giật lan truyền qua 7 quái vật kèm hiệu ứng tê liệt.";
        if (lv === 5) return "Đạt cấp 5★! Sấm sét giật bão tố 9 mục tiêu uy lực cực lớn.";
        return "Đạt cấp tối đa!";
    }
};

// 6. Kirin Thiên Lôi (Lightning Strike)
window.JutsuCatalog.lightning_strike = {
    id: 'lightning_strike',
    type: 'active',
    name: 'Lôi Độn: Kirin Thiên Lôi',
    icon: '🌩️',
    category: 'Nhẫn Thuật Hệ Lôi',
    color: '#38bdf8',
    maxLevel: 5,
    pairId: 'crit',
    pairName: 'Bạo Kích',
    pairIcon: '💥',
    evolution: {
        id: 'loithiet_thanphat',
        name: 'Lôi Thiết Thần Phạt',
        icon: '⚡',
        category: 'Thức Tỉnh 6★ • Hệ Lôi',
        desc: 'Cột sét hoàng kim giáng thế, 100% nổ sát thương chí mạng và đánh tan giáp kẻ địch.'
    },
    getDesc(lv) {
        if (lv === 1) return "Triệu hồi sấm sét giáng thẳng đầu quái mạnh nhất gây Choáng 1s.";
        if (lv === 2) return "Tăng sát thương sét giáng +35% và tăng tỉ lệ chí mạng.";
        if (lv === 3) return "Giáng 2 cột sấm sét liên tiếp vào các mục tiêu nguy hiểm.";
        if (lv === 4) return "Tăng thời gian làm choáng lên 1.5s và bán kính giật điện.";
        if (lv === 5) return "Đạt cấp 5★! 3 cột thiên lôi cuồng bạo san bằng điểm nổ.";
        return "Đạt cấp tối đa!";
    }
};

// 7. Lôi Giáp Hộ Thể (Lightning Armor)
window.JutsuCatalog.lightning_armor = {
    id: 'lightning_armor',
    type: 'active',
    name: 'Lôi Giáp Hộ Thể',
    icon: '🛡️',
    category: 'Nhẫn Thuật Hệ Lôi',
    color: '#818cf8',
    maxLevel: 5,
    pairId: 'armor',
    pairName: 'Giáp Hộ Thể',
    pairIcon: '🛡️',
    evolution: {
        id: 'loithe_lucdao',
        name: 'Lôi Thể Lục Đạo',
        icon: '🌌',
        category: 'Thức Tỉnh 6★ • Thể Thuật Lôi Độn',
        desc: 'Giáp sét tím Lục Đạo bất tử, phản 100% sát thương nhận vào thành lôi nổ diện rộng.'
    },
    getDesc(lv) {
        if (lv === 1) return "Khiên sét bao bọc cơ thể: Tăng +20% tốc độ chạy và phản 30% sát thương khi va chạm.";
        if (lv === 2) return "Tăng tốc chạy lên +25% và liên tục giật điện quái áp sát.";
        if (lv === 3) return "Tăng phản sát thương lên 50% và giảm -15% sát thương gánh chịu.";
        if (lv === 4) return "Khiên sét phóng các tia hồ quang đánh bật quái áp sát.";
        if (lv === 5) return "Đạt cấp 5★! Tốc chạy +30%, khiên sét bảo hộ toàn diện.";
        return "Đạt cấp tối đa!";
    }
};

// 8. Lôi Cầu Tĩnh Điện (Plasma Orb)
window.JutsuCatalog.plasma_orb = {
    id: 'plasma_orb',
    type: 'active',
    name: 'Lôi Cầu Tĩnh Điện',
    icon: '🔮',
    category: 'Nhẫn Thuật Hệ Lôi',
    color: '#a855f7',
    maxLevel: 5,
    pairId: 'magnet',
    pairName: 'Hút Chakra',
    pairIcon: '🧲',
    evolution: {
        id: 'loicau_trungkich',
        name: 'Lôi Cầu Trùng Kích',
        icon: '⚛️',
        category: 'Thức Tỉnh 6★ • Hệ Lôi',
        desc: 'Cầu điện cực đại tự động hút mọi ngọc EXP và liên tục giật tia plasma 360° quét sạch map.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tạo cầu điện tĩnh bay chậm, liên tục phóng tia giật sét 360° xung quanh.";
        if (lv === 2) return "Tăng tần suất phóng tia điện và tăng +30% sát thương.";
        if (lv === 3) return "Tạo đồng thời 2 cầu điện bay theo quỹ đạo xoắn ốc.";
        if (lv === 4) return "Tăng tầm bắn của tia plasma và thời gian tồn tại cầu điện.";
        if (lv === 5) return "Đạt cấp 5★! 3 cầu điện bao phủ chiến trường bằng lưới điện dày đặc.";
        return "Đạt cấp tối đa!";
    }
};

// ============================================================================
// HỆ THỐNG CẬP NHẬT & HIỆU ỨNG VẼ CANVAS HỆ LÔI (PIXELFX STYLE)
// ============================================================================
window.LightningJutsu = {
    chainArcs: [],
    strikes: [],
    plasmaOrbs: [],
    zapRays: [],

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const areaMult = p.areaMultiplier || 1;
        const dameMult = p.damageMultiplier || 1;
        p.cooldowns = p.cooldowns || {};

        // 5. Cập nhật Thiên Điểu Sét Lan (Chidori)
        const chiLv = p.skills.chidori || 0;
        if (chiLv > 0) {
            p.cooldowns.chidori = (p.cooldowns.chidori || 0) - dt;
            if (p.cooldowns.chidori <= 0 && game.enemies.length > 0) {
                const isEvo = chiLv >= 6 || p.evolvedSkills?.chidori;
                p.cooldowns.chidori = (isEvo ? 0.9 : Math.max(0.65, 2.0 - chiLv * 0.2)) * cdMult;

                const first = game.findNearestEnemy ? game.findNearestEnemy(p.x, p.y, 600) : null;
                if (first) {
                    const maxHops = isEvo ? 14 : (3 + chiLv * 2);
                    const hitSet = new Set();
                    let cx = p.x, cy = p.y;
                    let target = first;

                    for (let h = 0; h < maxHops && target; h++) {
                        hitSet.add(target.id);
                        this.chainArcs.push({
                            x1: cx, y1: cy,
                            x2: target.x, y2: target.y,
                            life: 0.22,
                            maxLife: 0.22,
                            isEvo: isEvo
                        });

                        const dmg = Math.round((isEvo ? 85 : 22 + chiLv * 8) * dameMult);
                        window.DamageSystem.damageEnemy(game, target, dmg, isEvo, 4);
                        target.slowTimer = 2.0;
                        target.slowFactor = 0.50; // Giảm 50% tốc độ

                        cx = target.x;
                        cy = target.y;

                        // Tìm quái kế tiếp gần nhất chưa bị giật sét
                        let nextTarget = null, minDist = 240 * areaMult;
                        for (let k = 0; k < game.enemies.length; k++) {
                            const candidate = game.enemies[k];
                            if (candidate.dead || hitSet.has(candidate.id)) continue;
                            const d = Math.hypot(candidate.x - cx, candidate.y - cy);
                            if (d < minDist) { minDist = d; nextTarget = candidate; }
                        }
                        target = nextTarget;
                    }
                    if (window.SFXController) window.SFXController.chidori();
                }
            }
        }

        // Cập nhật tia sét nhảy cóc
        for (let i = this.chainArcs.length - 1; i >= 0; i--) {
            this.chainArcs[i].life -= dt;
            if (this.chainArcs[i].life <= 0) this.chainArcs.splice(i, 1);
        }

        // 6. Cập nhật Kirin Thiên Lôi (Lightning Strike)
        const lsLv = p.skills.lightning_strike || 0;
        if (lsLv > 0) {
            p.cooldowns.lightning_strike = (p.cooldowns.lightning_strike || 0) - dt;
            if (p.cooldowns.lightning_strike <= 0 && game.enemies.length > 0) {
                const isEvo = lsLv >= 6 || p.evolvedSkills?.lightning_strike;
                p.cooldowns.lightning_strike = (isEvo ? 1.5 : Math.max(1.4, 3.8 - lsLv * 0.35)) * cdMult;

                const count = isEvo ? 3 : (lsLv >= 3 ? 2 : 1);
                for (let k = 0; k < count; k++) {
                    const sorted = game.enemies.filter(e => !e.dead).sort((a, b) => b.hp - a.hp);
                    const target = sorted[k] || sorted[0];
                    if (target) {
                        this.strikes.push({
                            tx: target.x,
                            ty: target.y,
                            life: 0.35,
                            maxLife: 0.35,
                            damage: Math.round((isEvo ? 320 : 75 + lsLv * 22) * dameMult),
                            isEvo: isEvo,
                            applied: false
                        });
                    }
                }
            }
        }

        // Cập nhật cột sét giáng
        for (let i = this.strikes.length - 1; i >= 0; i--) {
            const st = this.strikes[i];
            st.life -= dt;
            if (!st.applied && st.life < st.maxLife * 0.85) {
                st.applied = true;
                if (window.Camera) window.Camera.shake(0.3, st.isEvo ? 14 : 8);

                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - st.tx, e.y - st.ty);
                    if (d <= (st.isEvo ? 90 : 50) * areaMult) {
                        window.DamageSystem.damageEnemy(game, e, st.damage, st.isEvo, 12);
                        e.stunTimer = st.isEvo ? 1.8 : 1.0; // Choáng 1s - 1.8s
                    }
                }
            }
            if (st.life <= 0) this.strikes.splice(i, 1);
        }

        // 7. Cập nhật Lôi Giáp Hộ Thể (Lightning Armor)
        const laLv = p.skills.lightning_armor || 0;
        if (laLv > 0) {
            const isEvo = laLv >= 6 || p.evolvedSkills?.lightning_armor;
            p.speed = Math.round((215 * (1 + (p.skills.speed || 0) * 0.10)) * 1.30); // Tăng 30% tốc độ chạy

            // Giật điện quái chạm vào
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius + e.radius + 18) {
                    const phảnDmg = Math.round((isEvo ? 65 : 18 + laLv * 6) * dameMult);
                    window.DamageSystem.damageEnemy(game, e, phảnDmg, isEvo, 6);
                }
            }
        }

        // 8. Cập nhật Lôi Cầu Tĩnh Điện (Plasma Orb)
        const poLv = p.skills.plasma_orb || 0;
        if (poLv > 0) {
            p.cooldowns.plasma_orb = (p.cooldowns.plasma_orb || 0) - dt;
            const isEvo = poLv >= 6 || p.evolvedSkills?.plasma_orb;
            const maxOrbs = isEvo ? 3 : (poLv >= 4 ? 3 : (poLv >= 3 ? 2 : 1));

            if (p.cooldowns.plasma_orb <= 0 && this.plasmaOrbs.length < maxOrbs) {
                p.cooldowns.plasma_orb = (isEvo ? 2.0 : 3.8) * cdMult;
                const ang = Math.random() * Math.PI * 2;
                this.plasmaOrbs.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(ang) * (isEvo ? 140 : 90),
                    vy: Math.sin(ang) * (isEvo ? 140 : 90),
                    radius: (isEvo ? 28 : 16) * areaMult,
                    damage: Math.round((isEvo ? 48 : 16 + poLv * 4) * dameMult),
                    life: isEvo ? 7.5 : 5.0,
                    zapTimer: 0,
                    isEvo: isEvo
                });
            }
        }

        for (let i = this.plasmaOrbs.length - 1; i >= 0; i--) {
            const orb = this.plasmaOrbs[i];
            orb.x += orb.vx * dt;
            orb.y += orb.vy * dt;
            orb.life -= dt;
            orb.zapTimer -= dt;

            // Bản 6★: Tự động hút hạt EXP về phía người chơi
            if (orb.isEvo && game.dropItems) {
                for (let d = 0; d < game.dropItems.length; d++) {
                    const item = game.dropItems[d];
                    if (Math.hypot(item.x - orb.x, item.y - orb.y) < 220) {
                        item.x += (p.x - item.x) * 0.12;
                        item.y += (p.y - item.y) * 0.12;
                    }
                }
            }

            // Phóng tia giật sét 360 độ liên tục
            if (orb.zapTimer <= 0) {
                orb.zapTimer = orb.isEvo ? 0.15 : 0.28;
                for (let k = 0; k < game.enemies.length; k++) {
                    const e = game.enemies[k];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - orb.x, e.y - orb.y);
                    if (d < (orb.isEvo ? 260 : 160) * areaMult) {
                        this.zapRays.push({
                            x1: orb.x, y1: orb.y,
                            x2: e.x, y2: e.y,
                            life: 0.12,
                            isEvo: orb.isEvo
                        });
                        window.DamageSystem.damageEnemy(game, e, orb.damage, false, 2);
                        break;
                    }
                }
            }

            if (orb.life <= 0) this.plasmaOrbs.splice(i, 1);
        }

        for (let i = this.zapRays.length - 1; i >= 0; i--) {
            this.zapRays[i].life -= dt;
            if (this.zapRays[i].life <= 0) this.zapRays.splice(i, 1);
        }
    },

    // Vẽ Canvas 2D các hiệu ứng Hệ Lôi
    render(ctx, camX, camY, game) {
        // 1. Vẽ tia sét nhảy cóc (Chain Lightning)
        for (let i = 0; i < this.chainArcs.length; i++) {
            const arc = this.chainArcs[i];
            const x1 = arc.x1 - camX, y1 = arc.y1 - camY;
            const x2 = arc.x2 - camX, y2 = arc.y2 - camY;
            const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
            const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 30;

            ctx.save();
            ctx.strokeStyle = arc.isEvo ? "#fef08a" : "#67e8f9";
            ctx.lineWidth = arc.isEvo ? 5.5 : 3.5;
            ctx.shadowColor = arc.isEvo ? "#eab308" : "#06b6d4";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(midX, midY);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }

        // 2. Vẽ cột sét giáng (Kirin Strike)
        for (let i = 0; i < this.strikes.length; i++) {
            const st = this.strikes[i];
            const kx = st.tx - camX;
            const ky = st.ty - camY;
            const alpha = Math.max(0, st.life / st.maxLife);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = st.isEvo ? "#fbbf24" : "#ffffff";
            ctx.lineWidth = st.isEvo ? 14 : 8;
            ctx.shadowColor = st.isEvo ? "#f59e0b" : "#38bdf8";
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.moveTo(kx + (Math.random() - 0.5) * 20, -100);
            ctx.lineTo(kx + (Math.random() - 0.5) * 30, ky * 0.4);
            ctx.lineTo(kx, ky);
            ctx.stroke();

            // Vòng sóng điện chấn động
            ctx.strokeStyle = st.isEvo ? "#fef08a" : "#67e8f9";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(kx, ky, (1 - alpha) * (st.isEvo ? 90 : 50), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Vẽ Lôi Giáp Hộ Thể (Lightning Armor) quanh người chơi
        const p = game ? game.player : null;
        if (p && (p.skills.lightning_armor || 0) > 0) {
            const isEvo = (p.skills.lightning_armor || 0) >= 6 || p.evolvedSkills?.lightning_armor;
            const px = p.x - camX, py = p.y - camY;
            const time = game.elapsedTime || 0;

            ctx.save();
            ctx.strokeStyle = isEvo ? "#c084fc" : "#38bdf8";
            ctx.lineWidth = isEvo ? 3.5 : 2.5;
            ctx.shadowColor = isEvo ? "#a855f7" : "#0284c7";
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(px, py, p.radius + 12 + Math.sin(time * 14) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Tia hồ quang nhảy múa
            for (let b = 0; b < 3; b++) {
                const ang = time * 8 + b * (Math.PI * 2 / 3);
                const rx = px + Math.cos(ang) * (p.radius + 14);
                const ry = py + Math.sin(ang) * (p.radius + 14);
                ctx.fillStyle = isEvo ? "#f3e8ff" : "#ffffff";
                ctx.beginPath();
                ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 4. Vẽ Lôi Cầu Tĩnh Điện & Tia Zap
        for (let i = 0; i < this.plasmaOrbs.length; i++) {
            const orb = this.plasmaOrbs[i];
            const ox = orb.x - camX, oy = orb.y - camY;

            ctx.save();
            const g = ctx.createRadialGradient(ox, oy, 2, ox, oy, orb.radius);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.4, orb.isEvo ? '#c084fc' : '#67e8f9');
            g.addColorStop(1, orb.isEvo ? 'rgba(147, 51, 234, 0.1)' : 'rgba(6, 182, 212, 0.1)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (let i = 0; i < this.zapRays.length; i++) {
            const z = this.zapRays[i];
            ctx.save();
            ctx.strokeStyle = z.isEvo ? "#f472b6" : "#67e8f9";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(z.x1 - camX, z.y1 - camY);
            ctx.lineTo(z.x2 - camX, z.y2 - camY);
            ctx.stroke();
            ctx.restore();
        }
    }
};

window.ChidoriSkill = window.LightningJutsu;
