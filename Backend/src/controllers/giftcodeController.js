/* ============================================================================
   MODULE: Backend/src/controllers/giftcodeController.js
   QUẢN LÝ TẠO, DANH SÁCH VÀ ĐỔI GIFTCODE ĐỒNG BỘ CSDL SQLITE
   ============================================================================ */

const { getDatabase } = require('../config/db');

/**
 * Admin: Tạo mã Giftcode mới
 */
function createGiftcode(req, res) {
    try {
        const { code, ryo = 0, scrolls = 0, ninja_id = null, shards = 0, max_uses = null, expires_at = null } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Mã giftcode không hợp lệ' });
        }

        const cleanCode = code.trim().toUpperCase();
        const db = getDatabase();
        if (!db) return res.status(503).json({ error: 'CSDL chưa sẵn sàng' });

        const existing = db.prepare('SELECT id FROM Giftcodes WHERE code = ?').get(cleanCode);
        if (existing) {
            return res.status(409).json({ error: `Mã code "${cleanCode}" đã tồn tại` });
        }

        const stmt = db.prepare(`
            INSERT INTO Giftcodes (code, reward_ryo, reward_scrolls, reward_ninja_id, reward_ninja_shards, max_uses, expires_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(cleanCode, Number(ryo) || 0, Number(scrolls) || 0, ninja_id || null, Number(shards) || 0, max_uses ? Number(max_uses) : null, expires_at || null, req.user?.id || null);

        return res.status(201).json({
            message: `Tạo mã giftcode ${cleanCode} thành công!`,
            giftcode: {
                code: cleanCode,
                ryo: Number(ryo) || 0,
                scrolls: Number(scrolls) || 0,
                ninja_id,
                shards: Number(shards) || 0,
                max_uses
            }
        });
    } catch (err) {
        console.error('🔥 [giftcodeController.createGiftcode]:', err);
        return res.status(500).json({ error: 'Lỗi tạo giftcode', details: err.message });
    }
}

/**
 * Người chơi: Đổi Giftcode nhận thưởng
 */
function redeemGiftcode(req, res) {
    try {
        const { code } = req.body;
        const userId = req.user?.id;

        if (!code) {
            return res.status(400).json({ error: 'Vui lòng nhập mã quà tặng' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Vui lòng đăng nhập để đổi quà' });
        }

        const cleanCode = code.trim().toUpperCase();
        const db = getDatabase();
        if (!db) return res.status(503).json({ error: 'CSDL chưa sẵn sàng' });

        // 1. Tìm giftcode
        const gift = db.prepare('SELECT * FROM Giftcodes WHERE code = ?').get(cleanCode);
        if (!gift) {
            return res.status(404).json({ error: 'Mã quà tặng không tồn tại hoặc đã hết hạn!' });
        }

        if (!gift.is_active) {
            return res.status(400).json({ error: 'Mã quà tặng này đã bị vô hiệu hóa!' });
        }

        // Kiểm tra hạn sử dụng
        if (gift.expires_at && new Date(gift.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Mã quà tặng này đã quá hạn sử dụng!' });
        }

        // Kiểm tra giới hạn số lượt
        if (gift.max_uses !== null && gift.current_uses >= gift.max_uses) {
            return res.status(400).json({ error: 'Mã quà tặng đã hết lượt nhập!' });
        }

        // 2. Kiểm tra xem người chơi này đã từng nhập chưa
        const alreadyRedeemed = db.prepare('SELECT id FROM GiftcodeRedemptions WHERE user_id = ? AND giftcode_id = ?').get(userId, gift.id);
        if (alreadyRedeemed) {
            return res.status(400).json({ error: 'Bạn đã từng nhận phần thưởng của mã này rồi!' });
        }

        // 3. Tiến hành cộng thưởng trong transaction
        const redeemTransaction = db.transaction(() => {
            // Ghi nhận đã nhập
            db.prepare('INSERT INTO GiftcodeRedemptions (user_id, giftcode_id) VALUES (?, ?)').run(userId, gift.id);

            // Tăng số lượt đã dùng của code
            db.prepare('UPDATE Giftcodes SET current_uses = current_uses + 1 WHERE id = ?').run(gift.id);

            // Cộng Ryo và Cuộn cho người chơi
            db.prepare('UPDATE Users SET ryo = ryo + ?, scrolls = scrolls + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(gift.reward_ryo, gift.reward_scrolls, userId);

            // Cộng Mảnh tướng nếu có
            if (gift.reward_ninja_id && gift.reward_ninja_shards > 0) {
                const ninjaExist = db.prepare('SELECT id, shards FROM UserNinjas WHERE user_id = ? AND ninja_id = ?').get(userId, gift.reward_ninja_id);
                if (ninjaExist) {
                    db.prepare('UPDATE UserNinjas SET shards = shards + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(gift.reward_ninja_shards, ninjaExist.id);
                } else {
                    db.prepare('INSERT INTO UserNinjas (user_id, ninja_id, stars, shards) VALUES (?, ?, 1, ?)')
                        .run(userId, gift.reward_ninja_id, gift.reward_ninja_shards);
                }
            }
        });

        redeemTransaction();

        // Lấy lại số dư mới nhất
        const updatedUser = db.prepare('SELECT ryo, scrolls FROM Users WHERE id = ?').get(userId);

        return res.json({
            message: 'Đổi mã quà tặng thành công!',
            reward: {
                ryo: gift.reward_ryo,
                scrolls: gift.reward_scrolls,
                ninja_id: gift.reward_ninja_id,
                shards: gift.reward_ninja_shards
            },
            currentBalance: {
                ryo: updatedUser.ryo,
                scrolls: updatedUser.scrolls
            }
        });
    } catch (err) {
        console.error('🔥 [giftcodeController.redeemGiftcode]:', err);
        return res.status(500).json({ error: 'Lỗi đổi giftcode', details: err.message });
    }
}

/**
 * Admin: Liệt kê toàn bộ Giftcode
 */
function listGiftcodes(req, res) {
    try {
        const db = getDatabase();
        if (!db) return res.status(503).json({ error: 'CSDL chưa sẵn sàng' });

        const codes = db.prepare('SELECT * FROM Giftcodes ORDER BY id DESC').all();
        return res.json({ giftcodes: codes });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi lấy danh sách giftcode', details: err.message });
    }
}

module.exports = { createGiftcode, redeemGiftcode, listGiftcodes };
