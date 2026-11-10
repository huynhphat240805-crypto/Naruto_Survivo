/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/UI/Modals/LevelUp/LevelUpModal.js
   Nâng cấp Giao diện Modal Lĩnh Ngộ Nhẫn Thuật 5 Thẻ Dàn Hàng Ngang (5-Column Flexbox)
   Khung nền khung_modal.png, Viền Neon phát quang theo hệ, Nút 3D Vàng Cam & Reroll 5 Thẻ
   ============================================================================ */

if (!window.SkillIconMap) {
    window.SkillIconMap = {
        'fireball': 'icon_fireball.png', 'flamethrower': 'icon_flamethrower.png',
        'meteor': 'icon_meteor.png', 'fire_tornado': 'icon_fire_tornado.png',
        'chidori': 'icon_chain_lightning.png', 'lightning_strike': 'icon_kirin.png',
        'kirin': 'icon_kirin.png', 'lightning_armor': 'icon_lightning_armor.png',
        'plasma_orb': 'icon_plasma_orb.png', 'ice_spikes': 'icon_ice_spikes.png',
        'icicle_rain': 'icon_icicle_rain.png', 'water_jet': 'icon_water_jet.png',
        'tidal_wave': 'icon_tidal_wave.png', 'sword_combo': 'icon_sword_combo.png',
        'dash_strike': 'icon_dash_strike.png', 'earth_smash': 'icon_earth_smash.png',
        'shuriken': 'icon_shuriken_volley.png', 'bijuu_dama': 'icon_bijuu_dama.png',
        'rasengan': 'icon_bijuu_dama.png', 'teleport_trap': 'icon_hiraishin.png',
        'amaterasu': 'icon_amaterasu.png', 'force_field': 'icon_chakra_barrier.png',
        'clones': 'icon_chakra_barrier.png', 'dame': 'icon_passive_attack.png',
        'uyluc': 'icon_passive_attack.png', 'speed': 'icon_passive_speed.png',
        'thuanthan': 'icon_passive_speed.png', 'cooldown': 'icon_passive_cooldown.png',
        'ketan': 'icon_passive_cooldown.png', 'area': 'icon_passive_area.png',
        'hp': 'icon_passive_hp.png', 'theluc': 'icon_passive_hp.png',
        'regen': 'icon_passive_regen.png', 'armor': 'icon_passive_armor.png',
        'crit': 'icon_passive_crit.png', 'duration': 'icon_passive_duration.png',
        'magnet': 'icon_passive_magnet.png', 'hutchakra': 'icon_passive_magnet.png'
    };
}

if (!window.getSkillIconPath) {
    window.getSkillIconPath = function(skillId) {
        if (!skillId) return '';
        const cleanId = String(skillId).toLowerCase().trim();
        const fileName = window.SkillIconMap[cleanId];
        if (!fileName) return '';
        const isRoot = (typeof window !== 'undefined' && window.location)
            ? !window.location.pathname.includes('/SurvivalIO/') : true;
        const prefix = isRoot ? 'SurvivalIO/' : '';
        return prefix + 'Assets/_Project/Textures/Icons/' + fileName;
    };
}

if (!window.getSkillIconHtml) {
    window.getSkillIconHtml = function(skillOrId, className = 'skill-icon-img', fallbackEmoji = '✨') {
        let id = '';
        let emoji = fallbackEmoji;
        let name = '';
        if (typeof skillOrId === 'object' && skillOrId !== null) {
            id = skillOrId.id || skillOrId.activeId || skillOrId.pairId || '';
            emoji = skillOrId.icon || fallbackEmoji;
            name = skillOrId.name || id;
        } else if (typeof skillOrId === 'string') {
            id = skillOrId;
            name = id;
        }
        const path = window.getSkillIconPath(id);
        if (path) {
            return `<img src="${path}" class="${className}" alt="${name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline';" /><span class="skill-fallback-emoji" style="display:none;">${emoji}</span>`;
        }
        return `<span class="skill-fallback-emoji">${emoji}</span>`;
    };
}

