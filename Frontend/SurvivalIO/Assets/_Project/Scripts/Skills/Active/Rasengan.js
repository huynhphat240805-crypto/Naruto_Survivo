/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Rasengan.js
   HỆ BĂNG & THỦY (ICE & WATER NINJUTSU) - 4 KỸ NĂNG & TIẾN HÓA 6★ (PIXELFX CANVAS RENDERER)
   9. Ma Kính Băng Chông (Ice Spikes) -> 🌟 Băng Sơn Tuyết Quốc
   10. Băng Tiễn Vũ (Icicle Rain) -> 🌟 Tuyệt Kỹ Bão Tuyết Haku
   11. Thủy Long Đạn (Water Jet) -> 🌟 Thủy Độn: Đại Hải Triều
   12. Thủy Triều Sóng Thần (Tidal Wave) -> 🌟 Thủy Độn: Đại Thủy Bộc
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 9. Ma Kính Băng Chông (Ice Spikes)
window.JutsuCatalog.ice_spikes = {
    id: 'ice_spikes',
    type: 'active',
    name: 'Băng Độn: Ma Kính Băng Chông',
    icon: '🧊',
    category: 'Nhẫn Thuật Hệ Băng',
    color: '#38bdf8',
    maxLevel: 5,
    pairId: 'hp',
    pairName: 'Thể Lực',
    pairIcon: '💚',
    evolution: {
        id: 'bangson_tuyetquoc',
        name: 'Băng Sơn Tuyết Quốc',
        icon: '🏔️',
        category: 'Thức Tỉnh 6★ • Hệ Băng',
        desc: 'Rừng chông băng vạn trượng trồi lên đóng băng cứng ngắc toàn bộ kẻ địch kể cả Boss.'
    },
    getDesc(lv) {
        if (lv === 1) return "Chông băng sắc nhọn trồi từ lòng đất, đóng băng quái 1.5s.";
        if (lv === 2) return "Tăng số lượng chông băng lên 4 cụm và +30% sát thương.";
        if (lv === 3) return "Tăng thời gian đóng băng lên 2.0s và mở rộng bán kính.";
        if (lv === 4) return "Tạo 6 cụm chông băng liên hoàn nổ tung vỡ vụn sát thương quái.";
        if (lv === 5) return "Đạt cấp 5★! Rừng băng phong tỏa toàn bộ kẻ địch xung quanh.";
        return "Đạt cấp tối đa!";
    }
};

// 10. Băng Tiễn Vũ (Icicle Rain)
window.JutsuCatalog.icicle_rain = {
    id: 'icicle_rain',
    type: 'active',
    name: 'Băng Độn: Băng Tiễn Vũ',
    icon: '🌨️',
    category: 'Nhẫn Thuật Hệ Băng',
    color: '#0ea5e9',
    maxLevel: 5,
    pairId: 'duration',
    pairName: 'Thời Gian',
    pairIcon: '⏳',
    evolution: {
        id: 'baotuyet_haku',
        name: 'Tuyệt Kỹ Bão Tuyết Haku',
        icon: '❄️',
        category: 'Thức Tỉnh 6★ • Bí Thuật Haku',
        desc: 'Bão tuyết rơi vĩnh cửu làm chậm 80% toàn map và liên tục gây sát thương băng giá.'
    },
    getDesc(lv) {
        if (lv === 1) return "Mưa tiễn băng rơi xuống vùng đông quái, làm chậm 60% tốc độ.";
        if (lv === 2) return "Mở rộng bán kính mưa băng và tăng mật độ tiễn băng rơi.";
        if (lv === 3) return "Tăng thời gian duy trì mưa băng lên 4.5 giây.";
        if (lv === 4) return "Tiễn băng phát nổ thành các mảnh băng vỡ gây thêm sát thương.";
        if (lv === 5) return "Đạt cấp 5★! Mưa băng tuyết rơi như vũ bão khống chế chiến trường.";
        return "Đạt cấp tối đa!";
    }
};

