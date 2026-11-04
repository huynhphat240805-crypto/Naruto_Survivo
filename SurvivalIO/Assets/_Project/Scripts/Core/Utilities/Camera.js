/* ============================================================================
   MODULE: src/Core/Camera.js
   Hệ thống Camera 2D mượt mà bám theo tâm nhân vật & Hiệu ứng Rung lắc (Screen Shake)
   Chuẩn kiến trúc SurvivorIO Camera System
   ============================================================================ */

window.Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    shakeTime: 0,
    shakeIntensity: 0,
    shakeOffsetX: 0,
    shakeOffsetY: 0,
    smoothSpeed: 10,
    shakeEnabled: true,

    // Đặt vị trí tức thì
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    },

    // Kích hoạt hiệu ứng rung màn hình
    shake(duration = 0.25, intensity = 8) {
        if (!this.shakeEnabled) return;
        this.shakeTime = Math.max(this.shakeTime, duration);
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    },

    // Cập nhật bám theo đối tượng và tính độ rung
    update(dt, targetX, targetY, viewportWidth = 800, viewportHeight = 600) {
        const vw = Number(viewportWidth) || (typeof window !== 'undefined' ? window.innerWidth : 800) || 800;
        const vh = Number(viewportHeight) || (typeof window !== 'undefined' ? window.innerHeight : 600) || 600;

        // Cập nhật tọa độ mục tiêu (tâm nhân vật nằm giữa viewport)
        if (targetX !== undefined && targetY !== undefined) {
            this.targetX = targetX - vw / 2;
            this.targetY = targetY - vh / 2;

            // Bám mượt bằng thuật toán Exponential Smoothing (Lerp-like)
            const factor = Math.min(1, this.smoothSpeed * dt);
            this.x += (this.targetX - this.x) * factor;
            this.y += (this.targetY - this.y) * factor;
        }

        // Cập nhật rung màn hình
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            const currentIntensity = this.shakeIntensity * (this.shakeTime / 0.3);
            this.shakeOffsetX = (Math.random() - 0.5) * currentIntensity;
            this.shakeOffsetY = (Math.random() - 0.5) * currentIntensity;
            if (this.shakeTime <= 0) {
                this.shakeTime = 0;
                this.shakeIntensity = 0;
                this.shakeOffsetX = 0;
                this.shakeOffsetY = 0;
            }
        } else {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    },

    // Lấy tọa độ render có tính rung
    getRenderX() {
        return this.x + this.shakeOffsetX;
    },

    getRenderY() {
        return this.y + this.shakeOffsetY;
    },

    // Chuyển đổi tọa độ thế giới (World) sang tọa độ màn hình (Screen)
    worldToScreen(wx, wy) {
        return {
            x: wx - this.getRenderX(),
            y: wy - this.getRenderY()
        };
    },

    // Chuyển đổi tọa độ màn hình (Screen) sang thế giới (World)
    screenToWorld(sx, sy) {
        return {
            x: sx + this.getRenderX(),
            y: sy + this.getRenderY()
        };
    }
};
