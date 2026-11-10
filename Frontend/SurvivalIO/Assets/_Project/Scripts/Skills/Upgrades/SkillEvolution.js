/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Upgrades/SkillEvolution.js
   MA TRẬN 20 COMBO TIẾN HÓA 6★ (SKILL EVOLUTIONS) & CƠ CHẾ NÂNG CẤP
   ============================================================================ */

window.SkillEvolution = {
    // 20 Cặp Combo Tiến Hóa 6★ Chuẩn Tuyệt Đối
    recipes: [
        // Hệ Hỏa
        { activeId: 'fireball', passiveId: 'area', evoId: 'haohoadictkhuoc', name: 'Hỏa Độn: Hào Hỏa Diệt Khước' },
        { activeId: 'flamethrower', passiveId: 'duration', evoId: 'hoalong_thanhoa', name: 'Hỏa Long Thần Hỏa' },
        { activeId: 'meteor', passiveId: 'dame', evoId: 'diabocthientinh', name: 'Địa Bộc Thiên Tinh' },
        { activeId: 'fire_tornado', passiveId: 'speed', evoId: 'hoalong_cuongphong', name: 'Hỏa Long Cuồng Phong' },

        // Hệ Lôi
        { activeId: 'chidori', passiveId: 'cooldown', evoId: 'kirin_storm', name: 'Lôi Thần Kirin Bão Tố' },
        { activeId: 'lightning_strike', passiveId: 'crit', evoId: 'loithiet_thanphat', name: 'Lôi Thiết Thần Phạt' },
        { activeId: 'lightning_armor', passiveId: 'armor', evoId: 'loithe_lucdao', name: 'Lôi Thể Lục Đạo' },
        { activeId: 'plasma_orb', passiveId: 'magnet', evoId: 'loicau_trungkich', name: 'Lôi Cầu Trùng Kích' },

        // Hệ Băng & Thủy
        { activeId: 'ice_spikes', passiveId: 'hp', evoId: 'bangson_tuyetquoc', name: 'Băng Sơn Tuyết Quốc' },
        { activeId: 'icicle_rain', passiveId: 'duration', evoId: 'baotuyet_haku', name: 'Tuyệt Kỹ Bão Tuyết Haku' },
        { activeId: 'water_jet', passiveId: 'regen', evoId: 'daihaitrieu', name: 'Thủy Độn: Đại Hải Triều' },
        { activeId: 'tidal_wave', passiveId: 'area', evoId: 'daithuyboc', name: 'Thủy Độn: Đại Thủy Bộc' },

        // Thể Thuật, Kiếm Thuật & Vũ Khí
        { activeId: 'sword_combo', passiveId: 'speed', evoId: 'philoi_vankiem', name: 'Phi Lôi Thần Vạn Kiếm' },
        { activeId: 'dash_strike', passiveId: 'dame', evoId: 'lucdao_thantockiem', name: 'Lục Đạo Thần Tốc Kiếm' },
        { activeId: 'earth_smash', passiveId: 'armor', evoId: 'dahac_batmon', name: 'Dạ Hạc Bát Môn Độn Giáp' },
        { activeId: 'shuriken', passiveId: 'crit', evoId: 'phongma_phanthuc', name: 'Phong Ma Phi Tiêu Ảnh Phân Thân' },

        // Bí Thuật Không Gian & Hắc Ám
        { activeId: 'bijuu_dama', passiveId: 'dame', evoId: 'sieu_rasenshuriken', name: 'Siêu Vĩ Thú Rasenshuriken' },
        { activeId: 'rasengan', passiveId: 'dame', evoId: 'sieu_rasenshuriken', name: 'Siêu Vĩ Thú Rasenshuriken' },
        { activeId: 'teleport_trap', passiveId: 'cooldown', evoId: 'hiraishin_vohan', name: 'Hiraishin Vô Hạn' },
        { activeId: 'amaterasu', passiveId: 'duration', evoId: 'amaterasu_phan_diet', name: 'Amaterasu Hắc Diễm Phần Diệt' },
        { activeId: 'force_field', passiveId: 'hp', evoId: 'cuuvi_kimcuong', name: 'Cửu Vĩ Kim Cương Giới' },
        { activeId: 'clones', passiveId: 'hp', evoId: 'cuuvi_kimcuong', name: 'Cửu Vĩ Kim Cương Giới' }
    ],

    // Kiểm tra xem kỹ năng có thỏa mãn điều kiện tiến hóa 6★ không
    canEvolve(activeId, playerSkills) {
        if (!playerSkills) return false;
        const recipe = this.recipes.find(r => r.activeId === activeId);
        if (!recipe) return false;
        const actLv = playerSkills[recipe.activeId] || 0;
        const passLv = playerSkills[recipe.passiveId] || playerSkills[this.getPassiveAlias(recipe.passiveId)] || 0;
        return (actLv >= 5) && (passLv >= 1) && (actLv < 6);
    },

    getPassiveAlias(id) {
        const map = {
            dame: 'uyluc', uyluc: 'dame',
            speed: 'thuanthan', thuanthan: 'speed',
            cooldown: 'ketan', ketan: 'cooldown',
            magnet: 'hutchakra', hutchakra: 'magnet',
            hp: 'theluc', theluc: 'hp'
        };
        return map[id] || id;
    },

    // Lấy thông tin công thức tiến hóa
    getRecipeForActive(activeId) {
        return this.recipes.find(r => r.activeId === activeId) || null;
    },

    // Xử lý khi người chơi chọn thẻ nâng cấp hoặc tiến hóa
    selectSkillUpgrade(skillId, isEvolution, game) {
        const p = game.player;
        if (!p) return;

        p.skills = p.skills || {};
        p.evolvedSkills = p.evolvedSkills || {};

        if (isEvolution) {
            // Thức tỉnh 6★ Siêu Cấp
            p.skills[skillId] = 6;
            p.evolvedSkills[skillId] = true;

            // Xử lý alias
            if (skillId === 'bijuu_dama' || skillId === 'rasengan') {
                p.skills.bijuu_dama = 6;
                p.skills.rasengan = 6;
                p.evolvedSkills.bijuu_dama = true;
                p.evolvedSkills.rasengan = true;
            } else if (skillId === 'force_field' || skillId === 'clones') {
                p.skills.force_field = 6;
                p.skills.clones = 6;
                p.evolvedSkills.force_field = true;
                p.evolvedSkills.clones = true;
            }

            if (window.SFXController) window.SFXController.summonReveal();
            if (window.Camera) window.Camera.shake(0.6, 16);

            const evoInfo = window.JutsuCatalog[skillId]?.evolution;
            const evoTitle = evoInfo ? evoInfo.name : '🌟 THỨC TỈNH 6★ MAX';
            game.addFloatingText(p.x, p.y - 50, `🌟 EVOLUTION 6★: ${evoTitle}!`, '#facc15', 24);
            if (game.spawnExplosionParticles) {
                game.spawnExplosionParticles(p.x, p.y, '#f59e0b', 40);
                game.spawnExplosionParticles(p.x, p.y, '#ffffff', 25);
            }
        } else {
            // Nâng cấp 1-5 sao
            const isNew = (p.skills[skillId] || 0) === 0;
            p.skills[skillId] = (p.skills[skillId] || 0) + 1;

            const catalogItem = window.JutsuCatalog[skillId];
            if (isNew && catalogItem) {
                if (catalogItem.type === 'active') {
                    p.acquiredActive = p.acquiredActive || [];
                    if (!p.acquiredActive.includes(skillId)) p.acquiredActive.push(skillId);
                } else if (catalogItem.type === 'passive') {
                    p.acquiredPassive = p.acquiredPassive || [];
                    if (!p.acquiredPassive.includes(skillId)) p.acquiredPassive.push(skillId);
                }
            }

            if (window.StatsPassive && catalogItem?.type === 'passive') {
                window.StatsPassive.apply(skillId, p);
            }
        }

        if (window.LevelUpModal) window.LevelUpModal.hide();
        game.state = window.GameStates.PLAYING;
        if (window.HUDView) window.HUDView.update(p, game);
    }
};

window.EvolutionSystem = window.SkillEvolution;