// 11. Thủy Long Đạn (Water Jet)
window.JutsuCatalog.water_jet = {
    id: 'water_jet',
    type: 'active',
    name: 'Thủy Độn: Thủy Long Đạn',
    icon: '🌊',
    category: 'Nhẫn Thuật Hệ Thủy',
    color: '#0284c7',
    maxLevel: 5,
    pairId: 'regen',
    pairName: 'Trị Thương Thuật',
    pairIcon: '✨',
    evolution: {
        id: 'daihaitrieu',
        name: 'Thủy Độn: Đại Hải Triều',
        icon: '🐉',
        category: 'Thức Tỉnh 6★ • Hệ Thủy',
        desc: 'Vòi rồng nước nuốt chửng quái vật, đẩy lùi cực xa và hồi máu liên tục cho người chơi.'
    },
    getDesc(lv) {
        if (lv === 1) return "Phun cột nước rồng áp lực cao đẩy lùi mạnh mẽ quái vật ra xa.";
        if (lv === 2) return "Tăng tầm bắn và bề rộng của cột nước rồng.";
        if (lv === 3) return "Cột nước xuyên qua tất cả kẻ địch trên đường thẳng.";
        if (lv === 4) return "Bắn đồng thời 2 vòi rồng nước quét sạch 2 hướng.";
        if (lv === 5) return "Đạt cấp 5★! Cột nước khổng lồ cuốn phăng mọi đợt quái bao vây.";
        return "Đạt cấp tối đa!";
    }
};

// 12. Thủy Triều Sóng Thần (Tidal Wave)
window.JutsuCatalog.tidal_wave = {
    id: 'tidal_wave',
    type: 'active',
    name: 'Thủy Độn: Thủy Triều Sóng Thần',
    icon: '🏄',
    category: 'Nhẫn Thuật Hệ Thủy',
    color: '#0369a1',
    maxLevel: 5,
    pairId: 'area',
    pairName: 'Phạm Vi Chiêu',
    pairIcon: '🌐',
    evolution: {
        id: 'daithuyboc',
        name: 'Thủy Độn: Đại Thủy Bộc',
        icon: '🌊',
        category: 'Thức Tỉnh 6★ • Hệ Thủy',
        desc: 'Sóng thần trắng xóa dâng ngập toàn bộ màn hình, cuốn trôi và đánh bạt mọi quái vật.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tạo đợt sóng thần dâng cao quét sạch cả góc màn hình về hướng nhìn.";
        if (lv === 2) return "Mở rộng bề ngang của sóng thần và tăng lực đẩy lùi.";
        if (lv === 3) return "Sóng thần để lại vùng xoáy nước làm chậm quái trong 3 giây.";
        if (lv === 4) return "Tăng +40% sát thương va đập của sóng thần.";
        if (lv === 5) return "Đạt cấp 5★! Đại sóng thần cuồn cuộn nuốt trọn bầy quái vật.";
        return "Đạt cấp tối đa!";
    }
};

