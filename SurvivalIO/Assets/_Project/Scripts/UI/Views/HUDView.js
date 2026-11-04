/* ============================================================================
   MODULE: src/UI/HUDView.js
   Giao diện Trong Trận Đấu (HUD): Thanh Máu Glassmorphism, 2 Hàng 5+5 Slot, Đồng Hồ Anime
   Tự động khởi tạo & Quản lý DOM độc lập - Giải phóng hoàn toàn index.html
   ============================================================================ */

window.HUDView = {
    element: null,
    wasdTimeout: null,

    init() {
        if (this.element) return;

        const html = `
        <div id="hudLayer" class="hidden fixed inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-10">
            <!-- Top Bar: Thanh EXP Chakra + Thông số chính -->
            <div class="w-full max-w-6xl mx-auto flex flex-col gap-2 pointer-events-none">
                
                <!-- 1. Thanh Chakra (EXP) -->
                <div class="w-full px-1">
                    <div class="hud-exp-track">
                        <div id="expBarFill" class="hud-exp-fill" style="width: 0%;">
                            <div class="hud-exp-shimmer"></div>
                        </div>
                        <div class="absolute inset-0 flex items-center justify-between px-3 text-[11px] sm:text-xs font-bold tracking-wider drop-shadow pointer-events-none">
                            <span id="hudRankBadge" class="neon-cyan-text flex items-center gap-1.5">
                                ⚡ CẤP BẬC: HỌC VIỆN (LV.1)
                            </span>
                            <span id="hudExpText" class="text-sky-100 font-mono text-[11px] font-black">CHAKRA: 0 / 15</span>
                        </div>
                    </div>
                </div>

                <!-- 2. Hàng thông số chính -->
                <div class="flex items-start justify-between gap-2 px-1 mt-0.5">
                    
                    <!-- Khung trái: Avatar + HP + 2 hàng 5+5 Slots -->
                    <div class="hud-glass-card forehead-protector-box flex flex-col gap-2 pointer-events-auto">
                        <div class="flex items-center gap-3">
                            <div id="playerAvatarSlot" class="hud-avatar-circle flex items-center justify-center flex-shrink-0" title="Shinobi Làng Lá">
                                <span id="playerAvatarIcon" class="hud-avatar-symbol">🍥</span>
                                <div class="hud-avatar-ring-pulse"></div>
                            </div>

                            <div id="hpBarContainer" class="flex flex-col flex-1 min-w-[155px] sm:min-w-[195px] transition-transform duration-200">
                                <div class="flex justify-between items-center text-[10.5px] sm:text-xs mb-1">
                                    <span class="hud-hp-badge flex items-center gap-1.5 font-bold tracking-wider text-rose-300">
                                        <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]"></span>
                                        <span>SINH LỰC</span>
                                    </span>
                                    <span id="hudHpText" class="hud-hp-number font-mono font-medium text-amber-200/95">100 / 100</span>
                                </div>
                                <div class="hp-glass-bar-track">
                                    <div id="hpBarFill" class="hp-glass-bar-fill" style="width: 100%;">
                                        <div class="hp-glass-shimmer"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cụm 2 hàng trang bị: Nhẫn thuật (5 ô) + Thuộc tính (5 ô) -->
                        <div class="hud-equipment-slots-container flex flex-col gap-2">
                            <!-- Hàng 1: NHẪN THUẬT -->
                            <div class="flex items-center gap-2">
                                <div class="hud-slot-tag hud-tag-jutsu flex items-center justify-center gap-1.5" title="Nhẫn Thuật Tấn Công (Tối đa 5 ô)">
                                    <svg class="w-3.5 h-3.5 text-orange-400 hud-shuriken-spin flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C12 2 13 8 16 9C19 10 22 12 22 12C22 12 16 13 15 16C14 19 12 22 12 22C12 22 11 16 8 15C5 14 2 12 2 12C2 12 8 11 9 8C10 5 12 2 12 2Z"/>
                                        <circle cx="12" cy="12" r="2.5" fill="#0a0f1e"/>
                                    </svg>
                                    <span class="hud-tag-title">NHẪN THUẬT</span>
                                </div>
                                <div id="hudActiveSlotsBar" class="flex items-center gap-1.5"></div>
                            </div>

                            <!-- Hàng 2: THUỘC TÍNH -->
                            <div class="flex items-center gap-2">
                                <div class="hud-slot-tag hud-tag-passive flex items-center justify-center gap-1.5" title="Thuộc Tính Bổ Trợ (Tối đa 5 ô)">
                                    <svg class="w-3.5 h-3.5 hud-chakra-pulse flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                        <defs>
                                            <radialGradient id="chakraOrbGrad" cx="35%" cy="35%" r="65%">
                                                <stop offset="0%" stop-color="#a5f3fc"/>
                                                <stop offset="50%" stop-color="#06b6d4"/>
                                                <stop offset="100%" stop-color="#0e7490"/>
                                            </radialGradient>
                                        </defs>
                                        <circle cx="12" cy="12" r="8.5" fill="url(#chakraOrbGrad)" stroke="#38bdf8" stroke-width="1.3"/>
                                        <circle cx="9" cy="9" r="2.4" fill="#ffffff" opacity="0.8"/>
                                    </svg>
                                    <span class="hud-tag-title">THUỘC TÍNH</span>
                                </div>
                                <div id="hudPassiveSlotsBar" class="flex items-center gap-1.5"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Khung giữa: Đồng hồ anime -->
                    <div class="anime-digital-clock-box pointer-events-auto">
                        <div id="hudWaveTitle" class="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-300 drop-shadow truncate max-w-[210px] sm:max-w-none text-center">
                            PHÚT 0-2: ĐẠO TẶC & NINJA LÀNG MƯA
                        </div>
                        <div id="hudTimer" class="anime-digital-clock-time">00:00</div>
                    </div>

                    <!-- Khung phải: Thống kê nổi & Nút Debug -->
                    <div class="flex flex-col items-end gap-1.5 pointer-events-auto relative">
                        <div class="flex items-center gap-2">
                            <div class="floating-stat-badge">
                                <span class="text-base">⚔️</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-[11px] text-rose-300/90 font-bold hidden sm:inline">HẠ:</span>
                                    <span id="hudKillCount" class="text-sm font-black text-rose-200 font-mono">0</span>
                                </div>
                            </div>

                            <div class="floating-stat-badge">
                                <span class="text-base">💎</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-[11px] text-cyan-300/90 font-bold hidden sm:inline">ĐÁ:</span>
                                    <span id="hudDiamonds" class="text-sm font-black text-cyan-200 font-mono">0</span>
                                </div>
                            </div>

                            <button id="btnToggleDebugHud" class="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-amber-300 flex items-center justify-center font-bold text-xs shadow transition cursor-pointer" title="Cài Đặt & Thử Nghiệm Nhanh (Phím H)">
                                ⚙️
                            </button>
                        </div>

                        <!-- Menu Debug HUD Popover -->
                        <div id="hudDebugPopover" class="hud-debug-popover hidden">
                            <div class="flex items-center justify-between border-b border-slate-700/80 pb-1 mb-1">
                                <span class="text-[10px] font-black text-amber-400 uppercase tracking-wider">THỬ NGHIỆM (H)</span>
                                <button id="btnCloseDebugHud" class="text-slate-400 hover:text-white text-xs px-1">✕</button>
                            </div>
                            <button id="btnSkipTime" class="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-600 text-[11px] font-bold border border-amber-500/40 text-amber-200 transition text-left">
                                ⏩ +1 Phút Sinh Tồn
                            </button>
                            <button id="btnQuickLevel" class="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-600 text-[11px] font-bold border border-sky-500/40 text-sky-200 transition text-left">
                                ⚡ Đột Phá Tăng Cấp
                            </button>
                            <button id="btnSpawnManda" class="px-2.5 py-1.5 rounded-lg bg-purple-950/90 hover:bg-purple-700 text-[11px] font-bold border border-purple-400/50 text-purple-200 transition text-left">
                                🐍 Triệu Hồi Boss Manda (5p)
                            </button>
                            <button id="btnSpawnAkatsuki" class="px-2.5 py-1.5 rounded-lg bg-rose-950/90 hover:bg-rose-700 text-[11px] font-bold border border-rose-400/50 text-rose-200 transition text-left">
                                ☁️ Triệu Hồi Boss Akatsuki (10p)
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Thanh máu BOSS khổng lồ -->
                <div id="bossHudContainer" class="hidden w-full max-w-2xl mx-auto mt-1 bg-slate-950/95 border-2 border-red-500 rounded-xl p-2 sm:p-2.5 shadow-2xl boss-alert-banner pointer-events-auto">
                    <div class="flex justify-between items-center text-xs sm:text-sm font-extrabold mb-1 px-1">
                        <span id="bossNameText" class="text-red-400 uppercase tracking-wider flex items-center gap-2">
                            ⚠️ BOSS XUẤT HIỆN
                        </span>
                        <span id="bossHpText" class="text-amber-200 font-mono">5000 / 5000</span>
                    </div>
                    <div class="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-red-500/60">
                        <div id="bossHpBarFill" class="h-full bg-gradient-to-r from-red-700 via-rose-500 to-orange-400 transition-all duration-100" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <!-- Hướng dẫn điều khiển đáy -->
            <div class="w-full flex justify-between items-end">
                <div id="hudHintWASD" class="hud-wasd-hint bg-slate-900/85 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 backdrop-blur-md shadow-lg">
                    🎮 Di chuyển: <span class="text-amber-400 font-black">W A S D</span> hoặc <span class="text-amber-400 font-black">Phím Mũi Tên</span> (Hỗ trợ chạm/kéo chuột) • Nhẫn thuật tự động thi triển
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('hudLayer');
        this._bindEvents();
    },

    _bindEvents() {
        const btnToggle = document.getElementById('btnToggleDebugHud');
        const popover = document.getElementById('hudDebugPopover');
        const btnClose = document.getElementById('btnCloseDebugHud');

        if (btnToggle && popover) {
            btnToggle.onclick = (e) => {
                e.stopPropagation();
                popover.classList.toggle('hidden');
            };
        }
        if (btnClose && popover) {
            btnClose.onclick = (e) => {
                e.stopPropagation();
                popover.classList.add('hidden');
            };
        }

        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyH' && window.GameManager.state === window.GameStates.PLAYING) {
                if (popover) popover.classList.toggle('hidden');
            }
        });

        // Debug actions
        document.getElementById('btnSkipTime')?.addEventListener('click', () => {
            if (window.GameManager.state === window.GameStates.PLAYING) {
                window.GameManager.elapsedTime += 60;
                window.GameManager.addFloatingText(window.GameManager.player.x, window.GameManager.player.y - 40, "⏩ +1 PHÚT SINH TỒN", "#fbbf24", 16);
                this.update(window.GameManager.player, window.GameManager);
            }
        });
        document.getElementById('btnQuickLevel')?.addEventListener('click', () => {
            if (window.GameManager.state === window.GameStates.PLAYING) {
                window.GameManager.player.exp = window.GameManager.player.expToNext;
                window.LevelUpManager.triggerLevelUp(window.GameManager);
            }
        });
        document.getElementById('btnSpawnManda')?.addEventListener('click', () => {
            if (window.GameManager.state === window.GameStates.PLAYING) {
                window.EnemySpawner.spawnEnemy(window.GameManager, 'boss_manda');
            }
        });
        document.getElementById('btnSpawnAkatsuki')?.addEventListener('click', () => {
            if (window.GameManager.state === window.GameStates.PLAYING) {
                window.EnemySpawner.spawnEnemy(window.GameManager, 'boss_akatsuki');
            }
        });
    },

    show() {
        if (!this.element) this.init();
        this.element.classList.remove('hidden');

        // Cập nhật icon avatar
        const selectedId = window.StorageManager.data.selectedNinja || 'naruto';
        const ninja = window.NinjaCatalog.find(n => n.id === selectedId) || window.NinjaCatalog[0];
        const avatarIcon = document.getElementById('playerAvatarIcon');
        if (avatarIcon) avatarIcon.textContent = ninja.icon;

        // Reset hướng dẫn WASD
        const wasdHint = document.getElementById('hudHintWASD');
        if (wasdHint) {
            wasdHint.classList.remove('fade-out');
            if (this.wasdTimeout) clearTimeout(this.wasdTimeout);
            this.wasdTimeout = setTimeout(() => {
                if (wasdHint) wasdHint.classList.add('fade-out');
            }, 5000);
        }
    },

    hide() {
        if (this.element) this.element.classList.add('hidden');
    },

    // Cập nhật toàn bộ thông số trên HUD
    update(player, game) {
        if (!player || !this.element || this.element.classList.contains('hidden')) return;

        // Thời gian sinh tồn MM:SS
        const totalSec = Math.floor(game.elapsedTime);
        const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const ss = String(totalSec % 60).padStart(2, '0');
        const timerEl = document.getElementById('hudTimer');
        if (timerEl) timerEl.textContent = `${mm}:${ss}`;

        // Tiêu đề đợt quái
        const mins = game.elapsedTime / 60;
        const waveEl = document.getElementById('hudWaveTitle');
        if (waveEl) {
            if (mins < 2) waveEl.textContent = "PHÚT 0-2: ĐẠO TẶC & NINJA LÀNG MƯA";
            else if (mins < 5) waveEl.textContent = "PHÚT 2-5: ĐẠI QUÂN ZETSU TRẮNG BAO VÂY";
            else if (mins < 10) waveEl.textContent = "PHÚT 5+: ĐẠI XÀ MANDA & TINH NHUỆ ÂM THANH";
            else waveEl.textContent = "PHÚT 10+: QUYẾT CHIẾN TỔ CHỨC AKATSUKI";
        }

        // Máu HP
        const hpRatio = player.hp / player.maxHp;
        const hpPct = Math.max(0, Math.min(100, hpRatio * 100));
        const hpFill = document.getElementById('hpBarFill');
        if (hpFill) hpFill.style.width = `${hpPct}%`;
        const hpText = document.getElementById('hudHpText');
        if (hpText) hpText.textContent = `${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}`;

        const hpContainer = document.getElementById('hpBarContainer');
        if (hpContainer) {
            if (hpRatio <= 0.3 && player.hp > 0) {
                hpContainer.classList.add('heartbeat-low-hp');
            } else {
                hpContainer.classList.remove('heartbeat-low-hp');
            }
        }

        // Chakra EXP
        const expPct = Math.max(0, Math.min(100, (player.exp / player.expToNext) * 100));
        const expFill = document.getElementById('expBarFill');
        if (expFill) expFill.style.width = `${expPct}%`;
        const expText = document.getElementById('hudExpText');
        if (expText) expText.textContent = `CHAKRA: ${player.exp} / ${player.expToNext}`;

        const rankBadge = document.getElementById('hudRankBadge');
        if (rankBadge) {
            const rankTitle = window.getNinjaRankTitle(player.level);
            rankBadge.innerHTML = `⚡ CẤP BẬC: ${rankTitle.toUpperCase()} (LV.${player.level})`;
        }

        const killCount = document.getElementById('hudKillCount');
        if (killCount) killCount.textContent = game.kills;
        const diamonds = document.getElementById('hudDiamonds');
        if (diamonds) diamonds.textContent = game.diamonds;

        // Thanh Máu Boss
        const activeBoss = game.enemies.find(e => e.isBoss && !e.dead);
        const bossHud = document.getElementById('bossHudContainer');
        if (activeBoss && bossHud) {
            bossHud.classList.remove('hidden');
            const bossName = document.getElementById('bossNameText');
            if (bossName) bossName.textContent = `⚠️ BOSS: ${activeBoss.name}`;
            const bossHpText = document.getElementById('bossHpText');
            if (bossHpText) bossHpText.textContent = `${Math.max(0, activeBoss.hp)} / ${activeBoss.maxHp}`;
            const bossBarFill = document.getElementById('bossHpBarFill');
            if (bossBarFill) bossBarFill.style.width = `${Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100)}%`;
        } else if (bossHud) {
            bossHud.classList.add('hidden');
        }

        // 2 Hàng Khung Trang Bị: 5 Ô Nhẫn Thuật + 5 Ô Thuộc Tính
        this._renderActiveSlots(player);
        this._renderPassiveSlots(player);
    },

    _renderActiveSlots(player) {
        const activeBar = document.getElementById('hudActiveSlotsBar');
        if (!activeBar) return;

        const activeSkills = [];
        const seenActive = new Set();
        if (player.acquiredActive) {
            for (let i = 0; i < player.acquiredActive.length; i++) {
                const s = window.JutsuCatalog[player.acquiredActive[i]];
                if (s && s.type === 'active' && !seenActive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                    seenActive.add(s.id);
                    activeSkills.push(s);
                }
            }
        }
        for (const key of Object.keys(window.JutsuCatalog)) {
            const s = window.JutsuCatalog[key];
            if (s && s.type === 'active' && s.id && !seenActive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                seenActive.add(s.id);
                activeSkills.push(s);
                if (player.acquiredActive && !player.acquiredActive.includes(s.id)) {
                    player.acquiredActive.push(s.id);
                }
            }
        }

        let html = '';
        for (let i = 0; i < 5; i++) {
            if (i < activeSkills.length) {
                const s = activeSkills[i];
                const lv = player.skills[s.id] || 0;
                const isAwakened = lv >= 6;

                if (isAwakened) {
                    const evo = s.evolution || {};
                    html += `
                        <div class="hud-equip-slot slot-active slot-awakened" title="${evo.name || s.name} (MAX 6★ THỨC TỈNH)">
                            <span class="hud-slot-icon">${evo.icon || s.icon}</span>
                            <div class="hud-slot-awakened-badge">MAX 6★</div>
                        </div>
                    `;
                } else {
                    const stars = [1, 2, 3, 4, 5].map(st => `<span class="slot-star ${st <= lv ? 'active' : ''}">★</span>`).join('');
                    html += `
                        <div class="hud-equip-slot slot-active" title="${s.name} (Cấp ${lv}/5)">
                            <span class="hud-slot-icon">${s.icon}</span>
                            <div class="hud-slot-stars">${stars}</div>
                        </div>
                    `;
                }
            } else {
                html += `
                    <div class="hud-equip-slot slot-empty slot-active-empty" title="Ô Nhẫn Thuật Trống (Còn ${5 - activeSkills.length} chỗ)">
                        <span class="hud-slot-plus">+</span>
                    </div>
                `;
            }
        }
        activeBar.innerHTML = html;
    },

    _renderPassiveSlots(player) {
        const passiveBar = document.getElementById('hudPassiveSlotsBar');
        if (!passiveBar) return;

        const passiveSkills = [];
        const seenPassive = new Set();
        if (player.acquiredPassive) {
            for (let i = 0; i < player.acquiredPassive.length; i++) {
                const s = window.JutsuCatalog[player.acquiredPassive[i]];
                if (s && s.type === 'passive' && !seenPassive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                    seenPassive.add(s.id);
                    passiveSkills.push(s);
                }
            }
        }
        for (const key of Object.keys(window.JutsuCatalog)) {
            const s = window.JutsuCatalog[key];
            if (s && s.type === 'passive' && s.id && !seenPassive.has(s.id) && (player.skills[s.id] || 0) > 0) {
                seenPassive.add(s.id);
                passiveSkills.push(s);
                if (player.acquiredPassive && !player.acquiredPassive.includes(s.id)) {
                    player.acquiredPassive.push(s.id);
                }
            }
        }

        let html = '';
        for (let i = 0; i < 5; i++) {
            if (i < passiveSkills.length) {
                const s = passiveSkills[i];
                const lv = player.skills[s.id] || 0;
                const stars = [1, 2, 3, 4, 5].map(st => `<span class="slot-star ${st <= lv ? 'active' : ''}">★</span>`).join('');
                html += `
                    <div class="hud-equip-slot slot-passive" title="${s.name} (Cấp ${lv}/5)">
                        <span class="hud-slot-icon">${s.icon}</span>
                        <div class="hud-slot-stars">${stars}</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="hud-equip-slot slot-empty slot-passive-empty" title="Ô Thuộc Tính Trống (Còn ${5 - passiveSkills.length} chỗ)">
                        <span class="hud-slot-plus">+</span>
                    </div>
                `;
            }
        }
        passiveBar.innerHTML = html;
    }
};

