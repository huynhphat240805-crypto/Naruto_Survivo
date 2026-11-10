/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Kunai.js
   THỂ THUẬT, KIẾM THUẬT & VŨ KHÍ - 4 KỸ NĂNG & TIẾN HÓA 6★ (PIXELFX CANVAS RENDERER)
   13. Tam Đoạn Trảm Kusanagi -> 🌟 Phi Lôi Thần Vạn Kiếm
   14. Phi Thân Trảm (Dash Strike) -> 🌟 Lục Đạo Thần Tốc Kiếm
   15. Quái Lực Tsunade (Earth Smash) -> 🌟 Dạ Hạc Bát Môn Độn Giáp
   16. Phi Tiêu Loạn Vũ (Shuriken Volley) -> 🌟 Phong Ma Phi Tiêu Ảnh Phân Thân
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 13. Tam Đoạn Trảm Kusanagi
window.JutsuCatalog.sword_combo = {
    id: 'sword_combo',
    type: 'active',
    name: 'Tam Đoạn Trảm Kusanagi',
    icon: '🗡️',
    category: 'Kiếm Thuật & Thể Thuật',
    color: '#e2e8f0',
    maxLevel: 5,
    pairId: 'speed',
    pairName: 'Thuấn Thân',
    pairIcon: '🍃',
    evolution: {
        id: 'philoi_vankiem',
        name: 'Phi Lôi Thần Vạn Kiếm',
        icon: '⚔️',
        category: 'Thức Tỉnh 6★ • Kiếm Thuật Tối Thượng',
        desc: '8 phân thân lướt chém vạn kiếm chớp nhoáng toàn màn hình với tốc độ ánh sáng.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tung 3 nhát chém vòng cung liên hoàn xuyên quái, Chí Mạng 200%.";
        if (lv === 2) return "Mở rộng góc quét kiếm và tăng +35% sát thương chí mạng.";
        if (lv === 3) return "Giảm thời gian hồi chiêu và tạo sóng kiếm bay xa.";
        if (lv === 4) return "Tăng số nhát chém liên hoàn lên 4 nhát chém cực nhanh.";
        if (lv === 5) return "Đạt cấp 5★! Nhát chém trảm phong uy lực tuyệt đối.";
        return "Đạt cấp tối đa!";
    }
};

// 14. Phi Thân Trảm (Dash Strike)
window.JutsuCatalog.dash_strike = {
    id: 'dash_strike',
    type: 'active',
    name: 'Kiếm Thuật: Phi Thân Trảm',
    icon: '⚡',
    category: 'Kiếm Thuật & Thể Thuật',
    color: '#cbd5e1',
    maxLevel: 5,
    pairId: 'dame',
    pairName: 'Uy Lực',
    pairIcon: '⚔️',
    evolution: {
        id: 'lucdao_thantockiem',
        name: 'Lục Đạo Thần Tốc Kiếm',
        icon: '🔱',
        category: 'Thức Tỉnh 6★ • Kiếm Thuật Lục Đạo',
        desc: 'Lướt xuyên map thần tốc để lại vệt chém nổ chân không hủy diệt mọi kẻ địch.'
    },
    getDesc(lv) {
        if (lv === 1) return "Lướt kiếm thần tốc xuyên qua đàn quái, gây sát thương lớn trên đường lướt.";
        if (lv === 2) return "Tăng cự ly lướt và để lại vệt kiếm khí gây thêm sát thương.";
        if (lv === 3) return "Tăng +40% sát thương đòn lướt và giảm hồi chiêu.";
        if (lv === 4) return "Miễn nhiễm sát thương trong suốt quá trình lướt kiếm.";
        if (lv === 5) return "Đạt cấp 5★! Cú lướt xé toạc không gian đánh tan bầy quái.";
        return "Đạt cấp tối đa!";
    }
};

// 15. Quái Lực Tsunade (Earth Smash)
window.JutsuCatalog.earth_smash = {
    id: 'earth_smash',
    type: 'active',
    name: 'Thể Thuật: Quái Lực Tsunade',
    icon: '👊',
    category: 'Kiếm Thuật & Thể Thuật',
    color: '#f59e0b',
    maxLevel: 5,
    pairId: 'armor',
    pairName: 'Giáp Hộ Thể',
    pairIcon: '🛡️',
    evolution: {
        id: 'dahac_batmon',
        name: 'Dạ Hạc Bát Môn Độn Giáp',
        icon: '🦩',
        category: 'Thức Tỉnh 6★ • Cấm Thuật Bát Môn',
        desc: 'Dậm nát đất tạo sóng xung kích chấn động, làm choáng toàn bộ quái vật trên màn hình.'
    },
    getDesc(lv) {
        if (lv === 1) return "Đấm nứt mặt đất tạo sóng xung kích hất tung quái vật xung quanh.";
        if (lv === 2) return "Mở rộng bán kính chấn động và tăng sát thương hất tung.";
        if (lv === 3) return "Tạo các mảnh đá vỡ bay ra găm vào kẻ địch lân cận.";
        if (lv === 4) return "Làm choáng quái vật trong tâm chấn trong 1.5 giây.";
        if (lv === 5) return "Đạt cấp 5★! Cú đấm kinh thiên động địa phá nát mọi vật cản.";
        return "Đạt cấp tối đa!";
    }
};

