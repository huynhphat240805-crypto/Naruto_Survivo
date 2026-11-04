/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Controllers/SkillManager.js
   Bộ Điều Khiển Quản Lý Tung Chiêu & Thời Gian Hồi Chiêu Cooldown Toàn Bộ Nhẫn Thuật
   ============================================================================ */

window.SkillManager = {
    // Đồng bộ số lượng phân thân Kage Bunshin
    syncClones(game) {
        if (window.CloneSkill) {
            window.CloneSkill.sync(game);
        }
    },

    // Tự động thi triển các Nhẫn Thuật trong trận
    updateAutoSkills(dt, game) {
        if (!game || !game.player) return;

        // 1. Cập nhật Phi Tiêu Kunai
        if (window.KunaiSkill) {
            window.KunaiSkill.update(dt, game);
        }

        // 2. Cập nhật Rasengan
        if (window.RasenganSkill) {
            window.RasenganSkill.update(dt, game);
        }

        // 3. Cập nhật Hỏa Độn Hào Hỏa Cầu
        if (window.FireballSkill) {
            window.FireballSkill.update(dt, game);
        }

        // 4. Cập nhật Lôi Độn Chidori & Kỳ Lân
        if (window.ChidoriSkill) {
            window.ChidoriSkill.update(dt, game);
        }

        // 5. Cập nhật Kage Bunshin Phân Thân Chi Thuật
        if (window.CloneSkill) {
            window.CloneSkill.update(dt, game);
        }
    },

    // Chuyển tiếp lựa chọn nâng cấp / thức tỉnh sang SkillEvolution
    selectSkillUpgrade(skillId, isEvolution, game) {
        if (window.SkillEvolution) {
            window.SkillEvolution.selectSkillUpgrade(skillId, isEvolution, game);
        }
    }
};

// Aliases cho tương thích toàn diện
window.SkillSystem = window.SkillManager;
if (window.EvolutionSystem) {
    window.EvolutionSystem.updateAutoSkills = window.SkillManager.updateAutoSkills;
    window.EvolutionSystem.syncClones = window.SkillManager.syncClones;
}

