/* ============================================================================
   MODULE: src/UI/UpgradeModal.js
   Render Bảng Cường Hóa Thiên Phú 13 Thuộc Tính Dạng Lưới Grid 3 Cột Chuẩn PokéSurvivor
   Tự động khởi tạo & Quản lý DOM độc lập
   ============================================================================ */

window.UpgradeModal = {
    element: null,

    init() {
        if (this.element) return;

        const html = `
        <div id="modalUpgrades" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                    <div class="flex items-center gap-2.5">
                        <span class="text-3xl drop-shadow">⚡</span>
                        <div>
                            <h3 class="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wide">
                                CƯỜNG HÓA THIÊN PHÚ NHẪN GIẢ
                            </h3>
                            <p class="text-[11px] text-slate-300">13 Thuộc tính chuyên sâu chuẩn PokéSurvivor • Tự động lưu & cộng dồn vào trận chiến</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="top-badge-pill border border-amber-500/70 px-3 py-1 flex items-center gap-1.5 bg-slate-900/90 shadow">
                            <span class="text-sm">🪙</span>
                            <div class="flex items-baseline gap-1">
                                <span id="talentRyoDisplay" class="font-black text-amber-300 text-xs sm:text-sm font-mono">24,500</span>
                                <span class="text-[10px] font-extrabold text-amber-400/80">RYO</span>
                            </div>
                        </div>
                        <button class="btn-close-upgrade-modal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                    </div>
                </div>
                
                <!-- Danh sách 13 Thuộc Tính Dạng Lưới Grid 3 Cột -->
                <div id="talentsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 max-h-[68vh] overflow-y-auto pr-1"></div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span class="flex items-center gap-1">💡 <strong class="text-amber-300">Mẹo:</strong> Nâng đều Đổi Thẻ, Tự Lành và Bạo Kích để dễ dàng vượt qua phút thứ 5!</span>
                    <span class="text-slate-500 font-mono">13 THUỘC TÍNH</span>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('modalUpgrades');

        // Gắn sự kiện đóng
        this.element.querySelector('.btn-close-upgrade-modal').addEventListener('click', () => this.hide());
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.hide();
        });
    },

    show() {
        if (!this.element) this.init();
        if (window.SFXController) window.SFXController.uiOpen();
        this.render();
        this.element.classList.add('open');
    },

    hide() {
        if (this.element) this.element.classList.remove('open');
        if (window.SFXController) window.SFXController.uiClick();
    },

    render() {
        if (!this.element) this.init();
        const container = document.getElementById('talentsContainer');
        if (!container) return;

        const talentRyoEl = document.getElementById('talentRyoDisplay');
        if (talentRyoEl) {
            talentRyoEl.textContent = window.StorageManager.data.ryo.toLocaleString();
        }

        let html = '';
        for (let i = 0; i < window.TalentDefinitions.length; i++) {
            const t = window.TalentDefinitions[i];
            const lv = window.StorageManager.data.talents[t.id] || 0;
            const isMax = lv >= t.maxLevel;
            const cost = isMax ? 0 : Math.floor(t.baseCost * Math.pow(t.costMult, lv));
            const canAfford = !isMax && window.StorageManager.data.ryo >= cost;

            // Vạch tiến độ pips
            let pipsHtml = '';
            for (let j = 0; j < t.maxLevel; j++) {
                pipsHtml += `<div class="talent-pip ${j < lv ? 'active' : ''}"></div>`;
            }

            html += `
                <div class="talent-grid-card ${isMax ? 'talent-maxed' : ''}">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <div class="talent-icon-slot">${t.icon}</div>
                                <div class="min-w-0">
                                    <div class="text-sm font-black text-white truncate flex items-center gap-1.5">
                                        <span>${t.name}</span>
                                        <span class="text-[10px] text-amber-400 font-bold">(${t.subtitle})</span>
                                    </div>
                                    <div class="text-[10px] text-slate-400 truncate">${t.desc}</div>
                                </div>
                            </div>
                            <span class="text-xs font-black font-mono ${isMax ? 'text-emerald-400' : 'text-amber-300'} px-2 py-0.5 rounded-md bg-slate-950/70 border ${isMax ? 'border-emerald-500/50' : 'border-amber-400/30'} flex-shrink-0">
                                ${lv}/${t.maxLevel}
                            </span>
                        </div>

                        <div class="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 mb-1">
                            ${t.bonus}
                        </div>

                        <div class="talent-pip-bar">
                            ${pipsHtml}
                        </div>
                    </div>

                    <div class="pt-2 border-t border-slate-800/80 mt-1">
                        ${isMax ? `
                            <button class="btn-talent-buy max-level" disabled>
                                <span>✓</span> <span>TỐI ĐA (MAX)</span>
                            </button>
                        ` : `
                            <button onclick="window.TalentTree.buyUpgrade('${t.id}')" class="btn-talent-buy ${canAfford ? 'can-buy' : 'cant-afford'}">
                                <span>🪙</span>
                                <span>${cost.toLocaleString()} RYO</span>
                            </button>
                        `}
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    }
};