// ============================================================================
// HỆ THỐNG CẬP NHẬT & HIỆU ỨNG VẼ CANVAS HỆ BĂNG & THỦY (PIXELFX STYLE)
// ============================================================================
window.IceWaterJutsu = {
    spikes: [],
    icicleZones: [],
    waterJets: [],
    tidalWaves: [],

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const areaMult = p.areaMultiplier || 1;
        const dameMult = p.damageMultiplier || 1;
        p.cooldowns = p.cooldowns || {};

        // 9. Cập nhật Ma Kính Băng Chông (Ice Spikes)
        const isLv = p.skills.ice_spikes || 0;
        if (isLv > 0) {
            p.cooldowns.ice_spikes = (p.cooldowns.ice_spikes || 0) - dt;
            if (p.cooldowns.ice_spikes <= 0) {
                const isEvo = isLv >= 6 || p.evolvedSkills?.ice_spikes;
                p.cooldowns.ice_spikes = (isEvo ? 1.8 : Math.max(1.5, 3.8 - isLv * 0.35)) * cdMult;

                const count = isEvo ? 8 : (2 + isLv);
                for (let k = 0; k < count; k++) {
                    const ang = Math.random() * Math.PI * 2;
                    const dist = 40 + Math.random() * (isEvo ? 260 : 160);
                    const sx = p.x + Math.cos(ang) * dist;
                    const sy = p.y + Math.sin(ang) * dist;

                    this.spikes.push({
                        x: sx,
                        y: sy,
                        radius: (isEvo ? 45 : 24) * areaMult,
                        damage: Math.round((isEvo ? 120 : 32 + isLv * 10) * dameMult),
                        life: 0.8,
                        maxLife: 0.8,
                        isEvo: isEvo,
                        applied: false
                    });
                }
            }
        }

        for (let i = this.spikes.length - 1; i >= 0; i--) {
            const spk = this.spikes[i];
            spk.life -= dt;
            if (!spk.applied && spk.life < spk.maxLife * 0.7) {
                spk.applied = true;
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    if (Math.hypot(e.x - spk.x, e.y - spk.y) < spk.radius + e.radius) {
                        window.DamageSystem.damageEnemy(game, e, spk.damage, false, 8);
                        e.freezeTimer = spk.isEvo ? 2.5 : 1.5; // Đóng băng cứng ngắc
                    }
                }
            }
            if (spk.life <= 0) this.spikes.splice(i, 1);
        }

        // 10. Cập nhật Băng Tiễn Vũ (Icicle Rain)
        const irLv = p.skills.icicle_rain || 0;
        if (irLv > 0) {
            p.cooldowns.icicle_rain = (p.cooldowns.icicle_rain || 0) - dt;
            const isEvo = irLv >= 6 || p.evolvedSkills?.icicle_rain;

            if (p.cooldowns.icicle_rain <= 0) {
                p.cooldowns.icicle_rain = (isEvo ? 2.5 : Math.max(2.0, 4.5 - irLv * 0.4)) * cdMult;
                this.icicleZones.push({
                    x: p.x,
                    y: p.y,
                    radius: (isEvo ? 280 : 140 + irLv * 15) * areaMult,
                    damage: Math.round((isEvo ? 28 : 10 + irLv * 3) * dameMult),
                    life: isEvo ? 8.0 : (4.0 + irLv * 0.4),
                    dropTimer: 0,
                    isEvo: isEvo
                });
            }
        }

        for (let i = this.icicleZones.length - 1; i >= 0; i--) {
            const zone = this.icicleZones[i];
            zone.life -= dt;
            zone.dropTimer -= dt;

            // Rơi tiễn băng liên tục
            if (zone.dropTimer <= 0) {
                zone.dropTimer = 0.12;
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    if (Math.hypot(e.x - zone.x, e.y - zone.y) < zone.radius) {
                        if (Math.random() < 0.3) {
                            window.DamageSystem.damageEnemy(game, e, zone.damage, false, 2);
                            e.slowTimer = 2.0;
                            e.slowFactor = zone.isEvo ? 0.20 : 0.40; // Làm chậm 60% - 80%
                        }
                    }
                }
            }
            if (zone.life <= 0) this.icicleZones.splice(i, 1);
        }

        // 11. Cập nhật Thủy Long Đạn (Water Jet)
        const wjLv = p.skills.water_jet || 0;
        if (wjLv > 0) {
            p.cooldowns.water_jet = (p.cooldowns.water_jet || 0) - dt;
            if (p.cooldowns.water_jet <= 0) {
                const isEvo = wjLv >= 6 || p.evolvedSkills?.water_jet;
                p.cooldowns.water_jet = (isEvo ? 1.2 : Math.max(0.8, 2.4 - wjLv * 0.25)) * cdMult;

                const count = isEvo ? 2 : (wjLv >= 4 ? 2 : 1);
                for (let k = 0; k < count; k++) {
                    const ang = (p.facing === -1 ? Math.PI : 0) + (count > 1 ? (k === 0 ? 0.2 : -0.2) : 0);
                    this.waterJets.push({
                        x: p.x,
                        y: p.y,
                        vx: Math.cos(ang) * (isEvo ? 450 : 360),
                        vy: Math.sin(ang) * (isEvo ? 450 : 360),
                        radius: (isEvo ? 34 : 18 + wjLv * 2) * areaMult,
                        damage: Math.round((isEvo ? 75 : 22 + wjLv * 8) * dameMult),
                        life: 1.2,
                        isEvo: isEvo
                    });
                }
            }
        }

        for (let i = this.waterJets.length - 1; i >= 0; i--) {
            const wj = this.waterJets[i];
            wj.x += wj.vx * dt;
            wj.y += wj.vy * dt;
            wj.life -= dt;

            // Đẩy lùi quái ra xa & Hồi máu nếu là 6★
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - wj.x, e.y - wj.y) < wj.radius + e.radius) {
                    window.DamageSystem.damageEnemy(game, e, wj.damage, false, 18);
                    // Đẩy lùi
                    const ang = Math.atan2(wj.vy, wj.vx);
                    e.x += Math.cos(ang) * 45;
                    e.y += Math.sin(ang) * 45;

                    // Bản 6★: Hồi máu cho người chơi
                    if (wj.isEvo && p.hp < p.maxHp) {
                        p.hp = Math.min(p.maxHp, p.hp + 2);
                    }
                }
            }
            if (wj.life <= 0) this.waterJets.splice(i, 1);
        }

        // 12. Cập nhật Thủy Triều Sóng Thần (Tidal Wave)
        const twLv = p.skills.tidal_wave || 0;
        if (twLv > 0) {
            p.cooldowns.tidal_wave = (p.cooldowns.tidal_wave || 0) - dt;
            if (p.cooldowns.tidal_wave <= 0) {
                const isEvo = twLv >= 6 || p.evolvedSkills?.tidal_wave;
                p.cooldowns.tidal_wave = (isEvo ? 2.5 : Math.max(2.0, 4.8 - twLv * 0.4)) * cdMult;

                const ang = p.facing === -1 ? Math.PI : 0;
                this.tidalWaves.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(ang) * 280,
                    vy: Math.sin(ang) * 280,
                    width: (isEvo ? 360 : 180 + twLv * 25) * areaMult,
                    damage: Math.round((isEvo ? 160 : 45 + twLv * 14) * dameMult),
                    life: 1.8,
                    isEvo: isEvo
                });
            }
        }

        for (let i = this.tidalWaves.length - 1; i >= 0; i--) {
            const tw = this.tidalWaves[i];
            tw.x += tw.vx * dt;
            tw.y += tw.vy * dt;
            tw.life -= dt;

            // Quét sạch quái trên đường sóng
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - tw.x, e.y - tw.y) < tw.width * 0.5) {
                    window.DamageSystem.damageEnemy(game, e, tw.damage * dt * 3, false, 24);
                    // Hất văng theo hướng sóng
                    e.x += tw.vx * dt * 1.5;
                    e.y += tw.vy * dt * 1.5;
                }
            }
            if (tw.life <= 0) this.tidalWaves.splice(i, 1);
        }
    },

    // Vẽ Canvas 2D các hiệu ứng Hệ Băng & Thủy
    render(ctx, camX, camY) {
        // 1. Vẽ Vùng Băng Tiễn Vũ
        for (let i = 0; i < this.icicleZones.length; i++) {
            const z = this.icicleZones[i];
            const zx = z.x - camX, zy = z.y - camY;

            ctx.save();
            ctx.fillStyle = z.isEvo ? "rgba(14, 165, 233, 0.12)" : "rgba(56, 189, 248, 0.08)";
            ctx.beginPath();
            ctx.arc(zx, zy, z.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = z.isEvo ? "rgba(56, 189, 248, 0.5)" : "rgba(186, 230, 253, 0.4)";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.arc(zx, zy, z.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Vẽ các bông tuyết rơi
            ctx.fillStyle = "#ffffff";
            for (let s = 0; s < (z.isEvo ? 14 : 7); s++) {
                const ox = zx + (Math.random() - 0.5) * z.radius * 1.6;
                const oy = zy + (Math.random() - 0.5) * z.radius * 1.6;
                ctx.beginPath();
                ctx.arc(ox, oy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 2. Vẽ Chông Băng (Ice Spikes)
        for (let i = 0; i < this.spikes.length; i++) {
            const spk = this.spikes[i];
            const sx = spk.x - camX, sy = spk.y - camY;
            const progress = 1 - spk.life / spk.maxLife;

            ctx.save();
            ctx.fillStyle = spk.isEvo ? "rgba(186, 230, 253, 0.95)" : "rgba(224, 242, 254, 0.88)";
            ctx.strokeStyle = "#0284c7";
            ctx.lineWidth = 2;

            // 3 Mũi chông băng tinh thể hình tam giác nhọn
            const h = spk.radius * Math.min(1, progress * 2.2);
            for (let b = -1; b <= 1; b++) {
                const bx = sx + b * 10;
                ctx.beginPath();
                ctx.moveTo(bx, sy);
                ctx.lineTo(bx - 6, sy + 6);
                ctx.lineTo(bx + b * 4, sy - h * (1 - Math.abs(b) * 0.2));
                ctx.lineTo(bx + 6, sy + 6);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        // 3. Vẽ Cột Nước Thủy Long Đạn
        for (let i = 0; i < this.waterJets.length; i++) {
            const wj = this.waterJets[i];
            const wx = wj.x - camX, wy = wj.y - camY;

            ctx.save();
            const g = ctx.createRadialGradient(wx, wy, 2, wx, wy, wj.radius);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.4, wj.isEvo ? '#38bdf8' : '#67e8f9');
            g.addColorStop(1, 'rgba(2, 132, 199, 0.15)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(wx, wy, wj.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Vẽ Thủy Triều Sóng Thần
        for (let i = 0; i < this.tidalWaves.length; i++) {
            const tw = this.tidalWaves[i];
            const tx = tw.x - camX, ty = tw.y - camY;

            ctx.save();
            ctx.translate(tx, ty);
            const ang = Math.atan2(tw.vy, tw.vx);
            ctx.rotate(ang);

            // Bức tường sóng thần trắng xanh
            ctx.fillStyle = tw.isEvo ? "rgba(56, 189, 248, 0.75)" : "rgba(14, 165, 233, 0.65)";
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, tw.width * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Viền bọt sóng trắng xóa
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(6, 0, 18, tw.width * 0.48, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
};

window.RasenganSkill = window.IceWaterJutsu;
