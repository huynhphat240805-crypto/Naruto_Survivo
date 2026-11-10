/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Active/Clone.js
   BÍ THUẬT KHÔNG GIAN & HẮC ÁM - 4 KỸ NĂNG & TIẾN HÓA 6★ (PIXELFX CANVAS RENDERER)
   17. Vĩ Thú Ngọc (Bijuu Dama) -> 🌟 Siêu Vĩ Thú Rasenshuriken
   18. Phi Lôi Thần Thuật (Teleport Trap) -> 🌟 Hiraishin Vô Hạn
   19. Hắc Hỏa Amaterasu -> 🌟 Amaterasu Hắc Diễm Phần Diệt
   20. Chakra Hộ Thể (Force Field) -> 🌟 Cửu Vĩ Kim Cương Giới
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 17. Vĩ Thú Ngọc (Bijuu Dama)
window.JutsuCatalog.bijuu_dama = {
    id: 'bijuu_dama',
    type: 'active',
    name: 'Bí Thuật: Vĩ Thú Ngọc',
    icon: '🔮',
    category: 'Bí Thuật Vĩ Thú',
    color: '#a855f7',
    maxLevel: 5,
    pairId: 'dame',
    pairName: 'Uy Lực',
    pairIcon: '⚔️',
    evolution: {
        id: 'sieu_rasenshuriken',
        name: 'Siêu Vĩ Thú Rasenshuriken',
        icon: '🌀',
        category: 'Thức Tỉnh 6★ • Vĩ Thú Thần Thuật',
        desc: 'Cầu đen vàng cực đại hút cả map vào tâm rồi phát nổ hủy diệt toàn diện chiến trường.'
    },
    getDesc(lv) {
        if (lv === 1) return "Tụ cầu Chakra Vĩ Thú đen tím hút quái vào tâm rồi nổ văng ra mép map.";
        if (lv === 2) return "Tăng lực hút trọng lực và +30% bán kính nổ Vĩ Thú Ngọc.";
        if (lv === 3) return "Tăng sát thương phát nổ lên +40%.";
        if (lv === 4) return "Hút cả quái tinh anh và làm chậm quái sau vụ nổ.";
        if (lv === 5) return "Đạt cấp 5★! Quả cầu hủy diệt nuốt trọn bầy quái vật.";
        return "Đạt cấp tối đa!";
    }
};
// Alias tương thích cũ 'rasengan'
window.JutsuCatalog.rasengan = window.JutsuCatalog.bijuu_dama;

// 18. Phi Lôi Thần Thuật (Teleport Trap)
window.JutsuCatalog.teleport_trap = {
    id: 'teleport_trap',
    type: 'active',
    name: 'Bí Thuật: Phi Lôi Thần Thuật',
    icon: '⚡',
    category: 'Không Gian Nhẫn Thuật',
    color: '#eab308',
    maxLevel: 5,
    pairId: 'cooldown',
    pairName: 'Kết Ấn',
    pairIcon: '📜',
    evolution: {
        id: 'hiraishin_vohan',
        name: 'Hiraishin Vô Hạn',
        icon: '🔱',
        category: 'Thức Tỉnh 6★ • Thời Không Thuật',
        desc: 'Lướt dịch chuyển liên tục không hồi chiêu, kích nổ bẫy bùa nổ xung quanh chiến trường.'
    },
    getDesc(lv) {
        if (lv === 1) return "Lướt dịch chuyển tức thời né đòn và để lại bẫy nổ tại vị trí xuất phát.";
        if (lv === 2) return "Tăng phạm vi dịch chuyển và tăng sát thương bẫy nổ.";
        if (lv === 3) return "Đặt đồng thời 2 bẫy nổ liên hoàn.";
        if (lv === 4) return "Giảm -25% thời gian hồi chiêu Phi Lôi Thần.";
        if (lv === 5) return "Đạt cấp 5★! Dịch chuyển chớp nhoáng thả bẫy nổ khắp nơi.";
        return "Đạt cấp tối đa!";
    }
};

// 19. Hắc Hỏa Amaterasu
window.JutsuCatalog.amaterasu = {
    id: 'amaterasu',
    type: 'active',
    name: 'Đồng Thuật: Hắc Hỏa Amaterasu',
    icon: '🖤',
    category: 'Mangekyou Sharingan',
    color: '#581c87',
    maxLevel: 5,
    pairId: 'duration',
    pairName: 'Thời Gian',
    pairIcon: '⏳',
    evolution: {
        id: 'amaterasu_phan_diet',
        name: 'Amaterasu Hắc Diễm Phần Diệt',
        icon: '🔥',
        category: 'Thức Tỉnh 6★ • Hắc Hỏa Bất Diệt',
        desc: 'Lửa đen bất diệt tự động lan truyền sang quái vật xung quanh thiêu rụi toàn map.'
    },
    getDesc(lv) {
        if (lv === 1) return "Thiêu đốt kẻ địch bằng ngọn lửa đen vĩnh cửu không bao giờ tắt.";
        if (lv === 2) return "Tăng tốc độ thiêu đốt và đốt 2 mục tiêu cùng lúc.";
        if (lv === 3) return "Ngọn lửa đen bốc cháy dữ dội gây thêm sát thương phần trăm máu.";
        if (lv === 4) return "Đốt cháy 3 mục tiêu nguy hiểm nhất trên màn hình.";
        if (lv === 5) return "Đạt cấp 5★! Hắc diễm bao trùm biến bầy quái thành tro bụi.";
        return "Đạt cấp tối đa!";
    }
};