window.LevelUpModal = {
    element: null,
    cssLoaded: false,

    // Tự động nhúng file CSS riêng của Modal nếu chưa có
    ensureCSS() {
        if (this.cssLoaded || document.getElementById('level-up-modal-css')) {
            this.cssLoaded = true;
            return;
        }
        const link = document.createElement('link');
        link.id = 'level-up-modal-css';
        link.rel = 'stylesheet';
        link.href = 'SurvivalIO/Assets/_Project/Scripts/UI/Modals/LevelUp/LevelUpModal.css';
        document.head.appendChild(link);
        this.cssLoaded = true;
    },

    init() {
        this.ensureCSS();
        if (this.element) return;

        const html = `
        <div id="levelUpModal" class="level-up-modal-backdrop hidden">
            <div class="level-up-modal-container">
                <!-- 1. Dòng Danh Hiệu Hiện Tại (Sub-Header) -->
                <div class="level-up-subheader-wrapper">
                    <div id="levelUpSubheaderPill" class="level-up-subheader-pill">
                        Danh hiệu hiện tại: <span id="levelUpRankText" class="level-up-rank-highlight">Học Viện (Academy) Lv.1</span> – Hãy chọn 1 Bí Kíp Đột Phá Nhẫn Giả
                    </div>
                </div>

                <!-- 2. Dàn Hàng 5 Ô Thẻ Nhẫn Thuật (5-Column Flexbox) -->
                <div id="levelUpCardsRow" class="level-up-cards-row"></div>

                <!-- 3. Khu Vực Chân Trang (Footer - Reroll & Ban stats) -->
                <div id="levelUpFooter" class="level-up-footer">
                    <div class="level-up-footer-left">
                        <span class="level-up-stat-pill">
                            🎲 Lượt Đổi Thẻ: <strong id="levelUpRerollsLeft" class="level-up-stat-num active-reroll">0</strong>
                        </span>
                        <span class="level-up-stat-pill">
                            🚫 Lượt Phong Ấn: <strong id="levelUpBansLeft" class="level-up-stat-num active-ban">0</strong>
                            <span id="levelUpBannedCount" class="text-[10px] text-slate-400"></span>
                        </span>
                    </div>
                    <div>
                        <button id="btnRerollSkills" class="level-up-reroll-btn active" title="Làm mới lại 5 thẻ nhẫn thuật">
                            <span>🔄</span>
                            <span>Đổi Thẻ (Reroll)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Nếu đã có element cũ tồn tại từ trước, xóa bỏ để thay thế
        const oldModal = document.getElementById('levelUpModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('levelUpModal');
    },

    show(game, isStartingJutsu = false) {
        this.ensureCSS();
        if (!this.element) this.init();

        const p = game.player;
        const rankTitle = (typeof window.getNinjaRankTitle === 'function') 
            ? window.getNinjaRankTitle(p.level) 
            : "Nhẫn Giả";

        const isInitial = isStartingJutsu || (!p.acquiredActive || p.acquiredActive.length === 0);
        this.isInitial = isInitial;

        const rankEl = document.getElementById('levelUpRankText');
        if (rankEl) {
            if (isInitial) {
                rankEl.textContent = `⚡ KHỞI ĐẦU NHẪN THUẬT: CHỌN 1 CHIÊU TẤN CÔNG`;
            } else {
                rankEl.textContent = `${rankTitle} Lv.${p.level}`;
            }
        }

        this.renderCards(game, isInitial);
        this.element.classList.remove('hidden');
    },

    hide() {
        this.isInitial = false;
        if (this.element) {
            this.element.classList.add('hidden');
        }
    },

    // Xác định class viền neon theo thuộc tính/nguyên tố của thẻ
    getElementGlowClass(card) {
        if (card.isEvolution) return 'card-glow-evo';

        const id = (card.id || '').toLowerCase();
        const cat = (card.category || '').toLowerCase();
        const name = (card.name || '').toLowerCase();

        // 1. Hệ Hỏa: Viền cam rực lửa
        if (id.includes('fire') || id.includes('flame') || id.includes('meteor') || cat.includes('hỏa') || name.includes('hỏa')) {
            return 'card-glow-fire';
        }
        // 2. Hệ Lôi: Viền xanh lôi điện
        if (id.includes('lightning') || id.includes('chidori') || id.includes('plasma') || id.includes('kirin') || cat.includes('lôi') || name.includes('lôi')) {
            return 'card-glow-lightning';
        }
        // 3. Hệ Thủy: Viền xanh đại dương
        if (id.includes('water') || id.includes('wave') || id.includes('tidal') || cat.includes('thủy') || name.includes('thủy')) {
            return 'card-glow-water';
        }
        // 4. Hệ Phong / Băng: Viền xanh ngọc băng tuyết
        if (id.includes('ice') || id.includes('icicle') || id.includes('wind') || cat.includes('băng') || cat.includes('phong') || name.includes('băng') || name.includes('phong')) {
            return 'card-glow-wind';
        }
        // 5. Hệ Thể Thuật / Kiếm / Vũ Khí: Viền vàng kim
        if (id.includes('sword') || id.includes('dash') || id.includes('earth') || id.includes('shuriken') || id.includes('kunai') || cat.includes('thể thuật') || cat.includes('vũ khí') || cat.includes('kiếm')) {
            return 'card-glow-taijutsu';
        }
        // 6. Hệ Ám / Bí Thuật / Không Gian: Viền tím Chakra
        if (id.includes('amaterasu') || id.includes('teleport') || id.includes('bijuu') || id.includes('rasen') || id.includes('force') || id.includes('clone') || cat.includes('bí thuật') || cat.includes('ảo thuật') || cat.includes('hắc ám')) {
            return 'card-glow-dark';
        }

        // Bổ sung các thẻ thuộc tính nội tại (Passives)
        if (id === 'dame' || id === 'uyluc' || id === 'area' || id === 'crit') return 'card-glow-fire';
        if (id === 'speed' || id === 'thuanthan' || id === 'hp' || id === 'theluc' || id === 'regen') return 'card-glow-wind';
        if (id === 'magnet' || id === 'hutchakra') return 'card-glow-lightning';
        if (id === 'cooldown' || id === 'ketan' || id === 'duration') return 'card-glow-dark';
        if (id === 'armor') return 'card-glow-taijutsu';

        return 'card-glow-taijutsu';
    },

    // Sinh 5 thẻ ngẫu nhiên theo đúng quy chuẩn 5 Ô Nhẫn Thuật + 5 Ô Thuộc Tính & Thức Tỉnh 6★
    generate5Options(game, isInitial = this.isInitial) {
        const p = game.player;
        const banned = game.bannedSkills || new Set();
        const uniqueEntries = (typeof window.getUniqueCatalogEntries === 'function')
            ? window.getUniqueCatalogEntries()
            : [];

        // 1. Kiểm tra giới hạn 5 Ô Nhẫn Thuật (Active) & 5 Ô Thuộc Tính (Passive)
        const activeOwned = uniqueEntries.filter(sk => sk.type === 'active' && (p.skills[sk.id] || 0) > 0);
        const passiveOwned = uniqueEntries.filter(sk => sk.type === 'passive' && (p.skills[sk.id] || 0) > 0);

        const isStartingSelection = isInitial || activeOwned.length === 0;

        const isFullActive = activeOwned.length >= 5;
        const isFullPassive = passiveOwned.length >= 5;

        // 2. Thu thập Thẻ Thức Tỉnh 6★ (chỉ khi không phải lượt chọn ban đầu)
        const evolutionCandidates = [];
        if (!isStartingSelection) {
            for (let i = 0; i < uniqueEntries.length; i++) {
                const sk = uniqueEntries[i];
                if (sk.type === 'active' && (p.skills[sk.id] || 0) === 5 && !p.evolvedSkills?.[sk.id]) {
                    const pairAlias = window.SkillEvolution ? window.SkillEvolution.getPassiveAlias(sk.pairId) : sk.pairId;
                    const pairLv = (p.skills[sk.pairId] || 0) || (p.skills[pairAlias] || 0);
                    if (pairLv >= 1 && !banned.has(sk.id)) {
                        evolutionCandidates.push({
                            id: sk.id,
                            type: 'active',
                            isEvolution: true,
                            name: sk.evolution?.name || sk.name + ' (6★)',
                            icon: sk.evolution?.icon || sk.icon,
                            category: sk.evolution?.category || 'TIẾN HÓA 6★',
                            color: '#f59e0b',
                            desc: sk.evolution?.desc || 'Đột phá giới hạn Chakra tối thượng.',
                            badgeText: "🌟 TIẾN HÓA 6★",
                            pairId: sk.pairId,
                            pairName: sk.pairName,
                            pairIcon: window.JutsuCatalog?.[sk.pairId]?.icon || '✨'
                        });
                    }
                }
            }
        }

        // 3. Thu thập thẻ nâng cấp thông thường (1★ -> 5★)
        const regularPool = uniqueEntries.filter(sk => {
            if (banned.has(sk.id)) return false;
            // Nếu là chọn nhẫn thuật khởi đầu, chỉ lấy các nhẫn thuật tấn công (active)
            if (isStartingSelection && sk.type !== 'active') return false;

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
            const desc = (typeof sk.getDesc === 'function') 
                ? sk.getDesc(nextLv) 
                : (sk.desc || `Tăng cấp độ lên Cấp ${nextLv}`);

            return {
                id: sk.id,
                type: sk.type,
                isEvolution: false,
                name: sk.name,
                icon: sk.icon,
                category: sk.category || (sk.type === 'active' ? 'Nhẫn Thuật' : 'Thuộc Tính'),
                color: sk.color || '#38bdf8',
                desc: desc,
                badgeText: isStartingSelection ? "⚡ BÍ THUẬT KHỞI ĐẦU!" : (currLv === 0 ? "+ CHIÊU MỚI!" : `★ CẤP ${nextLv}/5`),
                isNew: currLv === 0,
                currLv: currLv,
                nextLv: nextLv,
                pairId: sk.pairId,
                pairName: sk.pairName,
                pairIcon: sk.pairIcon
            };
        });

        // 4. Tuyển chọn chính xác 5 thẻ (ưu tiên tối đa 2 thẻ 6★ nếu đủ điều kiện, còn lại lấy thẻ thường)
        const chosenCards = [];

        // Đảo ngẫu nhiên danh sách ứng viên tiến hóa
        if (evolutionCandidates.length > 0) {
            evolutionCandidates.sort(() => Math.random() - 0.5);
            const numEvo = Math.min(2, evolutionCandidates.length);
            for (let i = 0; i < numEvo; i++) {
                chosenCards.push(evolutionCandidates[i]);
            }
        }

        // Đảo ngẫu nhiên danh sách thẻ thông thường
        const shuffledRegular = regularPool
            .filter(c => !chosenCards.some(ec => ec.id === c.id))
            .sort(() => Math.random() - 0.5);

        while (chosenCards.length < 5 && shuffledRegular.length > 0) {
            chosenCards.push(shuffledRegular.pop());
        }

        return chosenCards;
    },

    renderCards(game, isInitial = this.isInitial) {
        this.ensureCSS();
        if (!this.element) this.init();

        const container = document.getElementById('levelUpCardsRow');
        if (!container) return;

        // Lấy 5 thẻ nhẫn thuật
        const chosenCards = this.generate5Options(game, isInitial);
        const p = game.player;
        container.innerHTML = '';

        // Trường hợp người chơi đã max toàn bộ kỹ năng & thuộc tính
        if (chosenCards.length === 0) {
            container.innerHTML = `
                <div class="level-up-maxout-box">
                    <div class="text-4xl mb-3">🏆</div>
                    <h3 class="text-xl font-black text-amber-300 uppercase tracking-wide mb-2">CẢNH GIỚI TỐI CAO ĐÃ ĐẠT!</h3>
                    <p class="text-xs text-slate-300 max-w-md leading-relaxed mb-4">
                        Toàn bộ 5 Ô Nhẫn Thuật & 5 Ô Thuộc Tính đã đạt cảnh giới tối thượng hoặc đã bị phong ấn.
                    </p>
                    <button id="btnCloseMaxLevelUp" class="card-btn-pick" style="max-width: 240px; padding: 10px 24px;">
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
            // Render 5 Thẻ Dàn Ngang
            for (let i = 0; i < chosenCards.length; i++) {
                const card = chosenCards[i];
                const isEvo = card.isEvolution;
                const canBan = !isEvo && (game.remainingBans || 0) > 0;
                const glowClass = this.getElementGlowClass(card);

                // Kiểm tra mảnh ghép combo tiến hóa
                let comboBadgeHtml = '';
                if (isEvo) {
                    comboBadgeHtml = `
                        <div class="card-combo-badge synergy-evo" title="Chiêu thức đã hoàn tất thức tỉnh 6★ Siêu Cấp">
                            🌟 CẢNH GIỚI TỐI CAO
                        </div>
                    `;
                } else if (card.pairId) {
                    const pairAlias = window.SkillEvolution ? window.SkillEvolution.getPassiveAlias(card.pairId) : card.pairId;
                    const pairOwned = ((p.skills[card.pairId] || 0) > 0) || ((p.skills[pairAlias] || 0) > 0);
                    const pairItem = window.JutsuCatalog ? window.JutsuCatalog[card.pairId] : null;
                    const pairName = card.pairName || pairItem?.name || card.pairId;
                    const pairIconTag = (typeof window.getSkillIconHtml === 'function')
                        ? window.getSkillIconHtml(card.pairId, 'skill-combo-mini-img', card.pairIcon || '✨')
                        : `<span>${card.pairIcon || '✨'}</span>`;

                    const comboText = pairOwned 
                        ? `Ghép: ${pairIconTag} <span>${pairName}</span> (✓ ĐÃ CÓ)`
                        : `Ghép: ${pairIconTag} <span>${pairName}</span>`;

                    comboBadgeHtml = `
                        <div class="card-combo-badge ${pairOwned ? 'synergy-owned' : ''}" title="Ghép với ${pairName} để đột phá 6★">
                            ${comboText}
                        </div>
                    `;
                } else {
                    comboBadgeHtml = `
                        <div class="card-combo-badge" title="Bí kíp hỗ trợ đắc lực">
                            ⚡ BÍ KÍP BỔ TRỢ
                        </div>
                    `;
                }

                // Tag nhãn
                const tagClass = isEvo ? 'card-tag-evo' : (card.isNew ? 'card-tag-new' : 'card-tag-up');
                const btnLabel = isEvo ? '⚡ KÍCH HOẠT 6★' : '✨ LĨNH NGỘ';

                const iconTag = (typeof window.getSkillIconHtml === 'function')
                    ? window.getSkillIconHtml(card, 'skill-icon-img', card.icon)
                    : `<span class="card-icon">${card.icon}</span>`;

                const cardEl = document.createElement('div');
                cardEl.className = `level-up-card ${glowClass}`;
                cardEl.innerHTML = `
                    <div>
                        <!-- Tag Trên Cùng & Nút Cấm -->
                        <div class="card-top-row">
                            <span class="card-tag ${tagClass}">${card.badgeText}</span>
                            ${canBan ? `
                                <button class="card-btn-ban" title="Phong ấn chiêu này vĩnh viễn trong trận">
                                    🚫 CẤM
                                </button>
                            ` : ''}
                        </div>

                        <!-- Icon Kỹ Năng -->
                        <div class="card-icon-wrapper">
                            ${iconTag}
                        </div>

                        <!-- Danh Mục & Tên -->
                        <div class="card-category">[ ${card.category} ]</div>
                        <h4 class="card-name">${card.name}</h4>

                        <!-- Mô Tả Thuộc Tính Ngắn Gọn -->
                        <p class="card-desc">${card.desc}</p>
                    </div>

                    <!-- Mảnh Ghép Combo & Nút 3D Vàng Cam -->
                    <div>
                        ${comboBadgeHtml}
                        <button class="card-btn-pick">
                            ${btnLabel}
                        </button>
                    </div>
                `;

                // Xử lý nút Ban
                const banBtn = cardEl.querySelector('.card-btn-ban');
                if (banBtn) {
                    banBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (window.SFXController && typeof window.SFXController.ban === 'function') {
                            window.SFXController.ban();
                        }
                        game.bannedSkills = game.bannedSkills || new Set();
                        game.bannedSkills.add(card.id);
                        game.remainingBans = Math.max(0, game.remainingBans - 1);
                        if (typeof game.addFloatingText === 'function') {
                            game.addFloatingText(game.player.x, game.player.y - 30, `🚫 PHONG ẤN: ${card.name}`, '#f43f5e', 15);
                        }
                        this.renderCards(game, this.isInitial);
                    });
                }

                // Xử lý chọn kỹ năng
                cardEl.addEventListener('click', () => {
                    if (window.EvolutionSystem && typeof window.EvolutionSystem.selectSkillUpgrade === 'function') {
                        window.EvolutionSystem.selectSkillUpgrade(card.id, isEvo, game);
                    } else if (window.SkillEvolution && typeof window.SkillEvolution.selectSkillUpgrade === 'function') {
                        window.SkillEvolution.selectSkillUpgrade(card.id, isEvo, game);
                    }
                });

                container.appendChild(cardEl);
            }
        }

        // Cập nhật số liệu Chân Trang (Footer)
        const rerollsLeft = game.remainingRerolls || 0;
        const bansLeft = game.remainingBans || 0;
        const totalBannedCount = (game.bannedSkills ? game.bannedSkills.size : 0);

        const rerollNumEl = document.getElementById('levelUpRerollsLeft');
        if (rerollNumEl) {
            rerollNumEl.textContent = rerollsLeft;
            rerollNumEl.className = `level-up-stat-num ${rerollsLeft > 0 ? 'active-reroll' : 'disabled'}`;
        }

        const bansNumEl = document.getElementById('levelUpBansLeft');
        if (bansNumEl) {
            bansNumEl.textContent = bansLeft;
            bansNumEl.className = `level-up-stat-num ${bansLeft > 0 ? 'active-ban' : 'disabled'}`;
        }

        const bannedCountEl = document.getElementById('levelUpBannedCount');
        if (bannedCountEl) {
            bannedCountEl.textContent = totalBannedCount > 0 ? `(${totalBannedCount} đã cấm)` : '';
        }

        const btnReroll = document.getElementById('btnRerollSkills');
        if (btnReroll) {
            if (rerollsLeft > 0) {
                btnReroll.className = 'level-up-reroll-btn active';
                btnReroll.onclick = () => {
                    if (window.SFXController && typeof window.SFXController.reroll === 'function') {
                        window.SFXController.reroll();
                    }
                    game.remainingRerolls--;
                    this.renderCards(game, this.isInitial);
                };
            } else {
                btnReroll.className = 'level-up-reroll-btn disabled';
                btnReroll.onclick = null;
            }
        }
    }
};

// Đồng bộ phương thức tạo thẻ với LevelUpManager nếu có
if (window.LevelUpManager) {
    window.LevelUpManager.generateOptions = function(game) {
        return window.LevelUpModal.generate5Options(game);
    };
}
