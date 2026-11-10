/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Progression/GiftcodeSystem.js
   Hệ Thống Quản Trị & Đổi Mã Quà Tặng (Giftcode System) - Naruto Survivor
   Đồng bộ qua localStorage ('naruto_giftcodes' & 'naruto_claimed_giftcodes')
   ============================================================================ */

window.GiftcodeSystem = {
    STORAGE_KEY_CODES: 'naruto_giftcodes',
    STORAGE_KEY_CLAIMED: 'naruto_claimed_giftcodes',

    defaultCodes: {
        'NARUTO2026': {
            code: 'NARUTO2026',
            name: 'Tân Thủ Hokage 2026',
            ryo: 50000,
            scrolls: 20,
            ninjaId: 'naruto',
            ninjaShards: 30,
            description: 'Quà chào mừng Đại Chiến Nhẫn Giả 2026'
        },
        'HOKAGE': {
            code: 'HOKAGE',
            name: 'Ý Chí Tia Chớp Vàng',
            ryo: 100000,
            scrolls: 50,
            ninjaId: 'minato',
            ninjaShards: 50,
            description: 'Quà tri ân Đệ Tứ Namikaze Minato'
        },
        'AKATSUKI': {
            code: 'AKATSUKI',
            name: 'Ảo Thuật Tsukuyomi',
            ryo: 88888,
            scrolls: 30,
            ninjaId: 'itachi',
            ninjaShards: 40,
            description: 'Quà thủ lĩnh Itachi Uchiha'
        }
    },

    init() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_CODES);
            if (!raw) {
                localStorage.setItem(this.STORAGE_KEY_CODES, JSON.stringify(this.defaultCodes));
            }
        } catch (e) {
            console.warn('[GiftcodeSystem Init Warning]:', e);
        }
    },

    getAllCodes() {
        this.init();
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_CODES);
            return raw ? JSON.parse(raw) : { ...this.defaultCodes };
        } catch (e) {
            return { ...this.defaultCodes };
        }
    },

    saveCodes(codesMap) {
        try {
            localStorage.setItem(this.STORAGE_KEY_CODES, JSON.stringify(codesMap));
            return true;
        } catch (e) {
            console.error('[GiftcodeSystem Save Error]:', e);
            return false;
        }
    },

    createOrUpdateCode(giftData) {
        if (!giftData || !giftData.code) return { success: false, message: 'Mã không được để trống!' };
        const code = giftData.code.trim().toUpperCase();
        if (!code) return { success: false, message: 'Mã không hợp lệ!' };

        const all = this.getAllCodes();
        all[code] = {
            code: code,
            name: giftData.name || code,
            ryo: Math.max(0, parseInt(giftData.ryo, 10) || 0),
            scrolls: Math.max(0, parseInt(giftData.scrolls, 10) || 0),
            ninjaId: giftData.ninjaId || 'naruto',
            ninjaShards: Math.max(0, parseInt(giftData.ninjaShards, 10) || 0),
            description: giftData.description || 'Quà tặng Game Master',
            createdAt: Date.now()
        };
        this.saveCodes(all);
        return { success: true, message: `Đã lưu mã quà tặng: ${code}`, code: all[code] };
    },

    deleteCode(code) {
        if (!code) return false;
        const norm = code.trim().toUpperCase();
        const all = this.getAllCodes();
        if (all[norm]) {
            delete all[norm];
            this.saveCodes(all);
            return true;
        }
        return false;
    },

    getClaimedCodes() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_CLAIMED);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    isClaimed(code) {
        const norm = (code || '').trim().toUpperCase();
        const claimed = this.getClaimedCodes();
        return claimed.includes(norm);
    },

    claim(rawCode) {
        if (!rawCode) {
            return { success: false, message: 'Vui lòng nhập mã Giftcode!' };
        }
        const code = rawCode.trim().toUpperCase();
        const all = this.getAllCodes();
        const gift = all[code];

        if (!gift) {
            return { success: false, message: `Mã [${code}] không tồn tại hoặc đã hết hạn!` };
        }

        if (this.isClaimed(code)) {
            return { success: false, message: `Bạn đã nhận quà từ mã [${code}] này rồi!` };
        }

        if (!window.StorageManager || !window.StorageManager.data) {
            return { success: false, message: 'Hệ thống lưu trữ chưa sẵn sàng!' };
        }

        const data = window.StorageManager.data;
        const ryoAdd = gift.ryo || 0;
        const scrollsAdd = gift.scrolls || 0;
        const shardsAdd = gift.ninjaShards || 0;
        const ninjaId = gift.ninjaId || 'naruto';

        data.ryo = (data.ryo || 0) + ryoAdd;
        data.scrolls = (data.scrolls || 0) + scrollsAdd;

        if (shardsAdd > 0 && ninjaId) {
            data.ninjaShards = data.ninjaShards || {};
            data.ninjaShards[ninjaId] = (data.ninjaShards[ninjaId] || 0) + shardsAdd;
        }

        // Lưu trạng thái đã nhận
        const claimed = this.getClaimedCodes();
        if (!claimed.includes(code)) claimed.push(code);
        try {
            localStorage.setItem(this.STORAGE_KEY_CLAIMED, JSON.stringify(claimed));
        } catch (e) {}

        window.StorageManager.save();

        if (window.LobbyMenuView) {
            if (typeof window.LobbyMenuView.syncStats === 'function') window.LobbyMenuView.syncStats();
            if (typeof window.LobbyMenuView.renderShinobiRoster === 'function') window.LobbyMenuView.renderShinobiRoster();
            if (typeof window.LobbyMenuView.renderShopItems === 'function') window.LobbyMenuView.renderShopItems();
        }

        // Âm thanh chúc mừng
        if (window.SFXController && typeof window.SFXController.levelUp === 'function') {
            window.SFXController.levelUp();
        }

        return {
            success: true,
            message: `Chúc mừng! Nhận thành công quà tặng từ [${code}]!`,
            rewards: gift
        };
    }
};

// Tự động khởi tạo dữ liệu mặc định khi script nạp vào trang
window.GiftcodeSystem.init();
