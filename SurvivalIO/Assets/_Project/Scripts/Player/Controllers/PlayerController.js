/* ============================================================================
   MODULE: src/Player/PlayerController.js
   Điều Khiển Người Chơi: Phím W A S D / Phím Mũi Tên & Kéo Thả Chuột / Cảm Ứng (Virtual Joystick)
   ============================================================================ */

window.PlayerController = {
    keys: {},
    pointerInput: {
        active: false,
        startX: 0,
        startY: 0,
        currX: 0,
        currY: 0
    },
    initialized: false,

    init(canvas) {
        if (this.initialized) return;
        this.initialized = true;

        // Bàn phím
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Chuột & Cảm ứng kéo thả (Virtual Joystick)
        const onPointerDown = (clientX, clientY) => {
            // Không nhận input khi bấm vào các nút UI / modal
            this.pointerInput.active = true;
            this.pointerInput.startX = clientX;
            this.pointerInput.startY = clientY;
            this.pointerInput.currX = clientX;
            this.pointerInput.currY = clientY;
        };

        const onPointerMove = (clientX, clientY) => {
            if (!this.pointerInput.active) return;
            this.pointerInput.currX = clientX;
            this.pointerInput.currY = clientY;
        };

        const onPointerUp = () => {
            this.pointerInput.active = false;
        };

        if (canvas) {
            canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', onPointerUp);

            canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            window.addEventListener('touchend', onPointerUp);
            window.addEventListener('touchcancel', onPointerUp);
        }
    },

    // Cập nhật di chuyển cho nhân vật
    update(dt, player) {
        if (!player) return;

        let mx = 0, my = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) my -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) my += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) mx += 1;

        // Kéo chuột / Cảm ứng ảo
        if (this.pointerInput.active) {
            const dx = this.pointerInput.currX - this.pointerInput.startX;
            const dy = this.pointerInput.currY - this.pointerInput.startY;
            const dist = Math.hypot(dx, dy);
            if (dist > 10) {
                mx = dx / dist;
                my = dy / dist;
            }
        }

        // Chuẩn hóa vector và di chuyển
        if (mx !== 0 || my !== 0) {
            const len = Math.hypot(mx, my);
            mx /= len;
            my /= len;
            player.x += mx * player.speed * dt;
            player.y += my * player.speed * dt;
            if (mx !== 0) player.facing = mx >= 0 ? 1 : -1;
        }
    },

    // Vẽ Joystick ảo
    renderJoystick(ctx) {
        if (!this.pointerInput.active) return;

        ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.pointerInput.startX, this.pointerInput.startY, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
        ctx.beginPath();
        ctx.arc(this.pointerInput.currX, this.pointerInput.currY, 18, 0, Math.PI * 2);
        ctx.fill();
    }
};

