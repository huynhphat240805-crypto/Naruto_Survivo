/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Passive/StatsPassive.js
   Hệ Thống 10 Thuộc Tính Bị Động Bổ Trợ (Passives) Phục Vụ 20 Nhẫn Thuật Tiến Hóa 6★
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 1. Phạm Vi Chiêu (Area) - Tăng kích thước vùng ảnh hưởng của mọi kỹ năng
window.JutsuCatalog.area = {
    id: 'area',
    type: 'passive',
    name: 'Phạm Vi Chiêu (Area)',
    icon: '🌐',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#fb923c',
    maxLevel: 5,
    pairId: 'fireball',
    pairName: 'Hào Hỏa Cầu',
    pairIcon: '🔥',
    getDesc(lv) {
        return `Tăng +${lv * 15}% Phạm vi ảnh hưởng và kích thước vùng nổ của toàn bộ Nhẫn Thuật (Cấp ${lv}/5).`;
    }
};

// 2. Kéo Dài Tác Dụng (Duration) - Tăng thời gian hiệu ứng thiêu đốt, bão tuyết, lửa đen
window.JutsuCatalog.duration = {
    id: 'duration',
    type: 'passive',
    name: 'Thời Gian (Duration)',
    icon: '⏳',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#a78bfa',
    maxLevel: 5,
    pairId: 'flamethrower',
    pairName: 'Hỏa Long Viêm Đạn',
    pairIcon: '🐲',
    getDesc(lv) {
        return `Kéo dài +${lv * 20}% Thời gian duy trì các hiệu ứng thiêu đốt, khống chế và vùng kỹ năng (Cấp ${lv}/5).`;
    }
};

// 3. Uy Lực (Damage) - Tăng sát thương toàn diện
window.JutsuCatalog.dame = {
    id: 'dame',
    type: 'passive',
    name: 'Uy Lực (Sát Thương)',
    icon: '⚔️',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#f87171',
    maxLevel: 5,
    pairId: 'meteor',
    pairName: 'Thiên Thạch Rơi',
    pairIcon: '☄️',
    getDesc(lv) {
        return `Tăng +${lv * 14}% Sát thương cho tất cả Nhẫn Thuật trên chiến trường (Cấp ${lv}/5).`;
    }
};
// Alias tương thích cũ 'uyluc'
window.JutsuCatalog.uyluc = window.JutsuCatalog.dame;

// 4. Thuấn Thân (Move Speed) - Tăng tốc độ di chuyển
window.JutsuCatalog.speed = {
    id: 'speed',
    type: 'passive',
    name: 'Thuấn Thân (Tốc Độ)',
    icon: '🍃',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#4ade80',
    maxLevel: 5,
    pairId: 'fire_tornado',
    pairName: 'Hỏa Phong Long Quyển',
    pairIcon: '🌪️',
    getDesc(lv) {
        return `Tăng +${lv * 10}% Tốc độ di chuyển và thân pháp né tránh quái (Cấp ${lv}/5).`;
    }
};
// Alias tương thích cũ 'thuanthan' & 'shunshin'
window.JutsuCatalog.thuanthan = window.JutsuCatalog.speed;

// 5. Kết Ấn (Cooldown) - Giảm thời gian hồi chiêu
window.JutsuCatalog.cooldown = {
    id: 'cooldown',
    type: 'passive',
    name: 'Kết Ấn (Giảm Hồi Chiêu)',
    icon: '📜',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#c084fc',
    maxLevel: 5,
    pairId: 'chidori',
    pairName: 'Thiên Điểu Sét Lan',
    pairIcon: '⚡',
    getDesc(lv) {
        return `Giảm -${lv * 8}% Thời gian hồi chiêu của tất cả Nhẫn Thuật (Cấp ${lv}/5).`;
    }
};
// Alias tương thích cũ 'ketan'
window.JutsuCatalog.ketan = window.JutsuCatalog.cooldown;

// 6. Bạo Kích (Critical Hit) - Tăng tỉ lệ & sát thương chí mạng
window.JutsuCatalog.crit = {
    id: 'crit',
    type: 'passive',
    name: 'Bạo Kích (Chí Mạng)',
    icon: '💥',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#facc15',
    maxLevel: 5,
    pairId: 'lightning_strike',
    pairName: 'Kirin Thiên Lôi',
    pairIcon: '🌩️',
    getDesc(lv) {
        return `Tăng +${lv * 7}% Tỉ lệ Chí Mạng và +${lv * 25}% Sát Thương Chí Mạng (Cấp ${lv}/5).`;
    }
};

// 7. Giáp Hộ Thể (Armor) - Tăng kháng sát thương và giảm sát thương nhận vào
window.JutsuCatalog.armor = {
    id: 'armor',
    type: 'passive',
    name: 'Giáp Hộ Thể (Armor)',
    icon: '🛡️',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#60a5fa',
    maxLevel: 5,
    pairId: 'lightning_armor',
    pairName: 'Lôi Giáp Hộ Thể',
    pairIcon: '⚡',
    getDesc(lv) {
        return `Giảm -${lv * 8}% Sát thương phải gánh chịu từ quái và đạn địch (Cấp ${lv}/5).`;
    }
};

