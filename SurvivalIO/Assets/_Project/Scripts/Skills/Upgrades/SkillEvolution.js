/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Upgrades/SkillEvolution.js
   Chuyên Xử Lý Công Thức Thức Tỉnh 6★ Siêu Cấp & Cơ Chế Nâng Cấp Kỹ Năng
   ============================================================================ */

window.SkillEvolution = {
    // Công thức ghép đôi tiến hóa 6★
    recipes: [
        { activeId: 'shuriken', passiveId: 'uyluc', evoId: 'kunai_storm' },
        { activeId: 'rasengan', passiveId: 'hutchakra', evoId: 'rasenshuriken' },
        { activeId: 'chidori', passiveId: 'thuanthan', evoId: 'kirin' },
        { activeId: 'fireball', passiveId: 'ketan', evoId: 'haohoadictkhuoc' },
        { activeId: 'clones', passiveId: 'theluc', evoId: 'datrongphanthuc' }
    ],

    // Kiểm tra xem kỹ năng có đủ điều kiện tiến hóa 6★ không
    canEvolve(activeId, playerSkills) {
        if (!playerSkills) return false;
        const recipe = this.recipes.find(r => r.activeId === activeId);
        if (!recipe) return false;
        return (playerSkills[recipe.activeId] >= 5) && ((playerSkills[recipe.passiveId] || 0) >= 1) && (playerSkills[recipe.activeId] < 6);
    },

    // Lấy thông tin công thức tiến hóa của một kỹ năng
    getRecipeForActive(activeId) {
        return this.recipes.find(r => r.activeId === activeId) || null;
    },

    // Xử lý khi người chơi chọn thẻ nâng cấp hoặc thức tỉnh
    selectSkillUpgrade(skillId, isEvolution, game) {
        const p = game.player;
        if (!p) return;

        if (isEvolution) {
            // Thức tỉnh 6★ Siêu Cấp
            p.skills[skillId] = 6;
            p.evolvedSkills = p.evolvedSkills || {};
            p.evolvedSkills[skillId] = true;

            if (window.SFXController) window.SFXController.summonReveal();
            if (window.Camera) window.Camera.shake(0.5, 14);

            const evoInfo = window.JutsuCatalog[skillId]?.evolution;
            const evoTitle = evoInfo ? evoInfo.name : 'THỨC TỈNH 6★';
            game.addFloatingText(p.x, p.y - 45, `🌟 ${evoTitle}!`, '#facc15', 22);
            game.spawnExplosionParticles(p.x, p.y, '#f59e0b', 36);
            game.spawnExplosionParticles(p.x, p.y, '#ffffff', 20);

            if (skillId === 'clones') {
                if (window.CloneSkill) window.CloneSkill.sync(game);
                else if (window.SkillManager) window.SkillManager.syncClones(game);
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

            if (skillId === 'clones') {
                if (window.CloneSkill) window.CloneSkill.sync(game);
                else if (window.SkillManager) window.SkillManager.syncClones(game);
            } else if (window.StatsPassive) {
                window.StatsPassive.apply(skillId, p);
            }
        }

        if (window.LevelUpModal) window.LevelUpModal.hide();
        game.state = window.GameStates.PLAYING;
        if (window.HUDView) window.HUDView.update(p, game);
    }
};

// Aliases cho các tham chiếu cũ
window.EvolutionSystem = window.SkillEvolution;

