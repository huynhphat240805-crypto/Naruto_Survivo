/* ============================================================================
   MODULE: Backend/server.js
   MÁY CHỦ TRUNG TÂM NARUTO SURVIVOR (API & MULTIPLAYER CO-OP SOCKET)
   ============================================================================ */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const giftcodeRoutes = require('./src/routes/giftcodeRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { setupRoomSockets } = require('./src/sockets/roomHandler');

const app = express();
const server = http.createServer(app);

// 1. Cấu hình Socket.IO với CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// 2. Middlewares
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        game: 'Naruto Survivor Server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/giftcodes', giftcodeRoutes);
app.use('/api/user', userRoutes);

// 5. Khởi tạo Socket Quản Lý Phòng Đấu Co-op 4 Người
setupRoomSockets(io);

// 6. Xử lý lỗi 404 & Global Error Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint không tồn tại' });
});

app.use((err, req, res, next) => {
    console.error('🔥 [Server Error]:', err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ', details: err.message });
});

// 7. Khởi động Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
=====================================================
  🍃 NARUTO SURVIVOR BACKEND & CO-OP SERVER IS READY! 🍃
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Health check: http://localhost:${PORT}/api/health
=====================================================
    `);
});

module.exports = { app, server, io };
