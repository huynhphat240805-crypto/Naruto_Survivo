/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/UI/Upgrade/UpgradeModal.js
   Render Bảng Cường Hóa Thiên Phú 13 Thuộc Tính Dạng Thẻ Bài Anime Ninja RPG
   - Lưới Grid 3 Cột (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
   - Mỗi Thẻ: Bo Góc rounded-xl, Viền Vàng Kim Mờ, Nền Tối rgba(15, 23, 42, 0.85)
   - 3 Hàng Phân Tầng Chuẩn Xác:
     * Hàng 1: [Icon Vuông Nhỏ] + [Tên & Mô Tả] + [Huy Hiệu Cấp Độ 0/5]
     * Hàng 2: [Chỉ Số Tăng Xanh Ngọc Bảo] + [Vạch Tiến Trình Pips Bar]
     * Hàng 3: [Nút Nâng Cấp Dạng Viên Thuốc (Pill-shaped) + Icon 🪙 + Giá Ryo]
   ============================================================================ */

window.UpgradeModal = {
    element: null,

    init() {
        if (this.element) return;

        const html = `
        <div id="modalUpgrades" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <!-- Header Bảng Cường Hóa -->
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                    <div class="flex items-center gap-2.5">
                        <span class="text-3xl drop-shadow-[0_0_10px_#f59e0b]">⚡</span>
                        <div>
                            <h3 class="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wide drop-shadow">
                                CƯỜNG HÓA THIÊN PHÚ NHẪN GIẢ
                            </h3>
                            <p class="text-[11px] text-slate-300">13 Thuộc tính chuyên sâu • Tự động lưu & vĩnh viễn cộng dồn vào mọi trận chiến</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2.5">
                        <div class="top-badge-pill border border-amber-500/70 px-3.5 py-1.5 flex items-center gap-2 bg-slate-900/90 shadow-[0_0_12px_rgba(245,158,11,0.3)] rounded-full">
                            <span class="text-base drop-shadow">🪙</span>
                            <div class="flex items-baseline gap-1">
                                <span id="talentRyoDisplay" class="font-black text-amber-300 text-sm font-mono">0</span>
                                <span class="text-[10px] font-extrabold text-amber-400/80">RYO</span>
                            </div>
                        </div>
                        <button class="btn-close-upgrade-modal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer" title="Đóng">✕</button>
                    </div>
                </div>
                
                <!-- Danh sách 13 Thuộc Tính Dạng Lưới Grid 3 Cột Sang Trọng -->
                <div id="talentsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3 max-h-[66vh] overflow-y-auto pr-1"></div>

                <!-- Chân Trang Mẹo & Thống Kê -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span class="flex items-center gap-1.5">💡 <strong class="text-amber-300">Mẹo:</strong> Nâng đều Đổi Thẻ, Tự Lành và Bạo Kích để dễ dàng vượt qua phút thứ 5!</span>
                    <span class="text-slate-400 font-mono font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60">13 THUỘC TÍNH</span>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('modalUpgrades');

        // Gắn sự kiện đóng
        const btnClose = this.element.querySelector('.btn-close-upgrade-modal');
        if (btnClose) btnClose.addEventListener('click', () => this.hide());
        
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.hide();
        });
    },

    show() {
        if (!this.element) this.init();
        if (window.SFXController && window.SFXController.uiOpen) window.SFXController.uiOpen();
        this.render();
        this.element.classList.add('open');
    },

    hide() {
        if (this.element) this.element.classList.remove('open');
        if (window.SFXController && window.SFXController.uiClick) window.SFXController.uiClick();
    },

    render() {
        if (!this.element) this.init();
        const container = document.getElementById('talentsContainer');
        if (!container) return;

        const currentRyo = window.StorageManager?.data?.ryo || 0;
        const talentRyoEl = document.getElementById('talentRyoDisplay');
        if (talentRyoEl) {
            talentRyoEl.textContent = currentRyo.toLocaleString();
        }

        const talentDefs = window.TalentDefinitions || [];
        let html = '';

        for (let i = 0; i < talentDefs.length; i++) {
            const t = talentDefs[i];
            const lv = window.StorageManager?.data?.talents?.[t.id] || 0;
            const isMax = lv >= t.maxLevel;
            const cost = isMax ? 0 : Math.floor(t.baseCost * Math.pow(t.costMult, lv));
            const canAfford = !isMax && currentRyo >= cost;

            // Vạch tiến độ pips
            let pipsHtml = '';
            for (let j = 0; j < t.maxLevel; j++) {
                pipsHtml += `<div class="talent-pip ${j < lv ? 'active' : ''}"></div>`;
            }

            html += `
                <div class="talent-grid-card ${isMax ? 'talent-maxed' : ''}">
                    <!-- HÀNG 1: Header Card [Icon] + [Tên & Mô Tả] + [Huy Hiệu Cấp Độ] -->
                    <div class="talent-card-header">
                        <div class="talent-icon-slot">${t.icon}</div>
                        <div class="talent-info-block">
                            <div class="talent-title-text">
                                <span>${t.name}</span>
                                <span class="talent-subtitle-tag">(${t.subtitle})</span>
                            </div>
                            <div class="talent-desc-text" title="${t.desc}">${t.desc}</div>
                        </div>
                        <div class="talent-level-badge ${isMax ? 'maxed' : ''}">
                            ${lv}/${t.maxLevel}
                        </div>
                    </div>

                    <!-- HÀNG 2: Chỉ Số Tăng & Vạch Tiến Trình (Pips Bar) -->
                    <div class="talent-card-body">
                        <div class="talent-bonus-chip">
                            <span>✦</span>
                            <span>${t.bonus}</span>
                        </div>
                        <div class="talent-pip-bar">
                            ${pipsHtml}
                        </div>
                    </div>

                    <!-- HÀNG 3: Nút Nâng Cấp Dạng Viên Thuốc (Pill-shaped Button) -->
                    <div class="talent-card-action">
                        ${isMax ? `
                            <button class="btn-talent-buy max-level" disabled>
                                <span>✓</span>
                                <span>TỐI ĐA (MAX)</span>
                            </button>
                        ` : `
                            <button onclick="window.TalentTree.buyUpgrade('${t.id}')" 
                                    class="btn-talent-buy ${canAfford ? 'can-buy' : 'cant-afford'}"
                                    ${!canAfford ? 'title="Chưa đủ Ryo để nâng cấp"' : ''}>
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

// Tự động khởi tạo khi tài liệu sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.UpgradeModal.init());
} else {
    window.UpgradeModal.init();
}