// 20. Chakra Hộ Thể (Force Field)
window.JutsuCatalog.force_field = {
    id: 'force_field',
    type: 'active',
    name: 'Bí Thuật: Chakra Hộ Thể',
    icon: '🛡️',
    category: 'Bí Thuật Phòng Ngự',
    color: '#eab308',
    maxLevel: 5,
    pairId: 'hp',
    pairName: 'Thể Lực',
    pairIcon: '💚',
    evolution: {
        id: 'cuuvi_kimcuong',
        name: 'Cửu Vĩ Kim Cương Giới',
        icon: '🦊',
        category: 'Thức Tỉnh 6★ • Cửu Vĩ Chakra',
        desc: 'Linh thể Cửu Vĩ khổng lồ bao bọc đẩy lùi mọi quái vật và miễn nhiễm sát thương.'
    },
    getDesc(lv) {
        if (lv === 1) return "Vòng khiên Chakra xoay quanh người triệt tiêu đòn đánh và đẩy lùi quái.";
        if (lv === 2) return "Mở rộng bán kính khiên Chakra và tăng sức chống chịu.";
        if (lv === 3) return "Gây sát thương liên tục cho mọi kẻ địch cố chạm vào khiên.";
        if (lv === 4) return "Khiên tự phục hồi nhanh hơn khi bị quái tấn công.";
        if (lv === 5) return "Đạt cấp 5★! Vòng bảo hộ Chakra vững như bàn thạch.";
        return "Đạt cấp tối đa!";
    }
};
// Alias tương thích cũ 'clones'
window.JutsuCatalog.clones = window.JutsuCatalog.force_field;

