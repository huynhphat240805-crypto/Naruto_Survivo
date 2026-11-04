/* ============================================================================
   MODULE: src/Core/GameLoop.js
   Vòng lặp RequestAnimationFrame 60fps, tính toán delta time dt mượt mà
   Mô phỏng kiến trúc Unity / SurvivorIO GameLoop Core
   ============================================================================ */

window.GameLoop = {
    running: false,
    paused: false,
    lastFrameTime: 0,
    maxDeltaTime: 0.05, // Giới hạn dt tối đa 50ms để chống nhảy vị trí khi lag/tab out
    updateCallbacks: [],
    renderCallbacks: [],
    animationFrameId: null,

    // Đăng ký hàm cập nhật logic theo dt
    onUpdate(callback) {
        if (typeof callback === 'function') {
            this.updateCallbacks.push(callback);
        }
    },

    // Đăng ký hàm vẽ đồ họa mỗi frame
    onRender(callback) {
        if (typeof callback === 'function') {
            this.renderCallbacks.push(callback);
        }
    },

    // Khởi động vòng lặp game
    start() {
        if (this.running) return;
        this.running = true;
        this.paused = false;
        this.lastFrameTime = performance.now();
        this._loop = this._loop.bind(this);
        this.animationFrameId = requestAnimationFrame(this._loop);
    },

    // Dừng vòng lặp hoàn toàn
    stop() {
        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },

    // Tạm dừng logic (nhưng vẫn có thể render)
    pause() {
        this.paused = true;
    },

    // Tiếp tục logic sau khi pause
    resume() {
        this.paused = false;
        this.lastFrameTime = performance.now();
    },

    // Hàm vòng lặp nội bộ
    _loop(timestamp) {
        if (!this.running) return;

        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        let dt = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;

        // Giới hạn dt tránh hiện tượng xuyên tường (tunneling) khi lag
        if (dt > this.maxDeltaTime) {
            dt = this.maxDeltaTime;
        }

        // 1. Chạy tất cả logic cập nhật nếu không pause
        if (!this.paused) {
            for (let i = 0; i < this.updateCallbacks.length; i++) {
                try {
                    this.updateCallbacks[i](dt);
                } catch (err) {
                    console.error("[GameLoop Update Error]:", err);
                }
            }
        }

        // 2. Chạy tất cả callback render đồ họa
        for (let i = 0; i < this.renderCallbacks.length; i++) {
            try {
                this.renderCallbacks[i]();
            } catch (err) {
                console.error("[GameLoop Render Error]:", err);
            }
        }

        this.animationFrameId = requestAnimationFrame(this._loop);
    }
};

