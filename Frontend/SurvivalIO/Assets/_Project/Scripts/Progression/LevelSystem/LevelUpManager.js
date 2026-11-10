/* ============================================================================
   MODULE: src/Progression/LevelUpManager.js
   Quản lý Thăng Cấp (Level Up), Cơ Chế 5 Ô Nhẫn Thuật + 5 Ô Thuộc Tính & Tuyển Chọn 3 Thẻ
   ============================================================================ */

window.LevelUpManager = {
    // Kích hoạt khi đầy thanh Chakra EXP
    triggerLevelUp(game) {
        if (window.SFXController) window.SFXController.levelUp();
        const p = game.player;
        p.exp -= p.expToNext;
        p.level++;
        p.expToNext = Math.round(p.expToNext * 1.28 + 10);
        p.hp = Math.min(p.maxHp, p.hp + 20);

        game.state = window.GameStates.LEVEL_UP;

        if (window.LevelUpModal) {
            window.LevelUpModal.show(game);
        }
    },

    // Thu thập 3 thẻ đề xuất theo luật 5 Ô Nhẫn Thuật + 5 Ô Thuộc Tính & Thức Tỉnh 6★
    generateOptions(game) {
        const p = game.player;
        const banned = game.bannedSkills || new Set();
        const uniqueEntries = window.getUniqueCatalogEntries();

        // 1. Kiểm tra số lượng slots đang sở hữu
        const activeOwned = uniqueEntries.filter(sk => sk.type === 'active' && (p.skills[sk.id] || 0) > 0);
        const passiveOwned = uniqueEntries.filter(sk => sk.type === 'passive' && (p.skills[sk.id] || 0) > 0);

        const isFullActive = activeOwned.length >= 5;
        const isFullPassive = passiveOwned.length >= 5;

        // 2. Thu thập Thẻ Thức Tỉnh 6★ (Active 5★ + Passive tương ứng ≥1★)
        const evolutionCandidates = [];
        for (let i = 0; i < uniqueEntries.length; i++) {
            const sk = uniqueEntries[i];
            if (sk.type === 'active' && (p.skills[sk.id] || 0) === 5 && !p.evolvedSkills?.[sk.id]) {
                const pairLv = p.skills[sk.pairId] || 0;
                if (pairLv >= 1 && !banned.has(sk.id)) {
                    evolutionCandidates.push({
                        id: sk.id,
                        isEvolution: true,
                        name: sk.evolution.name,
                        icon: sk.evolution.icon,
                        category: sk.evolution.category,
                        color: '#f59e0b',
                        desc: sk.evolution.desc,
                        badgeText: "🌟 THỨC TỈNH 6★ MAX",
                        pairId: sk.pairId,
                        pairName: sk.pairName,
                        pairIcon: window.JutsuCatalog[sk.pairId]?.icon || '✨'
                    });
                }
            }
        }

        // 3. Thu thập thẻ nâng cấp thông thường
        const regularPool = uniqueEntries.filter(sk => {
            if (banned.has(sk.id)) return false;
            const currLv = p.skills[sk.id] || 0;
            if (currLv >= sk.maxLevel) return false;

            if (currLv === 0) {
                if (sk.type === 'active' && isFullActive) return false;
                if (sk.type === 'passive' && isFullPassive) return false;
            }
            return true;
        }).map(sk => {
            const currLv = p.skills[sk.id] || 0;
            const nextLv = currLv + 1;
            return {
                id: sk.id,
                isEvolution: false,
                name: sk.name,
                icon: sk.icon,
                category: sk.category,
                color: sk.color,
                desc: sk.getDesc(nextLv),
                badgeText: currLv === 0 ? "✨ CHIÊU MỚI!" : `NÂNG CẤP LV.${nextLv}`,
                isNew: currLv === 0,
                nextLv: nextLv,
                pairId: sk.pairId,
                pairName: sk.pairName,
                pairIcon: sk.pairIcon
            };
        });

        // 4. Chọn 3 thẻ xuất hiện
        let chosenCards = [];
        if (evolutionCandidates.length > 0) {
            const evo = evolutionCandidates.sort(() => Math.random() - 0.5)[0];
            chosenCards.push(evo);
        }

        const shuffledRegular = regularPool.filter(c => !chosenCards.some(ec => ec.id === c.id)).sort(() => Math.random() - 0.5);
        while (chosenCards.length < 3 && shuffledRegular.length > 0) {
            chosenCards.push(shuffledRegular.pop());
        }

        return chosenCards.sort(() => Math.random() - 0.5);
    }
};

