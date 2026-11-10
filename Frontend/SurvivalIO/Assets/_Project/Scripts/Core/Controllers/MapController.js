/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/Core/MapController.js
   Hệ Thống Bản Đồ Chiến Đấu Rừng Làng Lá (Konoha Forest Arena)
   Pixel Art Spritesheet: forest_tiles.png (240x160 px)
   
   Tính năng:
   1. Nền cỏ đồng đều liền mạch (2 ô cỏ 16x16 px góc trên trái, tỉ lệ 80% cỏ chính, 20% cỏ hoa văn)
   2. Hệ thống Chunk vô tận nhất quán (Deterministic Procedural 350x350 px, >90% đường chạy thoáng)
   3. Vật thể phá được (Tảng đá rêu phong & Cây nhỏ / Gốc cây):
      - 3 HP, nháy sáng trắng 0.1s khi trúng đòn
      - Ghi nhớ trạng thái đã vỡ bằng Set (không xuất hiện lại khi quay lại)
      - Vỡ vụn 5-7 mảnh pixel, 70% rơi Ngọc Chakra EXP, 30% rơi Bát Mì Ramen (+30 HP)
   4. Cây cổ thụ bất tử (Cây sồi tán tròn, cây phong thân cao, cây thông lá kim & bụi dương xỉ):
      - 100% bất tử, đạn bay qua không phá được
      - Y-Sorting mượt mà cho phép Naruto lướt trước / sau thân cây
   ============================================================================ */

// ============================================================================
// 1. BẢNG TỌA ĐỘ CẮT SPRITE CHUẨN TỪ FOREST_TILES.PNG (240x160 px)
// ============================================================================
const SPRITES = {
    // A. Nền Cỏ (16x16 px gốc trên trái)
    grass1: { sx: 0,  sy: 0,  sw: 16, sh: 16 }, // Ô cỏ chính (80%)
    grass2: { sx: 16, sy: 16, sw: 16, sh: 16 }, // Ô cỏ điểm hoa văn (20%)

    // B. Cây Cổ Thụ Bất Tử (Unbreakable Big Trees)
    oakTree:  { sx: 64,  sy: 0, sw: 32, sh: 32, w: 64, h: 64,  colR: 16, footOffsetY: 20 }, // Cây sồi tán tròn
    tallTree: { sx: 128, sy: 0, sw: 32, sh: 64, w: 64, h: 128, colR: 14, footOffsetY: 50 }, // Cây phong thân cao
    pineTree: { sx: 192, sy: 0, sw: 32, sh: 64, w: 56, h: 128, colR: 12, footOffsetY: 52 }, // Cây thông lá kim

    // C. Bụi Cỏ & Dương Xỉ Bất Tử (Walkable Decor)
    fern:      { sx: 32, sy: 96,  sw: 16, sh: 16, w: 32, h: 32, colR: 0 }, // Bụi dương xỉ xòe
    bush1:     { sx: 0,  sy: 96,  sw: 16, sh: 16, w: 32, h: 32, colR: 0 }, // Bụi cỏ rậm
    bush2:     { sx: 16, sy: 112, sw: 16, sh: 16, w: 32, h: 32, colR: 0 }, // Bụi cây tròn thấp
    grassTuft: { sx: 48, sy: 112, sw: 16, sh: 16, w: 32, h: 32, colR: 0 }, // Khóm cỏ dại

    // D. Vật Thể Phá Được (Breakable Rocks & Stumps / Logs - HP = 3)
    rock1: { sx: 0,  sy: 64, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: true }, // Cụm đá nhọn
    rock2: { sx: 16, sy: 80, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: true }, // Tảng đá tròn rêu phong
    rock3: { sx: 48, sy: 80, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: true }, // Tảng đá lớn
    stump: { sx: 16, sy: 48, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: false }, // Gốc cây đốn
    log1:  { sx: 0,  sy: 32, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: false }, // Khúc gỗ mục 1
    log2:  { sx: 32, sy: 32, sw: 16, sh: 16, w: 36, h: 36, colR: 18, hp: 3, isRock: false }  // Khúc gỗ mục 2
};

// ============================================================================
// TỌA ĐỘ CẮT KHỐI NƯỚC GÓC 12H TRÊN MAP.PNG (NẰM GIỮA NHÀ GỖ VÀ TƯỜNG ĐÁ, TRÊN 3 ĐÀI PHUN NƯỚC)
// Khối nước xanh dương tuyền tuyệt đẹp có sẵn các gợn sóng vòng tròn bên trong
// ============================================================================
const WATER_BLOCK_SPRITE = {
    sx: 256, // Bắt đầu từ 256px để tuyệt đối KHÔNG cắt vào khu vực cỏ xanh/nhà gỗ bên trái (x < 256)
    sy: 0,   // Hàng trên cùng góc 12h
    sw: 96,  // Chiều rộng khối nước xanh (256px đến 351px)
    sh: 64   // Chiều cao khối nước xanh (0px đến 63px)
};

// ============================================================================
// 2. CLASS MAP CONTROLLER CORE ENGINE
// ============================================================================
class MapController {
    constructor() {
        this.tileset = new Image();
        this.isLoaded = false;

        this.tileset.onload = () => {
            this.isLoaded = true;
            console.log("🍥 [MapController]: Đã nạp thành công forest_tiles.png (240x160 px)!");
        };

        this.tileset.onerror = () => {
            console.warn("⚠️ [MapController]: Thử đường dẫn fallback Map.png...");
            if (this.tileset && !this.tileset.src.includes('Map.png')) {
                this.tileset.src = 'SurvivalIO/Assets/_Project/Textures/Map/Map.png';
            }
        };

        // Nạp ảnh spritesheet (Map1.png 240x160 px chuẩn spritesheet)
        this.tileset.src = 'SurvivalIO/Assets/_Project/Textures/Map/Map1.png';

        // Nạp ảnh tileset Map.png cho địa hình vũng nước màu xanh dương (Water Puddles)
        this.mapWaterImg = new Image();
        this.isMapWaterLoaded = false;
        this.mapWaterImg.onload = () => {
            this.isMapWaterLoaded = true;
            console.log("🌊 [MapController]: Đã nạp thành công Map.png cho Vũng Nước!");
        };
        this.mapWaterImg.onerror = () => {
            console.warn("⚠️ [MapController]: Thử đường dẫn fallback Map.png cho Vũng Nước...");
            if (this.mapWaterImg && !this.mapWaterImg.src.includes('./Assets/')) {
                this.mapWaterImg.src = './SurvivalIO/Assets/_Project/Textures/Map/Map.png';
            }
        };
        this.mapWaterImg.src = 'SurvivalIO/Assets/_Project/Textures/Map/Map.png';

        // Tương thích overworldImg
        this.overworldImg = this.mapWaterImg;
        this.isOverworldLoaded = false;
        this.mapWaterImg.addEventListener('load', () => { this.isOverworldLoaded = true; });

        // Cấu hình thông số
        this.chunkSize = 350;           // Kích thước Chunk 350x350 px
        this.tileSize = 32;             // Kích thước hiển thị 1 ô cỏ (16px x 2)
        this.fallbackColor = '#4a8528'; // Màu cỏ xanh an toàn chống treo game

        // Bộ nhớ trạng thái thế giới
        this.chunks = new Map();
        this.brokenProps = new Set();   // Ghi nhớ các vật thể đã bị phá hủy
        this.debris = [];                // Mảnh vỡ pixel văng ra khi vỡ đá / cây
        this.ramenPickups = [];          // Bát mì Ramen rơi ra

        // ====================================================================
        // HỆ THỐNG CHUNK VÔ TẬN CHO VŨNG NƯỚC (PUDDLES INFINITE CHUNK SYSTEM)
        // ====================================================================
        this.puddleChunkSize = 700;       // Kích thước ô Chunk 700px x 700px
        this.generatedChunks = new Map(); // Lưu trữ các Chunk đã sinh để giữ nguyên vị trí khi quay lại
        this.waterBubbles = [];           // Mảng chứa bong bóng sủi bọt & vòng sóng tủm tủm
        this.puddles = [];                // Danh sách vũng nước hiện đang hoạt động quanh tầm nhìn
    }