// 16. Phi Tiêu Loạn Vũ (Shuriken Volley)
window.JutsuCatalog.shuriken = {
    id: 'shuriken',
    type: 'active',
    name: 'Vũ Khí: Phi Tiêu Loạn Vũ',
    icon: '✴️',
    category: 'Vũ Khí Ninja',
    color: '#94a3b8',
    maxLevel: 5,
    pairId: 'crit',
    pairName: 'Bạo Kích',
    pairIcon: '💥',
    evolution: {
        id: 'phongma_phanthuc',
        name: 'Phong Ma Phi Tiêu Ảnh Phân Thân',
        icon: '🌟',
        category: 'Thức Tỉnh 6★ • Nhẫn Cụ Tối Thượng',
        desc: 'Mưa Phong Ma Phi Tiêu phân thân bay rợp trời, xuyên phá và nổ tung chiến trường.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phóng chùm phi tiêu 4 hướng kèm làn khói mù sát thương quái.";
        if (lv === 2) return "Tăng số lượng phi tiêu lên 6 hướng và tăng tốc độ bay.";
        if (lv === 3) return "Bắn chùm 8 hướng bao bọc 360 độ quanh thân chủ.";
        if (lv === 4) return "Phi tiêu có gắn bùa nổ phát nổ khi chạm mục tiêu.";
        if (lv === 5) return "Đạt cấp 5★! Phi tiêu loạn vũ liên tục phóng ra không ngừng.";
        return "Đạt cấp tối đa!";
    }
};

