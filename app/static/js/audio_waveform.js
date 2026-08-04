/**
 * WaveformVisualizer
 * Provides interactive audio waveform bar display with playback scrub line.
 * Supports mode switching between 'waveform' and 'spectrogram' views.
 */
class WaveformVisualizer {
    /**
     * @param {string} canvasId - The ID of the canvas element for waveform
     * @param {string} audioPlayerId - The ID of the audio player element
     */
    constructor(canvasId, audioPlayerId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.audioPlayer = document.getElementById(audioPlayerId);
        this.audioBuffer = null;
        this.peaks = [];
        this.selection = { start: 0, end: 0 };
        this.isSelecting = false;

        /** @type {'waveform' | 'spectrogram'} */
        this.currentMode = 'waveform';

        /** @type {SpectrogramVisualizer|null} */
        this.spectrogramVisualizer = null;

        /** @type {string|null} */
        this.spectrogramCanvasId = null;

        this.initResize();
        this.bindEvents();
    }

    /**
     * Set the spectrogram canvas ID and lazily create the SpectrogramVisualizer.
     * @param {string} canvasId - The ID of the spectrogram canvas element
     */
    setSpectrogramCanvas(canvasId) {
        this.spectrogramCanvasId = canvasId;
    }

    /**
     * Switch between 'waveform' and 'spectrogram' display modes.
     * @param {'waveform' | 'spectrogram'} mode
     */
    setMode(mode) {
        this.currentMode = mode;

        const waveformCanvas = this.canvas;
        const spectrogramCanvas = this.spectrogramCanvasId
            ? document.getElementById(this.spectrogramCanvasId)
            : null;

        if (mode === 'spectrogram') {
            // Show spectrogram, hide waveform
            if (waveformCanvas) waveformCanvas.style.display = 'none';
            if (spectrogramCanvas) spectrogramCanvas.style.display = 'block';

            // Lazily create spectrogram visualizer
            if (!this.spectrogramVisualizer && this.spectrogramCanvasId && window.SpectrogramVisualizer) {
                this.spectrogramVisualizer = new SpectrogramVisualizer(
                    this.spectrogramCanvasId,
                    this.audioPlayer
                );
            }

            if (this.spectrogramVisualizer) {
                this.spectrogramVisualizer.connectAudioElement(this.audioPlayer);
                this.spectrogramVisualizer.start();
            }
        } else {
            // Show waveform, hide spectrogram
            if (waveformCanvas) waveformCanvas.style.display = 'block';
            if (spectrogramCanvas) spectrogramCanvas.style.display = 'none';

            if (this.spectrogramVisualizer) {
                this.spectrogramVisualizer.stop();
            }
            this.draw();
        }
    }

    initResize() {
        const resize = () => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.draw();
        };
        window.addEventListener('resize', resize);
        resize();
    }

    async loadAudio(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            this.computePeaks();
            this.draw();

            // Also reload in spectrogram if active
            if (this.spectrogramVisualizer && this.currentMode === 'spectrogram') {
                this.spectrogramVisualizer.reset();
                this.spectrogramVisualizer.connectAudioElement(this.audioPlayer);
                this.spectrogramVisualizer.start();
            }
        } catch (e) {
            console.error("Waveform load error:", e);
        }
    }

    computePeaks() {
        if (!this.audioBuffer) return;
        const channelData = this.audioBuffer.getChannelData(0);
        const samples = 300;
        const blockSize = Math.floor(channelData.length / samples);
        this.peaks = [];

        for (let i = 0; i < samples; i++) {
            let start = i * blockSize;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(channelData[start + j] || 0);
            }
            this.peaks.push(sum / blockSize);
        }
    }

    draw() {
        if (!this.canvas || !this.ctx) return;
        if (this.currentMode !== 'waveform') return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        // Draw background grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        if (!this.peaks.length) {
            // Placeholder flatline
            ctx.strokeStyle = "rgba(0, 242, 254, 0.3)";
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
            return;
        }

        // Draw waveform bars
        const barWidth = w / this.peaks.length;
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#00f2fe');
        gradient.addColorStop(1, '#4facfe');

        for (let i = 0; i < this.peaks.length; i++) {
            const x = i * barWidth;
            const barHeight = Math.max(4, this.peaks[i] * h * 1.6);
            const y = (h - barHeight) / 2;

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth * 0.7, barHeight);
        }

        // Draw playback scrub line
        if (this.audioPlayer && this.audioPlayer.duration) {
            const progress = this.audioPlayer.currentTime / this.audioPlayer.duration;
            const scrubX = progress * w;

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2 * window.devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(scrubX, 0);
            ctx.lineTo(scrubX, h);
            ctx.stroke();

            // Glow line
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
            ctx.lineWidth = 6 * window.devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(scrubX, 0);
            ctx.lineTo(scrubX, h);
            ctx.stroke();
        }

        requestAnimationFrame(() => this.draw());
    }

    bindEvents() {
        if (!this.canvas) return;

        this.canvas.addEventListener('click', (e) => {
            if (!this.audioPlayer || !this.audioPlayer.duration) return;
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            this.audioPlayer.currentTime = pct * this.audioPlayer.duration;
        });
    }
}

window.WaveformVisualizer = WaveformVisualizer;
