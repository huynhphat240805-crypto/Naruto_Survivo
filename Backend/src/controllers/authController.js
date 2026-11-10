/* ============================================================================
   MODULE: Backend/src/controllers/authController.js
   XỬ LÝ ĐĂNG KÝ, ĐĂNG NHẬP, PHÂN QUYỀN ADMIN/PLAYER VÀ JWT TOKEN
   ============================================================================ */

const { getDatabase } = require('../config/db');

// Khóa bí mật JWT
const JWT_SECRET = process.env.JWT_SECRET || 'naruto_hokage_secret_key_2026';

/**
 * Đăng ký tài khoản mới (Khởi đầu từ con số 0: 0 Ryo, 0 Cuộn)
 */
async function register(req, res) {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu không được để trống' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Tên đăng nhập phải từ 3 đến 20 ký tự' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Mật khẩu phải từ 6 ký tự trở lên' });
        }

        const db = getDatabase();
        if (!db) {
            return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng' });
        }

        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        const existing = db.prepare('SELECT id FROM Users WHERE username = ?').get(username);
        if (existing) {
            return res.status(409).json({ error: 'Tên đăng nhập đã được sử dụng' });
        }

        // Hash mật khẩu
        let passwordHash = password;
        try {
            const bcrypt = require('bcryptjs');
            passwordHash = await bcrypt.hash(password, 10);
        } catch (_) {
            console.warn('⚠️ [bcryptjs]: Chưa cài đặt bcryptjs, đang dùng hash tạm');
        }

        // Phân quyền: role có thể là 'admin' nếu chỉ định hoặc mặc định 'player'
        const userRole = role === 'admin' ? 'admin' : 'player';

        // Tạo tài khoản mới: Bắt đầu từ số 0 (0 Ryo, 0 Cuộn, tướng naruto 1 sao)
        const insertUser = db.prepare(`
            INSERT INTO Users (username, password_hash, role, ryo, scrolls, selected_ninja)
            VALUES (?, ?, ?, 0, 0, 'naruto')
        `);
        const info = insertUser.run(username, passwordHash, userRole);
        const userId = info.lastInsertRowid;

        // Cấp tướng mặc định Naruto 1 sao
        const insertNinja = db.prepare(`
            INSERT INTO UserNinjas (user_id, ninja_id, stars, shards)
            VALUES (?, 'naruto', 1, 0)
        `);
        insertNinja.run(userId);

        // Tạo JWT Token
        let token = `token_${userId}_${Date.now()}`;
        try {
            const jwt = require('jsonwebtoken');
            token = jwt.sign({ id: userId, username, role: userRole }, JWT_SECRET, { expiresIn: '7d' });
        } catch (_) {}

        return res.status(201).json({
            message: 'Đăng ký tài khoản thành công',
            token,
            user: {
                id: userId,
                username,
                role: userRole,
                ryo: 0,
                scrolls: 0,
                selected_ninja: 'naruto'
            }
        });
    } catch (err) {
        console.error('🔥 [authController.register]:', err);
        return res.status(500).json({ error: 'Lỗi đăng ký tài khoản', details: err.message });
    }
}

/**
 * Đăng nhập tài khoản
 */
async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' });
        }

        const db = getDatabase();
        if (!db) {
            return res.status(503).json({ error: 'Cơ sở dữ liệu chưa sẵn sàng' });
        }

        const user = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);
        if (!user) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
        }

        // Kiểm tra mật khẩu
        let isMatch = false;
        try {
            const bcrypt = require('bcryptjs');
            isMatch = await bcrypt.compare(password, user.password_hash);
        } catch (_) {
            isMatch = (password === user.password_hash);
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
        }

        // Lấy danh sách tướng đã sở hữu
        const ninjas = db.prepare('SELECT ninja_id, stars, shards FROM UserNinjas WHERE user_id = ?').all(user.id);

        // Tạo JWT Token
        let token = `token_${user.id}_${Date.now()}`;
        try {
            const jwt = require('jsonwebtoken');
            token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        } catch (_) {}

        return res.json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                ryo: user.ryo,
                scrolls: user.scrolls,
                selected_ninja: user.selected_ninja,
                ninjas: ninjas.reduce((acc, n) => {
                    acc[n.ninja_id] = { stars: n.stars, shards: n.shards };
                    return acc;
                }, {})
            }
        });
    } catch (err) {
        console.error('🔥 [authController.login]:', err);
        return res.status(500).json({ error: 'Lỗi đăng nhập', details: err.message });
    }
}

/**
 * Lấy thông tin tài khoản hiện tại từ Token
 */
function getMe(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Chưa đăng nhập' });

        const db = getDatabase();
        const user = db.prepare('SELECT id, username, role, ryo, scrolls, selected_ninja, created_at FROM Users WHERE id = ?').get(userId);
        if (!user) return res.status(404).json({ error: 'Người chơi không tồn tại' });

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
        return res.status(500).json({ error: 'Lỗi lấy thông tin người chơi', details: err.message });
    }
}

module.exports = { register, login, getMe };
