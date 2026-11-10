/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/UI/MapModal.js
   Quản lý Chọn Bản Đồ (MapModal) - Độc Lập Hoàn Toàn Khỏi Sảnh Chờ:
   - Lưới 12 Ải Chiến Trường Chuẩn Xác Theo Thiết Kế Anime (4 Cột x 3 Hàng)
   - Sử dụng trực tiếp ảnh tổng thể: bando_modal.png (1024x687 px)
   - Cơ Chế Mở Khóa Tuần Tự (LocalStorage)
   - Click Chọn Bản Đồ Mở: Lưu & Tự Động Về Tab TRANG CHỦ Sảnh Chờ
   - Click Bản Đồ Khóa: Rung Thẻ (Shake) + Toast Cảnh Báo
   ============================================================================ */

window.MapModal = {
    STORAGE_UNLOCKED_KEY: 'naruto_survivor_unlocked_map',
    STORAGE_SELECTED_KEY: 'naruto_selected_map',

    toastTimer: null,
    element: null,

    // Danh sách 12 Bản Đồ Chiến Trường (Chuẩn 4 Cột x 3 Hàng cắt từ bando_modal.png)
    MAPS: [
        // HÀNG 1 (Y: 0%)
        { id: 1, name: "Rừng Làng Lá", stars: 3, rank: "D-RANK", req: null, bgPos: "0% 0%", desc: "Cửa ngõ làng Lá, kẻ địch phân bố đồng đều, khởi đầu lý tưởng." },
        { id: 2, name: "Sóng Quốc & Cầu Naruto", stars: 3, rank: "C-RANK", req: "Rừng Làng Lá", bgPos: "33.333% 0%", desc: "Cây cầu lịch sử nối liền Ba Quốc, sương mù & ninja đánh thuê." },
        { id: 3, name: "Khu Rừng Chết", stars: 4, rank: "B-RANK", req: "Sóng Quốc & Cầu Naruto", bgPos: "66.667% 0%", desc: "Thí luyện sinh tử kỳ thi Chunin, rắn độc khổng lồ & cạm bẫy." },
        { id: 4, name: "Thung Lũng Tận Cùng", stars: 4, rank: "A-RANK", req: "Khu Rừng Chết", bgPos: "100% 0%", desc: "Thác nước khổng lồ nơi diễn ra trận quyết đấu định mệnh." },

        // HÀNG 2 (Y: 50%)
        { id: 5, name: "Sa Mạc Làng Cát", stars: 3, rank: "C-RANK", req: "Thung Lũng Tận Cùng", bgPos: "0% 50%", desc: "Bão cát cuồng nộ và những pháo đài đất nung kiên cố." },
        { id: 6, name: "Cầu Tenchi & Hang Ổ Orochimaru", stars: 4, rank: "A-RANK", req: "Sa Mạc Làng Cát", bgPos: "33.333% 50%", desc: "Địa đạo ngầm tăm tối với Manda và bí thuật thí nghiệm cấm." },
        { id: 7, name: "Làng Mưa", stars: 4, rank: "S-RANK", req: "Cầu Tenchi & Hang Ổ Orochimaru", bgPos: "66.667% 50%", desc: "Tháp sắt cao chọc trời dưới cơn mưa Chakra bất tận của Pain." },
        { id: 8, name: "Núi Myoboku", stars: 4, rank: "A-RANK", req: "Làng Mưa", bgPos: "100% 50%", desc: "Thánh địa Tiên Thuật Diệu Mộc Sơn cùng tượng Cóc Thần cổ xưa." },

        // HÀNG 3 (Y: 100%)
        { id: 9, name: "Đảo Rùa Khổng Lồ", stars: 4, rank: "S-RANK", req: "Núi Myoboku", bgPos: "0% 100%", desc: "Đảo rùa di động trên biển Lôi Quốc, nơi thuần phục Vĩ Thú." },
        { id: 10, name: "Chiến Trường Đại Chiến Nhẫn Giả", stars: 5, rank: "SS-RANK", req: "Đảo Rùa Khổng Lồ", bgPos: "33.333% 100%", desc: "Liên minh Nhẫn Giả đối đầu quân đoàn Bạch Zetsu & Uchiha." },
        { id: 11, name: "Không Gian Thần Thụ", stars: 5, rank: "SSS-RANK", req: "Chiến Trường Đại Chiến Nhẫn Giả", bgPos: "66.667% 100%", desc: "Cội rễ Thần Thụ khổng lồ khai mở ảo mộng Tsukuyomi Vĩnh Cửu." },
        { id: 12, name: "Không Gian Kaguya", stars: 5, rank: "THẦN THOẠI", req: "Không Gian Thần Thụ", bgPos: "100% 100%", desc: "Dị không gian Dung Nham & Băng Tuyết của Thủy tổ Chakra." }
    ],

    init() {
        if (this.element) return;

        const html = `
        <div id="mapModal" class="map-modal-backdrop">
            <!-- Header Tiêu Đề (Đã Xóa Bỏ Nút ✕) -->
            <div class="map-modal-header">
                <div class="map-header-left">
                    <div class="map-header-icon-box">🗺️</div>
                    <div>
                        <h2 class="map-header-title">CHIẾN TRƯỜNG NGŨ ĐẠI CƯỜNG QUỐC</h2>
                        <div class="map-header-subtitle">Chọn 1 trong 12 Ải Thí Luyện để xuất chiến • Vượt ải để mở khóa ải tiếp theo</div>
                    </div>
                </div>
            </div>

            <!-- Lưới 12 Bản Đồ (4 Cột x 3 Hàng) - Chiếm Trọn Không Gian Phía Trên -->
            <div id="mapGridContainer" class="map-grid-container"></div>

            <!-- Cụm 3 Nút Chân Trang Cân Xứng Hoàn Hảo Với Lưới Map -->
            <div class="map-modal-bottom-tabs">
                <!-- 📖 Nút TRANG CHỦ -->
                <button id="mapNavBtnHome" class="map-bottom-btn">
                    <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 drop-shadow-[0_0_8px_#facc15]">
                        <defs>
                            <linearGradient id="mapBookGold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#fffbeb"/>
                                <stop offset="40%" stop-color="#facc15"/>
                                <stop offset="100%" stop-color="#b45309"/>
                            </linearGradient>
                        </defs>
                        <path d="M12 4 C14 2.5 17 2.5 21 3 L21 17 C17 16.5 14 16.5 12 18 C10 16.5 7 16.5 3 17 L3 3 C7 2.5 10 2.5 12 4 Z" fill="url(#mapBookGold)" stroke="#78350f" stroke-width="0.8"/>
                        <path d="M12 4 L12 18" stroke="#78350f" stroke-width="1.2"/>
                        <path d="M6 7 H9 M6 10 H10 M14 7 H18 M14 10 H17" stroke="#451a03" stroke-width="0.8" stroke-linecap="round"/>
                    </svg>
                    <span>TRANG CHỦ</span>
                </button>

                <!-- 🗺️ Nút BẢN ĐỒ (Đang Chọn - Active) -->
                <button id="mapNavBtnMap" class="map-bottom-btn active">
                    <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 text-white">
                        <defs>
                            <linearGradient id="mapParchmentGold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#fef3c7"/>
                                <stop offset="60%" stop-color="#fde68a"/>
                                <stop offset="100%" stop-color="#d97706"/>
                            </linearGradient>
                        </defs>
                        <polygon points="3,5 9,3 15,5 21,3 21,19 15,21 9,19 3,21" fill="url(#mapParchmentGold)" stroke="#78350f" stroke-width="0.8"/>
                        <line x1="9" y1="3" x2="9" y2="19" stroke="#b45309" stroke-width="0.8" stroke-dasharray="2 1.5"/>
                        <line x1="15" y1="5" x2="15" y2="21" stroke="#b45309" stroke-width="0.8" stroke-dasharray="2 1.5"/>
                        <polygon points="12,8 13.5,12 12,11 10.5,12" fill="#dc2626"/>
                        <polygon points="12,14 13.5,12 12,13 10.5,12" fill="#1e293b"/>
                    </svg>
                    <span>BẢN ĐỒ</span>
                </button>

                <!-- ⚙️ Nút CÀI ĐẶT -->
                <button id="mapNavBtnSettings" class="map-bottom-btn">
                    <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 text-amber-200">
                        <defs>
                            <linearGradient id="mapGearGold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#fffbeb"/>
                                <stop offset="50%" stop-color="#facc15"/>
                                <stop offset="100%" stop-color="#92400e"/>
                            </linearGradient>
                        </defs>
                        <path d="M12 15 A3 3 0 1 0 12 9 A3 3 0 1 0 12 15 Z" fill="#1e293b" stroke="#facc15" stroke-width="1.2"/>
                        <path d="M19.4 15 A7.5 7.5 0 0 0 19.5 13.5 L21.5 12 L19.5 10.5 A7.5 7.5 0 0 0 19.4 9 L21.2 7 L18.8 4.6 L16.8 6.4 A7.5 7.5 0 0 0 15 5.6 L13.5 3.5 L10.5 3.5 L9 5.6 A7.5 7.5 0 0 0 7.2 6.4 L5.2 4.6 L2.8 7 L4.6 9 A7.5 7.5 0 0 0 4.6 10.5 L2.5 12 L4.6 13.5 A7.5 7.5 0 0 0 4.6 15 L2.8 17 L5.2 19.4 L7.2 17.6 A7.5 7.5 0 0 0 9 18.4 L10.5 20.5 L13.5 20.5 L15 18.4 A7.5 7.5 0 0 0 16.8 17.6 L18.8 19.4 L21.2 17 Z" fill="url(#mapGearGold)" stroke="#78350f" stroke-width="0.8"/>
                    </svg>
                    <span>CÀI ĐẶT</span>
                </button>
            </div>

            <!-- Toast Thông Báo Khi Bấm Bản Đồ Bị Khóa -->
            <div id="mapToast" class="map-toast hidden">
                <span class="map-toast-icon">🔒</span>
                <span id="mapToastText" class="map-toast-text">Cần hoàn thành ải trước đó!</span>
            </div>
        </div>
        `;

        const parent = document.getElementById('startModal') || document.body;
        parent.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('mapModal');

        // Gán sự kiện cho bộ 3 nút chân trang trên MapModal
        const mapNavHome = document.getElementById('mapNavBtnHome');
        const mapNavSettings = document.getElementById('mapNavBtnSettings');

        if (mapNavHome) {
            mapNavHome.onclick = () => {
                this.close();
                const navHome = document.getElementById('navBtnHome');
                if (navHome) navHome.click();
            };
        }

        if (mapNavSettings) {
            mapNavSettings.onclick = () => {
                this.close();
                const navSettings = document.getElementById('navBtnSettings');
                if (navSettings) navSettings.click();
            };
        }

        // Cập nhật nhãn bản đồ ban đầu trên sảnh
        this.updateLobbyDisplay();
    },

    getUnlockedMap() {
        try {
            const val = parseInt(localStorage.getItem(this.STORAGE_UNLOCKED_KEY), 10);
            return (!isNaN(val) && val >= 1) ? val : 1;
        } catch (e) {
            return 1;
        }
    },

    getSelectedMapId() {
        try {
            const val = parseInt(localStorage.getItem(this.STORAGE_SELECTED_KEY), 10);
            const unlocked = this.getUnlockedMap();
            // Nếu map đã lưu vượt quá map mở khóa, fallback về map mở cao nhất hoặc map 1
            if (!isNaN(val) && val >= 1 && val <= unlocked) return val;
            return 1;
        } catch (e) {
            return 1;
        }
    },

    getSelectedMap() {
        const id = this.getSelectedMapId();
        return this.MAPS.find(m => m.id === id) || this.MAPS[0];
    },

    unlockNextMap(currentId) {
        const unlocked = this.getUnlockedMap();
        if (currentId >= unlocked && unlocked < 12) {
            const next = unlocked + 1;
            localStorage.setItem(this.STORAGE_UNLOCKED_KEY, next.toString());
            console.log(`[MapModal] Đã mở khóa bản đồ mới: Ải ${next}`);
            return next;
        }
        return unlocked;
    },

    open() {
        this.init();
        this.renderGrid();
        this.element.classList.add('active');

        // Đồng bộ trạng thái tab đáy
        const navMap = document.getElementById('navBtnMap');
        const navHome = document.getElementById('navBtnHome');
        const navSettings = document.getElementById('navBtnSettings');
        if (navMap) navMap.classList.add('active');
        if (navHome) navHome.classList.remove('active');
        if (navSettings) navSettings.classList.remove('active');

        if (window.SFXController && window.SFXController.uiOpen) {
            window.SFXController.uiOpen();
        }
    },

    close() {
        if (!this.element) return;
        this.element.classList.remove('active');

        const navMap = document.getElementById('navBtnMap');
        if (navMap) navMap.classList.remove('active');
    },

    renderGrid() {
        const grid = document.getElementById('mapGridContainer');
        if (!grid) return;

        const unlockedMax = this.getUnlockedMap();
        const selectedId = this.getSelectedMapId();

        grid.innerHTML = this.MAPS.map(map => {
            const isUnlocked = map.id <= unlockedMax;
            const isSelected = map.id === selectedId;

            const starsHtml = Array(map.stars).fill('<span class="map-star-icon">★</span>').join('');

            return `
            <div id="mapCard_${map.id}" 
                 class="map-card ${!isUnlocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}" 
                 style="background-image: url('SurvivalIO/Assets/_Project/Textures/UI/bando_modal.png'); background-size: 400% 300%; background-position: ${map.bgPos};"
                 onclick="window.MapModal.handleCardClick(${map.id})">
                
                <!-- Badge Đang Chọn -->
                ${isSelected ? `
                    <div class="map-selected-badge">
                        <span>⚔️</span>
                        <span>ĐANG CHỌN</span>
                    </div>
                ` : ''}

                <!-- Badge Khóa hoặc Cấp Độ -->
                ${!isUnlocked ? `
                    <div class="map-lock-badge" title="Chưa mở khóa">🔒</div>
                ` : `
                    <div class="map-rank-badge">${map.rank}</div>
                `}

                <!-- Dải Nhãn Chân Thẻ Anime -->
                <div class="map-card-footer">
                    <div class="map-card-title">${map.id}. ${map.name}</div>
                    <div class="map-card-stars">
                        ${starsHtml}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    },

    handleCardClick(mapId) {
        const unlockedMax = this.getUnlockedMap();
        const targetMap = this.MAPS.find(m => m.id === mapId);
        if (!targetMap) return;

        // 1. Nếu bản đồ bị khóa: Rung thẻ + Báo toast
        if (mapId > unlockedMax) {
            const card = document.getElementById(`mapCard_${mapId}`);
            if (card) {
                card.classList.remove('shake');
                void card.offsetWidth; // Trigger reflow
                card.classList.add('shake');
            }

            const priorMap = this.MAPS.find(m => m.id === mapId - 1);
            const priorName = priorMap ? priorMap.name : `Ải ${mapId - 1}`;
            this.showToast(`Cần hoàn thành "${priorName}" trước đã!`);

            if (window.SFXController && window.SFXController.uiError) {
                window.SFXController.uiError();
            }
            return;
        }

        // 2. Nếu bản đồ đã mở: Lưu lựa chọn & 1 chạm về sảnh
        localStorage.setItem(this.STORAGE_SELECTED_KEY, mapId.toString());
        
        if (window.SFXController && window.SFXController.uiClick) {
            window.SFXController.uiClick();
        }

        // Đóng ngay MapModal
        this.close();

        // Kích hoạt lại tab TRANG CHỦ ở chân trang sảnh chờ
        const navHome = document.getElementById('navBtnHome');
        if (navHome) {
            navHome.click();
        } else {
            const navMap = document.getElementById('navBtnMap');
            if (navMap) navMap.classList.remove('active');
        }

        // Cập nhật tên/giao diện bản đồ đã chọn trên sảnh
        this.updateLobbyDisplay();
    },

    updateLobbyDisplay() {
        const map = this.getSelectedMap();
        if (!map) return;

        // Cập nhật phụ đề trên nút CHƠI lớn
        const playSub = document.getElementById('lobbyPlaySubtitle');
        if (playSub) {
            playSub.textContent = `Ải ${map.id}: ${map.name} (${map.stars}★) - Nhấn để đổi ải`;
        }

        // Cập nhật thẻ nhãn bản đồ trên Showcase nếu có
        const mapBadge = document.getElementById('lobbySelectedMapBadge');
        if (mapBadge) {
            mapBadge.innerHTML = `🗺️ Ải ${map.id}: <strong>${map.name}</strong> (${map.stars}★)`;
        }
    },

    showToast(message) {
        const toast = document.getElementById('mapToast');
        const text = document.getElementById('mapToastText');
        if (!toast || !text) return;

        text.textContent = message;
        toast.classList.remove('hidden');

        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2200);
    }
};

// Tự động khởi tạo khi tài liệu sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.MapModal.init());
} else {
    window.MapModal.init();
}
