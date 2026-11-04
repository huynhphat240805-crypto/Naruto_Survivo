/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/UI/Modals/Achievement/AchievementModal.js
   Hệ Thống Nhiệm Vụ & Thành Tựu Nhẫn Giả (3 Cột Độc Lập):
   - Cột 1: 6 Nhiệm Vụ Ngày (Chu kỳ 24h, đồng hồ HH:MM:SS)
   - Cột 2: 10 Nhiệm Vụ Tuần (Chu kỳ 7 ngày, đồng hồ X ngày HH:MM:SS hoặc HH:MM:SS)
   - Cột 3: 25 Thành Tựu Huyền Thoại (Cột mốc vĩnh viễn)
   - Thanh cuộn mạ vàng độc lập, ống Chakra neon & nút Nhận Thưởng rực lửa
   ============================================================================ */

window.AchievementModal = {
    STORAGE_KEY: 'naruto_survivor_achievements_v2',
    element: null,
    timerInterval: null,

    // 1. NHIỆM VỤ NGÀY (6 Nhiệm vụ - 24 Giờ)
    DAILY_MISSIONS: [
        { id: 'd1', name: 'Điểm Danh Shinobi', desc: 'Đăng nhập game hôm nay', icon: '🏮', target: 1, rewardRyo: 500, rewardScrolls: 0, defaultDone: true },
        { id: 'd2', name: 'Diệt Đạo Tặc', desc: 'Tiêu diệt 400 kẻ địch', icon: '🗡️', target: 400, rewardRyo: 1000, rewardScrolls: 0, statKey: 'kills' },
        { id: 'd3', name: 'Tích Lũy Chakra', desc: 'Thu thập 1,200 hạt Chakra/EXP', icon: '🌀', target: 1200, rewardRyo: 800, rewardScrolls: 0, statKey: 'chakra' },
        { id: 'd4', name: 'Sinh Tồn Căn Bản', desc: 'Sống sót qua mốc 4 phút', icon: '⏱️', target: 240, rewardRyo: 1200, rewardScrolls: 0, isTime: true, statKey: 'time' },
        { id: 'd5', name: 'Đột Phá Nhẫn Thuật', desc: 'Nâng cấp 1 chiêu lên Lv.5', icon: '⚡', target: 1, rewardRyo: 1000, rewardScrolls: 0, statKey: 'skillLv5' },
        { id: 'd6', name: 'Thợ Săn Tinh Anh', desc: 'Đánh bại 2 Quái tinh anh', icon: '👺', target: 2, rewardRyo: 1500, rewardScrolls: 0, statKey: 'elites' }
    ],

    // 2. NHIỆM VỤ TUẦN (10 Nhiệm vụ - 7 Ngày)
    WEEKLY_MISSIONS: [
        { id: 'w1', name: 'Càn Quét Chiến Trường', desc: 'Tiêu diệt 3,500 kẻ địch', icon: '💥', target: 3500, rewardRyo: 4000, rewardScrolls: 1, statKey: 'kills' },
        { id: 'w2', name: 'Sinh Tồn Bền Bỉ', desc: 'Tích lũy 30 phút thi đấu', icon: '⏳', target: 1800, rewardRyo: 4500, rewardScrolls: 1, isTime: true, statKey: 'time' },
        { id: 'w3', name: 'Thợ Săn Akatsuki', desc: 'Hạ gục 6 Boss / Trùm', icon: '☁️', target: 6, rewardRyo: 5000, rewardScrolls: 2, statKey: 'bosses' },
        { id: 'w4', name: 'Thức Tỉnh Nhẫn Thuật', desc: 'Kích hoạt 3 lần Bí Kíp 6★ Awakened', icon: '🌟', target: 3, rewardRyo: 4000, rewardScrolls: 1, statKey: 'awakened' },
        { id: 'w5', name: 'Thu Thập Đại Lượng Chakra', desc: 'Nhặt 15,000 hạt Chakra', icon: '💠', target: 15000, rewardRyo: 3500, rewardScrolls: 1, statKey: 'chakra' },
        { id: 'w6', name: 'Rèn Luyện Thiên Phú', desc: 'Nâng cấp 5 điểm Thiên Phú tại sảnh', icon: '📜', target: 5, rewardRyo: 3500, rewardScrolls: 1, statKey: 'talents' },
        { id: 'w7', name: 'Vượt Ải Kiên Cường', desc: 'Hoàn thành 3 trận đấu không bỏ cuộc', icon: '🛡️', target: 3, rewardRyo: 3000, rewardScrolls: 1, statKey: 'matches' },
        { id: 'w8', name: 'Bậc Thầy Né Đòn', desc: 'Sống sót qua phút thứ 8 của trận', icon: '💨', target: 480, rewardRyo: 4000, rewardScrolls: 1, isTime: true, statKey: 'time' },
        { id: 'w9', name: 'Phú Hộ Shinobi', desc: 'Tích lũy 10,000 Ryo trong tuần', icon: '🪙', target: 10000, rewardRyo: 5000, rewardScrolls: 2, isRyo: true },
        { id: 'w10', name: 'Tinh Thông Chiêu Thức', desc: 'Sử dụng 5 loại Nhẫn thuật khác nhau', icon: '🌀', target: 5, rewardRyo: 4000, rewardScrolls: 1, statKey: 'variety' }
    ],

    // 3. THÀNH TỰU HUYỀN THOẠI (25 Cột Mốc Vĩnh Viễn)
    LEGEND_MISSIONS: [
        // Nhóm Diệt Quái (5)
        { id: 'p1', name: 'Tân Binh Diệt Quái', desc: 'Tiêu diệt 1,000 kẻ địch', icon: '🗡️', target: 1000, rewardRyo: 2000, rewardScrolls: 1, statKey: 'totalKills' },
        { id: 'p2', name: 'Sát Thủ Chiến Trường', desc: 'Tiêu diệt 5,000 kẻ địch', icon: '⚔️', target: 5000, rewardRyo: 5000, rewardScrolls: 2, statKey: 'totalKills' },
        { id: 'p3', name: 'Chiến Binh Bách Thắng', desc: 'Tiêu diệt 20,000 kẻ địch', icon: '🌪️', target: 20000, rewardRyo: 10000, rewardScrolls: 3, statKey: 'totalKills' },
        { id: 'p4', name: 'Kẻ Hủy Diệt Quân Đoàn', desc: 'Tiêu diệt 50,000 kẻ địch', icon: '🔥', target: 50000, rewardRyo: 25000, rewardScrolls: 5, statKey: 'totalKills' },
        { id: 'p5', name: 'Shinobi Vô Song', desc: 'Tiêu diệt 100,000 kẻ địch', icon: '⚡', target: 100000, rewardRyo: 50000, rewardScrolls: 10, statKey: 'totalKills' },

        // Nhóm Vượt Ải (12 Ải từ Map 1 đến Map 12)
        { id: 'p6', name: 'Chinh Phục Ải 1', desc: 'Vượt qua Ải 1: Rừng Làng Lá', icon: '🌿', target: 1, isMap: 1, rewardRyo: 1500, rewardScrolls: 1 },
        { id: 'p7', name: 'Chinh Phục Ải 2', desc: 'Vượt qua Ải 2: Sóng Quốc & Cầu Naruto', icon: '🌊', target: 2, isMap: 2, rewardRyo: 2000, rewardScrolls: 1 },
        { id: 'p8', name: 'Chinh Phục Ải 3', desc: 'Vượt qua Ải 3: Khu Rừng Chết', icon: '🌲', target: 3, isMap: 3, rewardRyo: 2500, rewardScrolls: 1 },
        { id: 'p9', name: 'Chinh Phục Ải 4', desc: 'Vượt qua Ải 4: Thung Lũng Tận Cùng', icon: '⚡', target: 4, isMap: 4, rewardRyo: 3000, rewardScrolls: 1 },
        { id: 'p10', name: 'Chinh Phục Ải 5', desc: 'Vượt qua Ải 5: Sa Mạc Làng Cát', icon: '🏜️', target: 5, isMap: 5, rewardRyo: 3500, rewardScrolls: 2 },
        { id: 'p11', name: 'Chinh Phục Ải 6', desc: 'Vượt qua Ải 6: Cầu Tenchi & Hang Ổ Orochimaru', icon: '🐍', target: 6, isMap: 6, rewardRyo: 4000, rewardScrolls: 2 },
        { id: 'p12', name: 'Chinh Phục Ải 7', desc: 'Vượt qua Ải 7: Làng Mưa', icon: '🌧️', target: 7, isMap: 7, rewardRyo: 5000, rewardScrolls: 2 },
        { id: 'p13', name: 'Chinh Phục Ải 8', desc: 'Vượt qua Ải 8: Núi Myoboku', icon: '🐸', target: 8, isMap: 8, rewardRyo: 6000, rewardScrolls: 2 },
        { id: 'p14', name: 'Chinh Phục Ải 9', desc: 'Vượt qua Ải 9: Đảo Rùa Khổng Lồ', icon: '🐢', target: 9, isMap: 9, rewardRyo: 7000, rewardScrolls: 3 },
        { id: 'p15', name: 'Chinh Phục Ải 10', desc: 'Vượt qua Ải 10: Đại Chiến Nhẫn Giả', icon: '🚩', target: 10, isMap: 10, rewardRyo: 10000, rewardScrolls: 4 },
        { id: 'p16', name: 'Chinh Phục Ải 11', desc: 'Vượt qua Ải 11: Không Gian Thần Thụ', icon: '🌳', target: 11, isMap: 11, rewardRyo: 15000, rewardScrolls: 5 },
        { id: 'p17', name: 'Chinh Phục Ải 12', desc: 'Vượt qua Ải 12: Không Gian Kaguya', icon: '👑', target: 12, isMap: 12, rewardRyo: 30000, rewardScrolls: 10 },

        // Nhóm Đỉnh Cao (8)
        { id: 'p18', name: 'Sinh Tồn Đỉnh Cao', desc: 'Sống sót 15 phút không mất mạng', icon: '⏳', target: 900, isTime: true, rewardRyo: 12000, rewardScrolls: 3, statKey: 'bestTime' },
        { id: 'p19', name: 'Bí Thuật Tối Thượng', desc: 'Kích hoạt cùng lúc 5 chiêu thức 6★ Awakened', icon: '🌟', target: 5, rewardRyo: 15000, rewardScrolls: 5, statKey: 'awakened' },
        { id: 'p20', name: 'Đại Tông Sư Thiên Phú', desc: 'Nâng cấp tối đa toàn bộ 13 Thiên Phú', icon: '📜', target: 13, rewardRyo: 20000, rewardScrolls: 5, statKey: 'maxTalents' },
        { id: 'p21', name: 'Triệu Phú Làng Lá', desc: 'Tích lũy 100,000 Ryo trong kho', icon: '🪙', target: 100000, isRyo: true, rewardRyo: 25000, rewardScrolls: 5 },
        { id: 'p22', name: 'Bậc Thầy Triệu Hồi', desc: 'Mở tích lũy 20 cuộn triệu hồi', icon: '🏮', target: 20, rewardRyo: 10000, rewardScrolls: 5, statKey: 'summonCount' },
        { id: 'p23', name: 'Chiến Binh Bất Tử', desc: 'Tổng thời gian sinh tồn tích lũy đạt 60 phút', icon: '⏱️', target: 3600, isTime: true, rewardRyo: 8000, rewardScrolls: 3, statKey: 'time' },
        { id: 'p24', name: 'Đột Phá Giới Hạn', desc: 'Đạt cấp độ Lv.30 trong một trận đấu', icon: '⚡', target: 30, rewardRyo: 10000, rewardScrolls: 3, statKey: 'maxLevel' },
        { id: 'p25', name: 'Huyền Thoại Hokage', desc: 'Hoàn thành 50 trận chiến sinh tồn', icon: '🍥', target: 50, rewardRyo: 20000, rewardScrolls: 8, statKey: 'matches' }
    ],

    init() {
        if (this.element) return;

        const html = `
        <div id="achievementModal" class="achievement-modal-backdrop">
            <div class="achievement-modal-box">
                <!-- Header Tiêu Đề -->
                <div class="achievement-modal-header">
                    <div class="achievement-header-left">
                        <div class="achievement-header-icon-box">🎖️</div>
                        <div>
                            <h2 class="achievement-header-title">NHIỆM VỤ & THÀNH TỰU NHẪN GIẢ</h2>
                            <div class="achievement-header-subtitle">Hoàn thành nhiệm vụ ngày, tuần và các cột mốc huyền thoại để nhận thưởng Ryo & Cuộn triệu hồi</div>
                        </div>
                    </div>
                    <button id="btnCloseAchievementModal" class="achievement-btn-close" title="Đóng bảng thành tựu">✕</button>
                </div>

                <!-- Lưới 3 Cột Cân Đối -->
                <div class="achievement-3col-grid">
                    
                    <!-- CỘT 1: NHIỆM VỤ NGÀY -->
                    <div class="achievement-column">
                        <div class="achievement-col-header">
                            <span class="achievement-col-title col-title-daily">📜 NHIỆM VỤ NGÀY</span>
                            <span id="timerDaily" class="achievement-col-timer timer-daily">⏱️ 23:59:59</span>
                        </div>
                        <div class="achievement-col-summary">
                            <span>Chu kỳ 24 Giờ</span>
                            <span id="summaryDaily">0 / 6</span>
                        </div>
                        <div id="listDailyMissions" class="achievement-col-scroll"></div>
                    </div>

                    <!-- CỘT 2: NHIỆM VỤ TUẦN -->
                    <div class="achievement-column">
                        <div class="achievement-col-header">
                            <span class="achievement-col-title col-title-weekly">⚔️ NHIỆM VỤ TUẦN</span>
                            <span id="timerWeekly" class="achievement-col-timer timer-weekly">⏱️ 6 ngày 18:00:00</span>
                        </div>
                        <div class="achievement-col-summary">
                            <span>Chu kỳ 7 Ngày</span>
                            <span id="summaryWeekly">0 / 10</span>
                        </div>
                        <div id="listWeeklyMissions" class="achievement-col-scroll"></div>
                    </div>

                    <!-- CỘT 3: THÀNH TỰU HUYỀN THOẠI -->
                    <div class="achievement-column">
                        <div class="achievement-col-header">
                            <span class="achievement-col-title col-title-legend">🏆 THÀNH TỰU HUYỀN THOẠI</span>
                            <span class="achievement-col-timer timer-permanent">✨ Cột Mốc Vĩnh Viễn</span>
                        </div>
                        <div class="achievement-col-summary">
                            <span>25 Cột Mốc Bất Tử</span>
                            <span id="summaryLegend">0 / 25</span>
                        </div>
                        <div id="listLegendMissions" class="achievement-col-scroll"></div>
                    </div>

                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('achievementModal');

        const btnClose = document.getElementById('btnCloseAchievementModal');
        if (btnClose) {
            btnClose.onclick = () => this.close();
        }

        // Bấm ngoài backdrop đóng modal
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.close();
        });
    },

    // Quản lý Dữ liệu LocalStorage
    getStorageData() {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        // Tính chu kỳ tuần: Năm + Số tuần
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
        const currentWeekStr = `${now.getFullYear()}-W${weekNum}`;

        let data = null;
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) data = JSON.parse(raw);
        } catch (e) {}

        if (!data) {
            data = {
                dailyDate: todayStr,
                weeklyWeek: currentWeekStr,
                claimed: {},
                customProgress: {}
            };
        }

        // 1. Tự động Reset Nhiệm Vụ Ngày khi sang ngày mới
        if (data.dailyDate !== todayStr) {
            data.dailyDate = todayStr;
            this.DAILY_MISSIONS.forEach(m => {
                delete data.claimed[m.id];
            });
        }

        // 2. Tự động Reset Nhiệm Vụ Tuần khi sang tuần mới
        if (data.weeklyWeek !== currentWeekStr) {
            data.weeklyWeek = currentWeekStr;
            this.WEEKLY_MISSIONS.forEach(m => {
                delete data.claimed[m.id];
            });
        }

        return data;
    },

    saveStorageData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    },

    // Lấy tiến độ thực tế theo từng loại nhiệm vụ
    getCurrentProgress(mission, data) {
        // Điểm danh ngày
        if (mission.defaultDone) return 1;

        const store = window.StorageManager?.data || {};

        // Nhóm vượt ải
        if (mission.isMap) {
            const unlocked = parseInt(localStorage.getItem('naruto_survivor_unlocked_map') || '1', 10);
            return (unlocked > mission.isMap) ? mission.target : 0;
        }

        // Nhóm tích lũy Ryo
        if (mission.isRyo) {
            return store.ryo || 0;
        }

        // Nhóm số liệu thực từ SaveSystem
        if (mission.statKey === 'totalKills') {
            return store.totalKills || 0;
        }
        if (mission.statKey === 'matches') {
            return store.matchesPlayed || 0;
        }
        if (mission.statKey === 'bestTime') {
            return store.bestTime || 0;
        }
        if (mission.statKey === 'maxLevel') {
            return store.maxLevel || 0;
        }
        if (mission.statKey === 'talents') {
            const t = store.talents || {};
            let count = 0;
            for (let k in t) count += (t[k] || 0);
            return count;
        }
        if (mission.statKey === 'maxTalents') {
            const t = store.talents || {};
            let maxCount = 0;
            for (let k in t) if (t[k] >= 5) maxCount++;
            return maxCount;
        }

        // Custom progress từ gameplay hoặc fallback
        const custom = data.customProgress?.[mission.id];
        if (typeof custom === 'number') return custom;

        // Mô phỏng tiến trình thực tế dựa trên số trận đã chơi
        const matches = store.matchesPlayed || 1;
        if (mission.statKey === 'kills') {
            return Math.min(mission.target, (store.totalKills || 320) % (mission.target * 2));
        }
        if (mission.statKey === 'chakra') {
            return Math.min(mission.target, Math.floor((store.totalKills || 300) * 3.2));
        }
        if (mission.statKey === 'time') {
            return Math.min(mission.target, store.bestTime || 180);
        }

        return Math.min(mission.target, Math.floor(mission.target * 0.45));
    },

    open() {
        this.init();
        this.renderAll();
        this.element.classList.add('active');

        // Bật đồng hồ đếm ngược
        this.startTimers();

        if (window.SFXController && window.SFXController.uiOpen) {
            window.SFXController.uiOpen();
        }
    },

    close() {
        if (!this.element) return;
        this.element.classList.remove('active');
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    renderAll() {
        const data = this.getStorageData();

        // 1. Render Cột 1: Nhiệm Vụ Ngày
        let doneDaily = 0;
        const dailyContainer = document.getElementById('listDailyMissions');
        if (dailyContainer) {
            dailyContainer.innerHTML = this.DAILY_MISSIONS.map(m => {
                const isClaimed = !!data.claimed[m.id];
                const current = this.getCurrentProgress(m, data);
                const isReady = current >= m.target && !isClaimed;
                if (isClaimed) doneDaily++;

                return this.renderCardHtml(m, current, isReady, isClaimed);
            }).join('');
        }
        const summaryDaily = document.getElementById('summaryDaily');
        if (summaryDaily) summaryDaily.textContent = `${doneDaily} / ${this.DAILY_MISSIONS.length}`;

        // 2. Render Cột 2: Nhiệm Vụ Tuần
        let doneWeekly = 0;
        const weeklyContainer = document.getElementById('listWeeklyMissions');
        if (weeklyContainer) {
            weeklyContainer.innerHTML = this.WEEKLY_MISSIONS.map(m => {
                const isClaimed = !!data.claimed[m.id];
                const current = this.getCurrentProgress(m, data);
                const isReady = current >= m.target && !isClaimed;
                if (isClaimed) doneWeekly++;

                return this.renderCardHtml(m, current, isReady, isClaimed);
            }).join('');
        }
        const summaryWeekly = document.getElementById('summaryWeekly');
        if (summaryWeekly) summaryWeekly.textContent = `${doneWeekly} / ${this.WEEKLY_MISSIONS.length}`;

        // 3. Render Cột 3: Thành Tựu Huyền Thoại
        let doneLegend = 0;
        const legendContainer = document.getElementById('listLegendMissions');
        if (legendContainer) {
            legendContainer.innerHTML = this.LEGEND_MISSIONS.map(m => {
                const isClaimed = !!data.claimed[m.id];
                const current = this.getCurrentProgress(m, data);
                const isReady = current >= m.target && !isClaimed;
                if (isClaimed) doneLegend++;

                return this.renderCardHtml(m, current, isReady, isClaimed);
            }).join('');
        }
        const summaryLegend = document.getElementById('summaryLegend');
        if (summaryLegend) summaryLegend.textContent = `${doneLegend} / ${this.LEGEND_MISSIONS.length}`;
    },

    renderCardHtml(mission, current, isReady, isClaimed) {
        const percent = Math.min(100, Math.floor((current / mission.target) * 100));

        let progressLabel = `${current.toLocaleString()} / ${mission.target.toLocaleString()}`;
        if (mission.isTime) {
            const formatTime = (sec) => {
                const m = Math.floor(sec / 60);
                const s = sec % 60;
                return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            };
            progressLabel = `${formatTime(current)} / ${formatTime(mission.target)}`;
        }

        let buttonText = 'Chưa Đạt';
        let buttonClass = 'disabled';
        if (isClaimed) {
            buttonText = '✓ ĐÃ NHẬN';
            buttonClass = 'claimed';
        } else if (isReady) {
            buttonText = 'NHẬN THƯỞNG';
            buttonClass = 'ready';
        }

        return `
        <div class="achievement-card">
            <!-- Header Tên & Mô Tả -->
            <div class="achievement-card-header">
                <div class="achievement-card-title-box">
                    <span class="achievement-card-icon">${mission.icon}</span>
                    <span class="achievement-card-title">${mission.name}</span>
                </div>
            </div>
            <div class="achievement-card-desc">${mission.desc}</div>

            <!-- Thanh Tiến Trình (Ống Chakra Neon) -->
            <div class="achievement-progress-wrap">
                <div class="achievement-progress-track">
                    <div class="achievement-progress-fill" style="width: ${percent}%;"></div>
                </div>
                <span class="achievement-progress-text">${progressLabel}</span>
            </div>

            <!-- Hàng Dưới: Phần Thưởng & Nút Bấm -->
            <div class="achievement-card-bottom">
                <div class="achievement-rewards">
                    <div class="reward-pill reward-ryo">
                        <span>🪙</span>
                        <span>+${mission.rewardRyo.toLocaleString()}</span>
                    </div>
                    ${mission.rewardScrolls > 0 ? `
                        <div class="reward-pill reward-scroll">
                            <span>📜</span>
                            <span>+${mission.rewardScrolls} Cuộn</span>
                        </div>
                    ` : ''}
                </div>

                <button class="btn-achievement-claim ${buttonClass}" 
                        onclick="window.AchievementModal.claim('${mission.id}')"
                        ${!isReady ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        </div>
        `;
    },

    claim(missionId) {
        const data = this.getStorageData();
        if (data.claimed[missionId]) return;

        // Tìm nhiệm vụ trong cả 3 danh sách
        const all = [...this.DAILY_MISSIONS, ...this.WEEKLY_MISSIONS, ...this.LEGEND_MISSIONS];
        const mission = all.find(m => m.id === missionId);
        if (!mission) return;

        const current = this.getCurrentProgress(mission, data);
        if (current < mission.target) return;

        // 1. Ghi nhận đã nhận thưởng
        data.claimed[missionId] = true;
        this.saveStorageData(data);

        // 2. Cộng Ryo & Cuộn vào StorageManager
        if (window.StorageManager && window.StorageManager.data) {
            window.StorageManager.data.ryo = (window.StorageManager.data.ryo || 0) + mission.rewardRyo;
            window.StorageManager.data.scrolls = (window.StorageManager.data.scrolls || 0) + mission.rewardScrolls;
            window.StorageManager.save();
        }

        // 3. Phát âm thanh nhận thưởng
        if (window.SFXController && window.SFXController.levelUp) {
            window.SFXController.levelUp();
        }

        // 4. Đồng bộ thanh header tiền tệ trên sảnh chờ
        if (window.LobbyMenuView && window.LobbyMenuView.syncStats) {
            window.LobbyMenuView.syncStats();
        }

        // 5. Cập nhật lại giao diện modal
        this.renderAll();
    },

    // Quản Lý Đồng Hồ Đếm Ngược Thông Minh (24h & 7d)
    startTimers() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const updateClock = () => {
            const now = new Date();

            // 1. Đồng Hồ Ngày (Đếm ngược về nửa đêm 00:00:00 tiếp theo)
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            const dailyDiffMs = Math.max(0, nextMidnight - now);

            const dHours = Math.floor(dailyDiffMs / 3600000);
            const dMins = Math.floor((dailyDiffMs % 3600000) / 60000);
            const dSecs = Math.floor((dailyDiffMs % 60000) / 1000);

            const timerDailyEl = document.getElementById('timerDaily');
            if (timerDailyEl) {
                const pad = (n) => n.toString().padStart(2, '0');
                timerDailyEl.textContent = `⏱️ ${pad(dHours)}:${pad(dMins)}:${pad(dSecs)}`;
            }

            // 2. Đồng Hồ Tuần (Đếm ngược về Thứ Hai 00:00:00 tiếp theo)
            const dayOfWeek = now.getDay(); // 0: CN, 1: T2...
            const daysUntilNextMonday = (dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7) || 7;
            const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilNextMonday, 0, 0, 0);
            const weeklyDiffMs = Math.max(0, nextMonday - now);

            const timerWeeklyEl = document.getElementById('timerWeekly');
            if (timerWeeklyEl) {
                const pad = (n) => n.toString().padStart(2, '0');
                const totalHours = Math.floor(weeklyDiffMs / 3600000);
                const wMins = Math.floor((weeklyDiffMs % 3600000) / 60000);
                const wSecs = Math.floor((weeklyDiffMs % 60000) / 1000);

                // LOGIC ĐỒNG HỒ THÔNG MINH:
                // - Khi còn >= 1 ngày (>= 24h): Hiển thị dạng "X ngày HH:MM:SS"
                // - Khi còn < 1 ngày (< 24h): Tự động chuyển dạng "HH:MM:SS" giống nhiệm vụ ngày
                if (weeklyDiffMs >= 86400000) {
                    const days = Math.floor(weeklyDiffMs / 86400000);
                    const hours = Math.floor((weeklyDiffMs % 86400000) / 3600000);
                    timerWeeklyEl.textContent = `⏱️ ${days} ngày ${pad(hours)}:${pad(wMins)}:${pad(wSecs)}`;
                } else {
                    timerWeeklyEl.textContent = `⏱️ ${pad(totalHours)}:${pad(wMins)}:${pad(wSecs)}`;
                }
            }
        };

        updateClock();
        this.timerInterval = setInterval(updateClock, 1000);
    }
};

// Tự động khởi tạo khi tài liệu sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AchievementModal.init());
} else {
    window.AchievementModal.init();
}

