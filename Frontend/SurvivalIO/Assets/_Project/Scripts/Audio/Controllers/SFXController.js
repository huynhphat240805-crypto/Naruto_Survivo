/* ============================================================================
   MODULE: src/Audio/SFXController.js
   Âm thanh Hiệu ứng Web Audio API: phi tiêu, Rasengan xoáy, Chidori, nổ, búa đập...
   ============================================================================ */

window.SFXController = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    },

    setMuted(m) {
        this.muted = !!m;
    },

    playTone(freq, type, duration, vol = 0.08, slideFreq = null) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            if (slideFreq) {
                osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
            }
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    },

    uiClick() {
        this.playTone(880, 'sine', 0.04, 0.05, 1200);
    },

    uiSelect() {
        this.playTone(520, 'triangle', 0.07, 0.06, 780);
    },

    uiOpen() {
        this.playTone(440, 'sine', 0.07, 0.05, 660);
        setTimeout(() => this.playTone(660, 'triangle', 0.09, 0.06, 880), 60);
    },

    summonReveal() {
        this.playTone(330, 'sawtooth', 0.2, 0.1, 550);
        setTimeout(() => this.playTone(550, 'sawtooth', 0.25, 0.12, 880), 120);
        setTimeout(() => this.playTone(880, 'sine', 0.45, 0.15, 1100), 280);
    },

    shuriken() {
        this.playTone(720, 'triangle', 0.09, 0.05, 220);
    },

    fireball() {
        this.playTone(160, 'sawtooth', 0.35, 0.12, 42);
    },

    chidori() {
        this.playTone(980, 'sawtooth', 0.16, 0.07, 420);
    },

    rasengan() {
        this.playTone(320, 'sine', 0.22, 0.09, 640);
    },

    orbPickup() {
        this.playTone(580, 'sine', 0.08, 0.05, 880);
    },

    levelUp() {
        this.playTone(440, 'triangle', 0.15, 0.12, 554);
        setTimeout(() => this.playTone(554, 'triangle', 0.15, 0.12, 659), 120);
        setTimeout(() => this.playTone(659, 'triangle', 0.30, 0.14, 880), 240);
    },

    bossSpawn() {
        this.playTone(140, 'sawtooth', 0.6, 0.16, 75);
        setTimeout(() => this.playTone(110, 'sawtooth', 0.7, 0.16, 55), 320);
    },

    reroll() {
        this.playTone(600, 'triangle', 0.08, 0.08, 900);
        setTimeout(() => this.playTone(850, 'triangle', 0.1, 0.09, 1200), 70);
    },

    ban() {
        this.playTone(280, 'sawtooth', 0.18, 0.1, 140);
        setTimeout(() => this.playTone(140, 'sine', 0.25, 0.12, 70), 80);
    },

    crit() {
        this.playTone(1100, 'sine', 0.08, 0.09, 1400);
    },

    talentUpgrade() {
        this.playTone(523.25, 'sine', 0.12, 0.09, 659.25);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.14, 0.1, 783.99), 90);
        setTimeout(() => this.playTone(1046.50, 'sine', 0.25, 0.12, 1318.51), 190);
    }
};

// Alias cho tương thích ngược SoundFX
window.SoundFX = window.SFXController;

