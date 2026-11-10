/* ============================================================================
   MODULE: Backend/src/routes/authRoutes.js
   ĐỊNH TUYẾN ĐĂNG KÝ, ĐĂNG NHẬP & XÁC THỰC
   ============================================================================ */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/auth/register - Đăng ký tài khoản mới
router.post('/register', authController.register);

// POST /api/auth/login - Đăng nhập tài khoản
router.post('/login', authController.login);

// GET /api/auth/me - Lấy thông tin tài khoản đang đăng nhập
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
