/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Admin/AdminGM.js
   BỘ ĐIỀU KHIỂN GAME MASTER SANDBOX (GM SANDBOX) & QUẢN TRỊ TOÀN DIỆN
   - Phòng tập bất tử: Sát thương quái & Boss = chính xác 0 Dame, không Game Over
   - Quản lý Nhẫn thuật với đủ 30 ảnh Icon PNG chuẩn từ Textures/Icons/
   - Bơm tiền Ryo/Cuộn nhanh, Quản trị Giftcode ngay dưới menu phải
   - Triệu hồi Boss/Quái, Spam chiêu 0s Cooldown, Thức tỉnh 6★
   ============================================================================ */

window.GM_STATE = {
    godMode: true,          // Mặc định Bất tử trong Sandbox
    dummyMode: false,       // Bù nhìn thử đòn (quái vô hạn máu)
    noCooldown: false,      // Spam 0s hồi chiêu
    showAllSkillsOnLevelUp: false // Mở tất cả kỹ năng khi up cấp
};

window.AdminGM = {
    isInitialized: false,
    panelElement: null,
    floatingBtn: null,
    skillSearchQuery: '',
    skillFilterType: 'all',

    // Bảng Ánh Xạ Đúng Chuẩn 30 File Icon PNG trong Textures/Icons/
    SKILL_ICON_PNG_MAP: {
        // Nhẫn thuật Hệ Hỏa (Fire)
        'fireball': 'icon_fireball.png',
        'flamethrower': 'icon_flamethrower.png',
        'meteor': 'icon_meteor.png',
        'fire_tornado': 'icon_fire_tornado.png',

        // Nhẫn thuật Hệ Lôi (Lightning)
        'chidori': 'icon_chain_lightning.png',
        'lightning_strike': 'icon_kirin_thiin.png',
        'kirin': 'icon_kirin_thiin.png',
        'lightning_armor': 'icon_lightning_armor.png',
        'plasma_orb': 'icon_plasma_orb.png',

        // Nhẫn thuật Hệ Băng & Thủy (Ice & Water)
        'ice_spikes': 'icon_ice_spikes.png',
        'icicle_rain': 'icon_icicle_rain.png',
        'water_jet': 'icon_water_jet.png',
        'tidal_wave': 'icon_tidal_wave.png',

        // Thể thuật, Kiếm thuật & Vũ khí (Weapons & Taijutsu)
        'sword_combo': 'icon_sword_combo.png',
        'dash_strike': 'icon_dash_strike.png',
        'earth_smash': 'icon_earth_smash.png',
        'shuriken': 'icon_shuriken_volley.png',

        // Bí thuật Không gian & Hắc ám (Space & Secret Arts)
        'bijuu_dama': 'icon_bijuu_dama.png',
        'rasengan': 'icon_bijuu_dama.png',
        'teleport_trap': 'icon_hiraishin.png',
        'hiraishin': 'icon_hiraishin.png',
        'amaterasu': 'icon_amaterasu.png',
        'force_field': 'icon_chakra_barrier.png',
        'clones': 'icon_chakra_barrier.png',

        // 10 Thuộc tính Bổ trợ Bị động (10 Passives)
        'area': 'icon_passive_area.png',
        'duration': 'icon_passive_duration.png',
        'dame': 'icon_passive_attack.png',
        'uyluc': 'icon_passive_attack.png',
        'speed': 'icon_passive_speed.png',
        'thuanthan': 'icon_passive_speed.png',
        'cooldown': 'icon_passive_cooldown.png',
        'ketan': 'icon_passive_cooldown.png',
        'crit': 'icon_passive_crit.png',
        'armor': 'icon_passive_armor.png',
        'magnet': 'icon_passive_magnet.png',
        'hutchakra': 'icon_passive_magnet.png',
        'hp': 'icon_passive_hp.png',
        'theluc': 'icon_passive_hp.png',
        'regen': 'icon_passive_regen.png'
    },

    getSkillIconUrl(skillId) {
        if (!skillId) return '';
        const cleanId = String(skillId).toLowerCase().trim();
        const fileName = this.SKILL_ICON_PNG_MAP[cleanId];
        if (!fileName) return '';
        return 'SurvivalIO/Assets/_Project/Textures/Icons/' + fileName;
    },

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        console.log("⚡ [AdminGM]: Khởi tạo Game Master Sandbox Controller...");

        // 1. Chèn Nút [+] cạnh Ryo & Cuộn trên Lobby
        this.injectPlusButtons();

        // 2. Chèn Nút [👑 Quản Trị Giftcode] ngay dưới nút Giftcode ở menu phải
        this.injectAdminGiftcodeButton();

        // 3. Chèn Modals Quản trị & Nhập Giftcode
        this.injectGiftcodeModals();

        // 4. Chèn Modals Bơm Tiền Nhanh
        this.injectCurrencyModal();

        // 5. Chèn GM Sandbox Panel Trong Trận Đấu
        this.injectBattlePanel();

        // 6. Cài đặt Hooks vào hệ thống Core Game (0 Dame quái, Bất tử, Game Over chặn)
        this.installGameHooks();

        // 7. Vòng lặp liên tục duy trì 0 Dame, Bất tử & No Cooldown
        this.startLoop();
    },

    // =========================================================================
    // 1. NÚT DẤU CỘNG [+] CẠNH RYO & CUỘN TRÊN LOBBY
    // =========================================================================
    injectPlusButtons() {
        const tryInject = () => {
            const ryoEl = document.getElementById('topRyoCount');
            const scrollEl = document.getElementById('topScrollCount');

            if (ryoEl && !document.getElementById('gmAddRyoBtn')) {
                const ryoBtn = document.createElement('button');
                ryoBtn.id = 'gmAddRyoBtn';
                ryoBtn.className = 'gm-plus-btn';
                ryoBtn.title = 'Bơm tiền Ryo tùy ý';
                ryoBtn.innerHTML = '+';
                ryoBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.openCurrencyModal('ryo');
                };
                ryoEl.parentElement.appendChild(ryoBtn);
            }

            if (scrollEl && !document.getElementById('gmAddScrollBtn')) {
                const scrollBtn = document.createElement('button');
                scrollBtn.id = 'gmAddScrollBtn';
                scrollBtn.className = 'gm-plus-btn';
                scrollBtn.title = 'Bơm Cuộn Triệu Hồi tùy ý';
                scrollBtn.innerHTML = '+';
                scrollBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.openCurrencyModal('scrolls');
                };
                scrollEl.parentElement.appendChild(scrollBtn);
            }
        };

        tryInject();
        setTimeout(tryInject, 400);
        setTimeout(tryInject, 1200);
    },

    // =========================================================================
    // 2. NÚT [👑 QUẢN TRỊ GIFTCODE] DƯỚI NÚT GIFTCODE Ở MENU PHẢI
    // =========================================================================
    injectAdminGiftcodeButton() {
        const tryInject = () => {
            const giftcodeBtn = document.getElementById('btnMenuGiftcode');
            if (!giftcodeBtn || document.getElementById('btnMenuAdminGiftcode')) return;

            const adminBtn = document.createElement('button');
            adminBtn.id = 'btnMenuAdminGiftcode';
            adminBtn.className = 'obsidian-menu-card lobby-nav-card menu-item menu-card-item group border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.35)] bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-950/95 transition-all hover:scale-102';
            adminBtn.innerHTML = `
                <div class="obsidian-icon-pod menu-icon-box flex items-center justify-center bg-gradient-to-br from-yellow-500/30 to-amber-700/40 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                    <span class="text-xl drop-shadow group-hover:scale-125 transition-transform duration-200">👑</span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                    <span class="obsidian-menu-title font-black text-amber-300 leading-tight group-hover:text-yellow-200 transition-colors flex items-center gap-1.5">
                        Quản Trị Giftcode
                        <span class="px-1.5 py-0.2 rounded text-[8.5px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 uppercase tracking-tighter shadow">ADMIN</span>
                    </span>
                    <span class="obsidian-menu-desc text-amber-400/80 truncate">Tạo mã quà, cấp Ryo, Cuộn & Mảnh</span>
                </div>
                <span class="obsidian-chevron text-amber-400">›</span>
            `;

            adminBtn.addEventListener('click', () => {
                if (window.SFXController && typeof window.SFXController.uiOpen === 'function') {
                    window.SFXController.uiOpen();
                }
                this.openGiftcodeAdminModal();
            });

            // Chèn ngay bên dưới nút Giftcode
            giftcodeBtn.insertAdjacentElement('afterend', adminBtn);
        };

        tryInject();
        setTimeout(tryInject, 400);
        setTimeout(tryInject, 1200);
    },

    // =========================================================================
    // 3. MODAL BƠM TIỀN RYO & CUỘN TRIỆU HỒI
    // =========================================================================
    injectCurrencyModal() {
        if (document.getElementById('gmCurrencyModal')) return;

        const modal = document.createElement('div');
        modal.id = 'gmCurrencyModal';
        modal.className = 'gm-modal-backdrop hidden';
        modal.innerHTML = `
            <div class="gm-modal-card" style="max-width: 440px;">
                <div class="gm-modal-header">
                    <div class="gm-modal-title">
                        <span id="gmCurrencyModalIcon">🪙</span>
                        <span id="gmCurrencyModalTitle">BƠM TIỀN NHANH</span>
                    </div>
                    <button class="gm-icon-btn" onclick="AdminGM.closeCurrencyModal()">✕</button>
                </div>
                <div class="gm-modal-body">
                    <div class="gm-form-group">
                        <label class="gm-form-label" id="gmCurrencyModalLabel">Nhập số lượng muốn cộng:</label>
                        <input type="number" id="gmCurrencyInput" class="gm-form-input font-mono font-bold text-base" placeholder="Ví dụ: 50000" />
                        <div class="gm-quick-pills" id="gmCurrencyQuickPills"></div>
                    </div>
                    <div class="flex gap-2 justify-end mt-2">
                        <button class="gm-action-btn" onclick="AdminGM.closeCurrencyModal()">Hủy</button>
                        <button class="gm-action-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color:#0f172a; font-weight:900;" onclick="AdminGM.confirmAddCurrency()">
                            XÁC NHẬN CỘNG
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    _currentCurrencyType: 'ryo',

    openCurrencyModal(type = 'ryo') {
        this._currentCurrencyType = type;
        const modal = document.getElementById('gmCurrencyModal');
        const iconEl = document.getElementById('gmCurrencyModalIcon');
        const titleEl = document.getElementById('gmCurrencyModalTitle');
        const labelEl = document.getElementById('gmCurrencyModalLabel');
        const inputEl = document.getElementById('gmCurrencyInput');
        const pillsEl = document.getElementById('gmCurrencyQuickPills');

        if (!modal) return;

        if (type === 'ryo') {
            iconEl.textContent = '🪙';
            titleEl.textContent = 'BƠM TIỀN RYO (GAME MASTER)';
            labelEl.textContent = 'Nhập số tiền Ryo muốn cộng thêm:';
            inputEl.value = '50000';
            pillsEl.innerHTML = `
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='10000'">+10,000</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='50000'">+50,000</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='100000'">+100,000</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='1000000'">+1,000,000</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='9999999'">MAX 9.9M</button>
            `;
        } else {
            iconEl.textContent = '📜';
            titleEl.textContent = 'BƠM CUỘN TRIỆU HỒI (GAME MASTER)';
            labelEl.textContent = 'Nhập số cuộn triệu hồi muốn cộng thêm:';
            inputEl.value = '50';
            pillsEl.innerHTML = `
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='10'">+10 Cuộn</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='50'">+50 Cuộn</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='100'">+100 Cuộn</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='500'">+500 Cuộn</button>
                <button class="gm-pill-btn" onclick="document.getElementById('gmCurrencyInput').value='9999'">MAX 9,999</button>
            `;
        }

        modal.classList.remove('hidden');
        inputEl.focus();
    },

    closeCurrencyModal() {
        const modal = document.getElementById('gmCurrencyModal');
        if (modal) modal.classList.add('hidden');
    },

    confirmAddCurrency() {
        const inputEl = document.getElementById('gmCurrencyInput');
        const val = parseInt(inputEl?.value, 10) || 0;
        if (val <= 0) {
            alert('Vui lòng nhập số dương lớn hơn 0!');
            return;
        }

        if (window.StorageManager && window.StorageManager.data) {
            const d = window.StorageManager.data;
            if (this._currentCurrencyType === 'ryo') {
                d.ryo = (d.ryo || 0) + val;
            } else {
                d.scrolls = (d.scrolls || 0) + val;
            }
            window.StorageManager.save();

            if (window.LobbyMenuView) {
                if (typeof window.LobbyMenuView.syncStats === 'function') window.LobbyMenuView.syncStats();
                if (typeof window.LobbyMenuView.renderShopItems === 'function') window.LobbyMenuView.renderShopItems();
            }

            if (window.SFXController && typeof window.SFXController.levelUp === 'function') {
                window.SFXController.levelUp();
            }
        }

        this.closeCurrencyModal();
    },

    // =========================================================================
    // 4. QUẢN TRỊ GIFTCODE & NHẬP GIFTCODE MODALS
    // =========================================================================
    injectGiftcodeModals() {
        // Modal 1: Bảng Quản Trị Giftcode (Admin)
        if (!document.getElementById('gmAdminGiftcodeModal')) {
            const modalAdmin = document.createElement('div');
            modalAdmin.id = 'gmAdminGiftcodeModal';
            modalAdmin.className = 'gm-modal-backdrop hidden';
            modalAdmin.innerHTML = `
                <div class="gm-modal-card" style="max-width: 680px;">
                    <div class="gm-modal-header">
                        <div class="gm-modal-title">
                            <span>👑</span>
                            <span>BẢNG QUẢN TRỊ GIFTCODE (GAME MASTER)</span>
                        </div>
                        <button class="gm-icon-btn" onclick="AdminGM.closeGiftcodeAdminModal()">✕</button>
                    </div>
                    <div class="gm-modal-body">
                        <!-- Form Tạo Mã Mới -->
                        <div class="gm-section">
                            <div class="gm-section-title">
                                <span>➕ TẠO MÃ GIFTCODE MỚI</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Mã Code (Tự động in hoa):</label>
                                    <input type="text" id="gmGiftInputCode" class="gm-form-input font-mono font-bold uppercase" placeholder="Ví dụ: NARUTO2026" />
                                </div>
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Tên / Ghi chú sự kiện:</label>
                                    <input type="text" id="gmGiftInputName" class="gm-form-input" placeholder="Ví dụ: Quà Tân Thủ Máy Chủ Mới" />
                                </div>
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Số Ryo:</label>
                                    <input type="number" id="gmGiftInputRyo" class="gm-form-input" value="50000" />
                                </div>
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Số Cuộn Triệu Hồi:</label>
                                    <input type="number" id="gmGiftInputScrolls" class="gm-form-input" value="20" />
                                </div>
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Tướng Thưởng Mảnh:</label>
                                    <select id="gmGiftInputNinja" class="gm-form-select">
                                        <option value="naruto">Naruto (Hiếm)</option>
                                        <option value="sasuke">Sasuke (Hiếm)</option>
                                        <option value="sakura">Sakura (Hiếm)</option>
                                        <option value="gaara">Gaara (Hiếm)</option>
                                        <option value="kakashi">Kakashi (Sử Thi)</option>
                                        <option value="jiraiya">Jiraiya (Sử Thi)</option>
                                        <option value="itachi">Itachi (Sử Thi)</option>
                                        <option value="minato">Minato (Huyền Thoại)</option>
                                        <option value="madara">Madara (Huyền Thoại)</option>
                                        <option value="pain">Pain (Huyền Thoại)</option>
                                    </select>
                                </div>
                                <div class="gm-form-group">
                                    <label class="gm-form-label">Số Mảnh Tướng:</label>
                                    <input type="number" id="gmGiftInputShards" class="gm-form-input" value="30" />
                                </div>
                            </div>
                            <div class="flex justify-end mt-1">
                                <button class="gm-action-btn" style="background: linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:800; padding:8px 16px;" onclick="AdminGM.handleCreateGiftcode()">
                                    💾 LƯU MÃ VÀO HỆ THỐNG
                                </button>
                            </div>
                        </div>

                        <!-- Danh sách mã hiện có -->
                        <div class="gm-section">
                            <div class="gm-section-title">
                                <span>📋 DANH SÁCH MÃ QUÀ TẶNG TRONG HỆ THỐNG</span>
                                <span class="text-[10px] text-amber-300 font-normal">Lưu trong localStorage: 'naruto_giftcodes'</span>
                            </div>
                            <div class="gm-table-container">
                                <table class="gm-gift-table">
                                    <thead>
                                        <tr>
                                            <th>Mã Code</th>
                                            <th>Phần Thưởng</th>
                                            <th>Ghi Chú</th>
                                            <th>Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody id="gmGiftTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalAdmin);
        }

        // Modal 2: Khung Nhập Mã Nhận Quà (Player / Test)
        if (!document.getElementById('gmRedeemGiftcodeModal')) {
            const modalRedeem = document.createElement('div');
            modalRedeem.id = 'gmRedeemGiftcodeModal';
            modalRedeem.className = 'gm-modal-backdrop hidden';
            modalRedeem.innerHTML = `
                <div class="gm-modal-card" style="max-width: 440px;">
                    <div class="gm-modal-header">
                        <div class="gm-modal-title">
                            <span>🎟️</span>
                            <span>NHẬP MÃ QUÀ TẶNG (GIFTCODE)</span>
                        </div>
                        <button class="gm-icon-btn" onclick="AdminGM.closeGiftcodeRedeemModal()">✕</button>
                    </div>
                    <div class="gm-modal-body">
                        <div class="gm-form-group">
                            <label class="gm-form-label">Nhập mã Giftcode của bạn:</label>
                            <input type="text" id="gmRedeemInput" class="gm-form-input font-mono font-bold uppercase text-center text-base" placeholder="NHẬP MÃ TẠI ĐÂY..." />
                        </div>
                        <div id="gmRedeemResult" class="text-xs p-2.5 rounded-lg hidden font-bold text-center"></div>
                        <div class="flex gap-2 justify-end mt-2">
                            <button class="gm-action-btn" onclick="AdminGM.closeGiftcodeRedeemModal()">Đóng</button>
                            <button class="gm-action-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color:#0f172a; font-weight:900;" onclick="AdminGM.handleRedeemGiftcode()">
                                NHẬN QUÀ NGAY
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalRedeem);
        }
    },

    openGiftcodeAdminModal() {
        const modal = document.getElementById('gmAdminGiftcodeModal');
        if (!modal) return;
        this.renderGiftcodeTable();
        modal.classList.remove('hidden');
    },

    closeGiftcodeAdminModal() {
        const modal = document.getElementById('gmAdminGiftcodeModal');
        if (modal) modal.classList.add('hidden');
    },

    renderGiftcodeTable() {
        const tbody = document.getElementById('gmGiftTableBody');
        if (!tbody || !window.GiftcodeSystem) return;

        const all = window.GiftcodeSystem.getAllCodes();
        const keys = Object.keys(all);

        if (keys.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-slate-400 py-4">Chưa có mã quà tặng nào. Hãy tạo mã mới ở trên!</td></tr>`;
            return;
        }

        let html = '';
        for (const k of keys) {
            const item = all[k];
            const ninjaName = item.ninjaId ? (item.ninjaId.charAt(0).toUpperCase() + item.ninjaId.slice(1)) : '';
            html += `
                <tr>
                    <td class="font-mono font-bold text-amber-400 text-xs">${item.code}</td>
                    <td>
                        <div class="text-[11px] leading-tight text-slate-200">
                            🪙 ${item.ryo?.toLocaleString() || 0} Ryo • 📜 ${item.scrolls || 0} Cuộn
                        </div>
                        ${item.ninjaShards ? `<div class="text-[10px] text-cyan-300">🧩 +${item.ninjaShards} Mảnh ${ninjaName}</div>` : ''}
                    </td>
                    <td class="text-slate-400 text-[10px]">${item.name || item.description || ''}</td>
                    <td>
                        <div class="flex items-center gap-1.5">
                            <button class="gm-skill-btn btn-add" title="Sao chép mã" onclick="AdminGM.copyCode('${item.code}')">Copy</button>
                            <button class="gm-skill-btn btn-max" title="Nhận thử ngay" onclick="AdminGM.testClaimCode('${item.code}')">Nhận</button>
                            <button class="gm-skill-btn btn-remove" title="Xóa mã này" onclick="AdminGM.deleteGiftcode('${item.code}')">Xóa</button>
                        </div>
                    </td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    },

    handleCreateGiftcode() {
        const code = document.getElementById('gmGiftInputCode')?.value;
        const name = document.getElementById('gmGiftInputName')?.value;
        const ryo = document.getElementById('gmGiftInputRyo')?.value;
        const scrolls = document.getElementById('gmGiftInputScrolls')?.value;
        const ninjaId = document.getElementById('gmGiftInputNinja')?.value;
        const ninjaShards = document.getElementById('gmGiftInputShards')?.value;

        if (!code || !code.trim()) {
            alert('Vui lòng nhập Mã Code!');
            return;
        }

        const res = window.GiftcodeSystem.createOrUpdateCode({
            code: code,
            name: name,
            ryo: ryo,
            scrolls: scrolls,
            ninjaId: ninjaId,
            ninjaShards: ninjaShards
        });

        if (res.success) {
            alert(res.message);
            document.getElementById('gmGiftInputCode').value = '';
            document.getElementById('gmGiftInputName').value = '';
            this.renderGiftcodeTable();
        } else {
            alert(res.message);
        }
    },

    deleteGiftcode(code) {
        if (!confirm(`Bạn có chắc muốn xóa mã Giftcode [${code}]?`)) return;
        window.GiftcodeSystem.deleteCode(code);
        this.renderGiftcodeTable();
    },

    copyCode(code) {
        navigator.clipboard?.writeText(code).then(() => {
            alert(`Đã sao chép mã [${code}] vào Clipboard!`);
        }).catch(() => {
            prompt("Mã code của bạn:", code);
        });
    },

    testClaimCode(code) {
        const res = window.GiftcodeSystem.claim(code);
        alert(res.message);
        this.renderGiftcodeTable();
    },

    openGiftcodeRedeemModal() {
        const modal = document.getElementById('gmRedeemGiftcodeModal');
        const resBox = document.getElementById('gmRedeemResult');
        const input = document.getElementById('gmRedeemInput');
        if (!modal) return;
        if (resBox) resBox.classList.add('hidden');
        if (input) input.value = '';
        modal.classList.remove('hidden');
        if (input) input.focus();
    },

    closeGiftcodeRedeemModal() {
        const modal = document.getElementById('gmRedeemGiftcodeModal');
        if (modal) modal.classList.add('hidden');
    },

    handleRedeemGiftcode() {
        const input = document.getElementById('gmRedeemInput');
        const resBox = document.getElementById('gmRedeemResult');
        const code = input?.value;

        if (!window.GiftcodeSystem) return;

        const res = window.GiftcodeSystem.claim(code);
        if (resBox) {
            resBox.classList.remove('hidden');
            if (res.success) {
                resBox.className = 'text-xs p-2.5 rounded-lg font-bold text-center bg-emerald-950/80 border border-emerald-500 text-emerald-300';
                resBox.innerHTML = `
                    <div class="text-sm">🎉 ${res.message}</div>
                    <div class="mt-1 text-[11px] text-amber-300">
                        +${res.rewards.ryo?.toLocaleString() || 0} Ryo • +${res.rewards.scrolls || 0} Cuộn Triệu Hồi
                        ${res.rewards.ninjaShards ? ` • +${res.rewards.ninjaShards} Mảnh ${res.rewards.ninjaId}` : ''}
                    </div>
                `;
            } else {
                resBox.className = 'text-xs p-2.5 rounded-lg font-bold text-center bg-rose-950/80 border border-rose-500 text-rose-300';
                resBox.textContent = `❌ ${res.message}`;
            }
        }
    },

    // =========================================================================
    // 5. IN-GAME GM BATTLE PANEL (PHÒNG THÍ NGHIỆM TRONG TRẬN)
    // =========================================================================
    mountGmHudButton() {
        const slot = document.getElementById('gmHudButtonSlot');
        if (!slot) return;
        if (document.getElementById('btnGmSandboxHud')) return;

        const btn = document.createElement('button');
        btn.id = 'btnGmSandboxHud';
        btn.className = 'gm-hud-btn';
        btn.title = 'Game Master Sandbox (Phím G hoặc Click)';
        btn.innerHTML = `<span class="gm-hud-bolt">⚡</span><span class="gm-hud-label">GM SANDBOX</span>`;
        btn.onclick = (e) => {
            e.stopPropagation();
            this.toggleBattlePanel();
        };
        slot.appendChild(btn);
        this.floatingBtn = btn;
    },

    injectBattlePanel() {
        if (document.getElementById('gmBattlePanel')) return;

        // Thử gắn nút GM Sandbox vào slot HUD
        this.mountGmHudButton();

        // Panel điều khiển trung tâm GM
        const panel = document.createElement('div');
        panel.id = 'gmBattlePanel';
        panel.className = 'gm-panel-container hidden';
        panel.innerHTML = `
            <!-- Header Panel -->
            <div class="gm-panel-header" id="gmPanelDragHeader">
                <div class="gm-panel-title">
                    <span>⚡ GM BATTLE SANDBOX</span>
                    <span class="text-[10px] text-amber-300/80 font-normal">• Naruto Survivor</span>
                </div>
                <div class="gm-panel-controls">
                    <button class="gm-icon-btn" title="Thu nhỏ/Mở rộng" onclick="AdminGM.toggleMinimizePanel()">−</button>
                    <button class="gm-icon-btn" title="Đóng panel" onclick="AdminGM.closeBattlePanel()">✕</button>
                </div>
            </div>

            <!-- Nội dung Panel -->
            <div class="gm-panel-content">
                
                <!-- Hàng 4 Toggle Cơ Bản -->
                <div class="gm-toggles-grid">
                    <!-- 1. Bất Tử (0 Dame nhận) -->
                    <div id="gmToggleGodMode" class="gm-toggle-card active" onclick="AdminGM.toggleState('godMode')">
                        <span class="gm-toggle-label">🛡️ Bất Tử (0 Dame)</span>
                        <div class="gm-toggle-switch"></div>
                    </div>

                    <!-- 2. Bù Nhìn Thử Đòn -->
                    <div id="gmToggleDummyMode" class="gm-toggle-card" onclick="AdminGM.toggleState('dummyMode')">
                        <span class="gm-toggle-label">🎯 Bù Nhìn (Dummy)</span>
                        <div class="gm-toggle-switch"></div>
                    </div>

                    <!-- 3. Spam Vô Hạn (No CD) -->
                    <div id="gmToggleNoCooldown" class="gm-toggle-card" onclick="AdminGM.toggleState('noCooldown')">
                        <span class="gm-toggle-label">🔥 Spam No CD</span>
                        <div class="gm-toggle-switch"></div>
                    </div>

                    <!-- 4. Mở hết Skill khi Up Cấp -->
                    <div id="gmToggleAllSkillsLevelUp" class="gm-toggle-card" onclick="AdminGM.toggleState('showAllSkillsOnLevelUp')">
                        <span class="gm-toggle-label">📚 Mở Hết Chiêu</span>
                        <div class="gm-toggle-switch"></div>
                    </div>
                </div>

                <!-- Section 1: Hồi Chiêu & Susanoo -->
                <div class="gm-section">
                    <div class="gm-section-title">
                        <span>⚡ HỒI CHIÊU & TRẠNG THÁI</span>
                    </div>
                    <div class="gm-btn-grid">
                        <button class="gm-action-btn" onclick="AdminGM.resetAllCooldowns()">
                            <span>⚡ Hồi Chiêu Ngay (0s)</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.triggerSusanoo()">
                            <span>👑 Bật Susanoo (Space)</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.healFullPlayer()">
                            <span>💚 Hồi Đầy Máu (100%)</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.killAllEnemies()">
                            <span>🧹 Quét Sạch Quái</span>
                        </button>
                    </div>
                </div>

                <!-- Section 2: Tăng Cấp Tự Do -->
                <div class="gm-section">
                    <div class="gm-section-title">
                        <span>📈 TĂNG CẤP ĐỘ (LEVEL UP)</span>
                    </div>
                    <div class="gm-btn-grid">
                        <button class="gm-action-btn" onclick="AdminGM.addLevel(1)">
                            <span>🔼 +1 Cấp (Mở Modal)</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.addLevel(5)">
                            <span>🔼 +5 Cấp</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.setMaxLevel()">
                            <span>🌟 Cấp Tối Đa (Lv.20)</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.fillChakraExp()">
                            <span>🌀 Nạp Đầy Chakra EXP</span>
                        </button>
                    </div>
                </div>

                <!-- Section 3: Triệu Hồi Boss & Bầy Quái -->
                <div class="gm-section">
                    <div class="gm-section-title">
                        <span>👹 TRIỆU HỒI BOSS & BẦY QUÁI</span>
                    </div>
                    <div class="gm-btn-grid">
                        <button class="gm-action-btn" onclick="AdminGM.spawnBossManda()">
                            <span>🐍 Boss Orochimaru</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.spawnBossAkatsuki()">
                            <span>☁️ Boss Akatsuki</span>
                        </button>
                        <button class="gm-action-btn" onclick="AdminGM.spawnEnemyWave(20)">
                            <span>🥷 Sinh 20 Quái Thường</span>
                        </button>
                        <button class="gm-action-btn btn-danger" onclick="AdminGM.killAllEnemies()">
                            <span>💀 Tiêu Diệt Hết Quái</span>
                        </button>
                    </div>
                </div>

                <!-- Section 4: Quản Lý Nhẫn Thuật (Skill Manager) -->
                <div class="gm-section">
                    <div class="gm-section-title">
                        <span>🥷 QUẢN LÝ NHẪN THUẬT (30 ICON PNG CHUẨN)</span>
                        <span id="gmSkillCountBadge" class="text-[10px] text-amber-300">0 chiêu</span>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="gmSkillSearchInput" class="gm-skill-search" placeholder="🔍 Tìm tên chiêu thức..." oninput="AdminGM.handleSkillSearch(this.value)" />
                        <select id="gmSkillTypeFilter" class="gm-form-select text-xs py-1" onchange="AdminGM.handleSkillFilter(this.value)">
                            <option value="all">Tất cả</option>
                            <option value="active">Chủ động</option>
                            <option value="passive">Bị động</option>
                        </select>
                    </div>
                    <div class="gm-skill-list" id="gmSkillListContainer"></div>
                </div>

            </div>
        `;
        document.body.appendChild(panel);
        this.panelElement = panel;

        // Kéo thả header
        this.makeDraggable(panel, document.getElementById('gmPanelDragHeader'));

        // Phím tắt G mở nhanh GM Sandbox trong trận
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyG' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                if (window.GameManager && window.GameManager.state === window.GameStates.PLAYING) {
                    this.toggleBattlePanel();
                }
            }
        });
    },

    toggleBattlePanel() {
        if (!this.panelElement) return;
        const isHidden = this.panelElement.classList.contains('hidden');
        if (isHidden) {
            this.panelElement.classList.remove('hidden');
            this.refreshSkillList();
            const btn = document.getElementById('btnGmSandboxHud') || this.floatingBtn;
            if (btn) btn.classList.add('active');
        } else {
            this.closeBattlePanel();
        }
    },

    closeBattlePanel() {
        if (this.panelElement) this.panelElement.classList.add('hidden');
        const btn = document.getElementById('btnGmSandboxHud') || this.floatingBtn;
        if (btn) btn.classList.remove('active');
    },

    toggleMinimizePanel() {
        if (this.panelElement) {
            this.panelElement.classList.toggle('gm-minimized');
        }
    },

    toggleState(key) {
        if (window.GM_STATE[key] === undefined) return;
        window.GM_STATE[key] = !window.GM_STATE[key];

        const card = document.getElementById(`gmToggle${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (card) {
            if (window.GM_STATE[key]) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        }

        const game = window.GameManager;
        if (game && game.player && game.addFloatingText) {
            const p = game.player;
            const stateLabels = {
                godMode: 'Bất Tử (0 Dame Nhận)',
                dummyMode: 'Bù Nhìn Thử Đòn',
                noCooldown: 'Spam Vô Hạn (No Cooldown)',
                showAllSkillsOnLevelUp: 'Mở Hết Chiêu Khi Up Cấp'
            };
            const label = stateLabels[key] || key;
            const statusText = window.GM_STATE[key] ? 'ĐÃ BẬT' : 'ĐÃ TẮT';
            const color = window.GM_STATE[key] ? '#10b981' : '#ef4444';
            game.addFloatingText(p.x, p.y - 45, `⚡ [GM]: ${label} -> ${statusText}`, color, 18);
        }
    },

    // =========================================================================
    // 6. QUẢN LÝ NHẪN THUẬT (SKILL MANAGER VỚI 30 ICON PNG CHUẨN)
    // =========================================================================
    handleSkillSearch(query) {
        this.skillSearchQuery = (query || '').toLowerCase().trim();
        this.refreshSkillList();
    },

    handleSkillFilter(type) {
        this.skillFilterType = type || 'all';
        this.refreshSkillList();
    },

    refreshSkillList() {
        const container = document.getElementById('gmSkillListContainer');
        const badge = document.getElementById('gmSkillCountBadge');
        if (!container) return;

        if (typeof window.getUniqueCatalogEntries !== 'function') {
            container.innerHTML = `<div class="text-xs text-slate-400 p-2">Đang tải danh mục nhẫn thuật...</div>`;
            return;
        }

        const entries = window.getUniqueCatalogEntries();
        const game = window.GameManager;
        const player = game?.player;
        const pSkills = player?.skills || {};

        let filtered = entries.filter(item => {
            if (this.skillFilterType !== 'all' && item.type !== this.skillFilterType) return false;
            if (this.skillSearchQuery) {
                const name = (item.name || '').toLowerCase();
                const id = (item.id || '').toLowerCase();
                const cat = (item.category || '').toLowerCase();
                return name.includes(this.skillSearchQuery) || id.includes(this.skillSearchQuery) || cat.includes(this.skillSearchQuery);
            }
            return true;
        });

        if (badge) badge.textContent = `${filtered.length} chiêu`;

        if (filtered.length === 0) {
            container.innerHTML = `<div class="text-xs text-slate-400 p-3 text-center">Không tìm thấy chiêu phù hợp</div>`;
            return;
        }

        let html = '';
        for (const item of filtered) {
            const lv = pSkills[item.id] || 0;
            const isEvo = lv >= 6 || player?.evolvedSkills?.[item.id];
            const hasSkill = lv > 0;

            let pillHtml = `<span class="gm-skill-level-pill">Chưa học</span>`;
            if (isEvo) {
                pillHtml = `<span class="gm-skill-level-pill maxed">🌟 6★ MAX</span>`;
            } else if (hasSkill) {
                pillHtml = `<span class="gm-skill-level-pill active">Lv.${lv}</span>`;
            }

            const iconSrc = this.getSkillIconUrl(item.id);
            const fallbackEmoji = item.icon || '✨';

            html += `
                <div class="gm-skill-item ${hasSkill ? 'has-skill' : ''}">
                    <div class="gm-skill-info">
                        ${iconSrc ? `
                            <img src="${iconSrc}" alt="${item.name}" class="gm-skill-icon-img" onerror="this.outerHTML='<span class=\\'text-lg\\'>${fallbackEmoji}</span>'" />
                        ` : `
                            <span class="text-lg">${fallbackEmoji}</span>
                        `}
                        <div class="min-w-0 flex-1">
                            <div class="gm-skill-name" title="${item.name}">${item.name}</div>
                            <div class="text-[9.5px] text-slate-400 truncate">${item.category || (item.type === 'active' ? 'Chủ động' : 'Bị động')}</div>
                        </div>
                        ${pillHtml}
                    </div>
                    <div class="gm-skill-actions">
                        <button class="gm-skill-btn btn-add" title="Tăng 1 cấp / Thêm chiêu" onclick="AdminGM.upgradeSkill('${item.id}')">+ UP</button>
                        <button class="gm-skill-btn btn-remove" title="Giảm 1 cấp / Gỡ chiêu" onclick="AdminGM.downgradeSkill('${item.id}')">- GỠ</button>
                        <button class="gm-skill-btn btn-max" title="Thức tỉnh 6★ Max" onclick="AdminGM.maxOutSkill('${item.id}')">🌟 6★</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    upgradeSkill(skillId) {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) {
            alert('Vui lòng BẮT ĐẦU TRẬN ĐẤU để thêm/nâng cấp kỹ năng trên người nhân vật!');
            return;
        }

        player.skills = player.skills || {};
        const currLv = player.skills[skillId] || 0;
        const catalogItem = window.JutsuCatalog?.[skillId];

        if (currLv >= 6) {
            alert('Chiêu thức này đã đạt Cảnh Giới Tối Cao 6★!');
            return;
        }

        if (currLv === 5) {
            this.maxOutSkill(skillId);
            return;
        }

        player.skills[skillId] = currLv + 1;

        if (catalogItem) {
            if (catalogItem.type === 'active') {
                player.acquiredActive = player.acquiredActive || [];
                if (!player.acquiredActive.includes(skillId)) player.acquiredActive.push(skillId);
            } else if (catalogItem.type === 'passive') {
                player.acquiredPassive = player.acquiredPassive || [];
                if (!player.acquiredPassive.includes(skillId)) player.acquiredPassive.push(skillId);
                if (window.StatsPassive && typeof window.StatsPassive.apply === 'function') {
                    window.StatsPassive.apply(skillId, player);
                }
            }
        }

        if (game.addFloatingText) {
            game.addFloatingText(player.x, player.y - 35, `⚡ [GM]: ${catalogItem?.name || skillId} -> Lv.${player.skills[skillId]}`, '#38bdf8', 18);
        }

        if (window.HUDView && typeof window.HUDView.update === 'function') {
            window.HUDView.update(player, game);
        }

        this.refreshSkillList();
    },

    downgradeSkill(skillId) {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;

        player.skills = player.skills || {};
        const currLv = player.skills[skillId] || 0;
        if (currLv <= 0) return;

        const nextLv = currLv - 1;
        player.skills[skillId] = nextLv;

        if (nextLv === 0) {
            delete player.skills[skillId];
            if (player.evolvedSkills) delete player.evolvedSkills[skillId];
            if (player.acquiredActive) player.acquiredActive = player.acquiredActive.filter(id => id !== skillId);
            if (player.acquiredPassive) player.acquiredPassive = player.acquiredPassive.filter(id => id !== skillId);
        }

        const catalogItem = window.JutsuCatalog?.[skillId];
        if (catalogItem?.type === 'passive' && window.StatsPassive) {
            window.StatsPassive.apply(skillId, player);
        }

        if (game.addFloatingText) {
            game.addFloatingText(player.x, player.y - 35, `🔻 [GM]: ${catalogItem?.name || skillId} ${nextLv > 0 ? `-> Lv.${nextLv}` : 'ĐÃ GỠ BỎ'}`, '#f87171', 18);
        }

        if (window.HUDView && typeof window.HUDView.update === 'function') {
            window.HUDView.update(player, game);
        }

        this.refreshSkillList();
    },

    maxOutSkill(skillId) {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) {
            alert('Vui lòng BẮT ĐẦU TRẬN ĐẤU để kích hoạt kỹ năng!');
            return;
        }

        player.skills = player.skills || {};
        player.evolvedSkills = player.evolvedSkills || {};

        player.skills[skillId] = 6;
        player.evolvedSkills[skillId] = true;

        const catalogItem = window.JutsuCatalog?.[skillId];
        if (catalogItem?.type === 'active') {
            player.acquiredActive = player.acquiredActive || [];
            if (!player.acquiredActive.includes(skillId)) player.acquiredActive.push(skillId);
        } else if (catalogItem?.type === 'passive') {
            player.acquiredPassive = player.acquiredPassive || [];
            if (!player.acquiredPassive.includes(skillId)) player.acquiredPassive.push(skillId);
            if (window.StatsPassive) window.StatsPassive.apply(skillId, player);
        }

        // Xử lý alias đặc biệt
        if (skillId === 'rasengan' || skillId === 'bijuu_dama') {
            player.skills.rasengan = 6;
            player.skills.bijuu_dama = 6;
            player.evolvedSkills.rasengan = true;
            player.evolvedSkills.bijuu_dama = true;
        } else if (skillId === 'clones' || skillId === 'force_field') {
            player.skills.clones = 6;
            player.skills.force_field = 6;
            player.evolvedSkills.clones = true;
            player.evolvedSkills.force_field = true;
        }

        if (window.Camera && typeof window.Camera.shake === 'function') window.Camera.shake(0.5, 14);
        if (window.SFXController && typeof window.SFXController.summonReveal === 'function') window.SFXController.summonReveal();

        if (game.addFloatingText) {
            const evoTitle = catalogItem?.evolution?.name || catalogItem?.name || skillId;
            game.addFloatingText(player.x, player.y - 45, `🌟 [GM MAX 6★]: ${evoTitle}!`, '#facc15', 22);
        }

        if (window.HUDView && typeof window.HUDView.update === 'function') {
            window.HUDView.update(player, game);
        }

        this.refreshSkillList();
    },

    // =========================================================================
    // 7. LEVEL UP & EXP CONTROLS
    // =========================================================================
    addLevel(amount = 1) {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) {
            alert('Vui lòng BẮT ĐẦU TRẬN ĐẤU để tăng cấp!');
            return;
        }

        if (amount === 1) {
            if (window.LevelUpManager && typeof window.LevelUpManager.triggerLevelUp === 'function') {
                player.exp = player.expToNext || 100;
                window.LevelUpManager.triggerLevelUp(game);
            } else {
                player.level++;
            }
        } else {
            player.level += amount;
            player.hp = player.maxHp;
            if (game.addFloatingText) {
                game.addFloatingText(player.x, player.y - 40, `🔼 [GM]: +${amount} CẤP (Hiện tại Lv.${player.level})`, '#facc15', 22);
            }
        }

        this.refreshSkillList();
    },

    setMaxLevel() {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;
        player.level = 20;
        player.hp = player.maxHp;
        if (game.addFloatingText) {
            game.addFloatingText(player.x, player.y - 40, `🌟 [GM]: ĐẠT ĐỈNH CẤP ĐỘ LV.20!`, '#facc15', 24);
        }
        this.refreshSkillList();
    },

    fillChakraExp() {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;
        if (window.LevelUpManager) {
            player.exp = player.expToNext;
            window.LevelUpManager.triggerLevelUp(game);
        }
    },

    healFullPlayer() {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;
        player.hp = player.maxHp;
        if (game.addFloatingText) {
            game.addFloatingText(player.x, player.y - 35, `💚 [GM]: HỒI ĐẦY 100% SINH LỰC!`, '#34d399', 20);
        }
    },

    // =========================================================================
    // 8. HỒI CHIÊU & SUSANOO
    // =========================================================================
    resetAllCooldowns() {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;

        player.susanooCooldown = 0;
        if (player.cooldowns) {
            for (const k in player.cooldowns) {
                player.cooldowns[k] = 0;
            }
        }

        if (game.addFloatingText) {
            game.addFloatingText(player.x, player.y - 40, `⚡ [GM]: HOÀN TẤT CẢ HỒI CHIÊU!`, '#38bdf8', 22);
        }
    },

    triggerSusanoo() {
        const game = window.GameManager;
        const player = game?.player;
        if (!player) return;

        player.susanooCooldown = 0;
        if (window.PlayerController && typeof window.PlayerController.triggerSusanoo === 'function') {
            window.PlayerController.triggerSusanoo(player, game);
        }
    },

    // =========================================================================
    // 9. TRIỆU HỒI BOSS & BẦY QUÁI
    // =========================================================================
    spawnBossManda() {
        const game = window.GameManager;
        const player = game?.player;
        if (!game || !player) {
            alert('Vui lòng BẮT ĐẦU TRẬN ĐẤU để triệu hồi Boss!');
            return;
        }

        const sx = player.x + (Math.random() < 0.5 ? 240 : -240);
        const sy = player.y + (Math.random() - 0.5) * 120;

        if (window.BossManda && typeof window.BossManda.spawn === 'function') {
            window.BossManda.spawn(game, sx, sy);
        } else if (window.EnemySpawner && typeof window.EnemySpawner.spawnEnemy === 'function') {
            window.EnemySpawner.spawnEnemy(game, 'boss_manda');
        }
    },

    spawnBossAkatsuki() {
        const game = window.GameManager;
        const player = game?.player;
        if (!game || !player) {
            alert('Vui lòng BẮT ĐẦU TRẬN ĐẤU để triệu hồi Boss!');
            return;
        }

        const sx = player.x + (Math.random() < 0.5 ? 240 : -240);
        const sy = player.y + (Math.random() - 0.5) * 120;

        if (window.BossAkatsuki && typeof window.BossAkatsuki.spawn === 'function') {
            window.BossAkatsuki.spawn(game, sx, sy);
        } else if (window.EnemySpawner && typeof window.EnemySpawner.spawnEnemy === 'function') {
            window.EnemySpawner.spawnEnemy(game, 'boss_akatsuki');
        }
    },

    spawnEnemyWave(count = 20) {
        const game = window.GameManager;
        if (!game || !game.player || !window.EnemySpawner) return;

        for (let i = 0; i < count; i++) {
            window.EnemySpawner.spawnEnemy(game);
        }

        if (game.addFloatingText) {
            game.addFloatingText(game.player.x, game.player.y - 45, `🥷 [GM]: ĐÃ SINH ${count} QUÁI VẬT!`, '#fbbf24', 20);
        }
    },

    killAllEnemies() {
        const game = window.GameManager;
        if (!game || !game.enemies) return;

        const count = game.enemies.length;
        game.enemies.length = 0;

        if (game.player && game.addFloatingText) {
            game.addFloatingText(game.player.x, game.player.y - 45, `💀 [GM]: ĐÃ QUÉT SẠCH ${count} KẺ ĐỊCH!`, '#ef4444', 20);
        }
    },

    // =========================================================================
    // 10. HOOKS VÀO CORE GAME (0 DAME QUÁI, BẤT TỬ & CHẶN GAME OVER)
    // =========================================================================
    installGameHooks() {
        // 1. SET SÁT THƯƠNG QUÁI & BOSS VỀ CHÍNH XÁC 0 DAME LÊN NGƯỜI CHƠI
        if (window.DamageSystem) {
            window.DamageSystem.damagePlayer = function(game, rawDamage) {
                // Trong GM Sandbox: Người chơi nhận đúng 0 Dame, luôn giữ 100% máu
                if (game && game.player) {
                    game.player.hp = game.player.maxHp;
                }
                return 0;
            };

            // Hook Damage Enemy (Dummy Mode)
            const origDamageEnemy = window.DamageSystem.damageEnemy;
            window.DamageSystem.damageEnemy = function(game, enemy, rawDamage, knockback, sourceX, sourceY, color) {
                if (window.GM_STATE.dummyMode && enemy) {
                    // Quái bất tử máu khủng
                    enemy.maxHp = 999999999;
                    enemy.hp = 999999999;

                    const p = game.player;
                    const isCrit = Math.random() < (p ? (p.critChance || 0) : 0);
                    const critMult = isCrit ? 1.5 : 1.0;
                    const dmgMult = p ? (p.damageMultiplier || 1) : 1;
                    const dmg = Math.max(1, Math.round(rawDamage * dmgMult * critMult));

                    enemy.hitFlash = 0.08;

                    if (isCrit) {
                        if (window.SFXController) window.SFXController.crit();
                        game.addFloatingText(enemy.x, enemy.y - enemy.radius - 6, `💥 BẠO KÍCH! -${dmg}`, '#f97316', enemy.isBoss ? 20 : 15);
                    } else {
                        game.addFloatingText(enemy.x, enemy.y - enemy.radius, `-${dmg}`, color || '#fde047', enemy.isBoss ? 17 : 13);
                    }

                    if (knockback > 0 && !enemy.isBoss) {
                        const sx = sourceX !== null ? sourceX : (p ? p.x : 0);
                        const sy = sourceY !== null ? sourceY : (p ? p.y : 0);
                        const dx = enemy.x - sx;
                        const dy = enemy.y - sy;
                        const dist = Math.hypot(dx, dy) || 1;
                        enemy.x += (dx / dist) * knockback;
                        enemy.y += (dy / dist) * knockback;
                    }
                    return;
                }
                return origDamageEnemy.apply(this, arguments);
            };
        }

        // 2. CHẶN HOÀN TOÀN MÀN HÌNH GAME OVER TRONG ADMIN / GM SANDBOX
        if (window.GameManager) {
            window.GameManager.triggerGameOver = function() {
                if (this.player) this.player.hp = this.player.maxHp;
                this.state = window.GameStates.PLAYING;
                return;
            };
        }

        if (window.GameOverModal) {
            window.GameOverModal.show = function(game, earnedRyo) {
                if (game && game.player) {
                    game.player.hp = game.player.maxHp;
                    game.state = window.GameStates.PLAYING;
                }
                return;
            };
        }

        // 3. Hook Level Up Sandbox: Mở tất cả kỹ năng khi lên cấp
        if (window.LevelUpModal) {
            const origGen5 = window.LevelUpModal.generate5Options;
            window.LevelUpModal.generate5Options = function(game) {
                if (!window.GM_STATE.showAllSkillsOnLevelUp) {
                    return origGen5.apply(this, arguments);
                }

                // Chế độ GM Sandbox: Trả về toàn bộ danh mục kỹ năng để chọn tùy thích
                const entries = window.getUniqueCatalogEntries ? window.getUniqueCatalogEntries() : [];
                const p = game.player;
                const result = [];

                for (const sk of entries) {
                    const currLv = p.skills?.[sk.id] || 0;
                    if (currLv >= (sk.maxLevel || 5)) {
                        if (!p.evolvedSkills?.[sk.id] && sk.evolution) {
                            result.push({
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
                                pairIcon: window.JutsuCatalog?.[sk.pairId]?.icon || '✨'
                            });
                        }
                    } else {
                        const nextLv = currLv + 1;
                        result.push({
                            id: sk.id,
                            isEvolution: false,
                            name: sk.name,
                            icon: sk.icon,
                            category: sk.category,
                            color: sk.color || '#38bdf8',
                            desc: sk.getDesc ? sk.getDesc(nextLv) : `Nâng lên cấp ${nextLv}`,
                            badgeText: currLv === 0 ? "✨ CHIÊU MỚI!" : `NÂNG CẤP LV.${nextLv}`,
                            isNew: currLv === 0,
                            nextLv: nextLv,
                            pairId: sk.pairId,
                            pairName: sk.pairName,
                            pairIcon: sk.pairIcon
                        });
                    }
                }

                return result;
            };
        }
    },

    // =========================================================================
    // 11. VÒNG LẶP LIÊN TỤC (TICK NO COOLDOWN, 0 DAME QUÁI & GOD MODE)
    // =========================================================================
    startLoop() {
        const loop = () => {
            const game = window.GameManager;
            const player = game?.player;

            if (player) {
                // Người chơi luôn giữ 100% máu
                player.hp = player.maxHp;

                // Triệt tiêu toàn bộ sát thương quái đánh lên người chơi
                if (game.enemies) {
                    for (let i = 0; i < game.enemies.length; i++) {
                        game.enemies[i].damage = 0;
                    }
                }

                // Triệt tiêu sát thương từ đạn của địch
                if (game.projectiles) {
                    for (let i = 0; i < game.projectiles.length; i++) {
                        const pr = game.projectiles[i];
                        if (pr && (pr.type === 'kusanagi_blade' || pr.type === 'boss_projectile' || pr.subType === 'kusanagi')) {
                            pr.damage = 0;
                        }
                    }
                }

                // Spam Vô Hạn (No Cooldown)
                if (window.GM_STATE.noCooldown) {
                    player.susanooCooldown = 0;
                    if (player.cooldowns) {
                        for (const k in player.cooldowns) {
                            player.cooldowns[k] = 0;
                        }
                    }
                }
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    // =========================================================================
    // 12. HELPER KÉO THẢ PANEL
    // =========================================================================
    makeDraggable(element, handle) {
        if (!element || !handle) return;
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
};

// Tự động khởi tạo khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdminGM.init());
} else {
    window.AdminGM.init();
}
