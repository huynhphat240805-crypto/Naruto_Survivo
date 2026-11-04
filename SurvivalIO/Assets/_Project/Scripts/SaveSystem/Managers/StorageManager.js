/* ============================================================================
   MODULE: src/SaveSystem/StorageManager.js
   Lưu Trữ Bền Vững Ryo, Cuộn Triệu Hồi, 13 Thuộc Tính Thiên Phú & Chiến Tích
   Chuẩn kiến trúc SurvivorIO SaveSystem
   ============================================================================ */

window.StorageManager = {
    STORAGE_KEY: 'naruto_survivor_save',

    data: {
        matchesPlayed: 14,
        bestTime: 382,
        maxLevel: 18,
        totalKills: 1420,
        ryo: 24500,
        scrolls: 15,
        selectedNinja: 'naruto',
        screenShakeEnabled: true,
        talents: {
            hp: 0,             // 1. Thể Lực (+10 HP Tối Đa/cấp, Max 5)
            damage: 0,         // 2. Uy Lực (+4% Sát Thương/cấp, Max 5)
            speed: 0,          // 3. Thuấn Thân (+3% Tốc Độ Di Chuyển/cấp, Max 5)
            cooldown: 0,       // 4. Kết Ấn (-3% Cooldown/cấp, Max 5)
            armor: 0,          // 5. Giáp Chakra (+2% Giảm Sát Thương/cấp, Max 5)
            regen: 0,          // 6. Tự Lành Vết Thương (+0.2 HP/giây/cấp, Max 5)
            magnet: 0,         // 7. Hút Chakra (+15% Tầm Hút/cấp, Max 5)
            exp_gain: 0,       // 8. Ngộ Tính (+5% EXP nhận/cấp, Max 5)
            ryo_gain: 0,       // 9. Tài Phú (+8% Ryo sau trận/cấp, Max 5)
            crit: 0,           // 10. Bạo Kích (+3% Tỉ Lệ Chí Mạng x1.5/cấp, Max 5)
            reroll: 0,         // 11. Đổi Thẻ (+1 Lượt Reroll khi lên cấp, Max 3)
            ban: 0,            // 12. Phong Ấn Chiêu (Cấm chiêu xuất hiện, Max 2)
            starting_jutsu: 0  // 13. Khởi Đầu Nhẫn Thuật (Tự do chọn chiêu đầu trận, Max 1)
        },
        missions: {
            m1: true,
            m2: true,
            m3: false,
            m4: false,
            m5: false
        }
    },

    // Nạp dữ liệu từ localStorage
    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.matchesPlayed !== undefined) this.data.matchesPlayed = parsed.matchesPlayed;
                if (parsed.bestTime !== undefined) this.data.bestTime = parsed.bestTime;
                if (parsed.maxLevel !== undefined) this.data.maxLevel = parsed.maxLevel;
                if (parsed.totalKills !== undefined) this.data.totalKills = parsed.totalKills;
                if (parsed.ryo !== undefined) this.data.ryo = parsed.ryo;
                if (parsed.scrolls !== undefined) this.data.scrolls = parsed.scrolls;
                if (parsed.selectedNinja !== undefined) this.data.selectedNinja = parsed.selectedNinja;
                if (parsed.screenShakeEnabled !== undefined) this.data.screenShakeEnabled = parsed.screenShakeEnabled;
                if (parsed.talents) this.data.talents = { ...this.data.talents, ...parsed.talents };
                if (parsed.missions) this.data.missions = { ...this.data.missions, ...parsed.missions };
            }
        } catch (e) {
            console.warn("[StorageManager Load Warning]:", e);
        }
        return this.data;
    },

    // Ghi dữ liệu vào localStorage
    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error("[StorageManager Save Error]:", e);
        }
    },

    // Ghi nhận trận đấu sau khi kết thúc
    recordRun(seconds, level, kills, diamonds) {
        this.data.matchesPlayed++;
        if (seconds > this.data.bestTime) this.data.bestTime = Math.floor(seconds);
        if (level > this.data.maxLevel) this.data.maxLevel = level;
        this.data.totalKills += kills;

        // Thưởng Tài Phú (+8% mỗi cấp)
        const ryoBonus = 1 + (this.data.talents.ryo_gain || 0) * 0.08;
        const earnedRyo = Math.floor((kills * 8 + seconds * 3 + diamonds * 25) * ryoBonus);
        this.data.ryo += earnedRyo;

        // Thưởng vé triệu hồi nếu sống sót lâu
        if (seconds >= 180) this.data.scrolls += 1;
        if (seconds >= 360) this.data.scrolls += 2;

        this.save();
        return earnedRyo;
    },

    // Nâng cấp 1 bậc thiên phú
    upgradeTalent(talentId, cost) {
        if (this.data.ryo >= cost) {
            this.data.ryo -= cost;
            this.data.talents[talentId] = (this.data.talents[talentId] || 0) + 1;
            this.save();
            return true;
        }
        return false;
    },

    // Đặt lại toàn bộ dữ liệu ban đầu
    reset() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {}
    }
};

// Aliases cho code cũ gọi GameStats
window.GameStats = {
    get matchesPlayed() { return window.StorageManager.data.matchesPlayed; },
    set matchesPlayed(v) { window.StorageManager.data.matchesPlayed = v; },
    get bestTime() { return window.StorageManager.data.bestTime; },
    set bestTime(v) { window.StorageManager.data.bestTime = v; },
    get maxLevel() { return window.StorageManager.data.maxLevel; },
    set maxLevel(v) { window.StorageManager.data.maxLevel = v; },
    get totalKills() { return window.StorageManager.data.totalKills; },
    set totalKills(v) { window.StorageManager.data.totalKills = v; },
    get ryo() { return window.StorageManager.data.ryo; },
    set ryo(v) { window.StorageManager.data.ryo = v; },
    get scrolls() { return window.StorageManager.data.scrolls; },
    set scrolls(v) { window.StorageManager.data.scrolls = v; },
    get selectedNinja() { return window.StorageManager.data.selectedNinja; },
    set selectedNinja(v) { window.StorageManager.data.selectedNinja = v; },
    get screenShakeEnabled() { return window.StorageManager.data.screenShakeEnabled; },
    set screenShakeEnabled(v) { window.StorageManager.data.screenShakeEnabled = v; },
    get talents() { return window.StorageManager.data.talents; },
    set talents(v) { window.StorageManager.data.talents = v; },
    get missions() { return window.StorageManager.data.missions; },
    set missions(v) { window.StorageManager.data.missions = v; },

    load() { return window.StorageManager.load(); },
    save() { return window.StorageManager.save(); },
    recordRun(s, l, k, d) { return window.StorageManager.recordRun(s, l, k, d); },
    syncLobbyUI() {
        if (window.LobbyView && typeof window.LobbyView.syncStats === 'function') {
            window.LobbyView.syncStats();
        }
    }
};