    // Kiểm tra vị trí hình chữ nhật [px, py, width, height] có hợp lệ để đặt vũng nước
    isPositionValidForPuddle(px, py, width, height, chunkX, chunkY) {
        const cx = px + width / 2;
        const cy = py + height / 2;

        // 1. Không sinh trong bán kính 300px quanh điểm xuất phát (0, 0)
        if (Math.hypot(cx, cy) < 300) {
            return false;
        }

        // 2. Khoảng cách giữa 2 vũng nước tối thiểu 500px (tuyệt đối không dính sát/chồng đè)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nKey = `${chunkX + dx},${chunkY + dy}`;
                if (this.generatedChunks.has(nKey)) {
                    const nPuds = this.generatedChunks.get(nKey);
                    for (let i = 0; i < nPuds.length; i++) {
                        const op = nPuds[i];
                        const opCX = op.x + op.width / 2;
                        const opCY = op.y + op.height / 2;
                        if (Math.hypot(cx - opCX, cy - opCY) < 500) {
                            return false; // Quá gần vũng nước khác (< 500px)
                        }
                    }
                }
            }
        }

        // 3. Kiểm tra không đè lên bất kỳ vật cản tĩnh nào (Cây cối, Tảng đá, Gốc cây, Bụi cây)
        const minCX = Math.floor((px - 100) / this.chunkSize);
        const maxCX = Math.ceil((px + width + 100) / this.chunkSize);
        const minCY = Math.floor((py - 100) / this.chunkSize);
        const maxCY = Math.ceil((py + height + 100) / this.chunkSize);

        const safeMargin = 70; // Giữ khoảng cách tối thiểu 70px với cây cối & tảng đá

        for (let chx = minCX; chx <= maxCX; chx++) {
            for (let chy = minCY; chy <= maxCY; chy++) {
                const cData = this.getChunk(chx, chy);
                if (!cData) continue;

                // A. Cây cổ thụ
                if (cData.trees) {
                    for (let i = 0; i < cData.trees.length; i++) {
                        const t = cData.trees[i];
                        const footX = t.x;
                        const footY = t.y + (t.footOffsetY || 0);
                        if (footX >= px - safeMargin && footX <= px + width + safeMargin &&
                            footY >= py - safeMargin && footY <= py + height + safeMargin) {
                            return false; // Đè hoặc quá gần cây
                        }
                    }
                }

                // B. Vật thể phá được (Tảng đá, Gốc cây, Khúc gỗ...)
                if (cData.breakables) {
                    for (let i = 0; i < cData.breakables.length; i++) {
                        const b = cData.breakables[i];
                        if (b.x >= px - safeMargin && b.x <= px + width + safeMargin &&
                            b.y >= py - safeMargin && b.y <= py + height + safeMargin) {
                            return false; // Đè hoặc quá gần đá
                        }
                    }
                }

                // C. Bụi cây / Khóm dương xỉ
                if (cData.decors) {
                    for (let i = 0; i < cData.decors.length; i++) {
                        const d = cData.decors[i];
                        if (d.x >= px - 50 && d.x <= px + width + 50 &&
                            d.y >= py - 50 && d.y <= py + height + 50) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    // Lấy hoặc sinh ngẫu nhiên vũng nước khối màu xanh góc 12h cho ô Chunk 700x700 px (Lưu cố định vào generatedChunks)
    getPuddleChunk(chunkX, chunkY) {
        const key = `${chunkX},${chunkY}`;
        if (this.generatedChunks.has(key)) {
            return this.generatedChunks.get(key);
        }

        const chunkPuddles = [];

        // 1. MẬT ĐỘ THƯA TẠO ĐIỂM NHẤN: Mỗi Chunk 700x700px chỉ có khoảng 20% - 25% cơ hội sinh vũng nước
        const spawnChance = this.getChunkSeed(chunkX, chunkY, 11);
        if (spawnChance < 0.25) {
            // 2. RANDOM KÍCH THƯỚC: Chỗ vừa (~100px x 80px) hoặc Chỗ to bự (~180px x 140px)
            const sizeSeed = this.getChunkSeed(chunkX, chunkY, 22);
            const isLarge = (sizeSeed >= 0.45);
            const width = isLarge
                ? Math.round(175 + sizeSeed * 15)  // ~175px - 190px (chỗ to bự)
                : Math.round(98 + sizeSeed * 12);  // ~98px - 110px (chỗ vừa)
            const height = isLarge
                ? Math.round(135 + sizeSeed * 10)  // ~135px - 145px (chỗ to bự)
                : Math.round(76 + sizeSeed * 10);  // ~76px - 86px (chỗ vừa)

            const margin = 70;
            let foundX = null;
            let foundY = null;

            // Thử tối đa 8 vị trí ngẫu nhiên để tìm bãi đất trống hợp lệ
            for (let attempt = 0; attempt < 8; attempt++) {
                const sX = this.getChunkSeed(chunkX, chunkY, 100 + attempt * 19);
                const sY = this.getChunkSeed(chunkX, chunkY, 200 + attempt * 19);

                const candX = chunkX * this.puddleChunkSize + margin + sX * (this.puddleChunkSize - width - margin * 2);
                const candY = chunkY * this.puddleChunkSize + margin + sY * (this.puddleChunkSize - height - margin * 2);

                if (this.isPositionValidForPuddle(candX, candY, width, height, chunkX, chunkY)) {
                    foundX = Math.round(candX);
                    foundY = Math.round(candY);
                    break;
                }
            }

            // Nếu tìm thấy vị trí đất trống an toàn
            if (foundX !== null && foundY !== null) {
                chunkPuddles.push({
                    id: `${chunkX}_${chunkY}_0`,
                    chunkX: chunkX,
                    chunkY: chunkY,
                    x: foundX,
                    y: foundY,
                    width: width,
                    height: height,
                    isLarge: isLarge,
                    seed: Math.floor(sizeSeed * 1000),
                    bubbleTimer: 2.0 + Math.random() * 3.5,
                    fish: {
                        active: false,
                        timer: 2.5 + Math.random() * 5.0,
                        x: foundX + width / 2,
                        y: foundY + height / 2,
                        vx: 0,
                        vy: 0,
                        life: 0,
                        maxLife: 2.4
                    }
                });
            }
        }

        // Lưu vào Map để khi quay lại vùng đất cũ, vũng nước nằm Y NGUYÊN vị trí cũ
        this.generatedChunks.set(key, chunkPuddles);
        return chunkPuddles;
    }

    // Lấy danh sách các vũng nước trong phạm vi lân cận
    getNearbyPuddles(centerX, centerY, radiusRange = 900) {
        const minCX = Math.floor((centerX - radiusRange) / this.puddleChunkSize);
        const maxCX = Math.ceil((centerX + radiusRange) / this.puddleChunkSize);
        const minCY = Math.floor((centerY - radiusRange) / this.puddleChunkSize);
        const maxCY = Math.ceil((centerY + radiusRange) / this.puddleChunkSize);

        const list = [];
        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const cp = this.getPuddleChunk(cx, cy);
                for (let i = 0; i < cp.length; i++) {
                    list.push(cp[i]);
                }
            }
        }
        return list;
    }

    // Kiểm tra điểm (x, y) có nằm trong phạm vi ô vuông của vũng nước [p.x, p.y, p.width, p.height] hay không (AABB Bounding Box)
    isWaterAt(x, y) {
        const cx = Math.floor(x / this.puddleChunkSize);
        const cy = Math.floor(y / this.puddleChunkSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const chunkPuddles = this.getPuddleChunk(cx + dx, cy + dy);
                for (let i = 0; i < chunkPuddles.length; i++) {
                    const p = chunkPuddles[i];
                    // Kiểm tra va chạm hộp chữ nhật AABB chuẩn xác
                    if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    init() {
        this.chunks.clear();
        this.brokenProps.clear();
        this.debris = [];
        this.ramenPickups = [];
        this.waterBubbles = [];
        this.generatedChunks.clear();
        this.puddles = [];
    }

    onMatchStart() {
        this.init();
    }

    // Hàm băm tọa độ cố định getChunkSeed (Deterministic Pseudo-Random)
    getChunkSeed(cx, cy, offset = 0) {
        const val = Math.sin(cx * 12.9898 + cy * 78.233 + (offset + 43.123)) * 43758.5453;
        return val - Math.floor(val);
    }

    // Sinh vật thể cố định cho Chunk 350x350 px (90% diện tích thông thoáng)
    getChunk(chunkX, chunkY) {
        const key = `${chunkX},${chunkY}`;
        if (this.chunks.has(key)) {
            return this.chunks.get(key);
        }

        // Chunk (0, 0) xuất phát của Naruto: Để trống 100% để chạy tự do
        if (chunkX === 0 && chunkY === 0) {
            const emptyChunk = { trees: [], breakables: [], decors: [] };
            this.chunks.set(key, emptyChunk);
            return emptyChunk;
        }

        const trees = [];
        const breakables = [];
        const decors = [];

        // 1. CÂY CỔ THỤ BẤT TỬ (~35% cơ hội có 1 cây to)
        const treeRoll = this.getChunkSeed(chunkX, chunkY, 101);
        if (treeRoll < 0.35) {
            const treeTypes = ['oakTree', 'tallTree', 'pineTree'];
            const tTypeKey = treeTypes[Math.floor(this.getChunkSeed(chunkX, chunkY, 102) * treeTypes.length)];
            const tData = SPRITES[tTypeKey];

            const tx = chunkX * this.chunkSize + 70 + this.getChunkSeed(chunkX, chunkY, 103) * (this.chunkSize - 140);
            const ty = chunkY * this.chunkSize + 70 + this.getChunkSeed(chunkX, chunkY, 104) * (this.chunkSize - 140);

            trees.push({
                typeKey: tTypeKey,
                x: tx,
                y: ty,
                w: tData.w,
                h: tData.h,
                colR: tData.colR,
                footOffsetY: tData.footOffsetY,
                sprite: tData
            });
        }

        // 2. VẬT THỂ PHÁ ĐƯỢC: ĐÁ & GỐC CÂY / CÂY NHỎ (~60% cơ hội có 1 vật thể)
        const breakableRoll = this.getChunkSeed(chunkX, chunkY, 201);
        if (breakableRoll < 0.60) {
            const propTypes = ['rock1', 'rock2', 'rock3', 'stump', 'log1', 'log2'];
            const pTypeKey = propTypes[Math.floor(this.getChunkSeed(chunkX, chunkY, 202) * propTypes.length)];
            const pData = SPRITES[pTypeKey];

            const px = chunkX * this.chunkSize + 60 + this.getChunkSeed(chunkX, chunkY, 203) * (this.chunkSize - 120);
            const py = chunkY * this.chunkSize + 60 + this.getChunkSeed(chunkX, chunkY, 204) * (this.chunkSize - 120);

            // Kiểm tra không chồng lên cây to
            let tooClose = false;
            for (const t of trees) {
                if (Math.hypot(px - t.x, py - (t.y + t.footOffsetY)) < 60) {
                    tooClose = true;
                    break;
                }
            }

            const propId = `${chunkX}_${chunkY}_0`;
            if (!tooClose && !this.brokenProps.has(propId)) {
                breakables.push({
                    id: propId,
                    typeKey: pTypeKey,
                    x: px,
                    y: py,
                    w: pData.w,
                    h: pData.h,
                    radius: pData.colR,
                    hp: pData.hp,
                    maxHp: pData.hp,
                    flashTimer: 0,
                    isRock: pData.isRock,
                    sprite: pData
                });
            }
        }

        // 3. BỤI CỎ / DƯƠNG XỈ TRANG TRÍ (~50% cơ hội có 1 khóm trang trí)
        const decorRoll = this.getChunkSeed(chunkX, chunkY, 301);
        if (decorRoll < 0.50) {
            const decorTypes = ['fern', 'bush1', 'bush2', 'grassTuft'];
            const dTypeKey = decorTypes[Math.floor(this.getChunkSeed(chunkX, chunkY, 302) * decorTypes.length)];
            const dData = SPRITES[dTypeKey];

            const dx = chunkX * this.chunkSize + 50 + this.getChunkSeed(chunkX, chunkY, 303) * (this.chunkSize - 100);
            const dy = chunkY * this.chunkSize + 50 + this.getChunkSeed(chunkX, chunkY, 304) * (this.chunkSize - 100);

            decors.push({
                typeKey: dTypeKey,
                x: dx,
                y: dy,
                w: dData.w,
                h: dData.h,
                sprite: dData
            });
        }

        const chunkData = { trees, breakables, decors };
        this.chunks.set(key, chunkData);
        return chunkData;
    }

    // CẬP NHẬT TRẠNG THÁI VŨNG NƯỚC: BỌT NƯỚC "TỦM TỦM" & BÓNG CÁ BƠI TRONG HỒ
    updatePuddles(dt, player) {
        const px = player ? player.x : 0;
        const py = player ? player.y : 0;

        // Cập nhật danh sách các vũng nước hiện diện trong tầm nhìn quanh người chơi (bán kính 1000px)
        const nearby = this.getNearbyPuddles(px, py, 1000);
        this.puddles = nearby;

        // 1. CẬP NHẬT BỌT NƯỚC "TỦM TỦM" (BUBBLES & RIPPLES)
        for (let i = this.waterBubbles.length - 1; i >= 0; i--) {
            const b = this.waterBubbles[i];
            if (b.state === 'growing') {
                b.timer += dt;
                b.size = Math.min(b.maxSize, (b.timer / b.growDuration) * b.maxSize);
                b.wobble = Math.sin(b.timer * 16) * 1.0;
                if (b.timer >= b.growDuration) {
                    // Vỡ bọt nước -> tạo vòng sóng tròn lan tỏa ra ngoài
                    b.state = 'popped';
                    b.rippleTimer = 0;
                }
            } else if (b.state === 'popped') {
                b.rippleTimer += dt;
                const progress = b.rippleTimer / b.rippleDuration;
                b.alpha = Math.max(0, (1 - progress) * 0.85);
                b.rippleR = progress * b.maxRippleR;
                if (progress >= 1.0) {
                    this.waterBubbles.splice(i, 1);
                }
            }
        }

        // 2. SINH BỌT NƯỚC & CẬP NHẬT BÓNG CÁ CHO CÁC KHỐI VŨNG NƯỚC GẦN ĐÓ
        for (let i = 0; i < nearby.length; i++) {
            const pud = nearby[i];

            // A. Bong bóng nước nổi lên vỡ nhẹ
            pud.bubbleTimer -= dt;
            if (pud.bubbleTimer <= 0) {
                pud.bubbleTimer = 2.5 + Math.random() * 3.5; // 2.5s - 6s

                // Vị trí bong bóng ngẫu nhiên trong vùng nước (tránh sát mép ngoài bờ)
                const innerMargin = 16;
                const wx = pud.x + innerMargin + Math.random() * Math.max(8, pud.width - innerMargin * 2);
                const wy = pud.y + innerMargin + Math.random() * Math.max(8, pud.height - innerMargin * 2);

                this.waterBubbles.push({
                    x: wx,
                    y: wy,
                    pudId: pud.id,
                    state: 'growing',
                    timer: 0,
                    growDuration: 0.40 + Math.random() * 0.30,
                    maxSize: 3.0 + Math.random() * 2.0,
                    size: 1.0,
                    wobble: 0,
                    rippleR: 0,
                    maxRippleR: 14 + Math.random() * 10,
                    rippleTimer: 0,
                    rippleDuration: 1.1,
                    alpha: 0.80
                });
            }

            // B. Bóng cá nhỏ bơi lướt qua lòng hồ trong vài giây rồi lặn mất tăm
            if (!pud.fish) {
                pud.fish = {
                    active: false,
                    timer: 2.0 + Math.random() * 4.0,
                    x: pud.x + pud.width / 2,
                    y: pud.y + pud.height / 2,
                    vx: 0,
                    vy: 0,
                    life: 0,
                    maxLife: 2.4
                };
            }

            const fish = pud.fish;
            if (!fish.active) {
                fish.timer -= dt;
                if (fish.timer <= 0) {
                    fish.active = true;
                    fish.life = 0;
                    fish.maxLife = 2.0 + Math.random() * 0.8;
                    const goRight = Math.random() < 0.5;
                    const startX = goRight ? (pud.x + 18) : (pud.x + pud.width - 18);
                    const endX = goRight ? (pud.x + pud.width - 18) : (pud.x + 18);
                    const startY = pud.y + 18 + Math.random() * Math.max(8, pud.height - 36);
                    const endY = pud.y + 18 + Math.random() * Math.max(8, pud.height - 36);
                    fish.x = startX;
                    fish.y = startY;
                    fish.vx = (endX - startX) / fish.maxLife;
                    fish.vy = (endY - startY) / fish.maxLife;
                }
            } else {
                fish.x += fish.vx * dt;
                fish.y += fish.vy * dt;
                fish.life += dt;
                if (fish.life >= fish.maxLife) {
                    fish.active = false;
                    fish.timer = 5.0 + Math.random() * 7.0; // 5-12s sau có cá khác bơi
                }
            }
        }
    }

    // CẬP NHẬT LOGIC VÒNG LẶP & VA CHẠM
    update(dt, gameManager) {
        if (!gameManager) return;
        const p = gameManager.player;

        try {
            // CẬP NHẬT HIỆU ỨNG VŨNG NƯỚC (BỌT NƯỚC & GỢN SÓNG TỦM TỦM THEO CHUNK)
            this.updatePuddles(dt, p);

            // A. CẬP NHẬT MẢNH VỤN PIXEL (DEBRIS)
            for (let i = this.debris.length - 1; i >= 0; i--) {
                const d = this.debris[i];
                d.x += d.vx * dt;
                d.y += d.vy * dt;
                d.vx *= 0.90;
                d.vy *= 0.90;
                d.life -= dt;
                if (d.life <= 0) {
                    this.debris.splice(i, 1);
                }
            }

            // B. CẬP NHẬT VẬT PHẨM HỒI MÁU (BÁT MÌ RAMEN)
            for (let i = this.ramenPickups.length - 1; i >= 0; i--) {
                const item = this.ramenPickups[i];
                item.bounceTimer += dt;
                item.life -= dt;

                // Naruto nhặt Ramen hồi ngay 25-30 HP
                if (p) {
                    const dist = Math.hypot(p.x - item.x, p.y - item.y);
                    if (dist < p.radius + item.radius) {
                        p.hp = Math.min(p.maxHp, p.hp + item.heal);
                        if (gameManager.addFloatingText) {
                            gameManager.addFloatingText(p.x, p.y - 25, `+${item.heal} HP 🍜`, "#4ade80", 18);
                        }
                        if (gameManager.spawnExplosionParticles) {
                            gameManager.spawnExplosionParticles(p.x, p.y, '#4ade80', 12);
                        }
                        if (window.SFXController && typeof window.SFXController.orbPickup === 'function') {
                            window.SFXController.orbPickup();
                        }
                        this.ramenPickups.splice(i, 1);
                        continue;
                    }
                }

                if (item.life <= 0) {
                    this.ramenPickups.splice(i, 1);
                }
            }

            if (!p) return;

            // Thu thập các vật thể trong các Chunk lân cận quanh Naruto
            const currentChunkX = Math.floor(p.x / this.chunkSize);
            const currentChunkY = Math.floor(p.y / this.chunkSize);

            const activeTrees = [];
            const activeBreakables = [];

            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                    const chunk = this.getChunk(currentChunkX + dx, currentChunkY + dy);
                    if (!chunk) continue;

                    for (const tree of chunk.trees) {
                        activeTrees.push(tree);
                    }

                    for (let r = chunk.breakables.length - 1; r >= 0; r--) {
                        const prop = chunk.breakables[r];
                        if (prop.hp <= 0 || this.brokenProps.has(prop.id)) {
                            chunk.breakables.splice(r, 1);
                            continue;
                        }
                        if (prop.flashTimer > 0) {
                            prop.flashTimer = Math.max(0, prop.flashTimer - dt);
                        }
                        activeBreakables.push(prop);
                    }
                }
            }

            const playerR = (typeof p.radius === 'number' && p.radius > 0) ? p.radius : 18;

            // C. VA CHẠM DI CHUYỂN CỦA NARUTO (LƯỚT TRƠN TRÒN KHÔNG KẸT)
            // 1. Va chạm gốc cây cổ thụ
            for (const t of activeTrees) {
                const footX = t.x;
                const footY = t.y + t.footOffsetY;
                const distX = p.x - footX;
                const distY = p.y - footY;
                const dist = Math.hypot(distX, distY);
                const minDist = playerR + t.colR;

                if (dist < minDist && dist > 0.001) {
                    const push = minDist - dist;
                    p.x += (distX / dist) * push;
                    p.y += (distY / dist) * push;
                }
            }

            // 2. Va chạm tảng đá / gốc cây phá được
            for (const prop of activeBreakables) {
                const distX = p.x - prop.x;
                const distY = p.y - prop.y;
                const dist = Math.hypot(distX, distY);
                const minDist = playerR + prop.radius;

                if (dist < minDist && dist > 0.001) {
                    const push = minDist - dist;
                    p.x += (distX / dist) * push;
                    p.y += (distY / dist) * push;
                }
            }

            // D. TƯƠNG TÁC ĐẠN NARUTO VỚI VẬT THỂ PHÁ ĐƯỢC
            if (gameManager.projectiles && gameManager.projectiles.length > 0) {
                for (let pi = gameManager.projectiles.length - 1; pi >= 0; pi--) {
                    const proj = gameManager.projectiles[pi];
                    if (!proj || proj.type === 'enemy_proj') continue;

                    const projRadius = proj.radius || 10;

                    for (const prop of activeBreakables) {
                        if (prop.hp <= 0) continue;

                        const dist = Math.hypot(proj.x - prop.x, proj.y - prop.y);
                        if (dist <= projRadius + prop.radius) {
                            // Trừ 1 HP & nháy sáng trắng 0.1s
                            prop.hp -= 1;
                            prop.flashTimer = 0.1;

                            if (gameManager.spawnExplosionParticles) {
                                gameManager.spawnExplosionParticles(proj.x, proj.y, prop.isRock ? '#94a3b8' : '#a16207', 5);
                            }
                            if (gameManager.addFloatingText) {
                                gameManager.addFloatingText(prop.x, prop.y - 18, "-1", "#ffffff", 14);
                            }
                            if (window.SFXController && typeof window.SFXController.hit === 'function') {
                                window.SFXController.hit();
                            }

                            // Đạn chạm vào phát nổ và biến mất (trừ đạn xuyên thấu)
                            if (proj.type !== 'rasenshuriken' && proj.type !== 'flame_wall') {
                                if (proj.pierce && proj.pierce > 1) {
                                    proj.pierce -= 1;
                                } else {
                                    proj.life = 0;
                                    gameManager.projectiles.splice(pi, 1);
                                }
                            }

                            // KHI BỊ BẮN VỠ (HP <= 0)
                            if (prop.hp <= 0) {
                                this.breakProp(prop, gameManager);
                            }

                            break;
                        }
                    }
                }
            }

        } catch (e) {
            // Bảo vệ an toàn tuyệt đối cho Game Loop
        }
    }

    // XỬ LÝ VẬT THỂ VỠ VỤN & RƠI PHẦN THƯỞNG
    breakProp(prop, gameManager) {
        // Ghi nhớ không xuất hiện lại khi Naruto quay lại
        this.brokenProps.add(prop.id);

        // 1. Tạo hiệu ứng nổ vỡ vụn nhẹ (5-7 mảnh vụn pixel)
        const debrisColor = prop.isRock ? '#64748b' : '#78350f';
        for (let i = 0; i < 7; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 50 + Math.random() * 120;
            this.debris.push({
                x: prop.x,
                y: prop.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                size: 3 + Math.random() * 4,
                color: (i % 2 === 0) ? debrisColor : (prop.isRock ? '#94a3b8' : '#b45309'),
                life: 1.0 + Math.random() * 0.6,
                maxLife: 1.6
            });
        }

        if (gameManager.spawnExplosionParticles) {
            gameManager.spawnExplosionParticles(prop.x, prop.y, debrisColor, 12);
        }

        if (window.Camera && typeof window.Camera.shake === 'function') {
            window.Camera.shake(0.18, 4);
        }

        // 2. TỈ LỆ RƠI VẬT PHẨM (DROP RATE)
        const dropRoll = Math.random();

        if (dropRoll < 0.70) {
            // 70%: Rơi 1 viên Ngọc Chakra EXP (gọi hàm sinh ngọc có sẵn của GameManager)
            if (gameManager.orbs) {
                gameManager.orbs.push({
                    x: prop.x,
                    y: prop.y,
                    exp: 20, // Tương đương 1 con creep
                    radius: 6,
                    isDiamond: false
                });
            }
            if (gameManager.addFloatingText) {
                gameManager.addFloatingText(prop.x, prop.y - 15, "💎 Chakra EXP!", "#38bdf8", 14);
            }
        } else {
            // 30%: Rơi 1 Bát Mì Ramen (Hồi ngay 30 HP khi nhặt)
            this.ramenPickups.push({
                x: prop.x,
                y: prop.y,
                radius: 16,
                heal: 30,
                life: 45,
                bounceTimer: 0
            });
            if (gameManager.addFloatingText) {
                gameManager.addFloatingText(prop.x, prop.y - 15, "🍜 Mì Ramen!", "#fbbf24", 15);
            }
        }
    }

    // RENDER BẢN ĐỒ CHIẾN ĐẤU PROCEDURAL (60 FPS CHUẨN XÁC)
    render(ctx, camera, player, gameManager) {
        if (!ctx) return;

        try {
            const camWidth = (camera && camera.width) || (ctx.canvas ? ctx.canvas.width : (typeof window !== 'undefined' ? window.innerWidth : 800));
            const camHeight = (camera && camera.height) || (ctx.canvas ? ctx.canvas.height : (typeof window !== 'undefined' ? window.innerHeight : 600));

            let camX = 0;
            let camY = 0;
            if (camera) {
                if (typeof camera.getRenderX === 'function') {
                    camX = camera.getRenderX();
                    camY = camera.getRenderY();
                } else if (camera.x !== undefined) {
                    camX = (camera.width !== undefined) ? (camera.x - camera.width / 2) : camera.x;
                    camY = (camera.height !== undefined) ? (camera.y - camera.height / 2) : camera.y;
                }
            }

            const viewport = {
                left: camX,
                top: camY,
                right: camX + camWidth,
                bottom: camY + camHeight
            };

            const p = player || (gameManager ? gameManager.player : null);
            const playerX = p ? p.x : -9999;
            const playerY = p ? p.y : -9999;

            ctx.save();
            ctx.imageSmoothingEnabled = false;

            // ================================================================
            // LỚP 1: NỀN ĐẤT ĐỒNG ĐỀU LIỀN MẠCH (2 Ô CỎ 16x16 GÓC TRÊN TRÁI)
            // ================================================================
            // Fallback màu cỏ xanh an toàn
            ctx.fillStyle = this.fallbackColor;
            ctx.fillRect(0, 0, camWidth, camHeight);

            if (this.isLoaded && this.tileset) {
                const startCol = Math.floor(viewport.left / this.tileSize) - 1;
                const endCol = Math.ceil(viewport.right / this.tileSize) + 1;
                const startRow = Math.floor(viewport.top / this.tileSize) - 1;
                const endRow = Math.ceil(viewport.bottom / this.tileSize) + 1;

                const destW = this.tileSize + 1;
                const destH = this.tileSize + 1;

                for (let c = startCol; c <= endCol; c++) {
                    for (let r = startRow; r <= endRow; r++) {
                        // Tỉ lệ 80% cỏ chính (grass1), 20% cỏ điểm hoa văn (grass2)
                        const h = this.getChunkSeed(c, r, 9999);
                        const tile = (h < 0.20) ? SPRITES.grass2 : SPRITES.grass1;

                        const screenX = Math.floor(c * this.tileSize - camX);
                        const screenY = Math.floor(r * this.tileSize - camY);

                        ctx.drawImage(
                            this.tileset,
                            tile.sx, tile.sy, tile.sw, tile.sh,
                            screenX, screenY,
                            destW, destH
                        );
                    }
                }
            }

            // ================================================================
            // LỚP 1.5: ĐỊA HÌNH VŨNG NƯỚC (PUDDLES) DẠNG Ô VUÔNG / KHỐI TILE PIXEL ART (MAP.PNG)
            // ================================================================
            const minPuddleCX = Math.floor((viewport.left - 200) / this.puddleChunkSize);
            const maxPuddleCX = Math.ceil((viewport.right + 200) / this.puddleChunkSize);
            const minPuddleCY = Math.floor((viewport.top - 200) / this.puddleChunkSize);
            const maxPuddleCY = Math.ceil((viewport.bottom + 200) / this.puddleChunkSize);

            const nowTime = Date.now() * 0.003;
            const waterImg = (this.isMapWaterLoaded && this.mapWaterImg && this.mapWaterImg.complete && this.mapWaterImg.naturalWidth > 0)
                ? this.mapWaterImg
                : null;
            const animFrame = Math.floor(nowTime * 2.2);

            for (let pcx = minPuddleCX; pcx <= maxPuddleCX; pcx++) {
                for (let pcy = minPuddleCY; pcy <= maxPuddleCY; pcy++) {
                    const chunkPuds = this.getPuddleChunk(pcx, pcy);
                    for (let i = 0; i < chunkPuds.length; i++) {
                        const pud = chunkPuds[i];
                        const sx = pud.x - camX;
                        const sy = pud.y - camY;

                        // Viewport culling: Kiểm tra AABB trong khung hình camera
                        if (sx + pud.width >= -20 && sx <= camWidth + 20 &&
                            sy + pud.height >= -20 && sy <= camHeight + 20) {

                            ctx.save();
                            ctx.imageSmoothingEnabled = false;

                            // 1. VẼ TRỰC TIẾP KHỐI NƯỚC XANH DƯƠNG GÓC 12H TỪ MAP.PNG (SX=256, SY=0, SW=96, SH=64)
                            // Khối nước màu xanh dương tuyền, có sẵn gợn sóng vòng tròn bên trong (nằm giữa nhà gỗ và tường đá, trên 3 đài phun nước)
                            if (waterImg) {
                                ctx.drawImage(
                                    waterImg,
                                    WATER_BLOCK_SPRITE.sx, WATER_BLOCK_SPRITE.sy,
                                    WATER_BLOCK_SPRITE.sw, WATER_BLOCK_SPRITE.sh,
                                    Math.round(sx), Math.round(sy),
                                    pud.width, pud.height
                                );
                            } else {
                                ctx.fillStyle = 'rgba(30, 144, 255, 0.85)';
                                ctx.fillRect(Math.round(sx), Math.round(sy), pud.width, pud.height);
                            }

                            // 2. NÉT GỢN SÓNG PIXEL LẤP LÁNH NHẸ NHÀNG TRÊN MẶT NƯỚC THEO THỜI GIAN
                            const shimmerAlpha = Math.max(0, Math.sin(nowTime * 2.5 + pud.seed) * 0.45 + 0.15);
                            ctx.fillStyle = `rgba(255, 255, 255, ${shimmerAlpha.toFixed(2)})`;
                            const sh1X = Math.round(sx + pud.width * 0.35 + (pud.seed % 15));
                            const sh1Y = Math.round(sy + pud.height * 0.35);
                            ctx.fillRect(sh1X, sh1Y, 7, 2);
                            ctx.fillRect(sh1X + 2, sh1Y - 1, 3, 4);

                            const shimmer2Alpha = Math.max(0, Math.cos(nowTime * 2.8 + pud.seed * 2) * 0.4 + 0.1);
                            ctx.fillStyle = `rgba(224, 242, 254, ${shimmer2Alpha.toFixed(2)})`;
                            const sh2X = Math.round(sx + pud.width * 0.62 - (pud.seed % 10));
                            const sh2Y = Math.round(sy + pud.height * 0.58);
                            ctx.fillRect(sh2X, sh2Y, 8, 2);

                            // 3. HIỆU ỨNG BÓNG CÁ BƠI LƯỚT QUA (FISH SHADOW) NẾU LÀ VŨNG TO
                            if (pud.isLarge && pud.fish && pud.fish.active) {
                                const fish = pud.fish;
                                const fx = fish.x - camX;
                                const fy = fish.y - camY;
                                const progress = fish.life / fish.maxLife;
                                const fAlpha = Math.sin(progress * Math.PI) * 0.55;

                                if (fAlpha > 0.05) {
                                    ctx.save();
                                    ctx.fillStyle = `rgba(15, 23, 42, ${fAlpha.toFixed(2)})`;
                                    const swimAngle = Math.atan2(fish.vy, fish.vx);
                                    ctx.translate(fx, fy);
                                    ctx.rotate(swimAngle);

                                    // Thân bóng cá pixel art nhỏ nhắn
                                    ctx.fillRect(-7, -2, 11, 4);
                                    ctx.fillRect(-10, -1, 3, 2); // Cuống đuôi
                                    // Vẫy đuôi cá
                                    const tailWag = Math.sin(nowTime * 22) * 1.5;
                                    ctx.fillRect(-12, -1 + tailWag, 2, 2);

                                    ctx.restore();
                                }
                            }

                            ctx.restore();
                        }
                    }
                }
            }

            // ============================================================
            // 5. HIỆU ỨNG "TỦM TỦM" (BONG BÓNG SỦI BỌT VÀ GỢN SÓNG LAN TỎA)
            // ============================================================
            if (this.waterBubbles && this.waterBubbles.length > 0) {
                for (let b = 0; b < this.waterBubbles.length; b++) {
                    const bub = this.waterBubbles[b];
                    const bx = bub.x - camX;
                    const by = bub.y - camY;

                    if (bx >= -40 && bx <= camWidth + 40 && by >= -40 && by <= camHeight + 40) {
                        ctx.save();
                        if (bub.state === 'growing') {
                            const bSize = bub.size;
                            const wobX = bx + (bub.wobble || 0);

                            // Bong bóng nước thủy tinh nhỏ
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
                            ctx.beginPath();
                            ctx.arc(wobX, by, bSize, 0, Math.PI * 2);
                            ctx.fill();

                            ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
                            ctx.beginPath();
                            ctx.arc(wobX, by, Math.max(0.5, bSize * 0.65), 0, Math.PI * 2);
                            ctx.fill();

                        } else if (bub.state === 'popped') {
                            // Gợn sóng tròn nhẹ mờ dần khi bọt vỡ
                            const r1 = bub.rippleR;
                            const r2 = r1 * 0.55;
                            const a = bub.alpha;

                            ctx.strokeStyle = `rgba(224, 242, 254, ${(a * 0.75).toFixed(2)})`;
                            ctx.lineWidth = 1.3;
                            ctx.beginPath();
                            ctx.arc(bx, by, r1, 0, Math.PI * 2);
                            ctx.stroke();

                            if (r2 > 2) {
                                ctx.strokeStyle = `rgba(186, 230, 253, ${(a * 0.50).toFixed(2)})`;
                                ctx.lineWidth = 1.0;
                                ctx.beginPath();
                                ctx.arc(bx, by, r2, 0, Math.PI * 2);
                                ctx.stroke();
                            }
                        }
                        ctx.restore();
                    }
                }
            }

            // ================================================================
            // LỚP 2: MẢNH VỤN PIXEL RƠI TRÊN ĐẤT (DEBRIS)
            // ================================================================
            for (const d of this.debris) {
                const sx = d.x - camX;
                const sy = d.y - camY;
                if (sx >= -10 && sx <= camWidth + 10 && sy >= -10 && sy <= camHeight + 10) {
                    const alpha = Math.min(1.0, d.life / (d.maxLife * 0.4));
                    ctx.fillStyle = d.color;
                    ctx.globalAlpha = Math.max(0, alpha);
                    ctx.fillRect(Math.floor(sx), Math.floor(sy), Math.floor(d.size), Math.floor(d.size));
                }
            }
            ctx.globalAlpha = 1.0;

            // ================================================================
            // LỚP 3: CÂY CỔ THỤ BẤT TỬ, VẬT THỂ PHÁ ĐƯỢC & BỤI CỎ (Y-SORTING)
            // ================================================================
            const minChunkX = Math.floor(viewport.left / this.chunkSize) - 1;
            const maxChunkX = Math.ceil(viewport.right / this.chunkSize) + 1;
            const minChunkY = Math.floor(viewport.top / this.chunkSize) - 1;
            const maxChunkY = Math.ceil(viewport.bottom / this.chunkSize) + 1;

            const visibleEntities = [];

            for (let cx = minChunkX; cx <= maxChunkX; cx++) {
                for (let cy = minChunkY; cy <= maxChunkY; cy++) {
                    const chunk = this.getChunk(cx, cy);
                    if (!chunk) continue;

                    // Bụi cỏ / Dương xỉ (vẽ ở tầng nền)
                    for (const decor of chunk.decors) {
                        const sx = decor.x - camX;
                        const sy = decor.y - camY;
                        if (sx >= -50 && sx <= camWidth + 50 && sy >= -50 && sy <= camHeight + 50) {
                            visibleEntities.push({
                                kind: 'decor',
                                entity: decor,
                                screenX: sx,
                                screenY: sy,
                                ySort: decor.y
                            });
                        }
                    }

                    // Vật thể phá được (đá, gốc cây)
                    for (const prop of chunk.breakables) {
                        if (prop.hp <= 0 || this.brokenProps.has(prop.id)) continue;
                        const sx = prop.x - camX;
                        const sy = prop.y - camY;
                        if (sx >= -50 && sx <= camWidth + 50 && sy >= -50 && sy <= camHeight + 50) {
                            visibleEntities.push({
                                kind: 'breakable',
                                entity: prop,
                                screenX: sx,
                                screenY: sy,
                                ySort: prop.y + prop.h / 2
                            });
                        }
                    }

                    // Cây to cổ thụ bất tử
                    for (const tree of chunk.trees) {
                        const sx = tree.x - camX;
                        const sy = tree.y - camY;
                        if (sx >= -70 && sx <= camWidth + 70 && sy >= -140 && sy <= camHeight + 70) {
                            visibleEntities.push({
                                kind: 'tree',
                                entity: tree,
                                screenX: sx,
                                screenY: sy,
                                ySort: tree.y + tree.footOffsetY
                            });
                        }
                    }
                }
            }

            // Sắp xếp theo chiều sâu Y-Sort để Naruto lướt trước / sau thân cây
            visibleEntities.sort((a, b) => a.ySort - b.ySort);

            for (const item of visibleEntities) {
                const sx = Math.floor(item.screenX);
                const sy = Math.floor(item.screenY);

                if (item.kind === 'decor') {
                    // Vẽ Bụi Dương Xỉ / Bụi Cỏ
                    const d = item.entity;
                    if (this.isLoaded) {
                        ctx.drawImage(
                            this.tileset,
                            d.sprite.sx, d.sprite.sy, d.sprite.sw, d.sprite.sh,
                            sx - d.w / 2, sy - d.h / 2, d.w, d.h
                        );
                    }

                } else if (item.kind === 'breakable') {
                    // Vẽ Vật Thể Phá Được (Tảng đá / Gốc cây)
                    const prop = item.entity;
                    const drawX = sx - prop.w / 2;
                    const drawY = sy - prop.h / 2;

                    // Bóng đổ nhẹ
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy + prop.h / 2 - 3, prop.radius * 0.9, 7, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Hiệu ứng nháy sáng trắng 0.1s khi trúng đòn
                    if (prop.flashTimer > 0) {
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(sx, sy, prop.radius, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (this.isLoaded) {
                        ctx.drawImage(
                            this.tileset,
                            prop.sprite.sx, prop.sprite.sy, prop.sprite.sw, prop.sprite.sh,
                            drawX, drawY, prop.w, prop.h
                        );
                    }

                    // Vết nứt & thanh máu nhỏ khi bị mất máu
                    if (prop.hp < prop.maxHp) {
                        const barW = 22;
                        const barH = 3;
                        const barX = sx - barW / 2;
                        const barY = drawY - 6;

                        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

                        const hpPct = prop.hp / prop.maxHp;
                        ctx.fillStyle = hpPct > 0.4 ? '#4ade80' : '#f87171';
                        ctx.fillRect(barX, barY, barW * hpPct, barH);
                    }

                } else if (item.kind === 'tree') {
                    // Vẽ Cây Cổ Thụ Bất Tử (Oak / Tall / Pine)
                    const tree = item.entity;
                    const drawX = sx - tree.w / 2;
                    const drawY = sy - tree.h / 2;

                    // Bóng đổ gốc cây
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy + tree.footOffsetY, tree.colR * 1.5, 9, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Hiệu ứng làm mờ Alpha (0.65) khi Naruto đứng sau tán cây to
                    let isBehindTree = false;
                    if (p) {
                        const isInsideX = (playerX >= tree.x - tree.w / 2 && playerX <= tree.x + tree.w / 2);
                        const isBehindCanopy = (playerY >= tree.y - tree.h / 2 && playerY <= tree.y + tree.footOffsetY);
                        if (isInsideX && isBehindCanopy) {
                            isBehindTree = true;
                        }
                    }

                    ctx.globalAlpha = isBehindTree ? 0.65 : 1.0;

                    if (this.isLoaded) {
                        ctx.drawImage(
                            this.tileset,
                            tree.sprite.sx, tree.sprite.sy, tree.sprite.sw, tree.sprite.sh,
                            drawX, drawY, tree.w, tree.h
                        );
                    }

                    ctx.globalAlpha = 1.0;
                }
            }

            // ================================================================
            // LỚP 4: VẬT PHẨM HỒI MÁU (BÁT MÌ RAMEN +30 HP)
            // ================================================================
            for (const item of this.ramenPickups) {
                const sx = Math.floor(item.x - camX);
                const sy = Math.floor(item.y - camY);

                if (sx >= -30 && sx <= camWidth + 30 && sy >= -30 && sy <= camHeight + 30) {
                    const bounce = Math.sin(item.bounceTimer * 4.5) * 3;

                    // Hào quang hồi phục xanh ngọc
                    ctx.fillStyle = 'rgba(74, 222, 128, 0.28)';
                    ctx.beginPath();
                    ctx.arc(sx, sy + 3, 14, 0, Math.PI * 2);
                    ctx.fill();

                    // Bát mì Ramen Ichiraku
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy + bounce + 2, 11, 7, 0, 0, Math.PI);
                    ctx.fill();

                    // Vành bát trắng
                    ctx.fillStyle = '#f8fafc';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy + bounce + 2, 11, 3.5, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Nước súp mì vàng thơm
                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.ellipse(sx, sy + bounce + 2, 8.5, 2.5, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Miếng chả cá Naruto Narutomaki xoắn hồng
                    ctx.fillStyle = '#f43f5e';
                    ctx.fillRect(sx - 2, sy + bounce + 1, 3, 2);

                    // Đôi đũa gỗ
                    ctx.strokeStyle = '#d97706';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(sx - 6, sy + bounce - 2);
                    ctx.lineTo(sx + 7, sy + bounce + 4);
                    ctx.stroke();
                }
            }

            ctx.restore();

        } catch (e) {
            console.error("🍥 [MapController]: Lỗi render bản đồ:", e);
        }
    }

    checkCollision(x, y, radius = 10) {
        return false;
    }
}

// ============================================================================
// KHỞI TẠO BẢN THỂ TOÀN CỤC & TƯƠNG THÍCH MODULAR
// ============================================================================
if (typeof window !== 'undefined') {
    window.MapControllerClass = MapController;
    window.MapController = new MapController();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MapController, SPRITES };
}
