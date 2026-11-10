/* ============================================================================
   MODULE: src/Player/PlayerStats.js
   Hệ Thống Danh Bạ Nhẫn Giả (10 Đại Shinobi), Cấp Bậc Nhẫn Giả & Chỉ Số Nâng Sao (1★ -> 5★)
   Phân hạng độ hiếm: RARE (Xanh dương), EPIC (Tím), LEGEND (Vàng Kim)
   ============================================================================ */

// Cấu hình Nâng Sao Nhẫn Giả (1★ -> 5★)
window.STAR_UPGRADE_CONFIG = {
    1: { nextShards: 20, statBonus: 0 },   // Lên 2★ cần 20 mảnh
    2: { nextShards: 50, statBonus: 10 },  // Lên 3★ cần 50 mảnh (+10% chỉ số)
    3: { nextShards: 100, statBonus: 20 }, // Lên 4★ cần 100 mảnh (+20% chỉ số)
    4: { nextShards: 200, statBonus: 30 }, // Lên 5★ cần 200 mảnh (+30% chỉ số)
    5: { nextShards: 0, statBonus: 40 }    // Mốc tối đa 5★ (+40% chỉ số)
};

// Hàm lấy đường dẫn file ảnh Avatar của từng nhân vật
window.getNinjaAvatarPath = function(avatarFile) {
    if (!avatarFile) return '';
    const isRoot = typeof window !== 'undefined' && window.location 
        ? !window.location.pathname.includes('/SurvivalIO/') : true;
    const prefix = isRoot ? 'SurvivalIO/' : '';
    return prefix + 'Assets/_Project/Textures/Player/Avatars/' + avatarFile;
};

