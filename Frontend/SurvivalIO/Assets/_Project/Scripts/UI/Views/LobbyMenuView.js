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
        <div id="startModal" class="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5 overflow-visible" style="background-color: #3b7d34; background-image: radial-gradient(circle at 50% 35%, rgba(0, 0, 0, 0.12) 0%, rgba(6, 20, 10, 0.68) 100%), repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 2px, transparent 2px, transparent 32px), repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 2px, transparent 2px, transparent 32px), radial-gradient(circle at 16px 16px, rgba(74, 222, 128, 0.12) 2px, transparent 3px), radial-gradient(circle at 32px 32px, rgba(20, 80, 30, 0.25) 3px, transparent 4px); background-size: 100% 100%, 32px 32px, 32px 32px, 32px 32px, 32px 32px;">
            
            <!-- HIỆU ỨNG LÁ CÂY LÀNG LÁ BAY DẬP DỜN (KONOHA FLOATING LEAVES) -->
            <div id="lobbyAmbientLeaves" class="ambient-leaves-container pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div class="ambient-leaf" style="left: 5%; width: 13px; height: 13px; animation-duration: 9.2s; animation-delay: -1.5s; --sway-x1: 28px; --sway-x2: -20px; --sway-x3: 35px; --rot1: 130deg; --rot2: 260deg; --rot3: 390deg;"></div>
                <div class="ambient-leaf" style="left: 14%; width: 11px; height: 11px; animation-duration: 11.5s; animation-delay: -6.2s; --sway-x1: 35px; --sway-x2: -15px; --sway-x3: 42px; --rot1: 150deg; --rot2: 290deg; --rot3: 450deg;"></div>
                <div class="ambient-leaf" style="left: 22%; width: 15px; height: 15px; animation-duration: 8.4s; animation-delay: -3.8s; --sway-x1: 22px; --sway-x2: -25px; --sway-x3: 30px; --rot1: 120deg; --rot2: 240deg; --rot3: 360deg;"></div>
                <div class="ambient-leaf" style="left: 31%; width: 10px; height: 10px; animation-duration: 13.0s; animation-delay: -8.0s; --sway-x1: 40px; --sway-x2: -18px; --sway-x3: 48px; --rot1: 160deg; --rot2: 310deg; --rot3: 470deg;"></div>
                <div class="ambient-leaf" style="left: 42%; width: 14px; height: 14px; animation-duration: 7.8s; animation-delay: -2.1s; --sway-x1: 25px; --sway-x2: -30px; --sway-x3: 32px; --rot1: 140deg; --rot2: 280deg; --rot3: 420deg;"></div>
                <div class="ambient-leaf" style="left: 50%; width: 12px; height: 12px; animation-duration: 10.5s; animation-delay: -5.4s; --sway-x1: 32px; --sway-x2: -22px; --sway-x3: 38px; --rot1: 135deg; --rot2: 270deg; --rot3: 405deg;"></div>
                <div class="ambient-leaf" style="left: 59%; width: 15px; height: 15px; animation-duration: 8.9s; animation-delay: -0.8s; --sway-x1: 26px; --sway-x2: -28px; --sway-x3: 34px; --rot1: 145deg; --rot2: 295deg; --rot3: 440deg;"></div>
                <div class="ambient-leaf" style="left: 68%; width: 11px; height: 11px; animation-duration: 12.2s; animation-delay: -7.5s; --sway-x1: 38px; --sway-x2: -16px; --sway-x3: 44px; --rot1: 155deg; --rot2: 305deg; --rot3: 460deg;"></div>
                <div class="ambient-leaf" style="left: 77%; width: 13px; height: 13px; animation-duration: 9.6s; animation-delay: -4.3s; --sway-x1: 24px; --sway-x2: -24px; --sway-x3: 36px; --rot1: 125deg; --rot2: 250deg; --rot3: 380deg;"></div>
                <div class="ambient-leaf" style="left: 85%; width: 16px; height: 16px; animation-duration: 7.5s; animation-delay: -2.9s; --sway-x1: 30px; --sway-x2: -32px; --sway-x3: 40px; --rot1: 165deg; --rot2: 330deg; --rot3: 495deg;"></div>
                <div class="ambient-leaf" style="left: 93%; width: 10px; height: 10px; animation-duration: 11.0s; animation-delay: -6.7s; --sway-x1: 36px; --sway-x2: -20px; --sway-x3: 45px; --rot1: 140deg; --rot2: 280deg; --rot3: 420deg;"></div>
            </div>
            
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
                        <canvas id="charShowcaseCanvas" width="240" height="240" class="w-full h-full object-contain"></canvas>
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
                                <span id="lobbyPlaySubtitle" class="text-xs sm:text-sm text-amber-100 font-bold truncate hover:text-amber-300 transition-colors cursor-pointer" title="Nhấn để đổi ải">Ải 1: Rừng Làng Lá (3★) - Nhấn để đổi ải</span>
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
                                <span id="menuNinjaUnlockedCount" class="obsidian-menu-desc text-sky-300/80 truncate">2 / 10 Nhẫn giả đã mở khóa</span>
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

                        <!-- 4. 📜 Chiêu Mộ (Pod viền hoàng kim nhẫn giả, Cuộn giấy bí kíp hoàng kim tỏa vầng hào quang chakra rực rỡ và phi tiêu shuriken) -->
                        <button id="btnMenuSummon" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box pod-summon flex items-center justify-center">
                                <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Chiêu Mộ" class="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform duration-200" />
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

                        <!-- 6. 🎁 Mã Quà Tặng (Giftcode) -->
                        <button id="btnMenuGiftcode" class="obsidian-menu-card lobby-nav-card menu-item menu-card-item group">
                            <div class="obsidian-icon-pod menu-icon-box flex items-center justify-center bg-gradient-to-br from-amber-600/30 to-rose-700/30 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                                <span class="text-xl drop-shadow group-hover:scale-125 transition-transform duration-200">🎁</span>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3.5">
                                <span class="obsidian-menu-title font-black text-white leading-tight group-hover:text-amber-300 transition-colors">Giftcode</span>
                                <span class="obsidian-menu-desc text-amber-300/80 truncate">Nhận Ryo, Cuộn & Mảnh Tướng</span>
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

        <!-- 1. MODAL ĐỒ GIÁM NHẪN GIẢ (10/10) -->
        <div id="modalShinobi" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content max-w-4xl! relative">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">🥋</span>
                        <div>
                            <h3 id="shinobiModalTitle" class="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider drop-shadow">
                                ĐỒ GIÁM NHẪN GIẢ (10/10)
                            </h3>
                            <div class="text-[11px] text-slate-300 font-medium">Bộ sưu tập 10 Đại Shinobi • Nâng cấp 1★ ➔ 5★ bộc phá chiến lực</div>
                        </div>
                    </div>
                    <button class="btn-close-submodal w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-base transition cursor-pointer shadow-lg">✕</button>
                </div>

                <!-- Thanh phân loại & Tóm tắt buff sao -->
                <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 border border-slate-800/90 rounded-xl px-3.5 py-2 mb-3.5 text-xs">
                    <div class="flex items-center gap-3.5 flex-wrap">
                        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span> <strong class="text-amber-300">LEGEND (3)</strong></span>
                        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span> <strong class="text-purple-300">EPIC (3)</strong></span>
                        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span> <strong class="text-sky-300">RARE (4)</strong></span>
                    </div>
                    <div class="text-slate-300 text-[11px] bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800">
                        ⭐ Mỗi cấp Sao (<strong class="text-amber-400">+1★</strong>) tăng vĩnh viễn <strong class="text-emerald-400">+10%</strong> HP, Tốc độ & Sát thương
                    </div>
                </div>

                <!-- Danh sách 10 thẻ Nhẫn GiẢ -->
                <div id="shinobiRosterGrid" class="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1"></div>
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

        <!-- 3. MODAL CỬA HÀNG (MẢNH NHẪN GIẢ & BÍ KÍP CHUẨN 6 Ô RANDOM & RESET 30 PHÚT) -->
        <div id="modalShop" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content max-w-4xl! relative p-4 sm:p-6">
                <!-- Hàng 1: Tiêu đề Cửa Hàng (Bên Trái) & Nút Đóng [✕] (Góc Trên Cùng Bên Phải, đối xứng y hệt Đồ Giám) -->
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">🏪</span>
                        <div>
                            <h3 class="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider drop-shadow leading-tight">
                                CỬA HÀNG MẢNH NHẪN GIẢ
                            </h3>
                            <div class="text-[11px] text-slate-300 font-medium">Giới hạn mua 1 lần mỗi đợt • Mua mảnh nâng cấp Nhẫn giả 1★ ➔ 5★!</div>
                        </div>
                    </div>

                    <!-- Nút Đóng [✕] góc trên cùng bên phải nội bộ của bảng modal -->
                    <button class="btn-close-submodal w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center font-bold text-base transition cursor-pointer shadow-lg hover:scale-105 active:scale-95">✕</button>
                </div>

                <!-- Hàng 2: Chỉ giữ lại 2 Badge [Làm mới sau: MM:SS] và [Ryo hiện có] -->
                <div class="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl px-3 sm:px-4 py-2 mb-3.5 flex-wrap gap-2 select-none">
                    <!-- Đồng hồ đếm ngược reset 30 phút -->
                    <div class="bg-slate-900 border border-rose-500/50 px-3.5 py-1.5 rounded-xl text-xs font-black text-rose-300 flex items-center gap-2 shadow-[0_0_10px_rgba(244,63,94,0.25)]">
                        <span class="text-sm">⏳</span>
                        <span class="text-slate-300 text-[11px] font-semibold">Làm mới sau:</span>
                        <span id="shopCountdownDisplay" class="font-mono text-xs sm:text-sm text-amber-400 font-black">30:00</span>
                    </div>

                    <!-- Số Ryo của người chơi -->
                    <div class="bg-slate-900 border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-300 flex items-center gap-2 shadow">
                        <span>🪙 Ryo của bạn:</span>
                        <span id="shopUserRyoDisplay" class="font-mono text-sm text-yellow-300 font-black">0</span>
                    </div>
                </div>

                <!-- Danh sách 6 Ô Vật Phẩm Ngẫu Nhiên (Lưới 3x2) -->
                <div id="shopItemsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[62vh] overflow-y-auto pr-1"></div>
            </div>
        </div>

        <!-- 4. MODAL TRIỆU HỒI NHẪN GIẢ (POSTER NỀN ĐẠI CHIẾN CHUẨN ẢNH MẪU 100%) -->
        <div id="modalSummon" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content summon-poster-content max-w-4xl! w-full relative overflow-hidden rounded-3xl p-0! border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.55)]">
                
                <!-- Lớp hình nền Poster Naruto Đại Chiến (Không padding để Header & Footer bám sát viền 100%) -->
                <div class="summon-poster-bg relative flex flex-col justify-between p-0! m-0! min-h-[520px] sm:min-h-[580px] bg-cover bg-center select-none" style="background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(10, 10, 15, 0.12) 45%, rgba(5, 5, 10, 0.82) 100%), url('SurvivalIO/Assets/_Project/Textures/UI/bg_chieumo.jpg');">
                    
                    <!-- 1. Thanh Tiêu Đề Trên Cùng (Full-width Header bám sát viền trên, trái, phải) -->
                    <div class="summon-header-bar w-full flex items-center justify-between bg-black/75 backdrop-blur-md border-b border-red-500/40 px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-xl">
                        <div class="flex items-center gap-3">
                            <!-- Icon Cuộn Giấy Hoàng Kim Phát Quang -->
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center p-1 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex-shrink-0">
                                <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Chiêu Mộ" class="w-full h-full object-contain drop-shadow" />
                            </div>
                            <div class="text-left">
                                <h3 class="text-base sm:text-2xl font-black text-amber-400 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
                                    TRIỆU HỒI NHẪN GIẢ
                                </h3>
                                <div class="text-[10px] sm:text-xs text-slate-200 font-semibold tracking-wide drop-shadow hidden xs:block">
                                    Hội Tụ Những Kẻ Mạnh Nhất • Gia Nhập Ngay Cùng Viết Tiếp Huyền Thoại!
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- Khung Hiển Thị Số Cuộn Triệu Hồi (Chỉ hiển thị, không click được, đồng bộ kiểu dáng với nút TỈ LỆ) -->
                            <div id="summonScrollStaticBadge" title="Số cuộn triệu hồi hiện có" class="px-3 sm:px-3.5 py-1.5 rounded-xl bg-black/80 border border-neutral-700 text-amber-400 font-black text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-default select-none pointer-events-none">
                                <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Cuộn" class="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain drop-shadow" />
                                <span id="summonScrollsCountDisplay" class="font-mono text-amber-400 font-black text-xs sm:text-sm">15</span>
                            </div>

                            <!-- Nút TỈ LỆ ℹ️ -->
                            <button id="btnOpenSummonRates" class="px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/80 text-amber-400 font-black text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 cursor-pointer">
                                <span>TỈ LỆ</span>
                                <span class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-sky-600 text-white flex items-center justify-center text-[10px] font-black leading-none shadow">i</span>
                            </button>

                            <!-- Nút Đóng [✕] -->
                            <button class="btn-close-submodal w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/80 hover:bg-rose-600 border border-neutral-700 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm sm:text-base transition cursor-pointer shadow-lg hover:scale-105 active:scale-95">✕</button>
                        </div>
                    </div>

                    <!-- 2. Vùng Trống Ở Giữa: Để Lộ Trọn Vẹn 100% Poster Nghệ Thuật (Hoàn Toàn Sạch Bóng Không Bị Che Khuất) -->
                    <div class="flex-1 w-full min-h-[300px] sm:min-h-[420px]"></div>

                    <!-- 3. Thanh Điều Khiển Dưới Cùng (Full-width Footer bám sát viền đáy, trái, phải) -->
                    <div class="summon-bottom-bar w-full bg-black/80 backdrop-blur-md border-t border-red-500/40 px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl flex items-center justify-between gap-2.5 sm:gap-4 relative">
                        
                        <!-- Họa Tiết Mây Đỏ Nhẫn Giả (Bên Trái) -->
                        <svg viewBox="0 0 120 75" class="summon-cloud-red w-14 h-9 sm:w-20 sm:h-12 flex-shrink-0 select-none pointer-events-none drop-shadow-[0_0_14px_rgba(239,68,68,0.8)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="akatsukiRedGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#ff4d4d"/>
                                    <stop offset="50%" stop-color="#dc2626"/>
                                    <stop offset="100%" stop-color="#7f1d1d"/>
                                </linearGradient>
                            </defs>
                            <path d="M52 16 C63 16 72 23 75 32 C82 31 90 35 93 42 C96 50 91 58 83 60 C70 62 48 62 35 60 C25 58 19 51 21 42 C23 35 29 30 36 29 C38 21 44 16 52 16 Z" fill="url(#akatsukiRedGrad)" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round"/>
                            <path d="M35 52 C26 52 16 55 12 61 C8 67 11 72 18 73 C27 74 34 69 33 63 C32 58 27 57 24 58" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
                        </svg>

                        <!-- 2 Nút Triệu Hồi X1 & X10 Với Icon Cuộn Triệu Hồi Sắc Nét -->
                        <div class="flex-1 flex items-center justify-center gap-3 sm:gap-5">
                            <!-- Nút Đỏ X1 -->
                            <button id="btnSummon1" class="summon-btn-red flex-1 max-w-[320px] py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer">
                                <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Cuộn" class="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow" />
                                <span>TRIỆU HỒI X1 (1 VÉ)</span>
                            </button>

                            <!-- Nút Vàng Hoàng Kim X10 -->
                            <button id="btnSummon10" class="summon-btn-gold flex-1 max-w-[320px] py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer">
                                <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Cuộn" class="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow" />
                                <span>TRIỆU HỒI X10 (10 VÉ)</span>
                            </button>
                        </div>

                        <!-- Họa Tiết Mây Vàng Cát Tường (Bên Phải) -->
                        <svg viewBox="0 0 120 75" class="summon-cloud-gold w-14 h-9 sm:w-20 sm:h-12 flex-shrink-0 select-none pointer-events-none drop-shadow-[0_0_14px_rgba(245,158,11,0.85)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="auspiciousGoldGrad" x1="1" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#fffbeb"/>
                                    <stop offset="35%" stop-color="#fde047"/>
                                    <stop offset="70%" stop-color="#f59e0b"/>
                                    <stop offset="100%" stop-color="#b45309"/>
                                </linearGradient>
                            </defs>
                            <path d="M68 16 C57 16 48 23 45 32 C38 31 30 35 27 42 C24 50 29 58 37 60 C50 62 72 62 85 60 C95 58 101 51 99 42 C97 35 91 30 84 29 C82 21 76 16 68 16 Z" fill="url(#auspiciousGoldGrad)" stroke="#fffbeb" stroke-width="2.2" stroke-linejoin="round"/>
                            <path d="M85 52 C94 52 104 55 108 61 C112 67 109 72 102 73 C93 74 86 69 87 63 C88 58 93 57 96 58" fill="none" stroke="#fffbeb" stroke-width="2.2" stroke-linecap="round"/>
                        </svg>

                    </div>

                </div>
            </div>
        </div>

        <!-- POPUP: BẢNG TỈ LỆ TRIỆU HỒI NHẪN GIẢ -->
        <div id="modalSummonRates" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content max-w-2xl! text-left relative">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl">📊</span>
                        <div>
                            <h3 class="text-lg sm:text-xl font-black text-amber-400 uppercase tracking-wide">
                                BẢNG TỈ LỆ TRIỆU HỒI NHẪN GIẢ
                            </h3>
                            <div class="text-[11px] text-slate-400">Minh bạch 100% tỉ lệ chiêu mộ từng cấp bậc & danh sách tướng</div>
                        </div>
                    </div>
                    <button id="btnCloseSummonRates" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>

                <div id="summonRatesContainer" class="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1"></div>

                <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>* Quay trúng tướng đã sở hữu sẽ <strong>tự động đổi thành 30 Mảnh</strong> để nâng sao!</span>
                    <button id="btnDismissSummonRates" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer">
                        Đã Hiểu
                    </button>
                </div>
            </div>
        </div>

        <!-- POPUP: KẾT QUẢ TRIỆU HỒI (HOẠT ẢNH NHẬN TƯỚNG & MẢNH) -->
        <div id="modalSummonResults" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content max-w-3xl! text-center relative overflow-hidden">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                    <div class="flex items-center gap-2">
                        <span class="text-3xl drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">✨</span>
                        <h3 id="summonResultsHeader" class="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider drop-shadow">
                            KẾT QUẢ TRIỆU HỒI
                        </h3>
                    </div>
                    <button id="btnCloseSummonResults" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">✕</button>
                </div>

                <!-- Vùng hiển thị kết quả các thẻ quay được -->
                <div id="summonResultsBody" class="py-2"></div>

                <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-4">
                    <button id="btnConfirmSummonResults" class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition cursor-pointer">
                        XÁC NHẬN NHẬN THƯỞNG
                    </button>
                </div>
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

        <!-- 8. MODAL CÀI ĐẶT -->
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

        <!-- 9. MODAL NHẬP MÃ QUÀ TẶNG (GIFTCODE) -->
        <div id="modalGiftcode" class="shinobi-modal-backdrop">
            <div class="shinobi-modal-content max-w-md! relative p-5 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                <!-- Header -->
                <div class="flex items-center justify-between pb-3 border-b border-amber-500/40 mb-4">
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">🎁</span>
                        <div>
                            <h3 class="text-lg sm:text-xl font-black text-amber-400 uppercase tracking-wider drop-shadow">
                                NHẬP MÃ QUÀ TẶNG (GIFTCODE)
                            </h3>
                            <div class="text-[10.5px] text-slate-400">Đổi mã quà lấy Ryo, Cuộn triệu hồi & Mảnh nhẫn giả</div>
                        </div>
                    </div>
                    <button class="btn-close-submodal w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer shadow-lg hover:scale-105 active:scale-95">✕</button>
                </div>

                <!-- Body -->
                <div class="flex flex-col gap-3.5">
                    <div class="text-xs text-slate-300 font-medium">
                        Nhập chính xác mã quà tặng vào ô bên dưới:
                    </div>
                    
                    <div class="relative flex flex-col gap-2">
                        <input type="text" id="inputGiftcodeCode" class="w-full bg-slate-950/90 border-2 border-amber-500/60 focus:border-amber-400 rounded-xl px-4 py-3 text-center font-mono font-black text-amber-300 tracking-widest uppercase text-base sm:text-lg focus:outline-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] placeholder:text-slate-600 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-xs" placeholder="Nhập mã code tại đây... (Ví dụ: NARUTO2026)" />
                    </div>

                    <!-- Hộp thông báo kết quả (thành công / rung lắc lỗi) -->
                    <div id="giftcodeResultMessage" class="hidden text-xs p-3 rounded-xl text-center font-bold transition-all"></div>

                    <!-- Nút Đổi Thưởng -->
                    <div class="flex items-center justify-end gap-2.5 pt-1">
                        <button class="btn-close-submodal px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition cursor-pointer">
                            Đóng
                        </button>
                        <button id="btnRedeemGiftcodeSubmit" class="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_18px_rgba(245,158,11,0.5)] cursor-pointer flex items-center justify-center gap-1.5">
                            <span>✨ ĐỔI THƯỞNG</span>
                        </button>
                    </div>
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

        // Kích hoạt hiệu ứng lá cây Làng Lá bay dập dờn
        this.initAmbientLeaves();

        // Nạp và khởi tạo module MapModal độc lập
        if (!window.MapModal && !document.getElementById('scriptMapModal')) {
            const s = document.createElement('script');
            s.id = 'scriptMapModal';
            s.src = 'SurvivalIO/Assets/_Project/Scripts/UI/Modals/Map/MapModal.js';
            document.head.appendChild(s);
        } else if (window.MapModal) {
            window.MapModal.updateLobbyDisplay();
        }

        // Nạp và khởi tạo module AchievementModal độc lập
        if (!window.AchievementModal && !document.getElementById('scriptAchievementModal')) {
            const s = document.createElement('script');
            s.id = 'scriptAchievementModal';
            s.src = 'SurvivalIO/Assets/_Project/Scripts/UI/Modals/Achievement/AchievementModal.js';
            document.head.appendChild(s);
        }

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

            // Khởi động trận đấu trực tiếp (chọn 1 chiêu tấn công khởi đầu ở giây 00:00)
            if (window.GameManager && typeof window.GameManager.startNewRun === 'function') {
                window.GameManager.startNewRun();
            } else {
                console.error("[LobbyMenuView]: window.GameManager.startNewRun không tồn tại!");
            }
        };

        const playBtn1 = document.getElementById('btn-play');
        if (playBtn1) playBtn1.addEventListener('click', handleStartGame);
        const playBtn2 = document.getElementById('btnPlayGame');
        if (playBtn2 && playBtn2 !== playBtn1) playBtn2.addEventListener('click', handleStartGame);
        document.querySelectorAll('.fiery-play-banner-btn, .btn-play-action').forEach(btn => {
            btn.onclick = handleStartGame;
        });

        // Bấm trực tiếp vào dòng chữ ải để mở MapModal đổi ải
        const playSubBtn = document.getElementById('lobbyPlaySubtitle');
        if (playSubBtn) {
            playSubBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.SFXController) {
                    try { window.SFXController.uiClick(); } catch (_) {}
                }
                if (window.MapModal) window.MapModal.open();
            });
        }

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
                this.syncStats();
                this.openModal('modalSummon');
            });
        }

        // 5. Nút Thành Tựu
        const btnAchieve = document.getElementById('btnMenuAchievements');
        if (btnAchieve) {
            btnAchieve.addEventListener('click', () => {
                if (window.AchievementModal) {
                    window.AchievementModal.open();
                } else {
                    const s = document.createElement('script');
                    s.src = 'SurvivalIO/Assets/_Project/Scripts/UI/Modals/Achievement/AchievementModal.js';
                    s.onload = () => { if (window.AchievementModal) window.AchievementModal.open(); };
                    document.head.appendChild(s);
                }
            });
        }

        // 6. Nút Nhận Giftcode (Mở #modalGiftcode)
        const btnGiftcode = document.getElementById('btnMenuGiftcode');
        if (btnGiftcode) {
            btnGiftcode.addEventListener('click', () => {
                if (window.SFXController && typeof window.SFXController.uiOpen === 'function') {
                    window.SFXController.uiOpen();
                }
                const input = document.getElementById('inputGiftcodeCode');
                const msg = document.getElementById('giftcodeResultMessage');
                if (input) input.value = '';
                if (msg) {
                    msg.className = 'hidden text-xs p-3 rounded-xl text-center font-bold transition-all';
                    msg.textContent = '';
                    msg.classList.remove('shake-card');
                }
                this.openModal('modalGiftcode');
                setTimeout(() => input?.focus(), 120);
            });
        }

        // Sự kiện đổi thưởng Giftcode
        const btnRedeemSubmit = document.getElementById('btnRedeemGiftcodeSubmit');
        if (btnRedeemSubmit) {
            btnRedeemSubmit.addEventListener('click', () => this.handleRedeemGiftcode());
        }
        const inputGift = document.getElementById('inputGiftcodeCode');
        if (inputGift) {
            inputGift.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.handleRedeemGiftcode();
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
                if (window.MapModal) {
                    window.MapModal.open();
                } else {
                    const s = document.createElement('script');
                    s.src = 'SurvivalIO/Assets/_Project/Scripts/UI/Modals/Map/MapModal.js';
                    s.onload = () => { if (window.MapModal) window.MapModal.open(); };
                    document.head.appendChild(s);
                }
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
                const unlocked = (window.StorageManager.data.unlockedNinjas && window.StorageManager.data.unlockedNinjas.length)
                    ? window.StorageManager.data.unlockedNinjas : ['naruto', 'itachi'];
                const catalog = window.NinjaCatalog.filter(n => unlocked.includes(n.id));
                if (!catalog.length) return;
                const curId = window.StorageManager.data.selectedNinja;
                let idx = catalog.findIndex(n => n.id === curId);
                if (idx === -1) idx = 0;
                idx = (idx - 1 + catalog.length) % catalog.length;
                this.selectNinja(catalog[idx].id);
            });
            btnNext.addEventListener('click', () => {
                const unlocked = (window.StorageManager.data.unlockedNinjas && window.StorageManager.data.unlockedNinjas.length)
                    ? window.StorageManager.data.unlockedNinjas : ['naruto', 'itachi'];
                const catalog = window.NinjaCatalog.filter(n => unlocked.includes(n.id));
                if (!catalog.length) return;
                const curId = window.StorageManager.data.selectedNinja;
                let idx = catalog.findIndex(n => n.id === curId);
                if (idx === -1) idx = 0;
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

        // Nút Triệu hồi x1 & x10
        const btnSum1 = document.getElementById('btnSummon1');
        const btnSum10 = document.getElementById('btnSummon10');
        if (btnSum1) btnSum1.addEventListener('click', () => this.triggerSummon(1));
        if (btnSum10) btnSum10.addEventListener('click', () => this.triggerSummon(10));

        // Nút mở bảng Tỉ Lệ Triệu Hồi
        const btnOpenRates = document.getElementById('btnOpenSummonRates');
        if (btnOpenRates) {
            btnOpenRates.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiOpen();
                this.renderSummonRates();
                this.openModal('modalSummonRates');
            });
        }
        const btnCloseRates = document.getElementById('btnCloseSummonRates');
        const btnDismissRates = document.getElementById('btnDismissSummonRates');
        if (btnCloseRates) btnCloseRates.addEventListener('click', () => this.openModal('modalSummon'));
        if (btnDismissRates) btnDismissRates.addEventListener('click', () => this.openModal('modalSummon'));

        // Nút đóng kết quả Triệu Hồi
        const btnConfirmRes = document.getElementById('btnConfirmSummonResults');
        const btnCloseRes = document.getElementById('btnCloseSummonResults');
        if (btnConfirmRes) btnConfirmRes.addEventListener('click', () => this.openModal('modalSummon'));
        if (btnCloseRes) btnCloseRes.addEventListener('click', () => this.openModal('modalSummon'));

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
        this.startShopTimer();

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

    // Quản lý sinh thêm hoặc khởi tạo hạt lá cây Konoha bay dập dờn
    initAmbientLeaves() {
        const container = document.getElementById('lobbyAmbientLeaves');
        if (!container) return;
        if (container.children.length === 0) {
            for (let i = 0; i < 16; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'ambient-leaf';
                const left = (i * 6.2 + Math.random() * 3).toFixed(1);
                const size = Math.floor(10 + Math.random() * 6);
                const dur = (7 + Math.random() * 6).toFixed(1);
                const delay = (-Math.random() * 10).toFixed(1);
                leaf.style.left = `${left}%`;
                leaf.style.width = `${size}px`;
                leaf.style.height = `${size}px`;
                leaf.style.animationDuration = `${dur}s`;
                leaf.style.animationDelay = `${delay}s`;
                leaf.style.setProperty('--sway-x1', `${20 + Math.random() * 20}px`);
                leaf.style.setProperty('--sway-x2', `-${15 + Math.random() * 20}px`);
                leaf.style.setProperty('--sway-x3', `${25 + Math.random() * 25}px`);
                leaf.style.setProperty('--rot1', `${120 + Math.random() * 60}deg`);
                leaf.style.setProperty('--rot2', `${240 + Math.random() * 80}deg`);
                leaf.style.setProperty('--rot3', `${360 + Math.random() * 120}deg`);
                container.appendChild(leaf);
            }
        }
    },

    show() {
        if (!this.element) this.init();
        if (this.element) {
            this.element.classList.remove('hidden');
            this.element.style.display = '';
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

    openModal(modalId) {
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        const target = document.getElementById(modalId);
        if (target) target.classList.add('open');
    },

    closeAllModals() {
        if (window.SFXController) window.SFXController.uiClick();
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        if (window.MapModal) window.MapModal.close();
        if (window.AchievementModal) window.AchievementModal.close();
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

        // Cập nhật số nhẫn giả đã mở khóa trên menu bên phải (X / 10 Nhẫn giả đã mở khóa)
        const menuNinjaCountEl = document.getElementById('menuNinjaUnlockedCount');
        if (menuNinjaCountEl) {
            const unlockedCount = (d.unlockedNinjas && d.unlockedNinjas.length) || 1;
            menuNinjaCountEl.textContent = `${unlockedCount} / 10 Nhẫn giả đã mở khóa`;
        }

        // Cập nhật số cuộn triệu hồi trên modal chiêu mộ
        const summonScrollEl = document.getElementById('summonScrollsCountDisplay');
        if (summonScrollEl) summonScrollEl.textContent = (d.scrolls || 0).toLocaleString();

        // Cập nhật số tiền Ryo trong cửa hàng
        const shopRyoEl = document.getElementById('shopUserRyoDisplay');
        if (shopRyoEl) shopRyoEl.textContent = (d.ryo || 0).toLocaleString();
    },

    updateStats() {
        this.syncStats();
    },

    renderShowcase(time) {
        const scCanvas = document.getElementById('charShowcaseCanvas');
        if (!scCanvas) return;
        const sctx = scCanvas.getContext('2d');
        const w = scCanvas.width || 240;
        const h = scCanvas.height || 240;
        const cx = w / 2;
        const cy = h / 2 + 18;

        sctx.clearRect(0, 0, w, h);

        // 1. Vòng xoay ấn chú dưới chân (Pedestal Seal)
        sctx.save();
        sctx.translate(cx, cy + 24);
        sctx.rotate(time * 0.6);
        sctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
        sctx.lineWidth = 2;
        sctx.beginPath();
        sctx.ellipse(0, 0, 52, 18, 0, 0, Math.PI * 2);
        sctx.stroke();

        for (let i = 0; i < 4; i++) {
            const ang = (Math.PI / 2) * i;
            const px = Math.cos(ang) * 52;
            const py = Math.sin(ang) * 18;
            sctx.fillStyle = "#facc15";
            sctx.beginPath();
            sctx.arc(px, py, 3, 0, Math.PI * 2);
            sctx.fill();
        }
        sctx.restore();

        // 2. Hào quang nhân vật mượt mà (Aura Glow)
        const currentNinjaId = (window.StorageManager && window.StorageManager.data && window.StorageManager.data.selectedNinja) || 'naruto';
        let auraColor = "rgba(249, 115, 22, 0.35)";
        if (currentNinjaId === 'sasuke') auraColor = "rgba(56, 189, 248, 0.35)";
        else if (currentNinjaId === 'kakashi') auraColor = "rgba(74, 222, 128, 0.35)";
        else if (currentNinjaId === 'sakura') auraColor = "rgba(244, 63, 94, 0.35)";
        else if (currentNinjaId === 'itachi') auraColor = "rgba(239, 68, 68, 0.35)";

        sctx.save();
        const auraGrad = sctx.createRadialGradient(cx, cy - 24, 15, cx, cy - 24, 58 + Math.sin(time * 5) * 4);
        auraGrad.addColorStop(0, auraColor.replace('0.35', '0.65'));
        auraGrad.addColorStop(0.7, auraColor);
        auraGrad.addColorStop(1, 'transparent');
        sctx.fillStyle = auraGrad;
        sctx.beginPath();
        sctx.arc(cx, cy - 24, 60 + Math.sin(time * 5) * 4, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();

        // 3. Hiển thị nhân vật pixel art chính diện giữa khung 240x240
        if (window.SpriteRenderer && typeof window.SpriteRenderer.drawShinobi === 'function') {
            sctx.save();
            sctx.translate(cx, cy + 12);
            sctx.scale(1.9, 1.9); // Phóng to 1.9x để nhân vật pixel art hiển thị to rõ, oai phong
            window.SpriteRenderer.drawShinobi(
                sctx,
                0,
                0,
                20,
                time,
                1,
                false,
                false,
                1,
                currentNinjaId,
                false // isMoving = false (Đứng thủ thế uy nghiêm)
            );
            sctx.restore();
        }
    },

    // =========================================================================
    // HỆ THỐNG CỬA HÀNG (SHOP) 6 Ô RANDOM & GIỚI HẠN MUA 1 LẦN & RESET 30 PHÚT
    // =========================================================================
    _shopTimerInterval: null,

    generateShopSlots() {
        if (!window.NinjaCatalog || !window.NinjaCatalog.length) return [];

        const ninjas = [...window.NinjaCatalog];
        const rareNinjas = ninjas.filter(n => n.rarity === 'RARE');
        const epicNinjas = ninjas.filter(n => n.rarity === 'EPIC');
        const legendNinjas = ninjas.filter(n => n.rarity === 'LEGEND');

        const getShardCost = (rarity, count) => {
            if (rarity === 'LEGEND') {
                return count === 2 ? 4000 : (count === 3 ? 6000 : (count === 5 ? 9500 : 18000));
            } else if (rarity === 'EPIC') {
                return count === 2 ? 2800 : (count === 3 ? 4000 : (count === 5 ? 6500 : 12000));
            } else {
                return count === 2 ? 2000 : (count === 3 ? 3000 : (count === 5 ? 4800 : 9000));
            }
        };

        const slots = [];
        const usedNinjaIds = new Set();

        // Ô 1: Ninja RARE
        const n1 = rareNinjas[Math.floor(Math.random() * rareNinjas.length)] || ninjas[0];
        const c1 = [2, 3, 5][Math.floor(Math.random() * 3)];
        usedNinjaIds.add(n1.id);
        slots.push({
            slotIndex: 0,
            type: 'shard',
            ninjaId: n1.id,
            count: c1,
            cost: getShardCost(n1.rarity, c1),
            purchased: false
        });

        // Ô 2: Ninja EPIC
        const n2 = epicNinjas[Math.floor(Math.random() * epicNinjas.length)] || ninjas[1];
        const c2 = [2, 3, 5][Math.floor(Math.random() * 3)];
        usedNinjaIds.add(n2.id);
        slots.push({
            slotIndex: 1,
            type: 'shard',
            ninjaId: n2.id,
            count: c2,
            cost: getShardCost(n2.rarity, c2),
            purchased: false
        });

        // Ô 3: Ninja LEGEND
        const n3 = legendNinjas[Math.floor(Math.random() * legendNinjas.length)] || ninjas[2];
        const c3 = [2, 3, 5][Math.floor(Math.random() * 3)];
        usedNinjaIds.add(n3.id);
        slots.push({
            slotIndex: 2,
            type: 'shard',
            ninjaId: n3.id,
            count: c3,
            cost: getShardCost(n3.rarity, c3),
            purchased: false
        });

        // Ô 4: Ninja ngẫu nhiên khác
        const rem4 = ninjas.filter(n => !usedNinjaIds.has(n.id));
        const n4 = rem4[Math.floor(Math.random() * rem4.length)] || ninjas[3];
        const c4 = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
        usedNinjaIds.add(n4.id);
        slots.push({
            slotIndex: 3,
            type: 'shard',
            ninjaId: n4.id,
            count: c4,
            cost: getShardCost(n4.rarity, c4),
            purchased: false
        });

        // Ô 5: Ninja ngẫu nhiên khác (Ưu đãi đặc biệt)
        const rem5 = ninjas.filter(n => !usedNinjaIds.has(n.id));
        const n5 = rem5[Math.floor(Math.random() * rem5.length)] || ninjas[4];
        const c5 = [3, 5, 10][Math.floor(Math.random() * 3)];
        usedNinjaIds.add(n5.id);
        slots.push({
            slotIndex: 4,
            type: 'shard',
            ninjaId: n5.id,
            count: c5,
            cost: getShardCost(n5.rarity, c5),
            purchased: false
        });

        // Ô 6: Gói Cuộn Triệu Hồi (Bằng tiền Ryo)
        const scrollOpts = [
            { count: 1, cost: 2000, name: 'Gói 1 Cuộn Triệu Hồi' },
            { count: 2, cost: 3800, name: 'Gói 2 Cuộn Triệu Hồi' },
            { count: 3, cost: 5500, name: 'Gói 3 Cuộn Triệu Hồi' }
        ];
        const sc = scrollOpts[Math.floor(Math.random() * scrollOpts.length)];
        slots.push({
            slotIndex: 5,
            type: 'scroll',
            isScroll: true,
            count: sc.count,
            name: sc.name,
            cost: sc.cost,
            purchased: false
        });

        return slots;
    },

    getShopState() {
        let state = null;
        try {
            const raw = localStorage.getItem('naruto_shop_data_v2');
            if (raw) state = JSON.parse(raw);
        } catch (_) {}

        const now = Date.now();
        if (!state || !state.resetTime || now >= state.resetTime || !Array.isArray(state.slots) || state.slots.length !== 6) {
            state = {
                resetTime: now + (30 * 60 * 1000), // 30 phút
                slots: this.generateShopSlots()
            };
            this.saveShopState(state);
        }

        return state;
    },

    saveShopState(state) {
        try {
            localStorage.setItem('naruto_shop_data_v2', JSON.stringify(state));
        } catch (_) {}
    },

    startShopTimer() {
        if (this._shopTimerInterval) clearInterval(this._shopTimerInterval);

        const tick = () => {
            const state = this.getShopState();
            const now = Date.now();
            const diff = Math.max(0, state.resetTime - now);

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            const text = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            const el = document.getElementById('shopCountdownDisplay');
            if (el) el.textContent = text;

            if (diff <= 0) {
                // Tự động random lại 6 ô mới khi hết 30 phút
                const newState = {
                    resetTime: Date.now() + (30 * 60 * 1000),
                    slots: this.generateShopSlots()
                };
                this.saveShopState(newState);
                this.renderShopItems();
            }
        };

        tick();
        this._shopTimerInterval = setInterval(tick, 1000);
    },

    renderShopItems() {
        const container = document.getElementById('shopItemsContainer');
        if (!container || !window.NinjaCatalog) return;

        const d = window.StorageManager.data;
        if (!d.ninjaShards) d.ninjaShards = {};
        const userRyo = d.ryo || 0;

        // Cập nhật số Ryo của người dùng
        const ryoDisplay = document.getElementById('shopUserRyoDisplay');
        if (ryoDisplay) ryoDisplay.textContent = userRyo.toLocaleString();

        const state = this.getShopState();
        const slots = state.slots || [];

        let html = '';
        for (let i = 0; i < slots.length; i++) {
            const it = slots[i];
            const isPurchased = !!it.purchased;
            const canAfford = userRyo >= it.cost;

            if (it.isScroll) {
                html += `
                    <div class="bg-slate-900/95 border-2 ${isPurchased ? 'border-slate-800 opacity-60' : 'border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.25)] hover:border-rose-400'} rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between relative transition-all">
                        ${isPurchased ? '<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-950/90 border border-rose-500/60 text-rose-300 uppercase shadow tracking-wider">ĐÃ MUA</span>' : '<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-600 text-white uppercase shadow tracking-wider">VÉ TRIỆU HỒI</span>'}
                        
                        <div>
                            <div class="flex items-center gap-3 mb-2.5">
                                <div class="w-14 h-14 rounded-xl bg-slate-950 border-2 border-rose-500/60 flex items-center justify-center p-1.5 shrink-0 shadow">
                                    <img src="SurvivalIO/Assets/_Project/Textures/UI/icon_menu_chieumo.png" alt="Cuộn" class="w-full h-full object-contain drop-shadow" />
                                </div>
                                <div class="flex-1 min-w-0 pr-14">
                                    <div class="text-xs sm:text-sm font-black text-rose-300 truncate">${it.name}</div>
                                    <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 border border-rose-400/40 text-rose-300">
                                            +${it.count} Cuộn Giấy
                                        </span>
                                        <span class="text-[10px] text-slate-400 font-medium">Có: ${d.scrolls || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 leading-relaxed mb-3">Dùng trong Triệu Hồi Nhẫn Giả để mở khóa và nhận mảnh tướng!</p>
                        </div>

                        <div class="flex items-center justify-between pt-2.5 border-t border-slate-800/80 mt-auto">
                            <span class="text-xs sm:text-sm font-black text-amber-400 font-mono">🪙 ${it.cost.toLocaleString()} Ryo</span>
                            ${isPurchased
                                ? '<button disabled class="px-4 py-1.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-500 border border-slate-700/80 cursor-not-allowed uppercase tracking-wider">ĐÃ MUA</button>'
                                : `<button onclick="window.LobbyMenuView.buyShopSlot(${it.slotIndex})" class="px-4 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${canAfford ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}">Mua</button>`
                            }
                        </div>
                    </div>
                `;
            } else {
                const ninja = window.NinjaCatalog.find(n => n.id === it.ninjaId);
                if (!ninja) continue;

                const avatarUrl = window.getNinjaAvatarPath(ninja.avatar);
                const currentShards = d.ninjaShards[ninja.id] || 0;
                const isLegend = ninja.rarity === 'LEGEND';
                const isEpic = ninja.rarity === 'EPIC';
                const borderCol = isLegend ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]' : (isEpic ? 'border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.18)]');
                const badgeBg = isLegend ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950' : (isEpic ? 'bg-purple-600 text-white' : 'bg-sky-500 text-white');
                const rarityLabel = isLegend ? 'LEGEND' : (isEpic ? 'EPIC' : 'RARE');

                html += `
                    <div class="bg-slate-900/95 border-2 ${isPurchased ? 'border-slate-800 opacity-60' : borderCol} rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between relative transition-all">
                        ${isPurchased
                            ? '<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-950/90 border border-rose-500/60 text-rose-300 uppercase shadow tracking-wider">ĐÃ MUA</span>'
                            : `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase shadow tracking-wider ${badgeBg}">${rarityLabel}</span>`
                        }
                        
                        <div>
                            <div class="flex items-center gap-3 mb-2.5">
                                <div class="relative shrink-0">
                                    <img src="${avatarUrl}" alt="${ninja.name}" class="w-14 h-14 rounded-xl object-cover border-2 ${borderCol} bg-slate-950" onerror="this.src=''; this.alt='🥷';" />
                                </div>
                                <div class="flex-1 min-w-0 pr-14">
                                    <div class="text-xs sm:text-sm font-black text-white truncate">${ninja.name}</div>
                                    <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                                            +${it.count} Mảnh
                                        </span>
                                        <span class="text-[10px] text-slate-400 font-medium">Có: ${currentShards}</span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 leading-relaxed mb-3">Dùng mảnh để nâng sao 1★ ➔ 5★ kích hoạt chỉ số sức mạnh tối thượng!</p>
                        </div>

                        <div class="flex items-center justify-between pt-2.5 border-t border-slate-800/80 mt-auto">
                            <span class="text-xs sm:text-sm font-black text-amber-400 font-mono">🪙 ${it.cost.toLocaleString()} Ryo</span>
                            ${isPurchased
                                ? '<button disabled class="px-4 py-1.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-500 border border-slate-700/80 cursor-not-allowed uppercase tracking-wider">ĐÃ MUA</button>'
                                : `<button onclick="window.LobbyMenuView.buyShopSlot(${it.slotIndex})" class="px-4 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${canAfford ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}">Mua</button>`
                            }
                        </div>
                    </div>
                `;
            }
        }

        container.innerHTML = html;
    },

    buyShopSlot(slotIndex) {
        const state = this.getShopState();
        if (!state || !state.slots) return;
        const it = state.slots[slotIndex];
        if (!it || it.purchased) return;

        const d = window.StorageManager.data;
        if (!d.ninjaShards) d.ninjaShards = {};
        const userRyo = d.ryo || 0;

        if (userRyo < it.cost) {
            alert(`Bạn không đủ đồng Ryo! Cần ${it.cost.toLocaleString()} Ryo.`);
            return;
        }

        // 1. Trừ Ryo
        d.ryo -= it.cost;

        // 2. Đánh dấu ô đã mua (Giới hạn 1 lần duy nhất)
        it.purchased = true;
        this.saveShopState(state);

        // 3. Cộng vật phẩm
        if (it.isScroll) {
            d.scrolls = (d.scrolls || 0) + it.count;
            window.StorageManager.save();
            if (window.SFXController) window.SFXController.orbPickup();
            this.syncStats();
            this.renderShopItems();
            alert(`🎉 Mua thành công +${it.count} Cuộn Giấy Triệu Hồi!`);
        } else {
            d.ninjaShards[it.ninjaId] = (d.ninjaShards[it.ninjaId] || 0) + it.count;
            window.StorageManager.save();
            if (window.SFXController) window.SFXController.talentUpgrade();
            this.syncStats();
            this.renderShopItems();
            this.renderShinobiRoster(); // Đồng bộ ngay với Đồ Giám để nâng sao

            const ninja = window.NinjaCatalog.find(n => n.id === it.ninjaId);
            const name = ninja ? ninja.name : item.ninjaId;
            alert(`🎉 Chúc mừng! Bạn đã mua thành công +${it.count} Mảnh ${name}! Số mảnh hiện tại: ${d.ninjaShards[it.ninjaId]} Mảnh.`);
        }
    },

    // Giữ lại hàm cũ để tránh lỗi tương thích nếu có lời gọi ngoại vi
    buyShopItem(itemId) {
        const state = this.getShopState();
        if (!state || !state.slots) return;
        const foundIdx = state.slots.findIndex(s => s.id === itemId);
        if (foundIdx !== -1) {
            this.buyShopSlot(foundIdx);
        }
    },

    renderShinobiRoster() {
        const container = document.getElementById('shinobiRosterGrid');
        if (!container || !window.NinjaCatalog) return;

        const d = window.StorageManager.data;
        if (!d.unlockedNinjas) d.unlockedNinjas = ['naruto', 'itachi'];
        if (!d.ninjaStars) d.ninjaStars = {};
        if (!d.ninjaShards) d.ninjaShards = {};

        // Đảm bảo các tướng mở khóa có ít nhất 1 sao
        d.unlockedNinjas.forEach(id => {
            if (!d.ninjaStars[id]) d.ninjaStars[id] = 1;
        });

        // Cập nhật tiêu đề hiển thị số lượng mở khóa
        const titleEl = document.getElementById('shinobiModalTitle');
        if (titleEl) {
            titleEl.textContent = `ĐỒ GIÁM NHẪN GIẢ (${d.unlockedNinjas.length}/10)`;
        }

        let html = '';
        for (let i = 0; i < window.NinjaCatalog.length; i++) {
            const n = window.NinjaCatalog[i];
            const isOwned = d.unlockedNinjas.includes(n.id);
            const isSelected = d.selectedNinja === n.id;
            const stars = isOwned ? (d.ninjaStars[n.id] || 1) : 0;
            const shards = d.ninjaShards[n.id] || 0;
            const starCfg = window.STAR_UPGRADE_CONFIG[stars] || { nextShards: 200, statBonus: 0 };
            const reqShards = starCfg.nextShards;
            const isMaxStar = stars >= 5;
            const canUpgrade = isOwned && !isMaxStar && shards >= reqShards;

            // Tính toán buff sao (+10% mỗi sao vượt quá 1★)
            const starBonusPercent = (stars > 1) ? (stars - 1) * 10 : 0;
            const curHp = Math.round(n.hp * (1 + starBonusPercent / 100));
            const curSpeed = Math.round(n.speed * (1 + starBonusPercent / 100));

            // Rarity Color & Badge Classes
            let rarityBadgeClass = '';
            let cardBorderClass = '';
            let avatarBorderClass = '';
            let rarityGlow = '';
            if (n.rarity === 'LEGEND') {
                rarityBadgeClass = 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950';
                cardBorderClass = isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-500/60 hover:border-amber-400';
                avatarBorderClass = 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
                rarityGlow = 'rgba(245, 158, 11, 0.12)';
            } else if (n.rarity === 'EPIC') {
                rarityBadgeClass = 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white';
                cardBorderClass = isSelected ? 'border-purple-400 ring-2 ring-purple-400/50' : 'border-purple-500/60 hover:border-purple-400';
                avatarBorderClass = 'border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]';
                rarityGlow = 'rgba(168, 85, 247, 0.12)';
            } else {
                rarityBadgeClass = 'bg-gradient-to-r from-sky-600 to-blue-500 text-white';
                cardBorderClass = isSelected ? 'border-sky-400 ring-2 ring-sky-400/50' : 'border-sky-500/60 hover:border-sky-400';
                avatarBorderClass = 'border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.5)]';
                rarityGlow = 'rgba(14, 165, 233, 0.12)';
            }

            // Thanh tiến trình Mảnh
            let progressHtml = '';
            if (isMaxStar) {
                progressHtml = `
                    <div class="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-amber-500/40 p-0.5">
                        <div class="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full w-full"></div>
                    </div>
                    <div class="flex justify-between items-center text-[10px] mt-1 font-black">
                        <span class="text-amber-300">★ ★ ★ ★ ★ TỐI ĐA</span>
                        <span class="text-amber-400">ĐẠT MỐC TỐI ĐA</span>
                    </div>
                `;
            } else if (isOwned) {
                const pct = Math.min(100, Math.floor((shards / reqShards) * 100));
                progressHtml = `
                    <div class="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-700/80 p-0.5">
                        <div class="h-full rounded-full transition-all duration-300 ${canUpgrade ? 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_8px_#10b981]' : 'bg-gradient-to-r from-amber-500 to-orange-400'}" style="width: ${pct}%"></div>
                    </div>
                    <div class="flex justify-between items-center text-[10px] mt-1">
                        <span class="text-slate-400">Tiến trình lên ${stars + 1}★:</span>
                        <span class="font-mono font-bold ${canUpgrade ? 'text-emerald-400' : 'text-amber-300'}">${shards}/${reqShards} Mảnh (${pct}%)</span>
                    </div>
                `;
            } else {
                progressHtml = `
                    <div class="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                        <div class="bg-slate-700 h-full rounded-full" style="width: 0%"></div>
                    </div>
                    <div class="flex justify-between items-center text-[10px] mt-1 text-slate-500">
                        <span>Chưa sở hữu:</span>
                        <span class="font-mono">0/${reqShards} Mảnh</span>
                    </div>
                `;
            }

            // Render 5 ngôi sao
            let starsHtml = '';
            for (let s = 1; s <= 5; s++) {
                if (s <= stars) {
                    starsHtml += '<span class="text-amber-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]">★</span>';
                } else {
                    starsHtml += '<span class="text-slate-700">★</span>';
                }
            }

            const avatarUrl = window.getNinjaAvatarPath(n.avatar);

            html += `
                <div class="ninja-card-box relative rounded-2xl p-3 border-2 transition-all duration-200 ${cardBorderClass} ${!isOwned ? 'opacity-75' : ''}" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, ${rarityGlow} 100%);">
                    
                    <!-- Phần Thông Tin Chính (Avatar + Tên + Độ Hiếm) -->
                    <div class="flex items-start gap-3 mb-2.5">
                        <!-- Avatar ảnh tròn/bo góc với viền theo độ hiếm -->
                        <div class="relative shrink-0">
                            <img src="${avatarUrl}" alt="${n.name}" class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 ${avatarBorderClass} bg-slate-900 ${!isOwned ? 'grayscale contrast-75' : ''}" onerror="this.src=''; this.alt='🥷';" />
                            <span class="absolute -bottom-1.5 -right-1 px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${rarityBadgeClass} shadow">
                                ${n.rarity}
                            </span>
                        </div>

                        <!-- Tên & Chiêu Thức -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-1">
                                <h4 class="text-sm sm:text-base font-black text-white truncate">${n.name}</h4>
                                <div class="flex items-center text-xs tracking-tighter shrink-0">${starsHtml}</div>
                            </div>
                            <div class="text-[11px] text-amber-300 font-bold truncate mt-0.5">${n.title}</div>
                            <div class="text-[10px] text-slate-400 truncate mt-0.5">${n.element}</div>
                            
                            <!-- Chỉ số cơ bản & Buff sao -->
                            <div class="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                                <span class="text-emerald-400 font-bold">HP: ${curHp}</span>
                                <span class="text-sky-300 font-bold">Tốc: ${curSpeed}</span>
                                ${starBonusPercent > 0 ? `<span class="text-amber-300 font-black px-1 rounded bg-amber-500/20 border border-amber-500/40">+${starBonusPercent}% ST</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Thanh Tiến Trình Nâng Sao -->
                    <div class="mb-2.5 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                        ${progressHtml}
                    </div>

                    <!-- Hàng Nút Bấm Tương Tác: Nâng Sao & Chọn Xuất Trận -->
                    <div class="flex items-center justify-between gap-2 pt-1">
                        ${!isOwned ? `
                            <div class="w-full py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                                <span>🔒</span> <span>Chưa Sở Hữu (Quay Trong Triệu Hồi)</span>
                            </div>
                        ` : `
                            <!-- Nút Nâng Sao -->
                            ${isMaxStar ? `
                                <button disabled class="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black cursor-default">
                                    🏆 ĐẠT MỐC TỐI ĐA
                                </button>
                            ` : `
                                <button onclick="window.LobbyMenuView.upgradeNinjaStar('${n.id}')" ${canUpgrade ? '' : 'disabled'} class="px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${canUpgrade ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_12px_rgba(168,85,247,0.5)] cursor-pointer hover:scale-105 animate-pulse' : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'}">
                                    NÂNG SAO ⬆️
                                </button>
                            `}

                            <!-- Nút Chọn Xuất Trận -->
                            ${isSelected ? `
                                <button class="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider cursor-default shadow">
                                    ✓ ĐÃ CHỌN
                                </button>
                            ` : `
                                <button onclick="window.LobbyMenuView.selectNinja('${n.id}')" class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-amber-400 text-slate-200 hover:text-white text-xs font-black uppercase tracking-wider transition hover:scale-105 cursor-pointer">
                                    CHỌN
                                </button>
                            `}
                        `}
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    upgradeNinjaStar(ninjaId) {
        const d = window.StorageManager.data;
        if (!d.unlockedNinjas || !d.unlockedNinjas.includes(ninjaId)) return;
        if (!d.ninjaStars) d.ninjaStars = {};
        if (!d.ninjaShards) d.ninjaShards = {};

        const curStar = d.ninjaStars[ninjaId] || 1;
        if (curStar >= 5) {
            alert("Nhẫn giả này đã đạt cấp sao tối đa 5★!");
            return;
        }

        const req = window.STAR_UPGRADE_CONFIG[curStar].nextShards;
        const curShards = d.ninjaShards[ninjaId] || 0;

        if (curShards < req) {
            alert(`Chưa đủ mảnh nhẫn giả! Cần ${req} mảnh, bạn hiện có ${curShards} mảnh.`);
            return;
        }

        // Khấu trừ mảnh và nâng sao
        d.ninjaShards[ninjaId] -= req;
        d.ninjaStars[ninjaId] = curStar + 1;
        window.StorageManager.save();

        if (window.SFXController) window.SFXController.talentUpgrade();
        this.renderShinobiRoster();
        this.syncStats();

        const ninja = window.NinjaCatalog.find(n => n.id === ninjaId);
        const name = ninja ? ninja.name : ninjaId;
        alert(`🎉 Chúc mừng! ${name} đã nâng cấp thành công lên ${curStar + 1}★! Toàn bộ chỉ số tăng thêm +10%!`);
    },

    selectNinja(ninjaId) {
        const d = window.StorageManager.data;
        if (!d.unlockedNinjas) d.unlockedNinjas = ['naruto', 'itachi'];
        if (!d.unlockedNinjas.includes(ninjaId)) {
            alert("Bạn chưa sở hữu nhẫn giả này! Hãy quay trong Triệu Hồi Nhẫn Giả để mở khóa.");
            return;
        }

        d.selectedNinja = ninjaId;
        window.StorageManager.save();
        this.renderShinobiRoster();
        this.syncStats();
        if (window.SFXController) window.SFXController.uiSelect();
    },

    renderSummonRates() {
        const container = document.getElementById('summonRatesContainer');
        if (!container || !window.NinjaCatalog) return;

        const legendList = window.NinjaCatalog.filter(n => n.rarity === 'LEGEND');
        const epicList = window.NinjaCatalog.filter(n => n.rarity === 'EPIC');
        const rareList = window.NinjaCatalog.filter(n => n.rarity === 'RARE');

        const renderNinjaRow = (list, ratePerNinja, borderCol, textCol) => {
            return list.map(n => {
                const url = window.getNinjaAvatarPath(n.avatar);
                return `
                    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border ${borderCol}">
                        <div class="flex items-center gap-2">
                            <img src="${url}" alt="${n.name}" class="w-10 h-10 rounded-lg object-cover border ${borderCol}" onerror="this.src=''; this.alt='🥷';" />
                            <div>
                                <div class="text-xs font-black text-white">${n.name}</div>
                                <div class="text-[10px] ${textCol}">${n.title}</div>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded bg-slate-950 font-mono font-bold text-xs ${textCol}">${ratePerNinja}%</span>
                    </div>
                `;
            }).join('');
        };

        const html = `
            <!-- 1. LEGEND 5% -->
            <div class="bg-amber-950/25 border-2 border-amber-500/60 rounded-2xl p-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-amber-500/30">
                    <span class="font-black text-amber-400 text-sm flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                        HẠNG LEGEND (HUYỀN THOẠI)
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow">TỔNG TỈ LỆ: 5%</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    ${renderNinjaRow(legendList, '1.67', 'border-amber-500/40', 'text-amber-300')}
                </div>
            </div>

            <!-- 2. EPIC 25% -->
            <div class="bg-purple-950/25 border-2 border-purple-500/60 rounded-2xl p-3 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-purple-500/30">
                    <span class="font-black text-purple-400 text-sm flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
                        HẠNG EPIC (SỬ THI)
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-black text-xs shadow">TỔNG TỈ LỆ: 25%</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    ${renderNinjaRow(epicList, '8.33', 'border-purple-500/40', 'text-purple-300')}
                </div>
            </div>

            <!-- 3. RARE 70% -->
            <div class="bg-sky-950/25 border-2 border-sky-500/60 rounded-2xl p-3 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                <div class="flex items-center justify-between mb-2.5 pb-2 border-b border-sky-500/30">
                    <span class="font-black text-sky-400 text-sm flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_#0284c7]"></span>
                        HẠNG RARE (HIẾM)
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-black text-xs shadow">TỔNG TỈ LỆ: 70%</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${renderNinjaRow(rareList, '17.50', 'border-sky-500/40', 'text-sky-300')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    triggerSummon(count) {
        const d = window.StorageManager.data;
        if (d.scrolls < count) {
            if (window.SFXController) window.SFXController.uiClick();
            alert(`Bạn không đủ Cuộn Giấy Triệu Hồi! Cần ${count} cuộn, hiện bạn có ${d.scrolls} cuộn.`);
            return;
        }

        // Khấu trừ vé triệu hồi
        d.scrolls -= count;

        if (!d.unlockedNinjas) d.unlockedNinjas = ['naruto', 'itachi'];
        if (!d.ninjaStars) d.ninjaStars = {};
        if (!d.ninjaShards) d.ninjaShards = {};

        const legendList = window.NinjaCatalog.filter(n => n.rarity === 'LEGEND');
        const epicList = window.NinjaCatalog.filter(n => n.rarity === 'EPIC');
        const rareList = window.NinjaCatalog.filter(n => n.rarity === 'RARE');

        const results = [];
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 100;
            let pool;
            if (r < 5) {
                pool = legendList; // 5% Legend
            } else if (r < 30) {
                pool = epicList;   // 25% Epic
            } else {
                pool = rareList;   // 70% Rare
            }
            const ninja = pool[Math.floor(Math.random() * pool.length)];
            const isOwned = d.unlockedNinjas.includes(ninja.id);

            if (!isOwned) {
                // Lần đầu quay trúng: Mở khóa tướng 1 sao
                d.unlockedNinjas.push(ninja.id);
                d.ninjaStars[ninja.id] = 1;
                if (d.ninjaShards[ninja.id] === undefined) d.ninjaShards[ninja.id] = 0;

                results.push({
                    ninja,
                    isNew: true,
                    shardsAdded: 0
                });
            } else {
                // Đã sở hữu rồi (trùng lặp): Tự động chuyển đổi thành 30 MẢNH
                d.ninjaShards[ninja.id] = (d.ninjaShards[ninja.id] || 0) + 30;

                results.push({
                    ninja,
                    isNew: false,
                    shardsAdded: 30
                });
            }
        }

        // Lưu trữ an toàn & đồng bộ ngay lập tức
        window.StorageManager.save();
        this.syncStats();
        this.renderShinobiRoster(); // Đồng bộ ngay với Đồ Giám!

        if (window.SFXController) window.SFXController.summonReveal();

        // Hiển thị Popup Hoạt ảnh kết quả chiêu mộ
        this.showSummonResults(results);
    },

    showSummonResults(results) {
        const body = document.getElementById('summonResultsBody');
        const header = document.getElementById('summonResultsHeader');
        if (!body) return;

        if (header) {
            header.textContent = results.length > 1 
                ? `KẾT QUẢ TRIỆU HỒI x${results.length} VÉ`
                : 'KẾT QUẢ TRIỆU HỒI NHẪN GIẢ';
        }

        let html = '';
        if (results.length === 1) {
            // Hiển thị 1 thẻ lớn hoành tráng
            const r = results[0];
            const n = r.ninja;
            const url = window.getNinjaAvatarPath(n.avatar);
            const isLegend = n.rarity === 'LEGEND';
            const isEpic = n.rarity === 'EPIC';
            const borderCol = isLegend ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]' : (isEpic ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]' : 'border-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.5)]');
            const badgeBg = isLegend ? 'bg-amber-500 text-slate-950' : (isEpic ? 'bg-purple-600 text-white' : 'bg-sky-500 text-white');

            html = `
                <div class="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border-2 ${borderCol} max-w-md mx-auto my-2 animate-bounce-short">
                    <div class="relative mb-3">
                        <img src="${url}" alt="${n.name}" class="w-24 h-24 rounded-2xl object-cover border-4 ${borderCol}" onerror="this.src=''; this.alt='🥷';" />
                        <span class="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${badgeBg} shadow">
                            ${n.rarity}
                        </span>
                    </div>

                    <h4 class="text-xl font-black text-white mt-2">${n.name}</h4>
                    <div class="text-xs text-amber-300 font-bold mb-1">${n.title}</div>
                    <div class="text-[11px] text-slate-400 mb-4">${n.element}</div>

                    ${r.isNew ? `
                        <div class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                            ✨ TƯỚNG MỚI! MỞ KHÓA 1★ THÀNH CÔNG
                        </div>
                    ` : `
                        <div class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                            🔄 TRÙNG LẶP! QUY ĐỔI +30 MẢNH NHẪN GIẢ
                        </div>
                    `}
                </div>
            `;
        } else {
            // Hiển thị lưới 10 thẻ (5 Cột x 2 Hàng)
            let newCount = 0;
            let shardTotal = 0;
            results.forEach(r => {
                if (r.isNew) newCount++;
                else shardTotal += r.shardsAdded;
            });

            html = `
                <div class="mb-3 text-xs bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-4">
                    <span>Mở khóa mới: <strong class="text-emerald-400 text-sm font-black">${newCount}</strong> tướng</span>
                    <span class="text-slate-600">•</span>
                    <span>Quy đổi: <strong class="text-amber-300 text-sm font-black">+${shardTotal}</strong> Mảnh tướng</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-[58vh] overflow-y-auto p-1">
            `;

            results.forEach(r => {
                const n = r.ninja;
                const url = window.getNinjaAvatarPath(n.avatar);
                const isLegend = n.rarity === 'LEGEND';
                const isEpic = n.rarity === 'EPIC';
                const borderCol = isLegend ? 'border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : (isEpic ? 'border-purple-400/80 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-sky-400/80 shadow-[0_0_10px_rgba(14,165,233,0.3)]');
                const badgeBg = isLegend ? 'bg-amber-500 text-slate-950' : (isEpic ? 'bg-purple-600 text-white' : 'bg-sky-500 text-white');

                html += `
                    <div class="flex flex-col items-center justify-between p-2 rounded-xl bg-slate-900/95 border-2 ${borderCol} relative">
                        <span class="absolute top-1 right-1 px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${badgeBg}">
                            ${n.rarity[0]}
                        </span>
                        <img src="${url}" alt="${n.name}" class="w-14 h-14 rounded-xl object-cover border ${borderCol} mb-1" onerror="this.src=''; this.alt='🥷';" />
                        <div class="text-[11px] font-black text-white text-center truncate w-full mb-1">${n.name}</div>
                        ${r.isNew ? `
                            <span class="w-full py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-tighter text-center">
                                MỚI 1★
                            </span>
                        ` : `
                            <span class="w-full py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-[9px] uppercase tracking-tighter text-center">
                                +30 Mảnh
                            </span>
                        `}
                    </div>
                `;
            });
            html += '</div>';
        }

        body.innerHTML = html;
        this.openModal('modalSummonResults');
    },

    handleRedeemGiftcode() {
        const input = document.getElementById('inputGiftcodeCode');
        const msg = document.getElementById('giftcodeResultMessage');
        if (!input || !msg) return;

        const code = (input.value || '').trim().toUpperCase();

        const triggerError = (text) => {
            if (window.SFXController && typeof window.SFXController.uiClick === 'function') {
                window.SFXController.uiClick();
            }
            msg.className = 'text-xs p-3 rounded-xl text-center font-bold bg-rose-950/90 border border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
            msg.textContent = `❌ ${text}`;
            msg.classList.remove('shake-card', 'hidden');
            void msg.offsetWidth; // Trigger reflow for animation restart
            msg.classList.add('shake-card');
        };

        if (!code) {
            triggerError("Vui lòng nhập mã Giftcode!");
            input.focus();
            return;
        }

        // 1. Dùng GiftcodeSystem nếu sẵn sàng
        if (window.GiftcodeSystem && typeof window.GiftcodeSystem.claim === 'function') {
            const res = window.GiftcodeSystem.claim(code);
            if (!res.success) {
                triggerError(res.message || "Mã không tồn tại hoặc đã được sử dụng!");
                return;
            }

            const rw = res.rewards || {};
            const ryoAdd = rw.ryo || 0;
            const scrollsAdd = rw.scrolls || 0;
            const shardsAdd = rw.ninjaShards || 0;
            const ninjaName = rw.ninjaId ? (rw.ninjaId.charAt(0).toUpperCase() + rw.ninjaId.slice(1)) : '';

            if (window.SFXController && typeof window.SFXController.levelUp === 'function') {
                window.SFXController.levelUp();
            }

            msg.className = 'text-xs p-3 rounded-xl text-center font-bold bg-emerald-950/90 border border-emerald-500 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]';
            msg.classList.remove('shake-card', 'hidden');
            msg.innerHTML = `
                <div class="text-sm font-black text-amber-300">🎉 ĐỔI THƯỞNG THÀNH CÔNG!</div>
                <div class="mt-1.5 text-[11px] text-emerald-200">
                    🪙 +${ryoAdd.toLocaleString()} Ryo • 📜 +${scrollsAdd} Cuộn
                    ${shardsAdd ? ` • 🧩 +${shardsAdd} Mảnh ${ninjaName}` : ''}
                </div>
            `;
            this.syncStats();
            if (typeof this.renderShinobiRoster === 'function') this.renderShinobiRoster();
            if (typeof this.renderShopItems === 'function') this.renderShopItems();
            return;
        }

        // 2. Fallback trực tiếp localStorage nếu chưa nạp GiftcodeSystem
        let codesMap = {};
        try {
            const raw = localStorage.getItem('naruto_giftcodes');
            codesMap = raw ? JSON.parse(raw) : {
                'NARUTO2026': { code: 'NARUTO2026', ryo: 50000, scrolls: 20, ninjaId: 'naruto', ninjaShards: 30 },
                'HOKAGE': { code: 'HOKAGE', ryo: 100000, scrolls: 50, ninjaId: 'minato', ninjaShards: 50 },
                'AKATSUKI': { code: 'AKATSUKI', ryo: 88888, scrolls: 30, ninjaId: 'itachi', ninjaShards: 40 }
            };
        } catch (e) {
            codesMap = {};
        }

        const gift = codesMap[code];
        if (!gift) {
            triggerError("Mã không tồn tại hoặc đã hết hạn!");
            return;
        }

        let claimed = [];
        try {
            const rawClaimed = localStorage.getItem('naruto_claimed_giftcodes');
            claimed = rawClaimed ? JSON.parse(rawClaimed) : [];
        } catch (e) {
            claimed = [];
        }

        if (claimed.includes(code)) {
            triggerError("Mã quà tặng này đã được sử dụng rồi!");
            return;
        }

        if (window.StorageManager && window.StorageManager.data) {
            const d = window.StorageManager.data;
            const ryoAdd = gift.ryo || 0;
            const scrollsAdd = gift.scrolls || 0;
            const shardsAdd = gift.ninjaShards || 0;
            const ninjaId = gift.ninjaId || 'naruto';
            const ninjaName = ninjaId ? (ninjaId.charAt(0).toUpperCase() + ninjaId.slice(1)) : '';

            d.ryo = (d.ryo || 0) + ryoAdd;
            d.scrolls = (d.scrolls || 0) + scrollsAdd;
            if (shardsAdd > 0 && ninjaId) {
                d.ninjaShards = d.ninjaShards || {};
                d.ninjaShards[ninjaId] = (d.ninjaShards[ninjaId] || 0) + shardsAdd;
            }

            claimed.push(code);
            try {
                localStorage.setItem('naruto_claimed_giftcodes', JSON.stringify(claimed));
            } catch (e) {}
            window.StorageManager.save();

            if (window.SFXController && typeof window.SFXController.levelUp === 'function') {
                window.SFXController.levelUp();
            }

            msg.className = 'text-xs p-3 rounded-xl text-center font-bold bg-emerald-950/90 border border-emerald-500 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)]';
            msg.classList.remove('shake-card', 'hidden');
            msg.innerHTML = `
                <div class="text-sm font-black text-amber-300">🎉 ĐỔI THƯỞNG THÀNH CÔNG!</div>
                <div class="mt-1.5 text-[11px] text-emerald-200">
                    🪙 +${ryoAdd.toLocaleString()} Ryo • 📜 +${scrollsAdd} Cuộn
                    ${shardsAdd ? ` • 🧩 +${shardsAdd} Mảnh ${ninjaName}` : ''}
                </div>
            `;

            this.syncStats();
            if (typeof this.renderShinobiRoster === 'function') this.renderShinobiRoster();
            if (typeof this.renderShopItems === 'function') this.renderShopItems();
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
window.buyShopSlot = function(idx) { window.LobbyMenuView.buyShopSlot(idx); };
window.filterShop = function(cat) { if (window.LobbyMenuView.filterShop) window.LobbyMenuView.filterShop(cat); };
window.claimMission = function(id) { window.LobbyMenuView.claimMission(id); };
