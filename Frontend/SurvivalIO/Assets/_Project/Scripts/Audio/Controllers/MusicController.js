/* ============================================================================
   MODULE: src/Audio/MusicController.js
   Nhạc Nền Thảo Nguyên Làng Lá & Nhạc Hồi Hộp Kịch Tính Khi Boss Xuất Hiện
   Tổng hợp hoàn toàn bằng Web Audio API - Hoạt động độc lập, không cần tải file ngoài
   ============================================================================ */

window.MusicController = {
    isPlaying: false,
    timer: null,
    step: 0,
    isBossPhase: false,

    // Giai điệu ngũ cung phong cách Làng Lá (D, F, G, A, C - Naruto Insen Scale)
    melodyPeace: [293.66, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23],
    melodyBoss: [146.83, 155.56, 174.61, 146.83, 130.81, 146.83, 174.61, 196.00],

    startBGM() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.isBossPhase = false;
        this.step = 0;
        this._scheduleNote();
    },

    stopBGM() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    },

    setBossPhase(active) {
        this.isBossPhase = !!active;
    },

    _scheduleNote() {
        if (!this.isPlaying) return;

        const sfx = window.SFXController;
        if (sfx && !sfx.muted && sfx.ctx) {
            const scale = this.isBossPhase ? this.melodyBoss : this.melodyPeace;
            const freq = scale[this.step % scale.length];
            const type = this.isBossPhase ? 'sawtooth' : 'triangle';
            const duration = this.isBossPhase ? 0.22 : 0.45;
            const vol = this.isBossPhase ? 0.045 : 0.03;

            try {
                const osc = sfx.ctx.createOscillator();
                const gain = sfx.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, sfx.ctx.currentTime);
                gain.gain.setValueAtTime(vol, sfx.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, sfx.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(sfx.ctx.destination);
                osc.start();
                osc.stop(sfx.ctx.currentTime + duration);
            } catch (e) {}
        }

        this.step++;
        const interval = this.isBossPhase ? 260 : 420;
        this.timer = setTimeout(() => this._scheduleNote(), interval);
    }
};