// ============================================================================
// DANH BẠ 10 ĐẠI NHẪN GIẢ CHIẾN TRƯỜNG (CHUẨN 3 PHÂN HẠNG ĐỘ HIẾM)
// ============================================================================
window.NinjaCatalog = [
    // ------------------------------------------------------------------------
    // 1. HẠNG RARE (HIẾM - Khung viền Xanh dương #0284c7) - 4 Nhẫn Giả
    // ------------------------------------------------------------------------
    {
        id: 'naruto',
        name: 'Uzumaki Naruto',
        title: 'Cửu Vĩ Jinchuriki',
        rarity: 'RARE',
        rarityName: 'Hiếm',
        rarityColor: '#0284c7',
        element: '🌀 Phong Độn / Cửu Vĩ',
        hp: 130,
        speed: 215,
        damage: 25,
        icon: '🍥',
        avatar: 'naruto.png',
        jutsu: 'Rasengan & Kage Bunshin',
        desc: 'Ý chí Hỏa Ảnh kiên cường, nhân bản Ảnh Phân Thân trợ chiến.'
    },
    {
        id: 'sasuke',
        name: 'Uchiha Sasuke',
        title: 'Truyền Nhân Uchiha',
        rarity: 'RARE',
        rarityName: 'Hiếm',
        rarityColor: '#0284c7',
        element: '⚡ Lôi Độn / Sharingan',
        hp: 110,
        speed: 230,
        damage: 28,
        icon: '⚡',
        avatar: 'sasuke.png',
        jutsu: 'Chidori & Hào Hỏa Cầu',
        desc: 'Tốc độ chớp nhoáng, bộc phá Chidori sấm sét và hỏa cầu diện rộng.'
    },
    {
        id: 'sakura',
        name: 'Haruno Sakura',
        title: 'Y Nhẫn Quái Lực',
        rarity: 'RARE',
        rarityName: 'Hiếm',
        rarityColor: '#0284c7',
        element: '🌸 Bách Hào / Thể Thuật',
        hp: 160,
        speed: 205,
        damage: 22,
        icon: '🌸',
        avatar: 'sakura.png',
        jutsu: 'Bách Hào Trị Liệu & Quái Lực',
        desc: 'Lượng sinh lực dồi dào, khả năng tự hồi phục bền bỉ phi thường.'
    },
    {
        id: 'gaara',
        name: 'Sabaku no Gaara',
        title: 'Phong Ảnh Sa Mạc',
        rarity: 'RARE',
        rarityName: 'Hiếm',
        rarityColor: '#0284c7',
        element: '⏳ Sa Độn / Nhất Vĩ',
        hp: 145,
        speed: 210,
        damage: 26,
        icon: '⏳',
        avatar: 'gaara.png',
        jutsu: 'Sa Mạc Bão Thao & Khiên Cát',
        desc: 'Khiên cát phòng ngự tuyệt đối, phong tỏa và đè bẹp kẻ địch diện rộng.'
    },

    // ------------------------------------------------------------------------
    // 2. HẠNG EPIC (SỬ THI - Khung viền Tím #a855f7) - 3 Nhẫn Giả
    // ------------------------------------------------------------------------
    {
        id: 'kakashi',
        name: 'Hatake Kakashi',
        title: 'Ninja Sao Chép',
        rarity: 'EPIC',
        rarityName: 'Sử Thi',
        rarityColor: '#a855f7',
        element: '⚡ Lôi Độn / Sharingan',
        hp: 120,
        speed: 225,
        damage: 30,
        icon: '📖',
        avatar: 'kakashi.png',
        jutsu: 'Raikiri & Shuriken Xuyên Phá',
        desc: 'Khởi đầu với Shuriken cấp cao và nhẫn thuật Lôi Điểu uy lực.'
    },
    {
        id: 'jiraiya',
        name: 'Jiraiya (Tiên Nhân Cóc)',
        title: 'Tam Nin Huyền Thoại',
        rarity: 'EPIC',
        rarityName: 'Sử Thi',
        rarityColor: '#a855f7',
        element: '🐸 Tiên Thuật / Hỏa Độn',
        hp: 150,
        speed: 215,
        damage: 32,
        icon: '🐸',
        avatar: 'jiraiya.png',
        jutsu: 'Hỏa Độn Du Đạn & Siêu Rasengan',
        desc: 'Sức mạnh Tiên Nhân Diệu Mộc Sơn, hỏa tiễn thiêu rụi chiến trường.'
    },
    {
        id: 'itachi',
        name: 'Uchiha Itachi',
        title: 'Thiên Tài Mangekyo',
        rarity: 'EPIC',
        rarityName: 'Sử Thi',
        rarityColor: '#a855f7',
        element: '🔥 Hỏa Độn / Mangekyo',
        hp: 115,
        speed: 230,
        damage: 35,
        icon: '👁️',
        avatar: 'itachi.png',
        jutsu: 'Tsukuyomi & Hắc Hỏa Amaterasu',
        desc: 'Sát thương bộc phá Mangekyo cực mạnh, thiêu đốt mọi vật cản.'
    },

    // ------------------------------------------------------------------------
    // 3. HẠNG LEGEND (HUYỀN THOẠI - Khung viền Vàng Kim #f59e0b) - 3 Nhẫn Giả
    // ------------------------------------------------------------------------
    {
        id: 'minato',
        name: 'Namikaze Minato',
        title: 'Tia Chớp Vàng Konoha',
        rarity: 'LEGEND',
        rarityName: 'Huyền Thoại',
        rarityColor: '#f59e0b',
        element: '⚡ Phi Lôi Thần / Đệ Tứ',
        hp: 135,
        speed: 260,
        damage: 38,
        icon: '⚡',
        avatar: 'minato.png',
        jutsu: 'Phi Lôi Thần & Rasengan Siêu Tốc',
        desc: 'Tốc độ di chuyển vô địch, dịch chuyển thần tốc và kết liễu chớp nhoáng.'
    },
    {
        id: 'madara',
        name: 'Uchiha Madara',
        title: 'Huyền Thoại Nhẫn Giả',
        rarity: 'LEGEND',
        rarityName: 'Huyền Thoại',
        rarityColor: '#f59e0b',
        element: '🔥 Hoàn Thể Susanoo',
        hp: 170,
        speed: 235,
        damage: 42,
        icon: '☄️',
        avatar: 'madara.png',
        jutsu: 'Hào Hỏa Diệt Khước & Thiên Ngoại Ma Thạch',
        desc: 'Sức mạnh áp đảo thần thánh, triệu hồi thiên thạch hủy diệt chiến trường.'
    },
    {
        id: 'pain',
        name: 'Pain Lục Đạo',
        title: 'Thần Linh Akatsuki',
        rarity: 'LEGEND',
        rarityName: 'Huyền Thoại',
        rarityColor: '#f59e0b',
        element: '🟣 Luân Hồi Nhãn (Rinnegan)',
        hp: 155,
        speed: 225,
        damage: 40,
        icon: '🌀',
        avatar: 'pain.png',
        jutsu: 'Thần La Thiên Chinh & Địa Bộc Thiên Tinh',
        desc: 'Năng lực Luân Hồi Nhãn nghịch chuyển càn khôn, lực đẩy đẩy lùi mọi kẻ địch.'
    }
];

