/* ============================================================================
   MODULE: Backend/src/routes/userRoutes.js
   ĐỊNH TUYẾN HỒ SƠ & TIẾN ĐỘ NGƯỜI CHƠI
   ============================================================================ */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/user/profile - Lấy thông tin & tiến độ tướng của người chơi
router.get('/profile', requireAuth, userController.getProfile);

// POST /api/user/sync - Đồng bộ tiến độ (Ryo, Cuộn, Tướng) lên CSDL SQLite
router.post('/sync', requireAuth, userController.syncProgress);

module.exports = router;
