/* ============================================================================
   MODULE: SurvivalIO/Assets/_Project/Scripts/UI/Lobby/LobbyMenuView.js
   Toàn Bộ Logic & Render Giao Diện Sảnh Chờ (Lobby Menu View) Chuẩn Xác 100% Ảnh Mẫu
   - 3D Pill Badges (Đồng Ryo cổ, Cuộn triệu hồi, Hokage Online)
   - Chữ 3D Kim Loại Vát Khối SHINOBI SURVIVOR & Ruy Băng Rồng Hoàng Kim
   - Nút CHƠI Rực Lửa Bùng Cháy Bập Bùng (Sửa Lỗi Mất Khúc, Đầy Đủ Chi Tiết)
   - 7 Thẻ Kính Mờ Đen Sâu Thẳm với Pod Icon Phát Sáng Riêng Biệt
   - Bộ 3 Nút Điều Hướng Squircle Viền Kim Loại Vàng (TRANG CHỦ Golden Aura Glow)
   - Bảng Thống Kê Chiến Tích Thể Thao Viền Neon Cyan Phát Quang
   ============================================================================ */

window.LobbyMenuView = {
    element: null,

    shopItems: [
        { id: 'ramen', name: 'Ramen Ichiraku Đặc Biệt', icon: '🍜', desc: 'Hồi phục 100% HP ngay khi cạn sinh lực (Tự kích hoạt 1 lần)', cost: 4000 },
        { id: 'pill', name: 'Binh Lương Hoàn Thượng Hạng', icon: '💊', desc: '+30% Lượng EXP Chakra nhận được trong suốt trận', cost: 3000 },
        { id: 'scrolls', name: 'Gói 3 Cuộn Giấy Triệu Hồi', icon: '📜', desc: 'Dùng để quay tướng và vĩ thú trong Thông Linh Chi Thuật', cost: 6000, isScrollPack: true },
        { id: 'armor', name: 'Áo Giáp Lưới Shinobi', icon: '🛡️', desc: 'Giảm 10% toàn bộ sát thương va chạm nhận vào', cost: 5000 }
    ],

    missions: [
        { id: 'm1', name: 'Tốt nghiệp Học viện Ninja', desc: 'Tham gia thi luyện ít nhất 1 trận đấu sinh tồn', rewardRyo: 1000, rewardScrolls: 0 },
        { id: 'm2', name: 'Chiến Binh Quả Cảm', desc: 'Tiêu diệt tích lũy từ 100 kẻ địch trở lên', rewardRyo: 2000, rewardScrolls: 0 },
        { id: 'm3', name: 'Sinh Tồn Bậc Thầy', desc: 'Sống sót thành công qua mốc 5 phút thi luyện', rewardRyo: 3000, rewardScrolls: 1 },
        { id: 'm4', name: 'Khắc Tinh Rắn Khổng Lồ', desc: 'Đánh bại Boss Rắn Manda của Orochimaru', rewardRyo: 4000, rewardScrolls: 2 },
        { id: 'm5', name: 'Huyền Thoại Hokage', desc: 'Đạt cấp độ nhẫn giả Cấp 20 trong một trận đấu', rewardRyo: 5000, rewardScrolls: 3 }
    ],

    summonPool: [
        { name: "✦✦✦✦✦ Vĩ Thú Cửu Vĩ Kurama", desc: "Triệu hoán linh thú huyền thoại, +50% Sát thương toàn thể!", icon: "🦊" },
        { name: "✦✦✦✦ Cóc Khổng Lồ Gamabunta", desc: "Đại Hiệp Cóc với trường đao sắc bén quét sạch kẻ địch xung quanh!", icon: "🐸" },
        { name: "✦✦✦✦ Uchiha Sasuke (Lôi Độn Kirin)", desc: "Mở khóa Lôi Thần Kirin giáng xuống từ tầng mây sấm sét!", icon: "⚡" },
        { name: "✦✦✦✦ Hatake Kakashi (Sharingan Sao Chép)", desc: "Giảm 30% thời gian hồi chiêu tất cả Nhẫn Thuật!", icon: "👁️" },
        { name: "✦✦✦ Sên Trị Liệu Katsuyu", desc: "Hồi phục 5% HP mỗi giây cho toàn bộ đồng minh!", icon: "🐌" },
        { name: "✦✦✦ Cuộn Bí Kíp Hỏa Độn Cổ Truyền", desc: "Cường hóa vĩnh viễn tầm thiêu đốt của Hào Hỏa Cầu!", icon: "🔥" }
    ],

    // Trả về toàn bộ mã nguồn HTML của Sảnh Chờ và các Modals
    getHtml() {
        return `
        <!-- MÀN HÌNH CHÍNH (HOME / LOBBY MODAL) -->
        <div id="startModal" class="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5 overflow-visible" style="background: radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.25) 0%, rgba(10, 15, 28, 0.7) 65%, rgba(5, 8, 16, 0.95) 100%);">
            
            <!-- 1. THANH HEADER TIỀN TỆ TRÊN CÙNG (3D PILL BADGES) -->
            <header class="w-full flex items-center justify-between gap-2 pointer-events-auto px-1 sm:px-3 pt-1">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                    
                    <!-- 🪙 HUY HIỆU ĐỒNG RYO VÀNG KIM 3D -->
                    <div class="top-badge-pill border border-amber-500/70 px-3.5 py-1.5 flex items-center gap-2.5 shadow-[0_0_18px_rgba(245,158,11,0.35)] bg-slate-950/90 backdrop-blur-md rounded-full transition-all hover:scale-105">
                        <!-- 3D Golden Coin SVG với lỗ vuông chạm khắc viền nổi ánh kim -->
                        <svg viewBox="0 0 32 32" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#f59e0b]">
                            <defs>
                                <radialGradient id="coinGoldGrad" cx="35%" cy="35%" r="65%">
                                    <stop offset="0%" stop-color="#fffbeb"/>
                                    <stop offset="25%" stop-color="#fde047"/>
                                    <stop offset="65%" stop-color="#f59e0b"/>
                                    <stop offset="90%" stop-color="#b45309"/>
                                    <stop offset="100%" stop-color="#78350f"/>
                                </radialGradient>
                                <linearGradient id="coinRimGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#fef08a"/>
                                    <stop offset="50%" stop-color="#d97706"/>
                                    <stop offset="100%" stop-color="#451a03"/>
                                </linearGradient>
                            </defs>
                            <circle cx="16" cy="16" r="14.5" fill="url(#coinGoldGrad)" stroke="url(#coinRimGrad)" stroke-width="1.8"/>
                            <circle cx="16" cy="16" r="11" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="2 1.2" opacity="0.8"/>
                            <rect x="12" y="12" width="8" height="8" rx="1.2" fill="#451a03" stroke="#fde047" stroke-width="1.2"/>
                            <circle cx="9" cy="9" r="1.5" fill="#ffffff" opacity="0.9"/>
                        </svg>
                        <div class="flex items-baseline gap-1">
                            <span id="topRyoCount" class="font-black text-amber-300 text-sm sm:text-base font-mono tracking-tight drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]">59,964</span>
                            <span class="text-[10px] font-black text-amber-400/90 tracking-wider">RYO</span>
                        </div>
                    </div>

                    <!-- 📜 HUY HIỆU CUỘN TRIỆU HỒI ĐỎ NHẪN GIẢ 3D -->
                    <div class="top-badge-pill border border-rose-500/70 px-3.5 py-1.5 flex items-center gap-2.5 shadow-[0_0_18px_rgba(244,63,94,0.35)] bg-slate-950/90 backdrop-blur-md rounded-full transition-all hover:scale-105">
                        <svg viewBox="0 0 32 32" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#f43f5e]">
                            <defs>
                                <linearGradient id="scrollBodyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#fffbeb"/>
                                    <stop offset="50%" stop-color="#fef3c7"/>
                                    <stop offset="100%" stop-color="#fde68a"/>
                                </linearGradient>
                                <linearGradient id="scrollEndGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stop-color="#ef4444"/>
                                    <stop offset="40%" stop-color="#b91c1c"/>
                                    <stop offset="100%" stop-color="#7f1d1d"/>
                                </linearGradient>
                            </defs>
                            <rect x="6.5" y="8" width="19" height="16" rx="2" fill="url(#scrollBodyGrad)" stroke="#78350f" stroke-width="1.2"/>
                            <rect x="2.5" y="6" width="5.5" height="20" rx="2" fill="url(#scrollEndGrad)" stroke="#991b1b" stroke-width="1.2"/>
                            <rect x="24" y="6" width="5.5" height="20" rx="2" fill="url(#scrollEndGrad)" stroke="#991b1b" stroke-width="1.2"/>
                            <rect x="2.5" y="10" width="5.5" height="2" fill="#fbbf24"/>
                            <rect x="24" y="10" width="5.5" height="2" fill="#fbbf24"/>
                            <circle cx="16" cy="16" r="4.2" fill="none" stroke="#dc2626" stroke-width="1.4"/>
                            <path d="M16 13v6M13 16h6M14 14l4 4M18 14l-4 4" stroke="#dc2626" stroke-width="1.2" stroke-linecap="round"/>
                        </svg>
                        <div class="flex items-baseline gap-1">
                            <span id="topScrollCount" class="font-black text-rose-400 text-sm sm:text-base font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]">16</span>
                            <span class="text-[10px] font-black text-rose-400/90 tracking-wider">CUỘN</span>
                        </div>
                    </div>

                    <!-- 🥷 HUY HIỆU HOKAGE ONLINE -->
                    <div class="hidden md:flex top-badge-pill border border-amber-500/60 px-3.5 py-1.5 items-center gap-2.5 shadow-[0_0_18px_rgba(245,158,11,0.25)] bg-slate-950/90 backdrop-blur-md rounded-full transition-all hover:scale-105">
                        <svg viewBox="0 0 32 32" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_6px_#f59e0b]">
                            <polygon points="16,2 3,21 29,21" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
                            <polygon points="16,2 9,21 23,21" fill="#dc2626"/>
                            <circle cx="16" cy="13" r="3" fill="#fef08a"/>
                            <path d="M2 21c7 4 21 4 28 0v3c-7 4-21 4-28 0z" fill="#0f172a" stroke="#334155" stroke-width="1"/>
                        </svg>
                        <div class="flex items-center gap-2">
                            <span class="text-xs sm:text-sm font-black text-white tracking-wide">Hokage • Uzumaki Naruto</span>
                            <div class="flex items-center gap-1.5 pl-2 border-l border-slate-700/80">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]"></span>
                                <span class="text-[11px] text-emerald-300 font-extrabold tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cụm nút tròn góc phải -->
                <div class="flex items-center gap-2">
                    <button id="btnOpenInfo" class="btn-top-util-circle" title="Hướng dẫn & Hồ sơ">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current text-slate-300 hover:text-amber-300 transition-colors">
                            <path d="M12 2l2.4 5.2 5.6.8-4 4 1 5.6-5-2.8-5 2.8 1-5.6-4-4 5.6-.8z"/>
                        </svg>
                    </button>
                    <button id="btnToggleAudio" class="btn-top-util-circle" title="Bật/Tắt Âm thanh">
                        <svg id="iconAudio" viewBox="0 0 24 24" class="w-4 h-4 fill-current text-slate-300 hover:text-amber-300 transition-colors">
                            <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        </svg>
                    </button>
                    <button id="btnToggleFullscreen" class="btn-top-util-circle" title="Toàn màn hình">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2 text-slate-300 hover:text-amber-300 transition-colors" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                    </button>
                </div>
            </header>

            <!-- 2. THÂN CHÍNH: KHU VỰC TRUNG TÂM & BẢNG MENU PHẢI -->
            <main class="flex-1 w-full flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 py-1 sm:py-2 overflow-y-auto lg:overflow-visible pointer-events-none">
                
                <!-- KHU VỰC TRUNG TÂM (TIÊU ĐỀ 3D, KHUNG TƯỚNG & 3 TAB ĐIỀU HƯỚNG) -->
                <section class="w-full lg:w-[63%] flex flex-col items-center justify-center pointer-events-auto my-auto">
                    
                    <!-- TIÊU ĐỀ LOGO HOÀNG KIM Ở GIỮA -->
                    <div class="relative text-center mb-2 sm:mb-3 flex flex-col items-center">
                        <!-- Dải ruy băng rồng uốn lượn vàng kim -->
                        <div class="golden-ribbon-banner flex items-center justify-center gap-2 px-5 py-0.5 mb-1 shadow-2xl">
                            <span class="text-sm">🐉</span>
                            <span class="text-[10px] sm:text-[11px] font-black tracking-widest text-amber-950 uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                                HOKAGE ĐỆ THẤT ĐANG CHỜ BẠN!
                            </span>
                            <span class="text-sm transform scale-x-[-1]">🐉</span>
                        </div>

                        <!-- Chữ 3D Kim Loại Vát Khối Rực Lửa -->
                        <h1 class="shinobi-title-3d text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight select-none leading-none my-1">
                            SHINOBI SURVIVOR
                        </h1>

                        <!-- Phụ đề Đại Chiến Nhẫn Giả -->
                        <div class="shinobi-subtitle flex items-center gap-3 text-xs sm:text-sm font-black tracking-[0.35em] text-amber-300 uppercase mt-0.5">
                            <span class="h-[2px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full"></span>
                            <span class="drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]">ĐẠI CHIẾN NHẪN GIẢ</span>
                            <span class="h-[2px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 rounded-full"></span>
                        </div>
                    </div>

                    <!-- Showcase Box (Khung Nhân Vật Viền Vàng 3D Đính Ngọc Bích 4 Góc) -->
                    <div class="character-showcase-box relative rounded-3xl flex items-center justify-center overflow-hidden mb-2.5">
                        <div class="corner-jade corner-jade-tl"></div>
                        <div class="corner-jade corner-jade-tr"></div>
                        <div class="corner-jade corner-jade-bl"></div>
                        <div class="corner-jade corner-jade-br"></div>
                        <canvas id="charShowcaseCanvas" width="320" height="380" class="w-full h-full object-contain"></canvas>
                        <div class="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
                    </div>

                    <!-- Tên tướng & Nút chuyển đổi -->
                    <div class="flex items-center gap-3 mb-4">
                        <button id="btnPrevNinja" class="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 hover:bg-slate-800 text-amber-300 flex items-center justify-center font-black text-sm shadow transition-all hover:scale-105 cursor-pointer" title="Nhẫn giả trước">◀</button>
                        <div class="flex flex-col items-center min-w-[190px] sm:min-w-[220px]">
                            <span id="showcaseNinjaName" class="text-base sm:text-lg font-black text-white tracking-wide drop-shadow">Uzumaki Naruto</span>
                            <div id="showcaseNinjaElement" class="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold tracking-wider mt-0.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                🌀 Phong Độn / Cửu Vĩ
                            </div>
                        </div>
                        <button id="btnNextNinja" class="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 hover:bg-slate-800 text-amber-300 flex items-center justify-center font-black text-sm shadow transition-all hover:scale-105 cursor-pointer" title="Nhẫn giả tiếp theo">▶</button>
                    </div>

                    <!-- BỘ 3 NÚT ĐIỀU HƯỚNG BÊN DƯỚI (ĐỒNG BỘ KÍCH THƯỚC TRANG CHỦ = BẢN ĐỒ = CÀI ĐẶT) -->
                    <div class="lobby-bottom-tabs w-full max-w-md">
                        <!-- 📖 Nút TRANG CHỦ (Đang chọn - Golden Aura Glow) -->
                        <button id="navBtnHome" class="nav-bottom-squircle-btn tab-btn btn-lobby-tab active flex-1">
                            <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 drop-shadow-[0_0_8px_#facc15]">
                                <defs>
                                    <linearGradient id="bookCoverGold" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stop-color="#fffbeb"/>
                                        <stop offset="40%" stop-color="#facc15"/>
                                        <stop offset="100%" stop-color="#b45309"/>
                                    </linearGradient>
                                </defs>
                                <path d="M12 4 C14 2.5 17 2.5 21 3 L21 17 C17 16.5 14 16.5 12 18 C10 16.5 7 16.5 3 17 L3 3 C7 2.5 10 2.5 12 4 Z" fill="url(#bookCoverGold)" stroke="#78350f" stroke-width="0.8"/>
                                <path d="M12 4 L12 18" stroke="#78350f" stroke-width="1.2"/>
                                <path d="M6 7 H9 M6 10 H10 M14 7 H18 M14 10 H17" stroke="#451a03" stroke-width="0.8" stroke-linecap="round"/>
                            </svg>
                            <span>TRANG CHỦ</span>
                        </button>
                        <!-- 🗺️ Nút BẢN ĐỒ -->
                        <button id="navBtnMap" class="nav-bottom-squircle-btn tab-btn btn-lobby-tab flex-1">
                            <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 text-amber-200">
                                <defs>
                                    <linearGradient id="mapParchment" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stop-color="#fef3c7"/>
                                        <stop offset="60%" stop-color="#fde68a"/>
                                        <stop offset="100%" stop-color="#d97706"/>
                                    </linearGradient>
                                </defs>
                                <polygon points="3,5 9,3 15,5 21,3 21,19 15,21 9,19 3,21" fill="url(#mapParchment)" stroke="#78350f" stroke-width="0.8"/>
                                <line x1="9" y1="3" x2="9" y2="19" stroke="#b45309" stroke-width="0.8" stroke-dasharray="2 1.5"/>
                                <line x1="15" y1="5" x2="15" y2="21" stroke="#b45309" stroke-width="0.8" stroke-dasharray="2 1.5"/>
                                <polygon points="12,8 13.5,12 12,11 10.5,12" fill="#dc2626"/>
                                <polygon points="12,14 13.5,12 12,13 10.5,12" fill="#1e293b"/>
                            </svg>
                            <span>BẢN ĐỒ</span>
                        </button>
                        <!-- ⚙️ Nút CÀI ĐẶT -->
                        <button id="navBtnSettings" class="nav-bottom-squircle-btn tab-btn btn-lobby-tab flex-1">
                            <svg viewBox="0 0 24 24" class="w-[22px] h-[22px] flex-shrink-0 text-amber-200">
                                <defs>
                                    <linearGradient id="gearGold" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stop-color="#fffbeb"/>
                                        <stop offset="50%" stop-color="#facc15"/>
                                        <stop offset="100%" stop-color="#92400e"/>
                                    </linearGradient>
                                </defs>
                                <path d="M12 15 A3 3 0 1 0 12 9 A3 3 0 1 0 12 15 Z" fill="#1e293b" stroke="#facc15" stroke-width="1.2"/>
                                <path d="M19.4 15 A7.5 7.5 0 0 0 19.5 13.5 L21.5 12 L19.5 10.5 A7.5 7.5 0 0 0 19.4 9 L21.2 7 L18.8 4.6 L16.8 6.4 A7.5 7.5 0 0 0 15 5.6 L13.5 3.5 L10.5 3.5 L9 5.6 A7.5 7.5 0 0 0 7.2 6.4 L5.2 4.6 L2.8 7 L4.6 9 A7.5 7.5 0 0 0 4.6 10.5 L2.5 12 L4.6 13.5 A7.5 7.5 0 0 0 4.6 15 L2.8 17 L5.2 19.4 L7.2 17.6 A7.5 7.5 0 0 0 9 18.4 L10.5 20.5 L13.5 20.5 L15 18.4 A7.5 7.5 0 0 0 16.8 17.6 L18.8 19.4 L21.2 17 Z" fill="url(#gearGold)" stroke="#78350f" stroke-width="0.8"/>
                            </svg>
                            <span>CÀI ĐẶT</span>
                        </button>
                    </div>
                </section>

                <!-- CỘT MENU HÀNH ĐỘNG BÊN PHẢI (RIGHT ACTION COLUMN) -->
                <aside class="lobby-right-column w-full flex flex-col pointer-events-auto justify-between flex-shrink-0">
                    
                    <!-- 1. NÚT CHƠI RỰC LỬA BÙNG CHÁY (ID: btn-play) -->
                    <button id="btn-play" class="fiery-play-banner-btn btn-play-action group">
                        <div class="fiery-play-inner flex items-center justify-between w-full relative z-10">
                            <!-- Icon Ngọn Lửa / Exclamation Badge -->
                            <div class="fiery-icon-badge flex-shrink-0">
                                <span class="fiery-badge-symbol">!</span>
                            </div>
                            <!-- Chữ Tiêu Đề -->
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5 pr-2">
                                <span class="fiery-play-title text-xl sm:text-2xl font-black tracking-wider text-white uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">CHƠI</span>
                                <span class="text-xs sm:text-sm text-amber-100 font-bold truncate">Bước vào Đại Chiến Nhẫn Giả</span>
                            </div>
                            <!-- Mũi tên trượt màu vàng kim -->
                            <span class="fiery-arrow text-2xl font-black text-amber-200 pr-1 transition-transform group-hover:translate-x-2 drop-shadow-[0_0_10px_#facc15]">›</span>
                        </div>
                    </button>

                    <!-- Khung Kính Chứa 7 Nút Danh Mục -->
                    <div class="shinobi-action-list-panel rounded-2xl p-2.5 flex flex-col gap-1.5">
                        
                        <!-- 1. 🥷 Nhẫn Giả (Pod viền xanh lam sáng, Mặt nạ Ninja/Anbu có mũ trùm xám tối, băng trán kim loại xanh dương nhạt đinh tán bạc & khẩu trang trắng che nửa mặt) -->
                        <button id="btnMenuNinja" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-ninja">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#38bdf8]">
                                    <defs>
                                        <linearGradient id="anbuHoodGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#334155"/>
                                            <stop offset="60%" stop-color="#1e293b"/>
                                            <stop offset="100%" stop-color="#0f172a"/>
                                        </linearGradient>
                                        <linearGradient id="anbuPlateGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stop-color="#f8fafc"/>
                                            <stop offset="35%" stop-color="#94a3b8"/>
                                            <stop offset="70%" stop-color="#38bdf8"/>
                                            <stop offset="100%" stop-color="#1e293b"/>
                                        </linearGradient>
                                        <linearGradient id="anbuMaskGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="60%" stop-color="#f1f5f9"/>
                                            <stop offset="100%" stop-color="#cbd5e1"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M18 3 C9 3 6 10 6 20 C6 28 10 33 18 33 C26 33 30 28 30 20 C30 10 27 3 18 3 Z" fill="url(#anbuHoodGrad)"/>
                                    <path d="M10 14 C10 14 12 18 18 18 C24 18 26 14 26 14 C26 22 23 28 18 28 C13 28 10 22 10 14 Z" fill="#090d16"/>
                                    <rect x="9" y="8" width="18" height="6.5" rx="1.5" fill="url(#anbuPlateGrad)" stroke="#0ea5e9" stroke-width="0.6"/>
                                    <circle cx="10.8" cy="9.8" r="0.7" fill="#ffffff"/>
                                    <circle cx="25.2" cy="9.8" r="0.7" fill="#ffffff"/>
                                    <circle cx="10.8" cy="12.7" r="0.7" fill="#ffffff"/>
                                    <circle cx="25.2" cy="12.7" r="0.7" fill="#ffffff"/>
                                    <path d="M16 11.2 Q18 9.8 20 11.2 Q18 12.6 16 11.2" fill="none" stroke="#0f172a" stroke-width="0.9" stroke-linecap="round"/>
                                    <ellipse cx="14" cy="16.5" rx="2.5" ry="1.2" fill="#38bdf8"/>
                                    <ellipse cx="22" cy="16.5" rx="2.5" ry="1.2" fill="#38bdf8"/>
                                    <circle cx="14" cy="16.5" r="0.6" fill="#ffffff"/>
                                    <circle cx="22" cy="16.5" r="0.6" fill="#ffffff"/>
                                    <path d="M10 18 C11 25 14 30 18 30 C22 30 25 25 26 18 C22 20 14 20 10 18 Z" fill="url(#anbuMaskGrad)" stroke="#94a3b8" stroke-width="0.5"/>
                                    <path d="M18 20 L18 28" stroke="#cbd5e1" stroke-width="0.8"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Nhẫn Giả</span>
                                <span class="obsidian-menu-desc text-sky-300/80 truncate">12 / 50 Nhẫn giả đã mở khóa</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 2. ⚔️ Nâng Cấp (Pod viền vàng lục, Katana lưỡi thép bạc sắc lẹm chém xéo, bao quanh bởi VÒNG HÀO QUANG LỬA VÀNG XOÁY TRÒN) -->
                        <button id="btnMenuUpgrades" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-upgrades">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#a3e635]">
                                    <defs>
                                        <radialGradient id="bladeFlameSpin" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.9"/>
                                            <stop offset="35%" stop-color="#fef08a" stop-opacity="0.8"/>
                                            <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.5"/>
                                            <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
                                        </radialGradient>
                                        <linearGradient id="katanaSteel" x1="0" y1="1" x2="1" y2="0">
                                            <stop offset="0%" stop-color="#94a3b8"/>
                                            <stop offset="45%" stop-color="#e2e8f0"/>
                                            <stop offset="60%" stop-color="#ffffff"/>
                                            <stop offset="100%" stop-color="#cbd5e1"/>
                                        </linearGradient>
                                    </defs>
                                    <circle cx="18" cy="18" r="15" fill="url(#bladeFlameSpin)"/>
                                    <path d="M18 4 C25 4 31 10 31 18 C31 23 28 28 23 30 C25 27 26 23 26 19 C26 14 22 9 17 9 C12 9 8 13 8 18 C8 21 9 24 11 26 C7 24 5 20 5 16 C5 9 11 4 18 4 Z" fill="#facc15" opacity="0.65"/>
                                    <path d="M18 6 C23 6 28 11 28 17 C28 21 25 25 21 27 C23 24 24 21 24 18 C24 14 21 11 17 11 C13 11 10 14 10 18 C10 20 11 22 12 24 C9 22 8 19 8 16 C8 11 12 6 18 6 Z" fill="#ea580c" opacity="0.45"/>
                                    <circle cx="28" cy="10" r="1.5" fill="#fef08a"/>
                                    <circle cx="7" cy="24" r="1.2" fill="#fb923c"/>
                                    <circle cx="25" cy="27" r="1" fill="#fde047"/>
                                    <line x1="7" y1="29" x2="13" y2="23" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
                                    <line x1="7" y1="29" x2="13" y2="23" stroke="#fef08a" stroke-width="1.2" stroke-dasharray="1.5 1.5"/>
                                    <ellipse cx="14" cy="22" rx="3.5" ry="1.8" transform="rotate(-45 14 22)" fill="#f59e0b" stroke="#78350f" stroke-width="0.8"/>
                                    <path d="M14.5 21.5 L29 7 C29.5 6.5 30 7 29.5 8 L16.5 23.5 Z" fill="url(#katanaSteel)" stroke="#ffffff" stroke-width="0.5"/>
                                    <path d="M28 8 L32 4 M27 5 L31 7" stroke="#ffffff" stroke-width="1" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Nâng Cấp</span>
                                <span class="obsidian-menu-desc text-emerald-300/80 truncate">Cường hóa thiên phú vĩnh viễn</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 3. 🍜 Cửa Hàng (Pod viền cam ấm, Bát mì Ramen men trắng viền hồng đào, đầy ắp sợi mì vàng óng & đôi đũa gỗ gác ngang có khói bốc lên) -->
                        <button id="btnMenuShop" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-shop">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#fb923c]">
                                    <defs>
                                        <linearGradient id="ramenBowlGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="60%" stop-color="#f8fafc"/>
                                            <stop offset="100%" stop-color="#e2e8f0"/>
                                        </linearGradient>
                                        <linearGradient id="soupGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#f59e0b"/>
                                            <stop offset="100%" stop-color="#b45309"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M14 9 Q12 6 15 3 M18 8 Q21 5 18 2 M22 9 Q20 6 23 3" fill="none" stroke="#f8fafc" stroke-width="1" stroke-linecap="round" opacity="0.75"/>
                                    <ellipse cx="18" cy="18" rx="13" ry="5.5" fill="url(#soupGrad)"/>
                                    <path d="M10 18 Q14 15 18 18 T26 18 M11 19 Q15 17 19 19 T25 19" fill="none" stroke="#fde047" stroke-width="1.4" stroke-linecap="round"/>
                                    <ellipse cx="13" cy="17" rx="3.2" ry="2.2" fill="#ffffff"/>
                                    <ellipse cx="13" cy="17" rx="1.8" ry="1.2" fill="#f97316"/>
                                    <circle cx="22" cy="17" r="2.4" fill="#ffffff" stroke="#f43f5e" stroke-width="0.8"/>
                                    <path d="M22 15.8 A1.2 1.2 0 1 1 21.2 17" fill="none" stroke="#f43f5e" stroke-width="0.6"/>
                                    <circle cx="17" cy="16.5" r="0.8" fill="#22c55e"/>
                                    <circle cx="19" cy="17.2" r="0.7" fill="#16a34a"/>
                                    <line x1="5" y1="14" x2="31" y2="12.5" stroke="#78350f" stroke-width="1.4" stroke-linecap="round"/>
                                    <line x1="5" y1="15.8" x2="31" y2="14.3" stroke="#b45309" stroke-width="1.3" stroke-linecap="round"/>
                                    <path d="M5 18 C5 27 10 32 18 32 C26 32 31 27 31 18 Z" fill="url(#ramenBowlGrad)" stroke="#cbd5e1" stroke-width="0.8"/>
                                    <path d="M5 18 C8 19.5 13 20 18 20 C23 20 28 19.5 31 18" fill="none" stroke="#f43f5e" stroke-width="1.8"/>
                                    <ellipse cx="18" cy="31" rx="5" ry="1.5" fill="#94a3b8"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Cửa Hàng</span>
                                <span class="obsidian-menu-desc text-amber-300/80 truncate">Nhẫn cụ, Binh lương hoàn & Bí kíp</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 4. 📜 Chiêu Mộ (Pod viền đỏ nhẫn giả, Cuộn giấy bí kíp hoàng kim tỏa ánh lửa có DẤU ẤN NGỌC ĐỎ phát sáng ở tâm) -->
                        <button id="btnMenuSummon" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-summon">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#f43f5e]">
                                    <defs>
                                        <linearGradient id="scrollGoldBody" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#fffbeb"/>
                                            <stop offset="35%" stop-color="#fef08a"/>
                                            <stop offset="70%" stop-color="#f59e0b"/>
                                            <stop offset="100%" stop-color="#b45309"/>
                                        </linearGradient>
                                        <radialGradient id="rubySealGlow" cx="40%" cy="40%" r="60%">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="25%" stop-color="#f87171"/>
                                            <stop offset="60%" stop-color="#dc2626"/>
                                            <stop offset="100%" stop-color="#7f1d1d"/>
                                        </radialGradient>
                                        <linearGradient id="scrollRollerGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stop-color="#991b1b"/>
                                            <stop offset="50%" stop-color="#ef4444"/>
                                            <stop offset="100%" stop-color="#7f1d1d"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M18 2 L19.5 7 L23 4 L21 8.5 L26 8 L22 11" fill="none" stroke="#facc15" stroke-width="0.9" opacity="0.8"/>
                                    <rect x="7" y="10" width="22" height="17" rx="2" fill="url(#scrollGoldBody)" stroke="#78350f" stroke-width="0.9"/>
                                    <rect x="3.5" y="7" width="5.5" height="23" rx="2" fill="url(#scrollRollerGrad)" stroke="#450a0a" stroke-width="0.9"/>
                                    <rect x="27" y="7" width="5.5" height="23" rx="2" fill="url(#scrollRollerGrad)" stroke="#450a0a" stroke-width="0.9"/>
                                    <rect x="3.5" y="11" width="5.5" height="2" fill="#fde047"/>
                                    <rect x="3.5" y="24" width="5.5" height="2" fill="#fde047"/>
                                    <rect x="27" y="11" width="5.5" height="2" fill="#fde047"/>
                                    <rect x="27" y="24" width="5.5" height="2" fill="#fde047"/>
                                    <circle cx="18" cy="18.5" r="5.5" fill="#fef2f2" stroke="#dc2626" stroke-width="1.2"/>
                                    <circle cx="18" cy="18.5" r="4.2" fill="url(#rubySealGlow)"/>
                                    <path d="M18 16 C19.2 16 20 17 20 18.2 C20 19.8 18 20.5 17 21 C17 19.5 16 18.5 17 17 Z" fill="#ffffff" opacity="0.9"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Chiêu Mộ</span>
                                <span class="obsidian-menu-desc text-rose-300/80 truncate">Triệu hồi Nhẫn giả & Vĩ thú</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 5. 🛡️ Thành Tựu (Pod viền vàng đồng, Tấm khiên mạ vàng nguyên khối hình cánh đại bàng vát cạnh 3D sang trọng) -->
                        <button id="btnMenuAchievements" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-achievements">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#eab308]">
                                    <defs>
                                        <linearGradient id="shieldGoldMain" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stop-color="#fffbeb"/>
                                            <stop offset="30%" stop-color="#fde047"/>
                                            <stop offset="65%" stop-color="#d97706"/>
                                            <stop offset="100%" stop-color="#78350f"/>
                                        </linearGradient>
                                        <linearGradient id="shieldInnerGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#fef08a"/>
                                            <stop offset="50%" stop-color="#f59e0b"/>
                                            <stop offset="100%" stop-color="#92400e"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M18 4 L30 8 C30 18 26 27 18 33 C10 27 6 18 6 8 Z" fill="url(#shieldGoldMain)" stroke="#fef08a" stroke-width="1"/>
                                    <path d="M18 7 L27 10.5 C27 18.5 24 25.5 18 30 C12 25.5 9 18.5 9 10.5 Z" fill="url(#shieldInnerGrad)" stroke="#78350f" stroke-width="0.8"/>
                                    <path d="M18 11 L14 16 L18 15 L22 16 Z" fill="#ffffff"/>
                                    <path d="M18 15 L12 21 L18 19 L24 21 Z" fill="#fef08a"/>
                                    <path d="M18 19 L15 25 L18 27 L21 25 Z" fill="#b45309"/>
                                    <polygon points="18,8 19,10.5 21.5,10.5 19.5,12 20.5,14.5 18,13 15.5,14.5 16.5,12 14.5,10.5 17,10.5" fill="#ffffff"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Thành Tựu</span>
                                <span class="obsidian-menu-desc text-purple-300/80 truncate">Nhiệm vụ, danh hiệu và hồ sơ</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 6. 👥 Bạn Bè (Pod viền tím huyền bí, Biểu tượng mặt nạ ninja bóng đêm mắt sáng huyền bí) -->
                        <button id="btnMenuFriends" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-friends">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#a855f7]">
                                    <defs>
                                        <linearGradient id="shadowNinjaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#3b0764"/>
                                            <stop offset="50%" stop-color="#1e1b4b"/>
                                            <stop offset="100%" stop-color="#0f172a"/>
                                        </linearGradient>
                                        <radialGradient id="mysticEyeGlow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="40%" stop-color="#c084fc"/>
                                            <stop offset="100%" stop-color="#9333ea"/>
                                        </radialGradient>
                                    </defs>
                                    <path d="M23 7 C18 7 16 11 16 16 C16 21 18 25 23 25 C28 25 30 21 30 16 C30 11 28 7 23 7 Z" fill="#18181b" opacity="0.7"/>
                                    <ellipse cx="25" cy="15" rx="1.8" ry="0.9" fill="#c084fc"/>
                                    <path d="M15 10 C9 10 7 15 7 21 C7 27 10 31 15 31 C20 31 23 27 23 21 C23 15 21 10 15 10 Z" fill="url(#shadowNinjaGrad)" stroke="#a855f7" stroke-width="0.9"/>
                                    <rect x="9.5" y="14" width="11" height="4" rx="1" fill="#4c1d95" stroke="#c084fc" stroke-width="0.5"/>
                                    <circle cx="15" cy="16" r="0.8" fill="#e9d5ff"/>
                                    <ellipse cx="12" cy="20.5" rx="2" ry="0.9" fill="url(#mysticEyeGlow)"/>
                                    <ellipse cx="18" cy="20.5" rx="2" ry="0.9" fill="url(#mysticEyeGlow)"/>
                                    <path d="M9 22 C10 26 12 29 15 29 C18 29 20 26 21 22 Z" fill="#0f172a" stroke="#6b21a8" stroke-width="0.6"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Bạn Bè</span>
                                <span class="obsidian-menu-desc text-cyan-300/80 truncate">Tổ đội sinh tồn tối đa 4 người</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>

                        <!-- 7. 🏆 Xếp Hạng (Pod viền vàng kim lấp lánh, Chiếc Cúp Vàng vô địch 3D lấp lánh có 2 quai uốn cong đối xứng & viên ngọc đỏ đính ở thân cúp) -->
                        <button id="btnMenuLeaderboard" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-leaderboard">
                                <svg viewBox="0 0 36 36" class="w-6 h-6 flex-shrink-0 drop-shadow-[0_0_8px_#facc15]">
                                    <defs>
                                        <linearGradient id="cupGoldMain" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stop-color="#b45309"/>
                                            <stop offset="25%" stop-color="#fde047"/>
                                            <stop offset="50%" stop-color="#ffffff"/>
                                            <stop offset="75%" stop-color="#f59e0b"/>
                                            <stop offset="100%" stop-color="#78350f"/>
                                        </linearGradient>
                                        <radialGradient id="cupRubyGlow" cx="35%" cy="35%" r="65%">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="35%" stop-color="#ef4444"/>
                                            <stop offset="100%" stop-color="#7f1d1d"/>
                                        </radialGradient>
                                    </defs>
                                    <path d="M10 11 C4 11 4 20 11 20" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
                                    <path d="M26 11 C32 11 32 20 25 20" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
                                    <path d="M9 7 L27 7 L25 18 C25 23 21 26 18 26 C15 26 11 23 11 18 Z" fill="url(#cupGoldMain)" stroke="#fef08a" stroke-width="0.9"/>
                                    <ellipse cx="18" cy="7" rx="9" ry="2.2" fill="#fef08a" stroke="#b45309" stroke-width="0.8"/>
                                    <path d="M16 26 L20 26 L19.5 29 L16.5 29 Z" fill="#d97706"/>
                                    <path d="M12 29 L24 29 L25 32 L11 32 Z" fill="#451a03" stroke="#facc15" stroke-width="0.8"/>
                                    <circle cx="18" cy="17" r="2.8" fill="url(#cupRubyGlow)" stroke="#fef2f2" stroke-width="0.6"/>
                                    <polygon points="18,15 19.8,17 18,19 16.2,17" fill="#ffffff" opacity="0.6"/>
                                    <polygon points="26,6 27,8 29,8 27.5,9.5 28,11.5 26,10 24,11.5 24.5,9.5 23,8 25,8" fill="#ffffff"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Xếp Hạng</span>
                                <span class="obsidian-menu-desc text-yellow-300/80 truncate">Bảng vàng ai sống sót lâu nhất</span>
                            </div>
                            <span class="obsidian-chevron">›</span>
                        </button>
                    </div>

                    <!-- BẢNG THỐNG KÊ CHIẾN TÍCH (DƯỚI CÙNG BÊN PHẢI) -->
                    <div class="battle-stats-card stats-card-box stats-panel rounded-2xl flex flex-col">
                        <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                            <span class="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 drop-shadow">
                                <span class="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span>
                                THỐNG KÊ CHIẾN TÍCH
                            </span>
                            <span class="text-[10px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold">Lịch sử</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="battle-stat-cell">
                                <div class="text-[10px] text-slate-400 font-semibold">Số trận đã đấu</div>
                                <div id="lobbyStatMatches" class="text-sm sm:text-base font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]">19 trận</div>
                            </div>
                            <div class="battle-stat-cell">
                                <div class="text-[10px] text-slate-400 font-semibold">Sống sót lâu nhất</div>
                                <div id="lobbyStatSurvival" class="text-sm sm:text-base font-black text-cyan-300 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(103,232,249,0.6)]">06:22</div>
                            </div>
                            <div class="battle-stat-cell">
                                <div class="text-[10px] text-slate-400 font-semibold">Cấp độ cao nhất</div>
                                <div id="lobbyStatLevel" class="text-sm sm:text-base font-black text-sky-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">Lv.18</div>
                            </div>
                            <div class="battle-stat-cell">
                                <div class="text-[10px] text-slate-400 font-semibold">Kẻ địch đã diệt</div>
                                <div id="lobbyStatKills" class="text-sm sm:text-base font-black text-rose-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]">4,834</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>

        <!-- ==========================================
             CÁC MODALS PHỤ CỦA LOBBY (100% ĐẦY ĐỦ TÍNH NĂNG)
             ========================================== -->

        <!-- 1. MODAL DANH BẠ NHẪN GIẢ -->
        <div id="modalShinobi" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🥋</span>
                        <h3 class="text-xl font-black text-amber-400 uppercase tracking-wide">DANH BẠ NHẪN GIẢ (12/50 ĐÃ MỞ)</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <p class="text-xs text-slate-300 mb-4">Chọn nhẫn giả đại diện xung trận. Mỗi nhẫn giả sở hữu chỉ số, hệ nguyên tố và bộ nhẫn thuật khởi đầu riêng biệt.</p>
                <div id="shinobiRosterGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"></div>
            </div>
        </div>

        <!-- 2. MODAL KHỞI ĐẦU NHẪN THUẬT -->
        <div id="modalStartingJutsu" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content text-center">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🌟</span>
                        <h3 class="text-xl font-black text-amber-400 uppercase tracking-wide">CHỌN NHẪN THUẬT KHỞI ĐẦU</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <p class="text-xs text-slate-300 mb-4">Thiên phú <strong>Khởi Đầu Nhẫn Thuật</strong> cho phép bạn tự do chọn 1 bí thuật xuất phát để bắt đầu cuộc chiến sinh tồn!</p>
                <div id="startingJutsuOptions" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-left"></div>
                <div class="flex justify-center">
                    <button id="btnStartWithDefaultJutsu" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-600 transition cursor-pointer">
                        Dùng Chiêu Thức Mặc Định Của Tướng
                    </button>
                </div>
            </div>
        </div>

        <!-- 3. MODAL CỬA HÀNG -->
        <div id="modalShop" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🍜</span>
                        <h3 class="text-xl font-black text-amber-400 uppercase tracking-wide">TIỆM RAMEN ICHIRAKU & NHẪN CỤ</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <p class="text-xs text-slate-300 mb-4">Tiếp tế thảo dược, binh lương hoàn và các vật phẩm cổ truyền phục vụ đại chiến sinh tồn.</p>
                <div id="shopItemsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"></div>
            </div>
        </div>

        <!-- 4. MODAL CHIÊU MỘ -->
        <div id="modalSummon" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content text-center">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">📜</span>
                        <h3 class="text-xl font-black text-rose-400 uppercase tracking-wide">THÔNG LINH CHI THUẬT (CHIÊU MỘ)</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <div class="relative py-6 flex flex-col items-center justify-center">
                    <div class="w-40 h-40 rounded-full border-4 border-dashed border-rose-500/70 flex items-center justify-center animate-spin-slow shadow-[0_0_40px_rgba(244,63,94,0.3)] mb-4">
                        <div class="text-5xl">🐸</div>
                    </div>
                    <h4 class="text-lg font-black text-amber-300 mb-1">TRIỆU HỒI NHẪN GIẢ & VĨ THÚ</h4>
                    <p class="text-xs text-slate-300 max-w-sm mb-6">Ký khế ước máu với các linh thú huyền thoại như Cóc Gamabunta, Sên Katsuyu và Vĩ thú Kurama.</p>

                    <div id="summonResultBox" class="hidden w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 mb-5 text-center shadow-2xl">
                        <div id="summonResultIcon" class="text-4xl mb-1">✨</div>
                        <div id="summonResultTitle" class="text-base font-black text-amber-300 uppercase"></div>
                        <div id="summonResultDesc" class="text-xs text-slate-300 mt-1"></div>
                    </div>

                    <div class="flex flex-wrap items-center justify-center gap-3">
                        <button id="btnSummon1" class="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer">
                            📜 Triệu Hồi x1 (1 Vé)
                        </button>
                        <button id="btnSummon10" class="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer">
                            📜 Triệu Hồi x10 (10 Vé)
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 5. MODAL THÀNH TỰU -->
        <div id="modalAchievements" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🎖️</span>
                        <h3 class="text-xl font-black text-purple-400 uppercase tracking-wide">NHIỆM VỤ & THÀNH TỰU NHẪN GIẢ</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <p class="text-xs text-slate-300 mb-4">Hoàn thành nhiệm vụ nhẫn giả cấp D đến cấp S để nhận thưởng Ryo và Cuộn giấy Triệu hồi.</p>
                <div id="missionsListContainer" class="space-y-2.5 mb-4"></div>
            </div>
        </div>

        <!-- 6. MODAL BẠN BÈ -->
        <div id="modalFriends" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🤝</span>
                        <h3 class="text-xl font-black text-cyan-400 uppercase tracking-wide">LIÊN MINH NHẪN GIẢ (TỔ ĐỘI 4 NGƯỜI)</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-700 rounded-xl p-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-slate-300">Mã Đội Của Bạn:</span>
                        <span class="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono font-black text-sm">KONOHA-77</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="btnCreateRoom" class="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer">Tạo Phòng Mới</button>
                        <button id="btnQuickMatch" class="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition cursor-pointer">Tìm Nhanh</button>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="flex items-center justify-between bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center font-bold text-blue-200">⚡</div>
                            <div>
                                <div class="text-sm font-bold text-white">Uchiha Sasuke (Lv.24)</div>
                                <div class="text-[11px] text-emerald-400 flex items-center gap-1">
                                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Sẵn sàng chiến đấu
                                </div>
                            </div>
                        </div>
                        <button class="btn-invite-friend px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer">Mời Vào Đội</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 7. MODAL XẾP HẠNG -->
        <div id="modalLeaderboard" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🏆</span>
                        <h3 class="text-xl font-black text-yellow-400 uppercase tracking-wide">BẢNG VÀNG SINH TỒN HOKAGE</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <p class="text-xs text-slate-300 mb-4">Danh sách những nhẫn giả sống sót kiên cường nhất qua các đợt đại quân Akatsuki và Boss thế giới.</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between bg-amber-500/20 border-2 border-amber-400/70 rounded-xl p-3">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl font-black text-amber-300">🥇</span>
                            <div>
                                <div class="text-sm font-black text-amber-200">Namikaze Minato (Tia Chớp Vàng)</div>
                                <div class="text-[11px] text-slate-300">Cấp độ 45 • Lục Đạo Tiên Nhân</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-black text-emerald-300 font-mono">35:42</div>
                            <div class="text-[10px] text-slate-400">12,450 Kills</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between bg-sky-950/70 border border-sky-500/70 rounded-xl p-3">
                        <div class="flex items-center gap-3">
                            <span class="text-xl font-bold text-sky-400">🎖️ 4</span>
                            <div>
                                <div class="text-sm font-black text-sky-200">Uzumaki Naruto (Bạn)</div>
                                <div class="text-[11px] text-slate-300">Kỷ lục cá nhân tốt nhất</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div id="leadBoardUserTime" class="text-sm font-black text-emerald-300 font-mono">00:00</div>
                            <div id="leadBoardUserKills" class="text-[10px] text-slate-400">0 Kills</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 8. MODAL BẢN ĐỒ -->
        <div id="modalMap" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🗺️</span>
                        <h3 class="text-xl font-black text-amber-400 uppercase tracking-wide">CHIẾN TRƯỜNG NGŨ ĐẠI CƯỜNG QUỐC</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="border-2 border-amber-400 rounded-xl p-3 bg-slate-900/90 text-center shadow-lg">
                        <div class="text-3xl mb-1">🌿</div>
                        <div class="text-sm font-black text-amber-300">Thảo Nguyên Làng Lá</div>
                        <div class="text-[10px] text-emerald-400 font-bold mb-2">ĐANG CHỌN • ĐỘ KHÓ: D-RANK</div>
                        <p class="text-[11px] text-slate-400 mb-3">Đồng cỏ rộng lớn, kẻ địch phân bố đồng đều, lý tưởng để làm quen nhẫn thuật.</p>
                        <button class="w-full py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">Đang Chọn</button>
                    </div>
                    <div class="border border-slate-700 rounded-xl p-3 bg-slate-900/60 text-center opacity-80 hover:opacity-100 transition">
                        <div class="text-3xl mb-1">⚡</div>
                        <div class="text-sm font-bold text-white">Thung Lũng Tận Cùng</div>
                        <div class="text-[10px] text-amber-400 font-bold mb-2">ĐÃ MỞ KHÓA • ĐỘ KHÓ: B-RANK</div>
                        <p class="text-[11px] text-slate-400 mb-3">Thác nước cuồn cuộn, sấm chớp liên hồi, quái vật xuất hiện dồn dập.</p>
                        <button class="btn-select-map w-full py-1.5 rounded-lg bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition cursor-pointer">Chọn Map</button>
                    </div>
                    <div class="border border-slate-700 rounded-xl p-3 bg-slate-900/60 text-center opacity-70">
                        <div class="text-3xl mb-1">🌲</div>
                        <div class="text-sm font-bold text-slate-300">Rừng Chết Thí Luyện</div>
                        <div class="text-[10px] text-rose-400 font-bold mb-2">KHÓA • ĐỘ KHÓ: S-RANK</div>
                        <p class="text-[11px] text-slate-400 mb-3">Cây cổ thụ độc, rắn khổng lồ xuất hiện ngay phút thứ 3 của trận đấu.</p>
                        <button class="w-full py-1.5 rounded-lg bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed">Sống sót >10p để mở</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 9. MODAL CÀI ĐẶT -->
        <div id="modalSettings" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">⚙️</span>
                        <h3 class="text-xl font-black text-slate-200 uppercase tracking-wide">CÀI ĐẶT TRÒ CHƠI</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <div class="space-y-4">
                    <div class="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div>
                            <div class="text-sm font-bold text-white">Hiệu Ứng Rung Màn Hình</div>
                            <div class="text-[11px] text-slate-400">Rung lắc khi Boss giáng thế hoặc đại bạo phát Rasengan</div>
                        </div>
                        <input type="checkbox" id="settingScreenShake" checked class="w-5 h-5 accent-amber-500 cursor-pointer">
                    </div>
                    <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div class="text-sm font-bold text-white mb-2">Bảng Phím Tắt Điều Khiển</div>
                        <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
                            <div>Di chuyển: <span class="text-amber-400 font-bold">W A S D</span> / <span class="text-amber-400 font-bold">Mũi Tên</span></div>
                            <div>Thi triển chiêu thức: <span class="text-emerald-400 font-bold">Tự động (Auto)</span></div>
                            <div>Kéo/Chạm Chuột: <span class="text-sky-400 font-bold">Joystick ảo</span></div>
                            <div>Tạm dừng: <span class="text-purple-400 font-bold">ESC / Phím P</span></div>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-2">
                        <button id="btnResetData" class="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-700 text-rose-200 text-xs font-bold border border-rose-600/40 transition cursor-pointer">Khôi phục dữ liệu ban đầu</button>
                        <button class="btn-close-submodal px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition cursor-pointer">Xong</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 10. MODAL HƯỚNG DẪN -->
        <div id="modalInfo" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🍥</span>
                        <h3 class="text-xl font-black text-amber-400 uppercase tracking-wide">HƯỚNG DẪN CHIẾN ĐẤU NHẪN GIẢ</h3>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>
                <div class="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <p>🌀 <strong class="text-white">NARUTO: SHINOBI SURVIVOR</strong> là tựa game Rogue-lite sinh tồn đỉnh cao lấy cảm hứng từ lối chơi chuẩn mực của <span class="text-amber-300 font-bold">PokéSurvivor</span>.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
                        <div><span class="text-amber-400 font-bold">✴️ Shuriken Nổ:</span> Tự động phóng phi tiêu sắc bén và gắn bùa nổ theo diện rộng.</div>
                        <div><span class="text-sky-400 font-bold">🌀 Rasengan:</span> Tạo cầu Chakra xoay tròn quanh người đẩy lùi mọi bầy quái áp sát.</div>
                        <div><span class="text-orange-400 font-bold">🔥 Hào Hỏa Cầu:</span> Quả cầu lửa diện rộng thiêu rụi bầy Zetsu Trắng trong nháy mắt.</div>
                        <div><span class="text-cyan-300 font-bold">⚡ Chidori:</span> Lôi điện giật chuỗi đa mục tiêu xuyên giáp kẻ địch tinh nhuệ.</div>
                    </div>
                    <p class="text-xs text-amber-300/90 pt-2 border-t border-slate-700/60">
                        💡 <strong>Mẹo Lên Cấp:</strong> Thu thập đủ 5 Nhẫn Thuật Tấn Công và 5 Thuộc Tính Bổ Trợ để Thức Tỉnh Nhẫn Thuật 6★ Siêu Cấp (Rasenshuriken, Kirin, Bão Nổ Liên Hoàn...).
                    </p>
                </div>
            </div>
        </div>
        `;
    },

    // Khởi tạo toàn bộ giao diện và gán các Event Listener tương tác
    init() {
        if (this.element) return;

        let container = document.getElementById('lobbyContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lobbyContainer';
            container.innerHTML = this.getHtml();
            document.body.appendChild(container);
        }

        this.element = document.getElementById('startModal');
        if (!this.element) return;

        // 1. Nút Chơi Trực Tiếp
        const handleStartGame = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (window.SFXController) {
                try { window.SFXController.uiClick(); } catch (_) {}
            }

            // Lập tức ẩn #startModal sảnh chờ
            this.hide();

            // Khởi động trận đấu theo kiến trúc hiện tại của game
            const talents = window.StorageManager?.data?.talents || {};
            const startingJutsuLevel = talents.starting_jutsu || talents.start_skill || (window.StorageManager?.getTalentLevel ? window.StorageManager.getTalentLevel('start_skill') : 0);
            if (startingJutsuLevel >= 1 && typeof this.openStartingJutsuSelection === 'function') {
                this.openStartingJutsuSelection();
            } else {
                if (window.GameManager && typeof window.GameManager.startNewRun === 'function') {
                    window.GameManager.startNewRun();
                } else {
                    console.error("[LobbyMenuView]: window.GameManager.startNewRun không tồn tại!");
                }
            }
        };

        const playBtn1 = document.getElementById('btn-play');
        if (playBtn1) playBtn1.addEventListener('click', handleStartGame);
        const playBtn2 = document.getElementById('btnPlayGame');
        if (playBtn2 && playBtn2 !== playBtn1) playBtn2.addEventListener('click', handleStartGame);
        document.querySelectorAll('.fiery-play-banner-btn, .btn-play-action').forEach(btn => {
            btn.onclick = handleStartGame;
        });

        // 2. Nút Chọn Tướng
        const btnNinja = document.getElementById('btnMenuNinja');
        if (btnNinja) {
            btnNinja.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.renderShinobiRoster();
                this.openModal('modalShinobi');
            });
        }

        // 3. Nút Nâng Cấp Thiên Phú
        const btnUpgrades = document.getElementById('btnMenuUpgrades');
        if (btnUpgrades) {
            btnUpgrades.addEventListener('click', () => {
                if (window.UpgradeModal) {
                    window.UpgradeModal.show();
                }
            });
        }

        // 4. Nút Cửa Hàng
        const btnShop = document.getElementById('btnMenuShop');
        if (btnShop) {
            btnShop.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.renderShopItems();
                this.openModal('modalShop');
            });
        }

        // 5. Nút Chiêu Mộ
        const btnSummon = document.getElementById('btnMenuSummon');
        if (btnSummon) {
            btnSummon.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                const box = document.getElementById('summonResultBox');
                if (box) box.classList.add('hidden');
                this.openModal('modalSummon');
            });
        }

        // 6. Nút Thành Tựu
        const btnAchieve = document.getElementById('btnMenuAchievements');
        if (btnAchieve) {
            btnAchieve.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.renderMissions();
                this.openModal('modalAchievements');
            });
        }

        // 7. Nút Bạn Bè
        const btnFriends = document.getElementById('btnMenuFriends');
        if (btnFriends) {
            btnFriends.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.openModal('modalFriends');
            });
        }

        // 8. Nút Xếp Hạng
        const btnLead = document.getElementById('btnMenuLeaderboard');
        if (btnLead) {
            btnLead.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.syncStats();
                this.openModal('modalLeaderboard');
            });
        }

        // 9. Bộ 3 Tab Điều Hướng Đáy
        const navHome = document.getElementById('navBtnHome');
        const navMap = document.getElementById('navBtnMap');
        const navSettings = document.getElementById('navBtnSettings');

        if (navHome) {
            navHome.addEventListener('click', () => {
                this.closeAllModals();
            });
        }
        if (navMap) {
            navMap.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.openModal('modalMap');
                document.querySelectorAll('.nav-bottom-squircle-btn').forEach(b => b.classList.remove('active'));
                navMap.classList.add('active');
            });
        }
        if (navSettings) {
            navSettings.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.openModal('modalSettings');
                document.querySelectorAll('.nav-bottom-squircle-btn').forEach(b => b.classList.remove('active'));
                navSettings.classList.add('active');
            });
        }

        // 10. Chuyển Đổi Tướng Nhanh Trên Showcase
        const btnPrev = document.getElementById('btnPrevNinja');
        const btnNext = document.getElementById('btnNextNinja');
        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                const catalog = window.NinjaCatalog;
                const curId = window.StorageManager.data.selectedNinja;
                let idx = catalog.findIndex(n => n.id === curId);
                idx = (idx - 1 + catalog.length) % catalog.length;
                this.selectNinja(catalog[idx].id);
            });
            btnNext.addEventListener('click', () => {
                const catalog = window.NinjaCatalog;
                const curId = window.StorageManager.data.selectedNinja;
                let idx = catalog.findIndex(n => n.id === curId);
                idx = (idx + 1) % catalog.length;
                this.selectNinja(catalog[idx].id);
            });
        }

        // 11. Các Nút Tiện Ích Góc Phải
        const btnAudio = document.getElementById('btnToggleAudio');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                if (window.SFXController) {
                    const isMuted = window.SFXController.toggleMute();
                    const icon = document.getElementById('iconAudio');
                    if (icon) {
                        icon.innerHTML = isMuted
                            ? '<path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>'
                            : '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>';
                    }
                }
            });
        }

        const btnFull = document.getElementById('btnToggleFullscreen');
        if (btnFull) {
            btnFull.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
        }

        const btnInfo = document.getElementById('btnOpenInfo');
        if (btnInfo) {
            btnInfo.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.openModal('modalInfo');
            });
        }

        // Đóng các submodal
        document.querySelectorAll('.btn-close-submodal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Nút Triệu hồi
        const btnSum1 = document.getElementById('btnSummon1');
        const btnSum10 = document.getElementById('btnSummon10');
        if (btnSum1) btnSum1.addEventListener('click', () => this.triggerSummon(1));
        if (btnSum10) btnSum10.addEventListener('click', () => this.triggerSummon(10));

        // Nút Khởi đầu bằng chiêu mặc định
        const btnDefaultJutsu = document.getElementById('btnStartWithDefaultJutsu');
        if (btnDefaultJutsu) {
            btnDefaultJutsu.addEventListener('click', () => {
                this.closeAllModals();
                window.GameManager.startNewRun();
            });
        }

        // Nút Reset Dữ Liệu
        const btnReset = document.getElementById('btnResetData');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến trình dữ liệu và chơi lại từ đầu?")) {
                    localStorage.removeItem(window.StorageManager.SAVE_KEY);
                    location.reload();
                }
            });
        }

        // Cài đặt Screen Shake
        const chkShake = document.getElementById('settingScreenShake');
        if (chkShake && window.Camera) {
            chkShake.addEventListener('change', (e) => {
                window.Camera.shakeEnabled = e.target.checked;
            });
        }

        // Đồng bộ dữ liệu hiển thị ban đầu
        this.syncStats();

        // Vòng lặp animation Showcase nhân vật
        let showcaseTime = 0;
        const animateShowcase = () => {
            if (this.element && !this.element.classList.contains('hidden')) {
                showcaseTime += 0.035;
                this.renderShowcase(showcaseTime);
            }
            requestAnimationFrame(animateShowcase);
        };
        requestAnimationFrame(animateShowcase);

        console.log("🍥 [LobbyMenuView]: Khởi tạo hoàn tất giao diện sảnh chờ chuẩn 100% hình ảnh mẫu!");
    },

    show() {
        if (!this.element) this.init();
        if (this.element) {
            this.element.classList.remove('hidden');
            this.closeAllModals();
            this.syncStats();
        }
    },

    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            this.element.style.display = 'none';
            this.closeAllModals();
        }
    },

    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            this.element.style.display = '';
            this.syncStats();
        }
    },

    openModal(modalId) {
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        const target = document.getElementById(modalId);
        if (target) target.classList.add('open');
    },

    closeAllModals() {
        if (window.SFXController) window.SFXController.uiClick();
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.nav-bottom-squircle-btn').forEach(b => b.classList.remove('active'));
        const homeBtn = document.getElementById('navBtnHome');
        if (homeBtn) homeBtn.classList.add('active');
    },

    syncStats() {
        if (!window.StorageManager || !window.StorageManager.data) return;
        const d = window.StorageManager.data;

        const ryoEl = document.getElementById('topRyoCount');
        if (ryoEl) ryoEl.textContent = d.ryo.toLocaleString();

        const scrollEl = document.getElementById('topScrollCount');
        if (scrollEl) scrollEl.textContent = d.scrolls.toLocaleString();

        const matchEl = document.getElementById('lobbyStatMatches');
        if (matchEl) matchEl.textContent = `${d.matchesPlayed || 19} trận`;

        const survEl = document.getElementById('lobbyStatSurvival');
        if (survEl) {
            const timeSec = d.bestTime || 382; // Mặc định 06:22 nếu chưa có
            const mm = String(Math.floor(timeSec / 60)).padStart(2, '0');
            const ss = String(timeSec % 60).padStart(2, '0');
            survEl.textContent = `${mm}:${ss}`;
        }

        const lvEl = document.getElementById('lobbyStatLevel');
        if (lvEl) lvEl.textContent = `Lv.${d.maxLevel || 18}`;

        const killEl = document.getElementById('lobbyStatKills');
        if (killEl) killEl.textContent = (d.totalKills || 4834).toLocaleString();

        const lbTime = document.getElementById('leadBoardUserTime');
        if (lbTime) {
            const timeSec = d.bestTime || 382;
            const mm = String(Math.floor(timeSec / 60)).padStart(2, '0');
            const ss = String(timeSec % 60).padStart(2, '0');
            lbTime.textContent = `${mm}:${ss}`;
        }
        const lbKills = document.getElementById('leadBoardUserKills');
        if (lbKills) lbKills.textContent = `${(d.totalKills || 4834).toLocaleString()} Kills`;

        // Cập nhật nhân vật đang chọn
        if (window.NinjaCatalog) {
            const ninja = window.NinjaCatalog.find(n => n.id === d.selectedNinja) || window.NinjaCatalog[0];
            const nameEl = document.getElementById('showcaseNinjaName');
            if (nameEl) nameEl.textContent = ninja.name;
            const elemEl = document.getElementById('showcaseNinjaElement');
            if (elemEl) elemEl.textContent = ninja.element;
        }
    },

    updateStats() {
        this.syncStats();
    },

    renderShowcase(time) {
        const scCanvas = document.getElementById('charShowcaseCanvas');
        if (!scCanvas) return;
        const sctx = scCanvas.getContext('2d');
        const w = scCanvas.width;
        const h = scCanvas.height;
        const cx = w / 2;
        const cy = h / 2 + 10;

        sctx.clearRect(0, 0, w, h);

        // Vòng xoay ấn chú
        sctx.save();
        sctx.translate(cx, cy + 42);
        sctx.rotate(time * 0.6);
        sctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
        sctx.lineWidth = 2;
        sctx.beginPath();
        sctx.ellipse(0, 0, 68, 24, 0, 0, Math.PI * 2);
        sctx.stroke();

        for (let i = 0; i < 4; i++) {
            const ang = (Math.PI / 2) * i;
            const px = Math.cos(ang) * 68;
            const py = Math.sin(ang) * 24;
            sctx.fillStyle = "#facc15";
            sctx.beginPath();
            sctx.arc(px, py, 3, 0, Math.PI * 2);
            sctx.fill();
        }
        sctx.restore();

        // Hào quang nhân vật
        const currentNinjaId = window.StorageManager.data.selectedNinja || 'naruto';
        let auraColor = "rgba(249, 115, 22, 0.4)";
        if (currentNinjaId === 'sasuke') auraColor = "rgba(56, 189, 248, 0.4)";
        else if (currentNinjaId === 'kakashi') auraColor = "rgba(74, 222, 128, 0.4)";
        else if (currentNinjaId === 'sakura') auraColor = "rgba(244, 63, 94, 0.4)";
        else if (currentNinjaId === 'itachi') auraColor = "rgba(239, 68, 68, 0.4)";

        sctx.fillStyle = auraColor;
        sctx.beginPath();
        sctx.arc(cx, cy - 8, 48 + Math.sin(time * 6) * 4, 0, Math.PI * 2);
        sctx.fill();

        if (window.SpriteRenderer && window.SpriteRenderer.drawShinobi) {
            window.SpriteRenderer.drawShinobi(
                sctx,
                cx,
                cy - 6,
                34,
                time,
                1,
                false,
                false,
                1,
                currentNinjaId
            );
        }
    },

    renderShinobiRoster() {
        const container = document.getElementById('shinobiRosterGrid');
        if (!container || !window.NinjaCatalog) return;

        let html = '';
        for (let i = 0; i < window.NinjaCatalog.length; i++) {
            const n = window.NinjaCatalog[i];
            const isSelected = window.StorageManager.data.selectedNinja === n.id;
            html += `
                <div class="ninja-card-item ${isSelected ? 'selected' : ''}" onclick="window.LobbyMenuView.selectNinja('${n.id}')">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${n.icon}</span>
                            <div>
                                <div class="text-sm font-black text-white">${n.name}</div>
                                <div class="text-[10px] text-amber-300 font-bold">${n.element}</div>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-black ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}">
                            ${isSelected ? 'ĐÃ CHỌN' : 'CHỌN'}
                        </span>
                    </div>
                    <div class="text-[11px] text-slate-300 mb-2 italic">"${n.desc}"</div>
                    <div class="flex items-center justify-between text-[11px] bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                        <span class="text-emerald-400 font-bold">HP: ${n.hp}</span>
                        <span class="text-sky-300 font-bold">Tốc độ: ${n.speed}</span>
                        <span class="text-amber-300 font-bold">${n.jutsu}</span>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    selectNinja(ninjaId) {
        window.StorageManager.data.selectedNinja = ninjaId;
        window.StorageManager.save();
        this.renderShinobiRoster();
        this.syncStats();
        if (window.SFXController) window.SFXController.uiSelect();
    },

    openStartingJutsuSelection() {
        if (window.SFXController) window.SFXController.uiOpen();
        const container = document.getElementById('startingJutsuOptions');
        if (!container) return;

        const options = [
            { id: 'rasengan', name: 'Rasengan (Loa Toàn Hoàn)', icon: '🌀', desc: 'Cầu Chakra hộ thể xoay tròn quanh người, liên tục đẩy lùi và nghiền nát quái.' },
            { id: 'shuriken', name: 'Phi Tiêu Shuriken Nổ', icon: '✴️', desc: 'Tự động phóng chùm phi tiêu sắc bén và kích nổ bùa nổ diện rộng từ xa.' },
            { id: 'fireball', name: 'Hào Hỏa Cầu Chi Thuật', icon: '🔥', desc: 'Quả cầu lửa khổng lồ thiêu đốt hàng loạt kẻ địch trên diện rộng (AoE).' },
            { id: 'chidori', name: 'Lôi Độn: Chidori (Thiên Điểu)', icon: '⚡', desc: 'Tia sét Thiên Điểu giật chuỗi đa mục tiêu xuyên phá giáp kẻ địch tinh nhuệ.' },
            { id: 'clones', name: 'Ảnh Phân Thân Chi Thuật', icon: '👥', desc: 'Triệu hồi Ảnh Phân Thân bọc lót xung quanh và ném phi tiêu hỗ trợ.' }
        ];

        let html = '';
        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            html += `
                <div class="ninja-card-item flex flex-col justify-between cursor-pointer group" onclick="window.LobbyMenuView.selectStartingJutsuAndPlay('${opt.id}')">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-3xl drop-shadow">${opt.icon}</span>
                            <div class="text-sm font-black text-amber-300 group-hover:text-yellow-200 transition-colors">${opt.name}</div>
                        </div>
                        <p class="text-[11px] text-slate-300 leading-relaxed mb-3">${opt.desc}</p>
                    </div>
                    <button class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition">
                        Xuất Trận Với Chiêu Này ➔
                    </button>
                </div>
            `;
        }
        container.innerHTML = html;
        this.openModal('modalStartingJutsu');
    },

    selectStartingJutsuAndPlay(skillId) {
        this.closeAllModals();
        window.GameManager.startNewRun(skillId);
    },

    renderShopItems() {
        const container = document.getElementById('shopItemsContainer');
        if (!container) return;

        let html = '';
        for (let i = 0; i < this.shopItems.length; i++) {
            const item = this.shopItems[i];
            const canAfford = window.StorageManager.data.ryo >= item.cost;
            html += `
                <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-2xl">${item.icon}</span>
                            <div class="text-sm font-black text-amber-300">${item.name}</div>
                        </div>
                        <p class="text-[11px] text-slate-300 mb-3">${item.desc}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span class="text-xs font-black text-amber-400 font-mono">🪙 ${item.cost.toLocaleString()} Ryo</span>
                        <button onclick="window.LobbyMenuView.buyShopItem('${item.id}')" class="px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">
                            Mua
                        </button>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    buyShopItem(itemId) {
        const item = this.shopItems.find(x => x.id === itemId);
        if (!item) return;

        if (window.StorageManager.data.ryo >= item.cost) {
            window.StorageManager.data.ryo -= item.cost;
            if (item.isScrollPack) {
                window.StorageManager.data.scrolls += 3;
            }
            window.StorageManager.save();
            if (window.SFXController) window.SFXController.orbPickup();
            this.renderShopItems();
            this.syncStats();
            alert(`Bạn đã mua thành công: ${item.name}!`);
        } else {
            alert("Bạn không đủ đồng Ryo!");
        }
    },

    renderMissions() {
        const container = document.getElementById('missionsListContainer');
        if (!container) return;

        let html = '';
        for (let i = 0; i < this.missions.length; i++) {
            const m = this.missions[i];
            const isClaimed = window.StorageManager.data.missions[m.id];
            let rewardText = `+${m.rewardRyo.toLocaleString()} Ryo`;
            if (m.rewardScrolls > 0) rewardText += ` & +${m.rewardScrolls} Cuộn`;

            html += `
                <div class="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">${isClaimed ? '✅' : '📜'}</span>
                        <div>
                            <div class="text-sm font-black text-white">${m.name}</div>
                            <div class="text-[11px] text-slate-400">${m.desc}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-amber-300 font-mono hidden sm:inline">${rewardText}</span>
                        <button onclick="window.LobbyMenuView.claimMission('${m.id}')" class="px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${isClaimed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow'}">
                            ${isClaimed ? 'Đã Nhận' : 'Nhận Thưởng'}
                        </button>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    claimMission(missionId) {
        if (window.StorageManager.data.missions[missionId]) return;
        const m = this.missions.find(x => x.id === missionId);
        if (!m) return;

        window.StorageManager.data.missions[missionId] = true;
        window.StorageManager.data.ryo += m.rewardRyo;
        window.StorageManager.data.scrolls += m.rewardScrolls;
        window.StorageManager.save();
        if (window.SFXController) window.SFXController.levelUp();
        this.renderMissions();
        this.syncStats();
    },

    triggerSummon(count) {
        if (window.StorageManager.data.scrolls < count) {
            if (window.SFXController) window.SFXController.uiClick();
            alert(`Bạn không đủ Cuộn Giấy Triệu Hồi! Cần ${count} cuộn, hiện bạn có ${window.StorageManager.data.scrolls} cuộn.`);
            return;
        }

        window.StorageManager.data.scrolls -= count;
        window.StorageManager.save();
        this.syncStats();
        if (window.SFXController) window.SFXController.summonReveal();

        const box = document.getElementById('summonResultBox');
        const title = document.getElementById('summonResultTitle');
        const desc = document.getElementById('summonResultDesc');
        const icon = document.getElementById('summonResultIcon');

        const reward = this.summonPool[Math.floor(Math.random() * this.summonPool.length)];

        if (box && title && desc && icon) {
            box.classList.remove('hidden');
            title.textContent = count > 1 ? `[KẾT QUẢ x10] ${reward.name}` : reward.name;
            desc.textContent = reward.desc;
            icon.textContent = reward.icon;
        }
    }
};

// ============================================================================
// BẢO ĐẢM TƯƠNG THÍCH 100% VỚI CÁC MODULE KHÁC
// ============================================================================
window.LobbyView = window.LobbyMenuView;
window.selectNinja = function(id) { window.LobbyMenuView.selectNinja(id); };
window.selectStartingJutsuAndPlay = function(id) { window.LobbyMenuView.selectStartingJutsuAndPlay(id); };
window.buyShopItem = function(id) { window.LobbyMenuView.buyShopItem(id); };
window.claimMission = function(id) { window.LobbyMenuView.claimMission(id); };