// ============================================================================
// HỆ THỐNG CẬP NHẬT & HIỆU ỨNG VẼ CANVAS THỂ THUẬT & VŨ KHÍ
// ============================================================================
window.WeaponTaijutsu = {
    slashes: [],
    dashes: [],
    smashes: [],
    shurikens: [],

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const areaMult = p.areaMultiplier || 1;
        const dameMult = p.damageMultiplier || 1;
        p.cooldowns = p.cooldowns || {};

        // 13. Cập nhật Tam Đoạn Trảm Kusanagi (Sword Combo)
        const scLv = p.skills.sword_combo || 0;
        if (scLv > 0) {
            p.cooldowns.sword_combo = (p.cooldowns.sword_combo || 0) - dt;
            if (p.cooldowns.sword_combo <= 0) {
                const isEvo = scLv >= 6 || p.evolvedSkills?.sword_combo;
                p.cooldowns.sword_combo = (isEvo ? 0.9 : Math.max(0.6, 2.0 - scLv * 0.2)) * cdMult;

                const count = isEvo ? 8 : (scLv >= 4 ? 4 : 3);
                for (let k = 0; k < count; k++) {
                    const ang = (p.facing === -1 ? Math.PI : 0) + (isEvo ? (k * Math.PI / 4) : ((k - 1) * 0.45));
                    this.slashes.push({
                        x: p.x + Math.cos(ang) * (isEvo ? 45 : 25),
                        y: p.y + Math.sin(ang) * (isEvo ? 45 : 25),
                        angle: ang,
                        radius: (isEvo ? 85 : 45 + scLv * 6) * areaMult,
                        damage: Math.round((isEvo ? 110 : 35 + scLv * 12) * dameMult * 2.0), // 200% Chí Mạng
                        life: 0.25,
                        maxLife: 0.25,
                        isEvo: isEvo,
                        applied: false
                    });
                }
                if (window.SFXController) window.SFXController.swordSlash();
            }
        }

        for (let i = this.slashes.length - 1; i >= 0; i--) {
            const sl = this.slashes[i];
            sl.life -= dt;
            if (!sl.applied) {
                sl.applied = true;
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    if (Math.hypot(e.x - sl.x, e.y - sl.y) < sl.radius + e.radius) {
                        window.DamageSystem.damageEnemy(game, e, sl.damage, true, 8);
                    }
                }
            }
            if (sl.life <= 0) this.slashes.splice(i, 1);
        }

        // 14. Cập nhật Phi Thân Trảm (Dash Strike)
        const dsLv = p.skills.dash_strike || 0;
        if (dsLv > 0) {
            p.cooldowns.dash_strike = (p.cooldowns.dash_strike || 0) - dt;
            if (p.cooldowns.dash_strike <= 0 && game.enemies.length > 0) {
                const isEvo = dsLv >= 6 || p.evolvedSkills?.dash_strike;
                p.cooldowns.dash_strike = (isEvo ? 1.4 : Math.max(1.2, 3.2 - dsLv * 0.3)) * cdMult;

                const target = game.findNearestEnemy ? game.findNearestEnemy(p.x, p.y, 450) : null;
                const dashAng = target ? Math.atan2(target.y - p.y, target.x - p.x) : (p.facing === -1 ? Math.PI : 0);
                const dashDist = (isEvo ? 360 : 180 + dsLv * 25) * areaMult;

                const startX = p.x, startY = p.y;
                const endX = p.x + Math.cos(dashAng) * dashDist;
                const endY = p.y + Math.sin(dashAng) * dashDist;

                // Lướt người chơi
                p.x = endX;
                p.y = endY;

                this.dashes.push({
                    x1: startX, y1: startY,
                    x2: endX, y2: endY,
                    damage: Math.round((isEvo ? 160 : 45 + dsLv * 15) * dameMult),
                    life: 0.35,
                    maxLife: 0.35,
                    isEvo: isEvo
                });

                // Chém quái trên đường lướt
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    // Đo khoảng cách tới đoạn thẳng
                    const d = Math.hypot(e.x - (startX + endX) / 2, e.y - (startY + endY) / 2);
                    if (d < dashDist * 0.55) {
                        window.DamageSystem.damageEnemy(game, e, Math.round((isEvo ? 160 : 45 + dsLv * 15) * dameMult), true, 12);
                    }
                }
            }
        }

        for (let i = this.dashes.length - 1; i >= 0; i--) {
            this.dashes[i].life -= dt;
            if (this.dashes[i].life <= 0) this.dashes.splice(i, 1);
        }

        // 15. Cập nhật Quái Lực Tsunade (Earth Smash)
        const esLv = p.skills.earth_smash || 0;
        if (esLv > 0) {
            p.cooldowns.earth_smash = (p.cooldowns.earth_smash || 0) - dt;
            if (p.cooldowns.earth_smash <= 0) {
                const isEvo = esLv >= 6 || p.evolvedSkills?.earth_smash;
                p.cooldowns.earth_smash = (isEvo ? 1.8 : Math.max(1.5, 4.0 - esLv * 0.35)) * cdMult;

                this.smashes.push({
                    x: p.x,
                    y: p.y,
                    radius: (isEvo ? 220 : 90 + esLv * 15) * areaMult,
                    damage: Math.round((isEvo ? 240 : 60 + esLv * 18) * dameMult),
                    life: 0.45,
                    maxLife: 0.45,
                    isEvo: isEvo
                });

                if (window.Camera) window.Camera.shake(isEvo ? 0.6 : 0.35, isEvo ? 18 : 10);

                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - p.x, e.y - p.y);
                    if (d <= (isEvo ? 220 : 90 + esLv * 15) * areaMult) {
                        window.DamageSystem.damageEnemy(game, e, Math.round((isEvo ? 240 : 60 + esLv * 18) * dameMult), isEvo, 22);
                        e.stunTimer = isEvo ? 2.0 : 1.2; // Choáng
                    }
                }
            }
        }

        for (let i = this.smashes.length - 1; i >= 0; i--) {
            this.smashes[i].life -= dt;
            if (this.smashes[i].life <= 0) this.smashes.splice(i, 1);
        }

        // 16. Cập nhật Phi Tiêu Loạn Vũ (Shuriken Volley)
        const shLv = p.skills.shuriken || 0;
        if (shLv > 0) {
            p.cooldowns.shuriken = (p.cooldowns.shuriken || 0) - dt;
            if (p.cooldowns.shuriken <= 0) {
                const isEvo = shLv >= 6 || p.evolvedSkills?.shuriken;
                p.cooldowns.shuriken = (isEvo ? 0.65 : Math.max(0.5, 1.8 - shLv * 0.2)) * cdMult;

                const count = isEvo ? 16 : (shLv >= 3 ? 8 : (shLv >= 2 ? 6 : 4));
                for (let k = 0; k < count; k++) {
                    const ang = (Math.PI * 2 / count) * k + (Math.random() - 0.5) * 0.1;
                    this.shurikens.push({
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(ang) * (isEvo ? 440 : 340),
                        vy: Math.sin(ang) * (isEvo ? 440 : 340),
                        radius: isEvo ? 14 : 7,
                        damage: Math.round((isEvo ? 55 : 18 + shLv * 5) * dameMult),
                        life: 1.5,
                        rot: 0,
                        isEvo: isEvo
                    });
                }
            }
        }

        for (let i = this.shurikens.length - 1; i >= 0; i--) {
            const sh = this.shurikens[i];
            sh.x += sh.vx * dt;
            sh.y += sh.vy * dt;
            sh.rot += 24 * dt;
            sh.life -= dt;

            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - sh.x, e.y - sh.y) < sh.radius + e.radius) {
                    window.DamageSystem.damageEnemy(game, e, sh.damage, sh.isEvo, 5);
                    if (!sh.isEvo) {
                        this.shurikens.splice(i, 1);
                        break;
                    }
                }
            }

            if (sh.life <= 0) this.shurikens.splice(i, 1);
        }
    },

    // Vẽ Canvas 2D các hiệu ứng Thể Thuật, Kiếm Thuật & Phi Tiêu
    render(ctx, camX, camY) {
        // 1. Vẽ Quái Lực Tsunade (Sóng Chấn Động Nứt Đất)
        for (let i = 0; i < this.smashes.length; i++) {
            const sm = this.smashes[i];
            const sx = sm.x - camX, sy = sm.y - camY;
            const prog = 1 - sm.life / sm.maxLife;

            ctx.save();
            ctx.strokeStyle = sm.isEvo ? "rgba(239, 68, 68, 0.85)" : "rgba(245, 158, 11, 0.75)";
            ctx.lineWidth = sm.isEvo ? 8 : 4.5;
            ctx.beginPath();
            ctx.arc(sx, sy, sm.radius * prog, 0, Math.PI * 2);
            ctx.stroke();

            // Vết nứt đất chữ thập
            ctx.strokeStyle = sm.isEvo ? "#ef4444" : "#b45309";
            ctx.lineWidth = 3;
            for (let b = 0; b < 6; b++) {
                const ang = b * (Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + Math.cos(ang) * sm.radius * prog, sy + Math.sin(ang) * sm.radius * prog);
                ctx.stroke();
            }
            ctx.restore();
        }

        // 2. Vẽ Phi Thân Trảm (Vệt chém nổ chân không)
        for (let i = 0; i < this.dashes.length; i++) {
            const d = this.dashes[i];
            ctx.save();
            ctx.strokeStyle = d.isEvo ? "#facc15" : "#f8fafc";
            ctx.lineWidth = d.isEvo ? 7 : 3.5;
            ctx.shadowColor = d.isEvo ? "#f59e0b" : "#38bdf8";
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.moveTo(d.x1 - camX, d.y1 - camY);
            ctx.lineTo(d.x2 - camX, d.y2 - camY);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Vẽ Tam Đoạn Trảm Kusanagi (Lưỡi kiếm vòng cung)
        for (let i = 0; i < this.slashes.length; i++) {
            const sl = this.slashes[i];
            const px = sl.x - camX, py = sl.y - camY;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(sl.angle);

            ctx.strokeStyle = sl.isEvo ? "#38bdf8" : "#f1f5f9";
            ctx.lineWidth = sl.isEvo ? 6 : 3.5;
            ctx.shadowColor = sl.isEvo ? "#0284c7" : "#94a3b8";
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(0, 0, sl.radius, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.stroke();
            ctx.restore();
        }

        // 4. Vẽ Phi Tiêu Loạn Vũ (Shuriken)
        for (let i = 0; i < this.shurikens.length; i++) {
            const sh = this.shurikens[i];
            const sx = sh.x - camX, sy = sh.y - camY;

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(sh.rot);

            if (sh.isEvo) {
                // Phong Ma Phi Tiêu 4 cánh vàng óng
                ctx.fillStyle = "#fbbf24";
                ctx.shadowColor = "#f59e0b";
                ctx.shadowBlur = 10;
                for (let b = 0; b < 4; b++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.beginPath();
                    ctx.moveTo(0, -4);
                    ctx.lineTo(sh.radius + 6, 0);
                    ctx.lineTo(0, 4);
                    ctx.closePath();
                    ctx.fill();
                }
            } else {
                ctx.fillStyle = "#cbd5e1";
                for (let b = 0; b < 4; b++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.beginPath();
                    ctx.moveTo(0, -2.5);
                    ctx.lineTo(sh.radius + 3, 0);
                    ctx.lineTo(0, 2.5);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            ctx.restore();
        }
    }
};

window.KunaiSkill = window.WeaponTaijutsu;