window.NinjaRanks = [
    { minLv: 1,  title: "Học Viện (Academy)" },
    { minLv: 3,  title: "Hạ Nhẫn (Genin)" },
    { minLv: 6,  title: "Trung Nhẫn (Chunin)" },
    { minLv: 10, title: "Thượng Nhẫn (Jonin)" },
    { minLv: 15, title: "Ám Bộ (Anbu)" },
    { minLv: 20, title: "Tam Nin Huyền Thoại (Sannin)" },
    { minLv: 26, title: "Ngũ Đại Kage (Hokage)" },
    { minLv: 32, title: "Lục Đạo Tiên Nhân (Six Paths)" }
];

window.getNinjaRankTitle = function(level) {
    let current = window.NinjaRanks[0].title;
    for (let i = 0; i < window.NinjaRanks.length; i++) {
        if (level >= window.NinjaRanks[i].minLv) {
            current = window.NinjaRanks[i].title;
        }
    }
    return current;
};

window.PlayerStats = {
    // Khởi tạo Player Object đầy đủ chỉ số từ Nhân vật chọn + Số sao nâng cấp + 13 Thuộc tính Thiên Phú
    createPlayer(customStartingSkill = null) {
        const selectedId = window.StorageManager.data.selectedNinja || 'naruto';
        const ninja = window.NinjaCatalog.find(n => n.id === selectedId) || window.NinjaCatalog[0];
        const t = window.StorageManager.data.talents || {};

        // Lấy số sao hiện tại của nhẫn giả (Mỗi sao tăng thêm +10% chỉ số HP, Tốc độ, Sát thương)
        const stars = (window.StorageManager.data.ninjaStars && window.StorageManager.data.ninjaStars[ninja.id]) || 1;
        const starBonusMult = 1 + (stars - 1) * 0.10; // 1★: +0%, 2★: +10%, 3★: +20%, 4★: +30%, 5★: +40%

        const hpBonus = (t.hp || 0) * 10;
        const dmgMult = (1 + (t.damage || 0) * 0.04) * starBonusMult;
        const spdMult = (1 + (t.speed || 0) * 0.03) * starBonusMult;
        const cdMult = Math.max(0.6, 1 - (t.cooldown || 0) * 0.03);
        const damageReduction = (t.armor || 0) * 0.02;
        const hpRegen = (t.regen || 0) * 0.2;
        const magMult = 1 + (t.magnet || 0) * 0.15;
        const expBonus = (t.exp_gain || 0) * 0.05;
        const critChance = (t.crit || 0) * 0.03;

        const baseHp = Math.round((ninja.hp + hpBonus) * starBonusMult);
        const baseSpeed = Math.round(ninja.speed * spdMult);

        // Xóa bỏ chiêu mặc định theo nhân vật - Khởi đầu không gán sẵn chiêu
        let startSkills = {
            shuriken: 0,
            rasengan: 0,
            fireball: 0,
            chidori: 0,
            clones: 0,
            uyluc: 0,
            hutchakra: 0,
            thuanthan: 0,
            ketan: 0,
            theluc: 0
        };

        // Nếu có customStartingSkill được truyền vào trực tiếp
        if (customStartingSkill && window.JutsuCatalog && window.JutsuCatalog[customStartingSkill]) {
            startSkills[customStartingSkill] = 1;
        }

        return {
            x: 0,
            y: 0,
            radius: 18,
            hp: baseHp,
            maxHp: baseHp,
            speed: baseSpeed,
            facing: 1,
            level: 1,
            exp: 0,
            expToNext: 15,
            magnetRange: Math.round(135 * magMult),
            damageMultiplier: dmgMult,
            cooldownMult: cdMult,
            damageReduction: damageReduction,
            hpRegen: hpRegen,
            expBonus: expBonus,
            critChance: critChance,
            ninjaType: ninja.id,
            ninjaStar: stars,
            skills: startSkills,
            acquiredActive: Object.keys(startSkills).filter(id => window.JutsuCatalog && window.JutsuCatalog[id]?.type === 'active' && startSkills[id] > 0),
            acquiredPassive: Object.keys(startSkills).filter(id => window.JutsuCatalog && window.JutsuCatalog[id]?.type === 'passive' && startSkills[id] > 0),
            evolvedSkills: {},
            kirinTimer: 0,
            susanooCooldown: 0,
            isSusanoo: false,
            susanooDuration: 0,
            susanooSlashTimer: 0,
            susanooSlashAnim: 0,
            susanooPendingWave: 0,
            cooldowns: {
                shuriken: 0,
                fireball: 0,
                chidori: 0,
                rasenshuriken: 0
            },
            rasenganAngle: 0
        };
    }
};
