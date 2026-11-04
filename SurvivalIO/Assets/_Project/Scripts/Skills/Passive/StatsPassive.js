/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Skills/Passive/StatsPassive.js
   Hệ Thống 5 Thuộc Tính Bị Động Bổ Trợ: Uy Lực, Thuấn Thân, Kết Ấn, Hút Chakra, Thể Lực
   ============================================================================ */

window.JutsuCatalog = window.JutsuCatalog || {};

// 1. Uy Lực (Tăng Sát Thương)
window.JutsuCatalog.uyluc = {
    id: 'uyluc',
    type: 'passive',
    name: 'Uy Lực (Tăng Sát Thương)',
    icon: '⚔️',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#f87171',
    maxLevel: 5,
    pairId: 'shuriken',
    pairName: 'Phi Tiêu Kunai',
    pairIcon: '✴️',
    getDesc(lv) {
        return `Tăng +${lv * 12}% Sát thương toàn bộ Nhẫn Thuật trên chiến trường (Cấp ${lv}/5).`;
    }
};

// 2. Hút Chakra (Tầm Hút EXP)
window.JutsuCatalog.hutchakra = {
    id: 'hutchakra',
    type: 'passive',
    name: 'Hút Chakra (Tầm Hút EXP)',
    icon: '🧲',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#38bdf8',
    maxLevel: 5,
    pairId: 'rasengan',
    pairName: 'Rasengan',
    pairIcon: '🌀',
    getDesc(lv) {
        return `Mở rộng +${lv * 30}% Phạm vi hút hạt Chakra và EXP từ xa (Cấp ${lv}/5).`;
    }
};

// 3. Thuấn Thân (Thân Pháp Tốc Độ)
window.JutsuCatalog.thuanthan = {
    id: 'thuanthan',
    type: 'passive',
    name: 'Thuấn Thân (Thân Pháp Tốc Độ)',
    icon: '🍃',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#4ade80',
    maxLevel: 5,
    pairId: 'chidori',
    pairName: 'Chidori',
    pairIcon: '⚡',
    getDesc(lv) {
        return `Tăng +${lv * 10}% Tốc độ di chuyển và thân pháp né tránh quái (Cấp ${lv}/5).`;
    }
};

// 4. Kết Ấn (Giảm Hồi Chiêu)
window.JutsuCatalog.ketan = {
    id: 'ketan',
    type: 'passive',
    name: 'Kết Ấn (Giảm Hồi Chiêu)',
    icon: '📜',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#c084fc',
    maxLevel: 5,
    pairId: 'fireball',
    pairName: 'Hào Hỏa Cầu',
    pairIcon: '🔥',
    getDesc(lv) {
        return `Giảm -${lv * 8}% Thời gian hồi chiêu của tất cả Nhẫn Thuật (Cấp ${lv}/5).`;
    }
};

// 5. Thể Lực (Sinh Lực Tối Đa)
window.JutsuCatalog.theluc = {
    id: 'theluc',
    type: 'passive',
    name: 'Thể Lực (Sinh Lực Tối Đa)',
    icon: '💚',
    category: 'Thuộc Tính Bổ Trợ',
    color: '#34d399',
    maxLevel: 5,
    pairId: 'clones',
    pairName: 'Kage Bunshin',
    pairIcon: '👥',
    getDesc(lv) {
        return `Tăng +${lv * 35} Máu tối đa và hồi ngay 25% Sinh Lực (Cấp ${lv}/5).`;
    }
};

// Aliases cho các tham chiếu cũ
try {
    Object.defineProperty(window.JutsuCatalog, 'shunshin', {
        get: () => window.JutsuCatalog.thuanthan,
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(window.JutsuCatalog, 'kyuubi_chakra', {
        get: () => window.JutsuCatalog.uyluc,
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
        if (skillId === 'uyluc') {
            player.damageMultiplier = (player.damageMultiplier || 1) + 0.12;
        } else if (skillId === 'hutchakra') {
            player.magnetRange = Math.round((player.magnetRange || 135) * 1.30);
        } else if (skillId === 'thuanthan') {
            player.speed = Math.round((player.speed || 215) * 1.10);
        } else if (skillId === 'ketan') {
            player.cooldownMult = Math.max(0.35, (player.cooldownMult || 1) * 0.92);
        } else if (skillId === 'theluc') {
            player.maxHp += 35;
            player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.25));
        }
    }
};

