/* ============================================================================
   MODULE: src/UI/LevelUpModal.js
   Render 3 Thẻ Nhẫn Thuật Dạng Cuộn Trục Bí Kíp + Icon Gợi Ý Combo Thức Tỉnh 6★
   Tự động khởi tạo & Quản lý DOM độc lập
   ============================================================================ */

window.LevelUpModal = {
    element: null,

    init() {
        if (this.element) return;

        const html = `
        <div id="levelUpModal" class="hidden fixed inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div class="max-w-4xl w-full bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-2xl text-center">
                <div class="inline-block px-4 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-300 text-xs font-bold uppercase tracking-widest mb-1">
                    ⚡ CHAKRA ĐỘT PHÁ
                </div>
                <h2 class="text-2xl sm:text-4xl font-black text-amber-400 mb-1">
                    LĨNH NGỘ NHẪN THUẬT MỚI!
                </h2>
                <p id="levelUpSubtitle" class="text-xs sm:text-sm text-slate-300 mb-5">
                    Hãy chọn 1 trong 3 Bí Kíp Nhẫn Thuật dưới đây:
                </p>

                <!-- Danh sách 3 Thẻ Nhẫn Thuật -->
                <div id="skillCardsContainer" class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left"></div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('levelUpModal');
    },

    show(game) {
        if (!this.element) this.init();
        const p = game.player;
        const rankTitle = window.getNinjaRankTitle(p.level);
        const subEl = document.getElementById('levelUpSubtitle');
        if (subEl) {
            subEl.innerHTML = `Danh hiệu hiện tại: <span class="text-amber-300 font-extrabold">${rankTitle} (Lv.${p.level})</span> — Hãy chọn 1 Bí Kíp Đột Phá Nhẫn Giả:`;
        }

        this.renderCards(game);
        this.element.classList.remove('hidden');
    },

    hide() {
        if (this.element) this.element.classList.add('hidden');
    },

    renderCards(game) {
        if (!this.element) this.init();
        const container = document.getElementById('skillCardsContainer');
        if (!container) return;

        const chosenCards = window.LevelUpManager.generateOptions(game);
        const p = game.player;
        container.innerHTML = '';

        if (chosenCards.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-8 text-center bg-slate-900/80 border border-amber-500/40 rounded-2xl p-6">
                    <div class="text-4xl mb-2">🏆</div>
                    <h3 class="text-lg font-black text-amber-300 uppercase">CẢNH GIỚI TỐI CAO ĐÃ ĐẠT!</h3>
                    <p class="text-xs text-slate-300 mt-1">Toàn bộ 5 Ô Nhẫn Thuật & 5 Ô Thuộc Tính đã đạt cảnh giới tối thượng hoặc đã bị phong ấn.</p>
                    <button id="btnCloseMaxLevelUp" class="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition cursor-pointer">
                        Tiếp Tục Chiến Đấu ➔
                    </button>
                </div>
            `;
            const btnClose = document.getElementById('btnCloseMaxLevelUp');
            if (btnClose) {
                btnClose.onclick = () => {
                    this.hide();
                    game.state = window.GameStates.PLAYING;
                };
            }
        } else {
            for (let i = 0; i < chosenCards.length; i++) {
                const cardData = chosenCards[i];
                const isEvo = cardData.isEvolution;
                const canBan = !isEvo && (game.remainingBans || 0) > 0;

                const pairOwned = (p.skills[cardData.pairId] || 0) > 0;
                const synergyText = pairOwned 
                    ? `🔗 ${cardData.pairIcon} ${cardData.pairName} (ĐÃ CÓ)`
                    : `🔗 ${cardData.pairIcon} ${cardData.pairName}`;

                const badgeClass = isEvo 
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 border-amber-300 font-black animate-pulse"
                    : (cardData.isNew 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50" 
                        : "bg-amber-500/20 text-amber-300 border-amber-400/50");

                const cardEl = document.createElement('div');
                cardEl.className = `ninja-scroll-card ${isEvo ? 'card-awakened-6star' : ''} p-5 flex flex-col justify-between cursor-pointer group`;
                cardEl.innerHTML = `
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-4xl drop-shadow filter ${isEvo ? 'scale-110 drop-shadow-[0_0_12px_#f59e0b]' : ''}">${cardData.icon}</span>
                            <div class="flex items-center gap-1.5">
                                ${canBan ? `
                                    <button class="btn-ban-card px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/60 hover:bg-rose-600 text-rose-300 hover:text-white text-[10px] font-black tracking-wider transition" title="Phong ấn chiêu này vĩnh viễn trong trận">
                                        🚫 CẤM (${game.remainingBans})
                                    </button>
                                ` : ''}
                                <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${badgeClass}">
                                    ${cardData.badgeText}
                                </span>
                            </div>
                        </div>
                        <div class="text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isEvo ? 'text-amber-300 font-extrabold' : 'text-slate-400'} mb-1">
                            ${cardData.category}
                        </div>
                        <h3 class="text-lg font-black ${isEvo ? 'text-yellow-300 text-xl' : 'text-white'} mb-2 group-hover:text-amber-300 transition-colors">
                            ${cardData.name}
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                            ${cardData.desc}
                        </p>
                    </div>

                    <div class="relative z-10 pt-2 border-t border-slate-800/80 mt-auto">
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <span class="text-[10px] font-bold text-slate-400">MẢNH GHÉP COMBO:</span>
                            <div class="synergy-combo-badge ${pairOwned ? 'synergy-owned' : ''}" title="Mảnh ghép mở khóa thức tỉnh 6★ Siêu Cấp">
                                <span>${synergyText}</span>
                            </div>
                        </div>

                        <button class="btn-pick-jutsu w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition ${isEvo ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:brightness-125 text-slate-950 font-black ring-2 ring-yellow-300' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'}">
                            ${isEvo ? '⚡ KÍCH HOẠT THỨC TỈNH 6★' : '⚡ Lĩnh Ngộ Nhẫn Thuật'}
                        </button>
                    </div>
                `;

                // Xử lý nút Ban
                const banBtn = cardEl.querySelector('.btn-ban-card');
                if (banBtn) {
                    banBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (window.SFXController) window.SFXController.ban();
                        game.bannedSkills = game.bannedSkills || new Set();
                        game.bannedSkills.add(cardData.id);
                        game.remainingBans = Math.max(0, game.remainingBans - 1);
                        game.addFloatingText(game.player.x, game.player.y - 30, `🚫 PHONG ẤN: ${cardData.name}`, '#f43f5e', 15);
                        this.renderCards(game);
                    });
                }

                // Xử lý chọn kỹ năng
                cardEl.addEventListener('click', () => {
                    window.EvolutionSystem.selectSkillUpgrade(cardData.id, isEvo, game);
                });

                container.appendChild(cardEl);
            }
        }

        // Action footer Reroll & Ban stats
        let actionFooter = document.getElementById('levelUpActionFooter');
        if (!actionFooter) {
            actionFooter = document.createElement('div');
            actionFooter.id = 'levelUpActionFooter';
            actionFooter.className = "flex items-center justify-between flex-wrap gap-2 pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400";
            container.parentElement.appendChild(actionFooter);
        }

        const rerollsLeft = game.remainingRerolls || 0;
        const bansLeft = game.remainingBans || 0;
        const totalBannedCount = (game.bannedSkills ? game.bannedSkills.size : 0);

        actionFooter.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="flex items-center gap-1.5 text-slate-300">
                    🎲 Lượt Đổi Thẻ: <strong class="${rerollsLeft > 0 ? 'text-amber-400' : 'text-slate-500'} font-mono">${rerollsLeft}</strong>
                </span>
                <span class="text-slate-600">|</span>
                <span class="flex items-center gap-1.5 text-slate-300">
                    🚫 Lượt Phong Ấn: <strong class="${bansLeft > 0 ? 'text-rose-400' : 'text-slate-500'} font-mono">${bansLeft}</strong>
                    ${totalBannedCount > 0 ? `<span class="text-slate-400">(${totalBannedCount} đã cấm)</span>` : ''}
                </span>
            </div>
            <div>
                <button id="btnRerollSkills" class="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition ${rerollsLeft > 0 ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md cursor-pointer' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}">
                    <span>🎲</span>
                    <span>Đổi Thẻ (Reroll)</span>
                </button>
            </div>
        `;

        const btnReroll = document.getElementById('btnRerollSkills');
        if (btnReroll && rerollsLeft > 0) {
            btnReroll.onclick = () => {
                if (window.SFXController) window.SFXController.reroll();
                game.remainingRerolls--;
                this.renderCards(game);
            };
        }
    }
};