// ============================================================================
// HỆ THỐNG CẬP NHẬT & HIỆU ỨNG VẼ CANVAS BÍ THUẬT & HẮC ÁM (PIXELFX STYLE)
// ============================================================================
window.SecretArtsJutsu = {
    bijuuOrbs: [],
    teleportTraps: [],
    blackFlames: [],

    update(dt, game) {
        const p = game.player;
        if (!p) return;
        const cdMult = p.cooldownMult || 1;
        const areaMult = p.areaMultiplier || 1;
        const dameMult = p.damageMultiplier || 1;
        p.cooldowns = p.cooldowns || {};

        // 17. Cập nhật Vĩ Thú Ngọc (Bijuu Dama / Rasengan)
        const bjLv = p.skills.bijuu_dama || p.skills.rasengan || 0;
        if (bjLv > 0) {
            p.cooldowns.bijuu_dama = (p.cooldowns.bijuu_dama || 0) - dt;
            if (p.cooldowns.bijuu_dama <= 0) {
                const isEvo = bjLv >= 6 || p.evolvedSkills?.bijuu_dama || p.evolvedSkills?.rasengan;
                p.cooldowns.bijuu_dama = (isEvo ? 2.5 : Math.max(2.0, 4.2 - bjLv * 0.35)) * cdMult;

                const target = game.findNearestEnemy ? game.findNearestEnemy(p.x, p.y, 550) : null;
                const tx = target ? target.x : p.x + (p.facing === -1 ? -200 : 200);
                const ty = target ? target.y : p.y;

                this.bijuuOrbs.push({
                    x: p.x,
                    y: p.y,
                    tx: tx,
                    ty: ty,
                    radius: (isEvo ? 36 : 18 + bjLv * 2) * areaMult,
                    blastRadius: (isEvo ? 180 : 85 + bjLv * 12) * areaMult,
                    damage: Math.round((isEvo ? 320 : 80 + bjLv * 24) * dameMult),
                    life: 1.2,
                    isEvo: isEvo,
                    imploding: false
                });
            }
        }

        for (let i = this.bijuuOrbs.length - 1; i >= 0; i--) {
            const bo = this.bijuuOrbs[i];
            bo.life -= dt;
            // Bay về phía mục tiêu
            bo.x += (bo.tx - bo.x) * dt * 4.5;
            bo.y += (bo.ty - bo.y) * dt * 4.5;

            // Hút quái vào tâm quả cầu
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                const d = Math.hypot(e.x - bo.x, e.y - bo.y);
                if (d < bo.blastRadius * 1.3) {
                    e.x += (bo.x - e.x) * dt * 3.5;
                    e.y += (bo.y - e.y) * dt * 3.5;
                }
            }

            if (bo.life <= 0) {
                // Nổ tung diện rộng
                if (window.Camera) window.Camera.shake(bo.isEvo ? 0.6 : 0.35, bo.isEvo ? 16 : 9);
                for (let j = 0; j < game.enemies.length; j++) {
                    const e = game.enemies[j];
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - bo.x, e.y - bo.y);
                    if (d < bo.blastRadius + e.radius) {
                        window.DamageSystem.damageEnemy(game, e, bo.damage, true, 26);
                    }
                }
                if (game.spawnExplosionParticles) {
                    game.spawnExplosionParticles(bo.x, bo.y, bo.isEvo ? '#f59e0b' : '#a855f7', 36);
                    game.spawnExplosionParticles(bo.x, bo.y, '#000000', 20);
                }
                this.bijuuOrbs.splice(i, 1);
            }
        }

        // 18. Cập nhật Phi Lôi Thần Thuật (Teleport Trap)
        const tpLv = p.skills.teleport_trap || 0;
        if (tpLv > 0) {
            p.cooldowns.teleport_trap = (p.cooldowns.teleport_trap || 0) - dt;
            if (p.cooldowns.teleport_trap <= 0) {
                const isEvo = tpLv >= 6 || p.evolvedSkills?.teleport_trap;
                p.cooldowns.teleport_trap = (isEvo ? 0.8 : Math.max(1.2, 3.5 - tpLv * 0.35)) * cdMult;

                // Để lại bẫy nổ tại chỗ cũ
                this.teleportTraps.push({
                    x: p.x,
                    y: p.y,
                    damage: Math.round((isEvo ? 180 : 50 + tpLv * 16) * dameMult),
                    radius: (isEvo ? 90 : 55) * areaMult,
                    life: 4.5,
                    isEvo: isEvo
                });

                // Dịch chuyển người chơi tiến lên trước một quãng
                const ang = p.facing === -1 ? Math.PI : 0;
                p.x += Math.cos(ang) * (isEvo ? 160 : 110);
                p.y += Math.sin(ang) * (isEvo ? 160 : 110);
                if (window.SFXController) window.SFXController.dash();
            }
        }

        for (let i = this.teleportTraps.length - 1; i >= 0; i--) {
            const trap = this.teleportTraps[i];
            trap.life -= dt;

            // Kích nổ khi quái giẫm vào
            let triggered = false;
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                if (Math.hypot(e.x - trap.x, e.y - trap.y) < trap.radius + e.radius) {
                    triggered = true;
                    break;
                }
            }

            if (triggered || trap.life <= 0) {
                if (triggered) {
                    for (let j = 0; j < game.enemies.length; j++) {
                        const e = game.enemies[j];
                        if (e.dead) continue;
                        if (Math.hypot(e.x - trap.x, e.y - trap.y) < trap.radius + e.radius) {
                            window.DamageSystem.damageEnemy(game, e, trap.damage, true, 12);
                        }
                    }
                    if (game.spawnExplosionParticles) {
                        game.spawnExplosionParticles(trap.x, trap.y, '#facc15', 18);
                    }
                }
                this.teleportTraps.splice(i, 1);
            }
        }

        // 19. Cập nhật Hắc Hỏa Amaterasu
        const amLv = p.skills.amaterasu || 0;
        if (amLv > 0) {
            p.cooldowns.amaterasu = (p.cooldowns.amaterasu || 0) - dt;
            if (p.cooldowns.amaterasu <= 0 && game.enemies.length > 0) {
                const isEvo = amLv >= 6 || p.evolvedSkills?.amaterasu;
                p.cooldowns.amaterasu = (isEvo ? 1.0 : Math.max(1.2, 3.2 - amLv * 0.3)) * cdMult;

                const count = isEvo ? 4 : (amLv >= 4 ? 3 : (amLv >= 2 ? 2 : 1));
                const living = game.enemies.filter(e => !e.dead);
                for (let k = 0; k < count && k < living.length; k++) {
                    const e = living[k];
                    this.blackFlames.push({
                        enemyId: e.id,
                        x: e.x,
                        y: e.y,
                        damage: Math.round((isEvo ? 35 : 12 + amLv * 4) * dameMult),
                        life: isEvo ? 8.0 : 5.0,
                        isEvo: isEvo
                    });
                }
            }
        }

        for (let i = this.blackFlames.length - 1; i >= 0; i--) {
            const bf = this.blackFlames[i];
            bf.life -= dt;

            // Tìm quái mang ngọn lửa đen
            const e = game.enemies.find(en => en.id === bf.enemyId && !en.dead);
            if (e) {
                bf.x = e.x;
                bf.y = e.y;
                window.DamageSystem.damageEnemy(game, e, bf.damage * dt * 2.5, false, 0);

                // Bản 6★: Lửa đen tự động lan sang quái gần nhất
                if (bf.isEvo && Math.random() < 0.04) {
                    const near = game.enemies.find(en => !en.dead && en.id !== e.id && Math.hypot(en.x - e.x, en.y - e.y) < 140);
                    if (near && this.blackFlames.length < 12) {
                        this.blackFlames.push({
                            enemyId: near.id,
                            x: near.x,
                            y: near.y,
                            damage: bf.damage,
                            life: 5.0,
                            isEvo: true
                        });
                    }
                }
            } else {
                this.blackFlames.splice(i, 1);
            }
        }

        // 20. Cập nhật Chakra Hộ Thể (Force Field / Clones)
        const ffLv = p.skills.force_field || p.skills.clones || 0;
        if (ffLv > 0) {
            const isEvo = ffLv >= 6 || p.evolvedSkills?.force_field || p.evolvedSkills?.clones;
            const shieldRadius = (isEvo ? 65 : 38 + ffLv * 4) * areaMult;

            // Đẩy lùi quái áp sát
            for (let j = 0; j < game.enemies.length; j++) {
                const e = game.enemies[j];
                if (e.dead) continue;
                const d = Math.hypot(e.x - p.x, e.y - p.y);
                if (d < shieldRadius + e.radius) {
                    const toAng = Math.atan2(e.y - p.y, e.x - p.x);
                    e.x += Math.cos(toAng) * 15;
                    e.y += Math.sin(toAng) * 15;
                    window.DamageSystem.damageEnemy(game, e, Math.round((isEvo ? 35 : 12 + ffLv * 3) * dameMult * dt * 3), false, 4);
                }
            }
        }
    },

    // Vẽ Canvas 2D các hiệu ứng Bí Thuật & Hắc Ám
    render(ctx, camX, camY, game) {
        // 1. Vẽ Bẫy Phi Lôi Thần
        for (let i = 0; i < this.teleportTraps.length; i++) {
            const tr = this.teleportTraps[i];
            const tx = tr.x - camX, ty = tr.y - camY;

            ctx.save();
            ctx.strokeStyle = tr.isEvo ? "#facc15" : "#38bdf8";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(tx, ty, tr.radius * 0.45, 0, Math.PI * 2);
            ctx.stroke();

            // Ký hiệu bùa chú Phi Lôi Thần
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("忍", tx, ty + 4);
            ctx.restore();
        }

        // 2. Vẽ Vĩ Thú Ngọc
        for (let i = 0; i < this.bijuuOrbs.length; i++) {
            const bo = this.bijuuOrbs[i];
            const bx = bo.x - camX, by = bo.y - camY;

            ctx.save();
            // Hào quang tím đen
            const g = ctx.createRadialGradient(bx, by, 2, bx, by, bo.radius);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.35, bo.isEvo ? '#facc15' : '#c084fc');
            g.addColorStop(0.75, '#581c87');
            g.addColorStop(1, '#000000');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(bx, by, bo.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 3. Vẽ Hắc Hỏa Amaterasu
        for (let i = 0; i < this.blackFlames.length; i++) {
            const bf = this.blackFlames[i];
            const fx = bf.x - camX, fy = bf.y - camY;

            ctx.save();
            ctx.fillStyle = "#09090b";
            ctx.shadowColor = "#7e22ce";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(fx, fy - 12, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#581c87";
            ctx.beginPath();
            ctx.arc(fx + (Math.random() - 0.5) * 6, fy - 16, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Vẽ Chakra Hộ Thể (Force Field / Cửu Vĩ Kim Cương Giới)
        const p = game ? game.player : null;
        const ffLv = p ? (p.skills.force_field || p.skills.clones || 0) : 0;
        if (p && ffLv > 0) {
            const isEvo = ffLv >= 6 || p.evolvedSkills?.force_field || p.evolvedSkills?.clones;
            const px = p.x - camX, py = p.y - camY;
            const rad = (isEvo ? 65 : 38 + ffLv * 4);
            const time = game.elapsedTime || 0;

            ctx.save();
            ctx.strokeStyle = isEvo ? "#f59e0b" : "#fbbf24";
            ctx.lineWidth = isEvo ? 4.5 : 2.5;
            ctx.shadowColor = isEvo ? "#d97706" : "#fef08a";
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(px, py, rad + Math.sin(time * 8) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Màn Chakra trong suốt
            ctx.fillStyle = isEvo ? "rgba(245, 158, 11, 0.12)" : "rgba(251, 191, 36, 0.08)";
            ctx.beginPath();
            ctx.arc(px, py, rad, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
};

window.CloneSkill = window.SecretArtsJutsu;
