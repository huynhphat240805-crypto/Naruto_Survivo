/* ============================================================================
   MODULE: Backend/src/config/db.js
   KẾT NỐI & QUẢN LÝ CƠ SỞ DỮ LIỆU SQLITE
   ============================================================================ */

const path = require('path');
const fs = require('fs');

let db = null;

function getDatabase() {
    if (db) return db;

    try {
        const Database = require('better-sqlite3');
        const dbPath = path.resolve(__dirname, process.env.DB_PATH || '../../../Database/database.sqlite');
        
        // Đảm bảo thư mục Database tồn tại
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');

        // Tự động nạp schema nếu bảng Users chưa tồn tại
        const schemaPath = path.resolve(__dirname, '../../../Database/schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            db.exec(schemaSql);
        }

        console.log('🍃 [Database]: Kết nối SQLite thành công tại', dbPath);
        return db;
    } catch (err) {
        console.warn('⚠️ [Database]: Chưa cài đặt better-sqlite3 hoặc lỗi kết nối. Hãy chạy "npm install" trong thư mục Backend.', err.message);
        return null;
    }
}

module.exports = { getDatabase };
