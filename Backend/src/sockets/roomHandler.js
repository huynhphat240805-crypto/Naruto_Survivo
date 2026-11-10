/* ============================================================================
   MODULE: Backend/src/sockets/roomHandler.js
   LOGIC QUẢN LÝ TỔ ĐỘI 4 NGƯỜI CHƠI CO-OP BẰNG MÃ CODE
   - Tạo mã phòng 6 ký tự
   - Tham gia phòng bằng mã code
   - Giới hạn tối đa 4 người chơi
   - Bắt đầu trận & Đồng bộ di chuyển / chiêu thức realtime
   ============================================================================ */

// Danh sách phòng tổ đội hoạt động trong RAM máy chủ
// Cấu trúc: roomCode => { code, hostId, maxPlayers: 4, status: 'WAITING'|'PLAYING', players: [] }
const rooms = new Map();

/**
 * Sinh mã code phòng ngẫu nhiên 6 ký tự dễ nhớ (VD: KAGE88, SHIN77, ANBU12)
 */
function generateRoomCode() {
    const prefixes = ['KAGE', 'SHIN', 'ANBU', 'NINJ', 'CHAK', 'LEAF', 'RAIK', 'TSUK'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    return `${prefix}${num}`;
}

function setupRoomSockets(io) {
    io.on('connection', (socket) => {
        console.log(`🔌 [Socket]: Nhẫn giả kết nối [SocketId: ${socket.id}]`);

        let currentRoomCode = null;

        /**
         * 1. TẠO PHÒNG MỚI (CHỦ PHÒNG / HOST)
         */
        socket.on('create_room', (data, callback) => {
            try {
                if (currentRoomCode) leaveCurrentRoom(socket);

                let roomCode;
                let attempts = 0;
                do {
                    roomCode = generateRoomCode();
                    attempts++;
                } while (rooms.has(roomCode) && attempts < 10);

                const hostPlayer = {
                    socketId: socket.id,
                    userId: data?.userId || null,
                    username: data?.username || 'Chủ Phòng',
                    ninjaId: data?.ninjaId || 'naruto',
                    stars: data?.stars || 1,
                    isHost: true,
                    isReady: true,
                    x: 0,
                    y: 0,
                    hp: 100,
                    maxHp: 100
                };

                const newRoom = {
                    code: roomCode,
                    hostId: socket.id,
                    maxPlayers: 4,
                    status: 'WAITING',
                    mapId: data?.mapId || 'map_leaf_forest',
                    createdAt: Date.now(),
                    players: [hostPlayer]
                };

                rooms.set(roomCode, newRoom);
                socket.join(roomCode);
                currentRoomCode = roomCode;

                console.log(`🏰 [Tổ Đội Co-op]: Tạo phòng mới thành công! [Mã Code: ${roomCode}] bởi ${hostPlayer.username}`);

                if (typeof callback === 'function') {
                    callback({ success: true, room: newRoom });
                }
            } catch (err) {
                console.error('🔥 [create_room]:', err);
                if (typeof callback === 'function') callback({ success: false, error: err.message });
            }
        });

        /**
         * 2. THAM GIA TỔ ĐỘI BẰNG MÃ CODE (TỐI ĐA 4 NGƯỜI)
         */
        socket.on('join_room', (data, callback) => {
            try {
                const roomCode = (data?.roomCode || '').trim().toUpperCase();
                const room = rooms.get(roomCode);

                if (!room) {
                    if (typeof callback === 'function') {
                        return callback({ success: false, error: 'Mã phòng không tồn tại!' });
                    }
                    return;
                }

                if (room.status === 'PLAYING') {
                    if (typeof callback === 'function') {
                        return callback({ success: false, error: 'Trận chiến đang diễn ra, không thể tham gia!' });
                    }
                    return;
                }

                if (room.players.length >= room.maxPlayers) {
                    if (typeof callback === 'function') {
                        return callback({ success: false, error: 'Phòng đã đủ 4 người chơi (tối đa 4/4)!' });
                    }
                    return;
                }

                if (room.players.some(p => p.socketId === socket.id)) {
                    if (typeof callback === 'function') return callback({ success: true, room });
                    return;
                }

                const newPlayer = {
                    socketId: socket.id,
                    userId: data?.userId || null,
                    username: data?.username || `Nhẫn Giả ${room.players.length + 1}`,
                    ninjaId: data?.ninjaId || 'sasuke',
                    stars: data?.stars || 1,
                    isHost: false,
                    isReady: false,
                    x: 0,
                    y: 0,
                    hp: 100,
                    maxHp: 100
                };

                room.players.push(newPlayer);
                socket.join(roomCode);
                currentRoomCode = roomCode;

                console.log(`🤝 [Tổ Đội Co-op]: ${newPlayer.username} đã gia nhập phòng [${roomCode}] (${room.players.length}/4 người)`);

                io.to(roomCode).emit('room_updated', { room });

                if (typeof callback === 'function') {
                    callback({ success: true, room });
                }
            } catch (err) {
                console.error('🔥 [join_room]:', err);
                if (typeof callback === 'function') callback({ success: false, error: err.message });
            }
        });

        /**
         * 3. BẬT/TẮT TRẠNG THÁI SẴN SÀNG
         */
        socket.on('toggle_ready', () => {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) return;

            const player = room.players.find(p => p.socketId === socket.id);
            if (player && !player.isHost) {
                player.isReady = !player.isReady;
                io.to(currentRoomCode).emit('room_updated', { room });
            }
        });

        /**
         * 4. BẮT ĐẦU TRẬN ĐẤU (CHỈ CHỦ PHÒNG ĐƯỢC PHÉP)
         */
        socket.on('start_game', (data, callback) => {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) return;

            if (room.hostId !== socket.id) {
                if (typeof callback === 'function') {
                    return callback({ success: false, error: 'Chỉ Chủ Phòng mới có quyền xuất trận!' });
                }
                return;
            }

            const allReady = room.players.every(p => p.isReady);
            if (!allReady && room.players.length > 1) {
                if (typeof callback === 'function') {
                    return callback({ success: false, error: 'Còn đồng đội chưa sẵn sàng chiến đấu!' });
                }
                return;
            }

            room.status = 'PLAYING';
            const seed = Math.floor(Math.random() * 1000000);

            console.log(`⚔️ [Tổ Đội Xuất Trận]: Phòng [${room.code}] bắt đầu trận đấu Co-op 4 người (Seed: ${seed})`);

            io.to(currentRoomCode).emit('game_started', {
                roomCode: room.code,
                seed: seed,
                mapId: room.mapId,
                players: room.players
            });

            if (typeof callback === 'function') callback({ success: true });
        });

        /**
         * 5. ĐỒNG BỘ TRẠNG THÁI THỜI GIAN THỰC (REALTIME SYNC TỌA ĐỘ, CHIÊU THỨC, MÁU)
         */
        socket.on('player_sync', (state) => {
            if (!currentRoomCode) return;
            socket.to(currentRoomCode).emit('peer_synced', {
                socketId: socket.id,
                ...state
            });
        });

        /**
         * 6. RỜI PHÒNG
         */
        socket.on('leave_room', () => {
            leaveCurrentRoom(socket);
        });

        /**
         * 7. NGẮT KẾT NỐI
         */
        socket.on('disconnect', () => {
            console.log(`🔌 [Socket]: Nhẫn giả ngắt kết nối [SocketId: ${socket.id}]`);
            leaveCurrentRoom(socket);
        });

        function leaveCurrentRoom(sock) {
            if (!currentRoomCode) return;
            const room = rooms.get(currentRoomCode);
            if (!room) {
                currentRoomCode = null;
                return;
            }

            room.players = room.players.filter(p => p.socketId !== sock.id);
            sock.leave(currentRoomCode);

            console.log(`🚪 [Tổ Đội]: Rời phòng [Mã: ${currentRoomCode}] (Còn lại: ${room.players.length} người)`);

            if (room.players.length === 0) {
                rooms.delete(currentRoomCode);
                console.log(`🗑️ [Tổ Đội]: Giải tán phòng [Mã: ${currentRoomCode}] do không còn người`);
            } else {
                if (room.hostId === sock.id) {
                    room.hostId = room.players[0].socketId;
                    room.players[0].isHost = true;
                    room.players[0].isReady = true;
                    console.log(`👑 [Tổ Đội]: Chuyển quyền chủ phòng cho ${room.players[0].username}`);
                }
                io.to(currentRoomCode).emit('room_updated', { room });
            }

            currentRoomCode = null;
        }
    });
}

module.exports = { setupRoomSockets, rooms };
