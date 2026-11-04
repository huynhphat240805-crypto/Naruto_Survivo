/* ============================================================================
   MODULE: src/Progression/TalentTree.js
   Hệ Thống Cường Hóa 13 Thuộc Tính Vĩnh Viễn Chuẩn PokéSurvivor
   ============================================================================ */

window.TalentDefinitions = [
    {
        id: 'hp',
        name: 'Thể Lực',
        subtitle: 'Sinh lực',
        icon: '🩸',
        bonus: '+10 HP Tối Đa',
        maxLevel: 5,
        baseCost: 500,
        costMult: 1.5,
        desc: 'Gia tăng lượng sinh mệnh bền bỉ'
    },
    {
        id: 'damage',
        name: 'Uy Lực',
        subtitle: 'Sức mạnh',
        icon: '⚔️',
        bonus: '+4% Sát Thương Nhẫn Thuật',
        maxLevel: 5,
        baseCost: 700,
        costMult: 1.55,
        desc: 'Tăng uy lực toàn bộ nhẫn thuật'
    },
    {
        id: 'speed',
        name: 'Thuấn Thân',
        subtitle: 'Tốc độ',
        icon: '⚡',
        bonus: '+3% Tốc Độ Di Chuyển',
        maxLevel: 5,
        baseCost: 550,
        costMult: 1.5,
        desc: 'Thân pháp lướt gió nhanh nhẹn né tránh'
    },
    {
        id: 'cooldown',
        name: 'Kết Ấn',
        subtitle: 'Niệm chú',
        icon: '📜',
        bonus: '-3% Thời Gian Cooldown',
        maxLevel: 5,
        baseCost: 650,
        costMult: 1.5,
        desc: 'Tăng tốc kết ấn, giảm hồi chiêu'
    },
    {
        id: 'armor',
        name: 'Giáp Chakra',
        subtitle: 'Phòng ngự',
        icon: '🛡️',
        bonus: '+2% Giảm Sát Thương',
        maxLevel: 5,
        baseCost: 500,
        costMult: 1.5,
        desc: 'Màng chakra bảo hộ giảm tổn thương'
    },
    {
        id: 'regen',
        name: 'Tự Lành Vết Thương',
        subtitle: 'Tái sinh',
        icon: '💚',
        bonus: '+0.2 HP Hồi Phục/giây',
        maxLevel: 5,
        baseCost: 800,
        costMult: 1.6,
        desc: 'Tế bào đệ nhất hồi máu liên tục'
    },
    {
        id: 'magnet',
        name: 'Hút Chakra',
        subtitle: 'Tầm hút',
        icon: '🌀',
        bonus: '+15% Tầm Hút Ngọc EXP',
        maxLevel: 5,
        baseCost: 400,
        costMult: 1.45,
        desc: 'Tỏa lực hút hạt chakra từ xa'
    },
    {
        id: 'exp_gain',
        name: 'Ngộ Tính',
        subtitle: 'Tu vi',
        icon: '🧠',
        bonus: '+5% Lượng EXP Từ Quái',
        maxLevel: 5,
        baseCost: 600,
        costMult: 1.5,
        desc: 'Hấp thu chakra thăng cấp nhanh hơn'
    },
    {
        id: 'ryo_gain',
        name: 'Tài Phú',
        subtitle: 'Tài vận',
        icon: '🪙',
        bonus: '+8% Tiền Ryo Sau Trận',
        maxLevel: 5,
        baseCost: 550,
        costMult: 1.5,
        desc: 'Tăng thu nhập ryo sau mỗi chiến dịch'
    },
    {
        id: 'crit',
        name: 'Bạo Kích',
        subtitle: 'Chí mạng',
        icon: '💥',
        bonus: '+3% Tỉ Lệ Chí Mạng (x1.5)',
        maxLevel: 5,
        baseCost: 750,
        costMult: 1.6,
        desc: 'Tung đòn bạo kích gây sát thương x1.5'
    },
    {
        id: 'reroll',
        name: 'Đổi Thẻ',
        subtitle: 'Reroll',
        icon: '🎲',
        bonus: '+1 Lượt Làm Mới Thẻ',
        maxLevel: 3,
        baseCost: 1200,
        costMult: 1.8,
        desc: 'Đổi danh sách 3 thẻ khi lên cấp'
    },
    {
        id: 'ban',
        name: 'Phong Ấn Chiêu',
        subtitle: 'Ban',
        icon: '🚫',
        bonus: 'Cấm 1 Nhẫn Thuật/Trận',
        maxLevel: 2,
        baseCost: 1800,
        costMult: 2.0,
        desc: 'Phong ấn chiêu không mong muốn'
    },
    {
        id: 'starting_jutsu',
        name: 'Khởi Đầu Nhẫn Thuật',
        subtitle: 'Starting move',
        icon: '🌟',
        bonus: 'Tự Do Chọn Chiêu Đầu Trận',
        maxLevel: 1,
        baseCost: 3000,
        costMult: 1.0,
        desc: 'Tự do chọn bí kíp xuất phát tùy ý'
    }
];

window.TalentTree = {
    // Tính chi phí nâng cấp
    getCost(talentId) {
        const def = window.TalentDefinitions.find(t => t.id === talentId);
        if (!def) return 0;
        const currentLv = window.StorageManager.data.talents[talentId] || 0;
        if (currentLv >= def.maxLevel) return 0;
        return Math.floor(def.baseCost * Math.pow(def.costMult, currentLv));
    },

    // Kiểm tra có thể mua không
    canUpgrade(talentId) {
        const def = window.TalentDefinitions.find(t => t.id === talentId);
        if (!def) return false;
        const currentLv = window.StorageManager.data.talents[talentId] || 0;
        if (currentLv >= def.maxLevel) return false;
        const cost = this.getCost(talentId);
        return window.StorageManager.data.ryo >= cost;
    },

    // Tiến hành mua nâng cấp
    buyUpgrade(talentId) {
        const def = window.TalentDefinitions.find(t => t.id === talentId);
        if (!def) return false;
        const currentLv = window.StorageManager.data.talents[talentId] || 0;
        if (currentLv >= def.maxLevel) return false;

        const cost = this.getCost(talentId);
        if (window.StorageManager.upgradeTalent(talentId, cost)) {
            if (window.SFXController) window.SFXController.talentUpgrade();
            if (window.UpgradeModal) window.UpgradeModal.render();
            if (window.LobbyView) window.LobbyView.syncStats();
            return true;
        } else {
            if (window.SFXController) window.SFXController.uiClick();
            alert(`Bạn không đủ đồng Ryo! Cần ${cost.toLocaleString()} Ryo để nâng cấp.`);
            return false;
        }
    }
};

// Hàm toàn cục cho nút onclick nếu có
window.upgradeTalent = function(talentId) {
    window.TalentTree.buyUpgrade(talentId);
};