// 8. Hút Chakra (Magnet) - Tầm hút ngọc EXP
window.JutsuCatalog.magnet = {
    id: 'magnet',
    type: 'passive',
    name: 'Hút Chakra (Tầm Hút EXP)',
    icon: '🧲',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#38bdf8',
    maxLevel: 5,
    pairId: 'plasma_orb',
    pairName: 'Lôi Cầu Tĩnh Điện',
    pairIcon: '🔮',
    getDesc(lv) {
        return `Mở rộng +${lv * 35}% Phạm vi tự động hút hạt Chakra EXP và Kim Cương từ xa (Cấp ${lv}/5).`;
    }
};
// Alias tương thích cũ 'hutchakra'
window.JutsuCatalog.hutchakra = window.JutsuCatalog.magnet;

// 9. Thể Lực (Max HP) - Tăng sinh lực tối đa
window.JutsuCatalog.hp = {
    id: 'hp',
    type: 'passive',
    name: 'Thể Lực (Sinh Lực Tối Đa)',
    icon: '💚',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#34d399',
    maxLevel: 5,
    pairId: 'ice_spikes',
    pairName: 'Ma Kính Băng Chông',
    pairIcon: '🧊',
    getDesc(lv) {
        return `Tăng +${lv * 50} Máu tối đa và hồi ngay 20% Sinh Lực (Cấp ${lv}/5).`;
    }
};
// Alias tương thích cũ 'theluc'
window.JutsuCatalog.theluc = window.JutsuCatalog.hp;

// 10. Trị Thương Thuật (HP Regen) - Hồi máu theo thời gian
window.JutsuCatalog.regen = {
    id: 'regen',
    type: 'passive',
    name: 'Trị Thương Thuật (Hồi Máu)',
    icon: '✨',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#f472b6',
    maxLevel: 5,
    pairId: 'water_jet',
    pairName: 'Thủy Long Đạn',
    pairIcon: '🌊',
    getDesc(lv) {
        return `Tự động hồi phục +${lv * 2.5} Máu mỗi giây liên tục trên chiến trường (Cấp ${lv}/5).`;
    }
};

// Aliases cho các tham chiếu cũ
try {
    Object.defineProperty(window.JutsuCatalog, 'shunshin', {
        get: () => window.JutsuCatalog.speed,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(window.JutsuCatalog, 'kyuubi_chakra', {
        get: () => window.JutsuCatalog.dame,
        enumerable: false,
        configurable: true
    });
} catch (e) {}

// Hàm lấy danh sách duy nhất các chiêu thức từ JutsuCatalog
window.getUniqueCatalogEntries = function() {
    const seen = new Set();
    const result = [];
    for (const key of Object.keys(window.JutsuCatalog)) {
        const item = window.JutsuCatalog[key];
        if (item && item.id && !seen.has(item.id)) {
            seen.add(item.id);
            result.push(item);
        }
    }
    return result;
};

window.StatsPassive = {
    apply(skillId, player) {
        if (!player) return;
        player.passives = player.passives || {};
        const lv = player.skills[skillId] || 0;

        // Đồng bộ alias
        if (skillId === 'dame' || skillId === 'uyluc') {
            player.skills.dame = lv;
            player.skills.uyluc = lv;
            player.damageMultiplier = 1 + lv * 0.14;
        } else if (skillId === 'speed' || skillId === 'thuanthan') {
            player.skills.speed = lv;
            player.skills.thuanthan = lv;
            player.speed = Math.round(215 * (1 + lv * 0.10));
        } else if (skillId === 'cooldown' || skillId === 'ketan') {
            player.skills.cooldown = lv;
            player.skills.ketan = lv;
            player.cooldownMult = Math.max(0.30, 1 - lv * 0.08);
        } else if (skillId === 'magnet' || skillId === 'hutchakra') {
            player.skills.magnet = lv;
            player.skills.hutchakra = lv;
            player.magnetRange = Math.round(135 * (1 + lv * 0.35));
        } else if (skillId === 'hp' || skillId === 'theluc') {
            player.skills.hp = lv;
            player.skills.theluc = lv;
            player.maxHp = (player.baseMaxHp || 100) + lv * 50;
            player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.20));
        } else if (skillId === 'area') {
            player.areaMultiplier = 1 + lv * 0.15;
        } else if (skillId === 'duration') {
            player.durationMultiplier = 1 + lv * 0.20;
        } else if (skillId === 'crit') {
            player.critChance = 0.05 + lv * 0.07;
            player.critDamage = 1.5 + lv * 0.25;
        } else if (skillId === 'armor') {
            player.armorReduction = lv * 0.08; // Giảm tối đa 40% sát thương
        } else if (skillId === 'regen') {
            player.hpRegenRate = lv * 2.5; // Hồi máu mỗi giây
        }
    }
};
