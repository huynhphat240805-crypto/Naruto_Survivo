/* ============================================================================
   MODULE: src/UI/GameOverModal.js
   Render Bảng Thất Bại / Vinh Danh Chiến Thắng Nhận Thưởng Ryo & Kỷ Lục
   Tự động khởi tạo & Quản lý DOM độc lập
   ============================================================================ */

window.GameOverModal = {
    element: null,

    init() {
        if (this.element) return;

        const html = `
        <div id="gameOverModal" class="hidden fixed inset-0 z-30 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div class="max-w-md w-full bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
                <div class="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mx-auto mb-3 text-4xl">
                    🏮
                </div>
                <h2 class="text-3xl font-black text-rose-500 tracking-wide uppercase mb-1">
                    KẾT THÚC THÍ LUYỆN
                </h2>
                <p class="text-xs sm:text-sm text-slate-400 mb-6">
                    Chakra đã cạn kiệt trên chiến trường Nhẫn Giả, nhưng ý chí Hỏa Ảnh vẫn bất diệt!
                </p>

                <!-- Bảng Thống Kê -->
                <div class="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 mb-6 space-y-3 text-sm">
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <span class="text-slate-400">Danh hiệu đạt được:</span>
                        <span id="statFinalRank" class="font-extrabold text-amber-400">Hạ Nhẫn (Genin)</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <span class="text-slate-400">Thời gian sống sót:</span>
                        <span id="statSurvivalTime" class="font-extrabold text-white font-mono">02:45</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <span class="text-slate-400">Số kẻ địch tiêu diệt:</span>
                        <span id="statKillCount" class="font-extrabold text-rose-400">128</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-slate-800/80 pb-2">
                        <span class="text-slate-400">💎 Kim cương Chakra nhận:</span>
                        <span id="statDiamonds" class="font-extrabold text-cyan-300">+65 💎</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-slate-400">🪙 Tiền Ryo thu thập:</span>
                        <span id="statEarnedRyo" class="font-extrabold text-amber-300 font-mono">+0 Ryo</span>
                    </div>
                </div>

                <!-- 2 Nút bấm điều hướng -->
                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="btnRetryGame" class="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer">
                        🔄 Chơi lại ván mới
                    </button>
                    <button id="btnBackHome" class="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600 transition cursor-pointer">
                        🏠 Về trang chủ
                    </button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById('gameOverModal');
        this._bindEvents();
    },

    _bindEvents() {
        document.getElementById('btnRetryGame')?.addEventListener('click', () => {
            this.hide();
            if ((window.StorageManager.data.talents.starting_jutsu || 0) >= 1) {
                if (window.LobbyView) window.LobbyView.openStartingJutsuSelection();
            } else {
                window.GameManager.startNewRun();
            }
        });

        document.getElementById('btnBackHome')?.addEventListener('click', () => {
            window.GameManager.backToLobby();
        });
    },

    show(game, earnedRyo) {
        if (!this.element) this.init();

        const totalSec = Math.floor(game.elapsedTime);
        const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const ss = String(totalSec % 60).padStart(2, '0');

        const rankTitle = window.getNinjaRankTitle(game.player.level);
        document.getElementById('statFinalRank').textContent = `${rankTitle} (Lv.${game.player.level})`;
        document.getElementById('statSurvivalTime').textContent = `${mm}:${ss}`;
        document.getElementById('statKillCount').textContent = game.kills;
        document.getElementById('statDiamonds').textContent = `+${game.diamonds} 💎`;

        const ryoEl = document.getElementById('statEarnedRyo');
        if (ryoEl) ryoEl.textContent = `+${(earnedRyo || 0).toLocaleString()} Ryo`;

        this.element.classList.remove('hidden');
    },

    hide() {
        if (this.element) this.element.classList.add('hidden');
    }
};

