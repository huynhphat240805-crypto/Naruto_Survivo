/* ============================================================================
   MODULE: Backend/src/controllers/userController.js
   QUẢN LÝ THÔNG TIN, SỐ DƯ RYO/CUỘN VÀ TIẾN ĐỘ TƯỚNG CỦA NGƯỜI CHƠI
   ============================================================================ */

const { getDatabase } = require('../config/db');

/**
 * Lấy toàn bộ hồ sơ người chơi
 */
function getProfile(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Chưa đăng nhập' });

        const db = getDatabase();
        if (!db) return res.status(503).json({ error: 'CSDL chưa sẵn sàng' });

        const user = db.prepare('SELECT id, username, role, ryo, scrolls, selected_ninja, created_at FROM Users WHERE id = ?').get(userId);
        if (!user) return res.status(404).json({ error: 'Không tìm thấy người chơi' });

        const ninjas = db.prepare('SELECT ninja_id, stars, shards FROM UserNinjas WHERE user_id = ?').all(userId);

        return res.json({
            user: {
                ...user,
                ninjas: ninjas.reduce((acc, n) => {
                    acc[n.ninja_id] = { stars: n.stars, shards: n.shards };
                    return acc;
                }, {})
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi lấy hồ sơ người chơi', details: err.message });
    }
}

/**
 * Đồng bộ tiến độ (Ryo, Cuộn, Tướng đang chọn, Số sao) sau trận đấu
 */
function syncProgress(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Chưa đăng nhập' });

        const { ryo, scrolls, selected_ninja, ninjas } = req.body;
        const db = getDatabase();
        if (!db) return res.status(503).json({ error: 'CSDL chưa sẵn sàng' });

        const updateTransaction = db.transaction(() => {
            // Cập nhật số dư và tướng chọn
            if (ryo !== undefined || scrolls !== undefined || selected_ninja) {
                const user = db.prepare('SELECT ryo, scrolls, selected_ninja FROM Users WHERE id = ?').get(userId);
                const newRyo = (ryo !== undefined) ? Number(ryo) : user.ryo;
                const newScrolls = (scrolls !== undefined) ? Number(scrolls) : user.scrolls;
                const newNinja = selected_ninja || user.selected_ninja;

                db.prepare(`
                    UPDATE Users 
                    SET ryo = ?, scrolls = ?, selected_ninja = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `).run(newRyo, newScrolls, newNinja, userId);
            }

            // Cập nhật dữ liệu tướng nếu có
            if (ninjas && typeof ninjas === 'object') {
                for (const [ninjaId, data] of Object.entries(ninjas)) {
                    const stars = Number(data.stars) || 1;
                    const shards = Number(data.shards) || 0;

                    const existing = db.prepare('SELECT id FROM UserNinjas WHERE user_id = ? AND ninja_id = ?').get(userId, ninjaId);
                    if (existing) {
                        db.prepare('UPDATE UserNinjas SET stars = ?, shards = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                            .run(stars, shards, existing.id);
                    } else {
                        db.prepare('INSERT INTO UserNinjas (user_id, ninja_id, stars, shards) VALUES (?, ?, ?, ?)')
                            .run(userId, ninjaId, stars, shards);
                    }
                }
            }
        });

        updateTransaction();

        return res.json({ message: 'Đồng bộ tiến độ người chơi thành công!' });
    } catch (err) {
        console.error('🔥 [userController.syncProgress]:', err);
        return res.status(500).json({ error: 'Lỗi đồng bộ tiến độ', details: err.message });
    }
}

module.exports = { getProfile, syncProgress };
