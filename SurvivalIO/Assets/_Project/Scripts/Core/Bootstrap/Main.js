/* ============================================================================
   MODULE: src/Main.js
   Điểm Khởi Đầu (Entry Point) Toàn Bộ Hệ Thống Web Game Naruto Shinobi Survivor
   Khởi tạo Canvas, Module Core, Data, UI & Bắt Đầu Vòng Lặp GameLoop
   ============================================================================ */

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("[Shinobi Survivor Init Error]: Không tìm thấy phần tử #gameCanvas!");
        return;
    }

    // 1. Tự động điều chỉnh kích thước Canvas theo kích thước màn hình
    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 2. Nạp dữ liệu lưu trữ bền vững từ LocalStorage
    if (window.StorageManager) {
        window.StorageManager.load();
    }

    // 3. Khởi tạo bộ điều khiển người chơi (Bàn phím, Cảm ứng, Chuột kéo)
    if (window.PlayerController) {
        window.PlayerController.init(canvas);
    }

    // 4. Khởi tạo toàn bộ các Module Giao Diện (Modals & HUD) độc lập
    if (window.LobbyView) window.LobbyView.init();
    if (window.HUDView) window.HUDView.init();
    if (window.UpgradeModal) window.UpgradeModal.init();
    if (window.LevelUpModal) window.LevelUpModal.init();
    if (window.GameOverModal) window.GameOverModal.init();

    // 5. Khởi tạo GameManager trung tâm
    if (window.GameManager) {
        window.GameManager.init(canvas);
    }

    // 6. Đăng ký logic & render vào GameLoop 60fps chuẩn
    if (window.GameLoop) {
        window.GameLoop.onUpdate((dt) => {
            if (window.GameManager) {
                window.GameManager.update(dt);
            }
        });

        window.GameLoop.onRender(() => {
            if (window.GameManager) {
                window.GameManager.render();
            }
        });

        // Bắt đầu vòng lặp game
        window.GameLoop.start();
    }

    console.log("🍥 [Shinobi Survivor]: Khởi tạo thành công toàn bộ hệ thống module chuẩn SurvivorIO!");
});

