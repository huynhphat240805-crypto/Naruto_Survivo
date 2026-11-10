/* ============================================================================
   MODULE: Backend/src/routes/giftcodeRoutes.js
   ĐỊNH TUYẾN QUẢN TRỊ & NHẬP GIFTCODE
   ============================================================================ */

const express = require('express');
const router = express.Router();
const giftcodeController = require('../controllers/giftcodeController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// POST /api/giftcodes/redeem - Người chơi nhập mã quà nhận thưởng
router.post('/redeem', requireAuth, giftcodeController.redeemGiftcode);

// POST /api/giftcodes/create - Admin tạo mã giftcode mới
router.post('/create', requireAuth, requireAdmin, giftcodeController.createGiftcode);

// GET /api/giftcodes/list - Admin xem danh sách mã quà
router.get('/list', requireAuth, requireAdmin, giftcodeController.listGiftcodes);

module.exports = router;
