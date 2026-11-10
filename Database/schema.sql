-- ============================================================================
-- CƠ SỞ DỮ LIỆU SQLITE: NARUTO SURVIVOR
-- Bảng tài khoản, phân quyền, tiến độ nhẫn giả, giftcode & phòng đấu Co-op
-- ============================================================================

-- Bảng 1: Tài khoản người chơi & Quản trị viên (Users)
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player' CHECK(role IN ('player', 'admin')),
    ryo INTEGER NOT NULL DEFAULT 0,
    scrolls INTEGER NOT NULL DEFAULT 0,
    selected_ninja TEXT NOT NULL DEFAULT 'naruto',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: Tiến độ tướng & Số sao nhẫn giả (UserNinjas)
CREATE TABLE IF NOT EXISTS UserNinjas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ninja_id TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 1,
    shards INTEGER NOT NULL DEFAULT 0,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE(user_id, ninja_id)
);

-- Bảng 3: Quản lý danh sách Giftcode do Admin phát hành (Giftcodes)
CREATE TABLE IF NOT EXISTS Giftcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL COLLATE NOCASE,
    reward_ryo INTEGER NOT NULL DEFAULT 0,
    reward_scrolls INTEGER NOT NULL DEFAULT 0,
    reward_ninja_id TEXT DEFAULT NULL,
    reward_ninja_shards INTEGER NOT NULL DEFAULT 0,
    max_uses INTEGER DEFAULT NULL, -- NULL = Không giới hạn lượt nhập
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_by INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT NULL,
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL
);

-- Bảng 4: Lịch sử đổi Giftcode (Mỗi người chơi chỉ được nhập 1 lần/mã)
CREATE TABLE IF NOT EXISTS GiftcodeRedemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    giftcode_id INTEGER NOT NULL,
    redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY(giftcode_id) REFERENCES Giftcodes(id) ON DELETE CASCADE,
    UNIQUE(user_id, giftcode_id)
);

-- Bảng 5: Quản lý phòng tổ đội Co-op 4 người chơi (GameRooms)
CREATE TABLE IF NOT EXISTS GameRooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_code TEXT UNIQUE NOT NULL COLLATE NOCASE,
    host_user_id INTEGER DEFAULT NULL,
    max_players INTEGER NOT NULL DEFAULT 4,
    current_players INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'WAITING' CHECK(status IN ('WAITING', 'PLAYING', 'FINISHED')),
    map_id TEXT NOT NULL DEFAULT 'map_leaf_forest',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(host_user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- Tạo Index tăng tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_user_ninjas_user_id ON UserNinjas(user_id);
CREATE INDEX IF NOT EXISTS idx_giftcodes_code ON Giftcodes(code);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_giftcode ON GiftcodeRedemptions(user_id, giftcode_id);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON GameRooms(room_code);
