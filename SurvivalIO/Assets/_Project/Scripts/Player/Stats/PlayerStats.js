/* ============================================================================
   MODULE: src/Player/PlayerStats.js
   Hệ Thống Danh Bạ Nhẫn Giả, Bảng Cấp Bậc (Genin -> Lục Đạo) & Chỉ Số Người Chơi
   ============================================================================ */

window.NinjaCatalog = [
    {
        id: 'naruto',
        name: 'Uzumaki Naruto',
        title: 'Cửu Vĩ Jinchuriki',
        element: '🌀 Phong Độn / Cửu Vĩ',
        hp: 130,
        speed: 215,
        icon: '🍥',
        jutsu: 'Rasengan & Kage Bunshin',
        desc: 'Ý chí Hỏa Ảnh kiên cường, nhân bản Ảnh Phân Thân trợ chiến.'
    },
    {
        id: 'sasuke',
        name: 'Uchiha Sasuke',
        title: 'Truyền Nhân Uchiha',
        element: '⚡ Lôi Độn / Sharingan',
        hp: 110,
        speed: 230,
        icon: '⚡',
        jutsu: 'Chidori & Hào Hỏa Cầu',
        desc: 'Tốc độ cực nhanh, bộc phá Chidori sấm sét và hỏa cầu diện rộng.'
    },
    {
        id: 'kakashi',
        name: 'Hatake Kakashi',
        title: 'Ninja Sao Chép',
        element: '⚡ Lôi Độn / Thổ Độn',
        hp: 115,
        speed: 220,
        icon: '📖',
        jutsu: 'Chidori & Phi Tiêu Shuriken Lv.2',
        desc: 'Khởi đầu với Shuriken cấp 2 và nhẫn thuật sấm sét uy lực.'
    },
    {
        id: 'sakura',
        name: 'Haruno Sakura',
        title: 'Y Nhẫn Quái Lực',
        element: '🌸 Thủy Độn / Bách Hào',
        hp: 160,
        speed: 205,
        icon: '🌸',
        jutsu: 'Bách Hào Trị Liệu & Rasengan',
        desc: 'Lượng sinh lực dồi dào, phòng thủ vững vàng trên chiến trường.'
    },
    {
        id: 'itachi',
        name: 'Uchiha Itachi',
        title: 'Thiên Tài Ám Bộ',
        element: '🔥 Hỏa Độn / Mangekyo',
        hp: 105,
        speed: 225,
        icon: '👁️',
        jutsu: 'Đại Hỏa Cầu & Shuriken Nổ',
        desc: 'Sát thương bộc phá Hỏa Độn cực mạnh, thiêu đốt diện rộng.'
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
    // Khởi tạo Player Object đầy đủ chỉ số từ Nhân vật chọn + 13 Thuộc tính Thiên Phú
    createPlayer(customStartingSkill = null) {
        const selectedId = window.StorageManager.data.selectedNinja || 'naruto';
        const ninja = window.NinjaCatalog.find(n => n.id === selectedId) || window.NinjaCatalog[0];
        const t = window.StorageManager.data.talents || {};

        const hpBonus = (t.hp || 0) * 10;
        const dmgMult = 1 + (t.damage || 0) * 0.04;
        const spdMult = 1 + (t.speed || 0) * 0.03;
        const cdMult = Math.max(0.6, 1 - (t.cooldown || 0) * 0.03);
        const damageReduction = (t.armor || 0) * 0.02;
        const hpRegen = (t.regen || 0) * 0.2;
        const magMult = 1 + (t.magnet || 0) * 0.15;
        const expBonus = (t.exp_gain || 0) * 0.05;
        const critChance = (t.crit || 0) * 0.03;

        const baseHp = ninja.hp + hpBonus;
        const baseSpeed = Math.round(ninja.speed * spdMult);

        // Kỹ năng ban đầu
        let startSkills = {
            shuriken: ninja.id === 'kakashi' ? 2 : 1,
            rasengan: (ninja.id === 'naruto' || ninja.id === 'sakura') ? 1 : 0,
            fireball: (ninja.id === 'itachi' || ninja.id === 'sasuke') ? 1 : 0,
            chidori: (ninja.id === 'sasuke' || ninja.id === 'kakashi') ? 1 : 0,
            clones: ninja.id === 'naruto' ? 1 : 0,
            uyluc: 0,
            hutchakra: 0,
            thuanthan: 0,
            ketan: 0,
            theluc: 0
        };

        // Nếu người chơi chọn chiêu thức xuất phát từ thiên phú Khởi Đầu Nhẫn Thuật
        if (customStartingSkill && window.JutsuCatalog[customStartingSkill]) {
            startSkills = {
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
            startSkills[customStartingSkill] = 1;
            if (customStartingSkill === 'shuriken' && ninja.id === 'kakashi') {
                startSkills.shuriken = 2;
            }
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
            skills: startSkills,
            acquiredActive: Object.keys(startSkills).filter(id => window.JutsuCatalog[id]?.type === 'active' && startSkills[id] > 0),
            acquiredPassive: Object.keys(startSkills).filter(id => window.JutsuCatalog[id]?.type === 'passive' && startSkills[id] > 0),
            evolvedSkills: {},
            kirinTimer: 0,
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

