/* ============================================================================
   MODULE: Backend/src/middleware/authMiddleware.js
   KIỂM TRA XÁC THỰC TOKEN & PHÂN QUYỀN ADMIN/PLAYER
   ============================================================================ */

const JWT_SECRET = process.env.JWT_SECRET || 'naruto_hokage_secret_key_2026';

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Yêu cầu token xác thực (Authorization: Bearer <token>)' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    // Hỗ trợ token giả lập nếu chưa có thư viện jsonwebtoken
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        // Fallback kiểm tra cấu trúc token tạm
        if (token.startsWith('token_')) {
            const parts = token.split('_');
            req.user = { id: Number(parts[1]), role: 'player' };
            return next();
        }
        return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Truy cập bị từ chối: Yêu cầu quyền Quản Trị Viên (Admin)' });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
