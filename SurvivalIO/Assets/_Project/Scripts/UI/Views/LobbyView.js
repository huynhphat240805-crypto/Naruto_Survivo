/* ============================================================================
   MODULE: src/UI/LobbyView.js
   Quản lý Toàn Bộ Giao Diện Màn Hình Chính (Home / Lobby) & Các Modals Tương Tác
   Phong Cách PokéSurvivor Chuẩn Chỉnh - Giữ nguyên 100% SVG Vector Hoa Mỹ
   ============================================================================ */

window.LobbyView = {
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

    init() {
        if (this.element) return;

        const html = `
        <!-- MÀN HÌNH CHÍNH (HOME / LOBBY MODAL) -->
        <div id="startModal" class="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-5 overflow-hidden" style="background: radial-gradient(circle at 45% 50%, rgba(11, 17, 32, 0.2) 0%, rgba(8, 14, 26, 0.6) 70%, rgba(5, 9, 18, 0.88) 100%);">
            
            <!-- 1. TOP HEADER BAR -->
            <header class="w-full flex items-center justify-between gap-2 pointer-events-auto">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <!-- Ryo -->
                    <div class="top-badge-pill border border-amber-500/60 px-3 py-1 sm:py-1.5 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" class="w-5 h-5 drop-shadow flex-shrink-0">
                            <defs>
                                <linearGradient id="ryoGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#fef08a"/>
                                    <stop offset="50%" stop-color="#f59e0b"/>
                                    <stop offset="100%" stop-color="#b45309"/>
                                </linearGradient>
                            </defs>
                            <circle cx="12" cy="12" r="10" fill="url(#ryoGrad)" stroke="#78350f" stroke-width="1.2"/>
                            <rect x="9.5" y="9.5" width="5" height="5" fill="#451a03" rx="0.6"/>
                            <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" stroke="#fef08a" stroke-width="1.2" stroke-linecap="round"/>
                        </svg>
                        <div class="flex items-baseline gap-1">
                            <span id="topRyoCount" class="font-black text-amber-300 text-xs sm:text-sm font-mono">24,500</span>
                            <span class="text-[10px] font-extrabold text-amber-400/80 tracking-wider">RYO</span>
                        </div>
                    </div>

                    <!-- Cuộn giấy -->
                    <div class="top-badge-pill border border-rose-500/60 px-3 py-1 sm:py-1.5 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" class="w-5 h-5 drop-shadow flex-shrink-0">
                            <rect x="4" y="6" width="16" height="12" rx="2" fill="#fef3c7" stroke="#78350f" stroke-width="1.2"/>
                            <rect x="1.5" y="4.5" width="4" height="15" rx="1.5" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
                            <rect x="18.5" y="4.5" width="4" height="15" rx="1.5" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
                            <circle cx="12" cy="12" r="3" fill="none" stroke="#b91c1c" stroke-width="1.2"/>
                            <path d="M12 10v4M10 12h4" stroke="#b91c1c" stroke-width="1.2" stroke-linecap="round"/>
                        </svg>
                        <div class="flex items-baseline gap-1">
                            <span id="topScrollCount" class="font-black text-rose-300 text-xs sm:text-sm font-mono">15</span>
                            <span class="text-[10px] font-extrabold text-rose-400/80 tracking-wider">CUỘN</span>
                        </div>
                    </div>

                    <!-- Hokage Tag -->
                    <div class="hidden md:flex top-badge-pill border border-sky-500/50 px-3.5 py-1.5 items-center gap-2.5">
                        <svg viewBox="0 0 24 24" class="w-5 h-5 drop-shadow flex-shrink-0">
                            <polygon points="12,2 3,16 21,16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
                            <polygon points="12,2 7,16 17,16" fill="#dc2626"/>
                            <path d="M2 16c5 3 15 3 20 0v2c-5 3-15 3-20 0z" fill="#0f172a"/>
                            <circle cx="12" cy="10" r="2" fill="#fef08a"/>
                        </svg>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-black text-white tracking-wide">Hokage • Uzumaki Naruto</span>
                            <div class="flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
                                <span class="text-[10px] text-emerald-300 font-bold">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cụm nút góc phải -->
                <div class="flex items-center gap-1.5 sm:gap-2">
                    <button id="btnToggleAudio" class="btn-util-sq" title="Bật/Tắt Âm thanh">
                        <svg id="iconAudio" viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                            <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        </svg>
                    </button>
                    <button id="btnToggleFullscreen" class="btn-util-sq" title="Toàn màn hình">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                    </button>
                    <button id="btnOpenInfo" class="btn-util-sq" title="Hướng dẫn & Hồ sơ">
                        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current stroke-2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                    </button>
                </div>
            </header>

            <!-- 2. THÂN CHÍNH: KHU VỰC TRUNG TÂM & BẢNG MENU PHẢI -->
            <main class="flex-1 w-full flex flex-col lg:flex-row items-center justify-between gap-4 py-2 sm:py-3 overflow-hidden pointer-events-none">
                
                <!-- KHU VỰC TRUNG TÂM -->
                <section class="w-full lg:w-[63%] flex flex-col items-center justify-center pointer-events-auto my-auto">
                    <div class="relative text-center mb-2 sm:mb-3">
                        <div class="tilted-blinking-badge absolute -top-3 sm:-top-4 -right-2 sm:-right-8 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] sm:text-xs font-black tracking-wider uppercase border border-yellow-100 shadow-xl">
                            ⚡ Hokage Đệ Thất đang chờ bạn!
                        </div>
                        <h1 class="shinobi-title text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
                            SHINOBI SURVIVOR
                        </h1>
                        <div class="text-xs sm:text-sm font-black tracking-[0.3em] text-amber-300/90 uppercase drop-shadow mt-0.5">
                            — ĐẠI CHIẾN NHẪN GIẢ —
                        </div>
                    </div>

                    <!-- Showcase Box -->
                    <div class="character-showcase-box relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl flex items-center justify-center overflow-hidden mb-2.5">
                        <canvas id="charShowcaseCanvas" width="240" height="240" class="w-full h-full"></canvas>
                        <div class="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
                    </div>

                    <!-- Tên tướng & nút chuyển -->
                    <div class="flex items-center gap-3 mb-4">
                        <button id="btnPrevNinja" class="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-amber-300 flex items-center justify-center font-black text-sm shadow transition cursor-pointer" title="Nhẫn giả trước">◀</button>
                        <div class="flex flex-col items-center min-w-[190px] sm:min-w-[220px]">
                            <span id="showcaseNinjaName" class="text-base sm:text-lg font-black text-white tracking-wide">Uzumaki Naruto</span>
                            <div id="showcaseNinjaElement" class="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold tracking-wider mt-0.5">
                                🌀 Phong Độn / Cửu Vĩ
                            </div>
                        </div>
                        <button id="btnNextNinja" class="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-amber-300 flex items-center justify-center font-black text-sm shadow transition cursor-pointer" title="Nhẫn giả tiếp theo">▶</button>
                    </div>

                    <!-- 3 Nút Điều Hướng Đáy -->
                    <div class="flex items-center justify-center gap-2.5 sm:gap-4 w-full max-w-md">
                        <button id="navBtnHome" class="nav-bottom-btn active flex-1">
                            <svg viewBox="0 0 24 24" class="w-5 h-5 flex-shrink-0">
                                <defs>
                                    <linearGradient id="leafHomeGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stop-color="#4ade80"/>
                                        <stop offset="100%" stop-color="#16a34a"/>
                                    </linearGradient>
                                </defs>
                                <path d="M12 2C7 6 5 11 7 16c2 4 6 6 10 5 4-1 6-5 5-9-1-5-6-9-10-10z" fill="url(#leafHomeGrad)" stroke="#15803d" stroke-width="1"/>
                                <path d="M12 7c-2 3-1 6 2 7 2 1 4 0 4-2 0-3-3-4-4-2" fill="none" stroke="#fef08a" stroke-width="1.3" stroke-linecap="round"/>
                            </svg>
                            <span>TRANG CHỦ</span>
                        </button>
                        <button id="navBtnMap" class="nav-bottom-btn flex-1">
                            <svg viewBox="0 0 24 24" class="w-5 h-5 flex-shrink-0">
                                <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" fill="#fef3c7" stroke="#b45309" stroke-width="1.3"/>
                                <line x1="9" y1="3" x2="9" y2="18" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2"/>
                                <line x1="15" y1="6" x2="15" y2="21" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2"/>
                                <circle cx="12" cy="11" r="2.2" fill="#dc2626"/>
                            </svg>
                            <span>BẢN ĐỒ</span>
                        </button>
                        <button id="navBtnSettings" class="nav-bottom-btn flex-1">
                            <svg viewBox="0 0 24 24" class="w-5 h-5 flex-shrink-0">
                                <path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5L12 2z" fill="#94a3b8" stroke="#475569" stroke-width="1"/>
                                <circle cx="12" cy="10" r="2.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="1"/>
                            </svg>
                            <span>CÀI ĐẶT</span>
                        </button>
                    </div>
                </section>

                <!-- BẢNG MENU DỌC BÊN PHẢI (8 MỤC) -->
                <aside class="w-full lg:w-[35%] max-w-sm flex flex-col gap-2.5 pointer-events-auto justify-center">
                    <div class="shinobi-sidebar-panel rounded-2xl p-2.5 flex flex-col gap-1.5">
                        
                        <!-- 1. Chơi -->
                        <button id="btnPlayGame" class="lobby-menu-btn btn-play-action">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6 drop-shadow">
                                    <defs>
                                        <linearGradient id="kunaiGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="60%" stop-color="#fef08a"/>
                                            <stop offset="100%" stop-color="#f97316"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 2l3 5-2 10-1 4-1-4-2-10 3-5z" fill="url(#kunaiGrad)" stroke="#78350f" stroke-width="1"/>
                                    <circle cx="12" cy="21" r="1.5" fill="none" stroke="#ffffff" stroke-width="1.2"/>
                                    <path d="M12 6c-2 2-2 4 0 5s4 0 3-2" stroke="#dc2626" stroke-width="1.2" fill="none" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-black tracking-wider text-white uppercase leading-tight drop-shadow">Chơi</span>
                                <span class="text-[11px] text-yellow-100 font-semibold truncate">Bước vào Đại Chiến Nhẫn Giả</span>
                            </div>
                            <span class="text-white text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 2. Nhẫn Giả -->
                        <button id="btnMenuNinja" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <path d="M2 10c6-2 14-2 20 0v4c-6-2-14-2-20 0z" fill="#1e3a8a"/>
                                    <rect x="6" y="8" width="12" height="8" rx="1.5" fill="#94a3b8" stroke="#334155" stroke-width="1"/>
                                    <path d="M12 10.5c-1.5 0-2 1-1.2 2 0.8 0.8 2 0.2 1.5-1.2" stroke="#0f172a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
                                    <path d="M13.5 10l-1.5 1" stroke="#0f172a" stroke-width="1.2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Nhẫn Giả</span>
                                <span class="text-[11px] text-sky-300/80 truncate">12 / 50 Nhẫn giả đã mở khóa</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 3. Nâng Cấp -->
                        <button id="btnMenuUpgrades" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <defs>
                                        <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#4ade80"/>
                                            <stop offset="100%" stop-color="#15803d"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 3l7 7h-4v9h-6v-9H5l7-7z" fill="url(#upGrad)" stroke="#86efac" stroke-width="1"/>
                                    <circle cx="12" cy="14" r="1.5" fill="#f0fdf4"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Nâng Cấp</span>
                                <span class="text-[11px] text-emerald-300/80 truncate">Cường hóa thiên phú vĩnh viễn</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 4. Cửa Hàng -->
                        <button id="btnMenuShop" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <path d="M4 10c0 6 3.5 9 8 9s8-3 8-9H4z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
                                    <ellipse cx="12" cy="10" rx="8" ry="2.5" fill="#fef08a"/>
                                    <line x1="3" y1="7" x2="19" y2="5" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
                                    <circle cx="10" cy="10" r="1.8" fill="#fff"/>
                                    <circle cx="10" cy="10" r="0.9" fill="none" stroke="#ec4899" stroke-width="0.8"/>
                                    <path d="M9 5c0-1.5 1-2 1-3M14 5c0-1.5 1-2 1-3" stroke="#fde047" stroke-width="1" stroke-linecap="round" fill="none"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Cửa Hàng</span>
                                <span class="text-[11px] text-amber-300/80 truncate">Nhẫn cụ, Binh lương hoàn & Bí kíp</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 5. Chiêu Mộ -->
                        <button id="btnMenuSummon" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <rect x="5" y="4" width="14" height="16" rx="1" fill="#fef3c7" stroke="#78350f" stroke-width="1.2"/>
                                    <circle cx="12" cy="12" r="4.2" fill="none" stroke="#991b1b" stroke-width="1.2"/>
                                    <path d="M12 9v6M9 12h6M10 10l4 4M14 10l-4 4" stroke="#991b1b" stroke-width="1.2" stroke-linecap="round"/>
                                    <rect x="2" y="3" width="3" height="18" rx="1" fill="#451a03"/>
                                    <rect x="19" y="3" width="3" height="18" rx="1" fill="#451a03"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Chiêu Mộ</span>
                                <span class="text-[11px] text-rose-300/80 truncate">Triệu hồi Nhẫn giả & Vĩ thú</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 6. Thành Tựu -->
                        <button id="btnMenuAchievements" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <path d="M6 4l3 5c-2 2-3 5-1 8 2 3 5 4 8 2 3-2 3-5 1-8l3-7-4 3c-2-1-4-1-6 0L6 4z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
                                    <path d="M7 13c2 0 3-1 3-2M17 13c-2 0-3-1-3-2" stroke="#dc2626" stroke-width="1.4" stroke-linecap="round" fill="none"/>
                                    <path d="M8 10l2 1M16 10l-2 1" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/>
                                    <circle cx="12" cy="8" r="1.2" fill="#dc2626"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Thành Tựu</span>
                                <span class="text-[11px] text-purple-300/80 truncate">Nhiệm vụ, danh hiệu và hồ sơ</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 7. Bạn Bè -->
                        <button id="btnMenuFriends" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <circle cx="12" cy="12" r="9" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
                                    <path d="M9 16V9l3 2 3-2v7" stroke="#67e8f9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <circle cx="12" cy="12" r="1.5" fill="#facc15"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Bạn Bè</span>
                                <span class="text-[11px] text-cyan-300/80 truncate">Tổ đội sinh tồn tối đa 4 người</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>

                        <!-- 8. Xếp Hạng -->
                        <button id="btnMenuLeaderboard" class="lobby-menu-btn">
                            <div class="menu-icon-slot">
                                <svg viewBox="0 0 24 24" class="w-6 h-6">
                                    <defs>
                                        <linearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#fef08a"/>
                                            <stop offset="100%" stop-color="#eab308"/>
                                        </linearGradient>
                                    </defs>
                                    <path d="M6 4h12v5c0 4-2.5 7-6 7s-6-3-6-7V4z" fill="url(#cupGrad)" stroke="#d97706" stroke-width="1"/>
                                    <path d="M6 6H3c0 3 1.5 5 3 5M18 6h3c0 3-1.5 5-3 5" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
                                    <rect x="10.5" y="16" width="3" height="3" fill="#d97706"/>
                                    <path d="M7 19h10v2H7z" fill="#b45309" rx="1"/>
                                    <circle cx="12" cy="9" r="2" fill="#ef4444"/>
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col text-left pl-3">
                                <span class="text-sm font-extrabold text-white leading-tight">Xếp Hạng</span>
                                <span class="text-[11px] text-yellow-300/80 truncate">Bảng vàng ai sống sót lâu nhất</span>
                            </div>
                            <span class="text-slate-400 text-base font-bold pr-1">›</span>
                        </button>
                    </div>

                    <!-- Thống kê chiến tích -->
                    <div class="shinobi-sidebar-panel rounded-2xl p-3 flex flex-col gap-2">
                        <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                            <span class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                📊 THỐNG KÊ CHIẾN TÍCH
                            </span>
                            <span class="text-[10px] text-slate-400 font-mono">LỤC ĐẠO</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                                <div class="text-[10px] text-slate-400">Số trận đã đấu</div>
                                <div id="lobbyStatMatches" class="text-sm font-black text-amber-300 font-mono">0 trận</div>
                            </div>
                            <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                                <div class="text-[10px] text-slate-400">Sống sót lâu nhất</div>
                                <div id="lobbyStatSurvival" class="text-sm font-black text-emerald-400 font-mono">00:00</div>
                            </div>
                            <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                                <div class="text-[10px] text-slate-400">Cấp độ cao nhất</div>
                                <div id="lobbyStatLevel" class="text-sm font-black text-sky-300 font-mono">Lv.1</div>
                            </div>
                            <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
                                <div class="text-[10px] text-slate-400">Kẻ địch đã diệt</div>
                                <div id="lobbyStatKills" class="text-sm font-black text-rose-400 font-mono">0</div>
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
                    <p>⏳ Sống sót qua các mốc thời gian để triệu tập và nghênh chiến <strong class="text-purple-400">Đại Xà Manda (Phút 5)</strong> và <strong class="text-rose-400">Thủ Lĩnh Akatsuki (Phút 10)</strong>!</p>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('startModal');
        this._bindEvents();
        this.syncStats();
    },

    _bindEvents() {
        // Nút Chơi
        const handleStart = () => {
            if ((window.StorageManager.data.talents.starting_jutsu || 0) >= 1) {
                this.openStartingJutsuSelection();
            } else {
                window.GameManager.startNewRun();
            }
        };
        document.getElementById('btnPlayGame')?.addEventListener('click', handleStart);

        // Nút chọn chiêu mặc định
        document.getElementById('btnStartWithDefaultJutsu')?.addEventListener('click', () => {
            this.closeAllModals();
            window.GameManager.startNewRun();
        });

        // Nút chuyển nhân vật trước / sau
        document.getElementById('btnPrevNinja')?.addEventListener('click', () => {
            if (window.SFXController) window.SFXController.uiClick();
            let idx = window.NinjaCatalog.findIndex(n => n.id === window.StorageManager.data.selectedNinja);
            idx = (idx - 1 + window.NinjaCatalog.length) % window.NinjaCatalog.length;
            window.StorageManager.data.selectedNinja = window.NinjaCatalog[idx].id;
            window.StorageManager.save();
            this.syncStats();
        });

        document.getElementById('btnNextNinja')?.addEventListener('click', () => {
            if (window.SFXController) window.SFXController.uiClick();
            let idx = window.NinjaCatalog.findIndex(n => n.id === window.StorageManager.data.selectedNinja);
            idx = (idx + 1) % window.NinjaCatalog.length;
            window.StorageManager.data.selectedNinja = window.NinjaCatalog[idx].id;
            window.StorageManager.save();
            this.syncStats();
        });

        // 8 Nút Menu Dọc Bên Phải
        document.getElementById('btnMenuNinja')?.addEventListener('click', () => {
            this.renderShinobiRoster();
            this.openModal('modalShinobi');
        });
        document.getElementById('btnMenuUpgrades')?.addEventListener('click', () => {
            if (window.UpgradeModal) window.UpgradeModal.show();
        });
        document.getElementById('btnMenuShop')?.addEventListener('click', () => {
            this.renderShopItems();
            this.openModal('modalShop');
        });
        document.getElementById('btnMenuSummon')?.addEventListener('click', () => {
            const box = document.getElementById('summonResultBox');
            if (box) box.classList.add('hidden');
            this.openModal('modalSummon');
        });
        document.getElementById('btnMenuAchievements')?.addEventListener('click', () => {
            this.renderMissions();
            this.openModal('modalAchievements');
        });
        document.getElementById('btnMenuFriends')?.addEventListener('click', () => {
            this.openModal('modalFriends');
        });
        document.getElementById('btnMenuLeaderboard')?.addEventListener('click', () => {
            this.syncStats();
            this.openModal('modalLeaderboard');
        });

        // 3 Nút Đáy
        document.getElementById('navBtnHome')?.addEventListener('click', () => {
            this.closeAllModals();
        });
        document.getElementById('navBtnMap')?.addEventListener('click', () => {
            document.querySelectorAll('.nav-bottom-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('navBtnMap').classList.add('active');
            this.openModal('modalMap');
        });
        document.getElementById('navBtnSettings')?.addEventListener('click', () => {
            document.querySelectorAll('.nav-bottom-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('navBtnSettings').classList.add('active');
            this.openModal('modalSettings');
        });

        // Nút Tiện ích Top
        document.getElementById('btnToggleAudio')?.addEventListener('click', () => {
            const isMuted = window.SFXController ? window.SFXController.toggleMute() : false;
            const icon = document.getElementById('iconAudio');
            if (icon) icon.style.opacity = isMuted ? '0.35' : '1';
            if (!isMuted && window.SFXController) window.SFXController.uiClick();
        });

        document.getElementById('btnToggleFullscreen')?.addEventListener('click', () => {
            if (window.SFXController) window.SFXController.uiClick();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        document.getElementById('btnOpenInfo')?.addEventListener('click', () => {
            this.openModal('modalInfo');
        });

        // Đóng các modal phụ
        document.querySelectorAll('.btn-close-submodal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(bd => {
            bd.addEventListener('click', (e) => {
                if (e.target === bd) this.closeAllModals();
            });
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });

        // Gacha buttons
        document.getElementById('btnSummon1')?.addEventListener('click', () => this.triggerSummon(1));
        document.getElementById('btnSummon10')?.addEventListener('click', () => this.triggerSummon(10));

        // Screen shake setting
        const shakeBox = document.getElementById('settingScreenShake');
        if (shakeBox) {
            shakeBox.checked = window.StorageManager.data.screenShakeEnabled;
            shakeBox.addEventListener('change', (e) => {
                window.StorageManager.data.screenShakeEnabled = e.target.checked;
                window.Camera.shakeEnabled = e.target.checked;
                window.StorageManager.save();
            });
        }

        // Reset data
        document.getElementById('btnResetData')?.addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn muốn đặt lại tất cả dữ liệu chiến tích và Ryo về mặc định?")) {
                window.StorageManager.reset();
                location.reload();
            }
        });

        // Mock invite friend
        document.querySelectorAll('.btn-invite-friend').forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.SFXController) window.SFXController.uiSelect();
                this.textContent = "Đã Mời ✓";
                this.classList.replace('bg-blue-600', 'bg-emerald-600');
            });
        });

        document.getElementById('btnCreateRoom')?.addEventListener('click', () => {
            if (window.SFXController) window.SFXController.uiSelect();
            alert("Đã tạo phòng tổ đội mới [KONOHA-77]. Hãy chia sẻ mã này với bạn bè!");
        });

        document.getElementById('btnQuickMatch')?.addEventListener('click', () => {
            if (window.SFXController) window.SFXController.uiSelect();
            alert("Đang tìm kiếm tổ đội sinh tồn trong Liên Minh Nhẫn Giả...");
        });

        document.querySelectorAll('.btn-select-map').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.SFXController) window.SFXController.uiSelect();
                alert("Đã chọn chiến trường: Thung Lũng Tận Cùng! Hãy bấm 'Chơi' để xuất kích.");
                this.closeAllModals();
            });
        });
    },

    show() {
        if (!this.element) this.init();
        this.element.classList.remove('hidden');
        this.syncStats();
    },

    hide() {
        if (this.element) this.element.classList.add('hidden');
    },

    openModal(modalId) {
        if (window.SFXController) window.SFXController.uiOpen();
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        const target = document.getElementById(modalId);
        if (target) target.classList.add('open');
    },

    closeAllModals() {
        if (window.SFXController) window.SFXController.uiClick();
        document.querySelectorAll('.shinobi-modal-backdrop').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.nav-bottom-btn').forEach(b => b.classList.remove('active'));
        const homeBtn = document.getElementById('navBtnHome');
        if (homeBtn) homeBtn.classList.add('active');
    },

    syncStats() {
        const d = window.StorageManager.data;
        const ryoEl = document.getElementById('topRyoCount');
        if (ryoEl) ryoEl.textContent = d.ryo.toLocaleString();

        const scrollEl = document.getElementById('topScrollCount');
        if (scrollEl) scrollEl.textContent = d.scrolls.toLocaleString();

        const matchEl = document.getElementById('lobbyStatMatches');
        if (matchEl) matchEl.textContent = `${d.matchesPlayed} trận`;

        const survEl = document.getElementById('lobbyStatSurvival');
        if (survEl) {
            const mm = String(Math.floor(d.bestTime / 60)).padStart(2, '0');
            const ss = String(d.bestTime % 60).padStart(2, '0');
            survEl.textContent = `${mm}:${ss}`;
        }

        const lvEl = document.getElementById('lobbyStatLevel');
        if (lvEl) lvEl.textContent = `Lv.${d.maxLevel}`;

        const killEl = document.getElementById('lobbyStatKills');
        if (killEl) killEl.textContent = d.totalKills.toLocaleString();

        const lbTime = document.getElementById('leadBoardUserTime');
        if (lbTime) {
            const mm = String(Math.floor(d.bestTime / 60)).padStart(2, '0');
            const ss = String(d.bestTime % 60).padStart(2, '0');
            lbTime.textContent = `${mm}:${ss}`;
        }
        const lbKills = document.getElementById('leadBoardUserKills');
        if (lbKills) lbKills.textContent = `${d.totalKills.toLocaleString()} Kills`;

        // Nhân vật đang chọn
        const ninja = window.NinjaCatalog.find(n => n.id === d.selectedNinja) || window.NinjaCatalog[0];
        const nameEl = document.getElementById('showcaseNinjaName');
        if (nameEl) nameEl.textContent = ninja.name;
        const elemEl = document.getElementById('showcaseNinjaElement');
        if (elemEl) elemEl.textContent = ninja.element;
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

        // Hào quang
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
    },

    renderShinobiRoster() {
        const container = document.getElementById('shinobiRosterGrid');
        if (!container) return;

        let html = '';
        for (let i = 0; i < window.NinjaCatalog.length; i++) {
            const n = window.NinjaCatalog[i];
            const isSelected = window.StorageManager.data.selectedNinja === n.id;
            html += `
                <div class="ninja-card-item ${isSelected ? 'selected' : ''}" onclick="window.LobbyView.selectNinja('${n.id}')">
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
                <div class="ninja-card-item flex flex-col justify-between cursor-pointer group" onclick="window.LobbyView.selectStartingJutsuAndPlay('${opt.id}')">
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
                        <button onclick="window.LobbyView.buyShopItem('${item.id}')" class="px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">
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
                        <button onclick="window.LobbyView.claimMission('${m.id}')" class="px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${isClaimed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow'}">
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

// Hàm toàn cục cho các inline event listener cũ
window.selectNinja = function(id) { window.LobbyView.selectNinja(id); };
window.selectStartingJutsuAndPlay = function(id) { window.LobbyView.selectStartingJutsuAndPlay(id); };
window.buyShopItem = function(id) { window.LobbyView.buyShopItem(id); };
window.claimMission = function(id) { window.LobbyView.claimMission(id); };
