/**
 * SpectrogramVisualizer
 * 
 * Renders a real-time scrolling spectrogram (time-frequency-amplitude heatmap)
 * on an HTML Canvas using the Web Audio API.
 * 
 * @class SpectrogramVisualizer
 */
class SpectrogramVisualizer {
    /**
     * @param {string} canvasId - The ID of the canvas element
     * @param {HTMLAudioElement} [audioElement] - The audio element to visualize
     */
    constructor(canvasId, audioElement = null) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id ${canvasId} not found`);
        }
        
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.audioElement = audioElement;
        
        // Audio setup
        this.audioCtx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.fftSize = 1024;
        
        // State
        this.isRunning = false;
        this.animationId = null;
        
        // Colors
        this.colormap = this._generateColorMap();
        
        // Offscreen canvas for scrolling
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
        
        // Resize handling
        this.resizeHandler = this._onResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
        
        this._initCanvas();
    }
    
    /**
     * Generates a 256-color gradient map for fast lookups.
     * @private
     * @returns {Uint8ClampedArray}
     */
    _generateColorMap() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 1;
        const tempCtx = tempCanvas.getContext('2d');
        
        const gradient = tempCtx.createLinearGradient(0, 0, 256, 0);
        // 0-40: dark deep blue (#0a0e1a -> #1a237e)
        gradient.addColorStop(0 / 255, '#0a0e1a');
        gradient.addColorStop(40 / 255, '#1a237e');
        // 40-100: blue to cyan (#1a237e -> #00f2fe)
        gradient.addColorStop(100 / 255, '#00f2fe');
        // 100-160: cyan to yellow (#00f2fe -> #f59e0b)
        gradient.addColorStop(160 / 255, '#f59e0b');
        // 160-220: yellow to orange/red (#f59e0b -> #ef4444)
        gradient.addColorStop(220 / 255, '#ef4444');
        // 220-255: red to white (#ef4444 -> #ffffff)
        gradient.addColorStop(255 / 255, '#ffffff');
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, 256, 1);
        
        return tempCtx.getImageData(0, 0, 256, 1).data;
    }

    /**
     * Initializes canvas dimensions and scaling.
     * @private
     */
    _initCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
        
        // Sync offscreen canvas
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        
        this.reset();
    }
    
    /**
     * Handles window resize.
     * @private
     */
    _onResize() {
        this._initCanvas();
    }

    /**
     * Connects a new audio element to the visualizer.
     * @param {HTMLAudioElement} audioElement 
     */
    connectAudioElement(audioElement) {
        if (!audioElement) return;
        
        this.audioElement = audioElement;
        if (this.audioCtx) {
            if (this.sourceNode) {
                this.sourceNode.disconnect();
            }
            this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        }
    }

    /**
     * Starts the audio context, analyser, and rendering loop.
     */
    start() {
        if (!this.audioElement) {
            console.warn('No audio element connected');
            return;
        }

        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            
            this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        }

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        this.isRunning = true;
        this.animationId = requestAnimationFrame(() => this._render());
    }

    /**
     * Stops rendering and suspends context.
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Sets the FFT size for the analyser.
     * @param {number} size - 256, 512, 1024, or 2048
     */
    setFFTSize(size) {
        if ([256, 512, 1024, 2048, 4096, 8192, 16384].includes(size)) {
            this.fftSize = size;
            if (this.analyser) {
                this.analyser.fftSize = size;
            }
        }
    }

    /**
     * Resets the canvas.
     */
    reset() {
        this.offscreenCtx.fillStyle = '#0a0e1a';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Gets the frequency at a specific canvas Y coordinate.
     * @param {number} y - The Y coordinate (css pixels)
     * @returns {number} The corresponding frequency in Hz
     */
    getFrequencyAtY(y) {
        if (!this.audioCtx) return 0;
        const nyquist = this.audioCtx.sampleRate / 2;
        // Y=0 is top (nyquist), Y=height is bottom (0Hz)
        const percent = 1.0 - (y / this.height);
        return percent * nyquist;
    }

    /**
     * Main render loop
     * @private
     */
    _render() {
        if (!this.isRunning) return;
        this.animationId = requestAnimationFrame(() => this._render());

        if (this.audioElement.paused) {
            // Freeze display
            this._drawOverlays();
            return;
        }

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        const dpr = window.devicePixelRatio || 1;
        const drawWidth = this.canvas.width;
        const drawHeight = this.canvas.height;
        const sliceWidth = Math.max(1, Math.floor(1 * dpr));

        // Shift existing image left
        this.offscreenCtx.drawImage(
            this.offscreenCanvas,
            sliceWidth, 0, drawWidth - sliceWidth, drawHeight,
            0, 0, drawWidth - sliceWidth, drawHeight
        );

        // Draw new slice on the right
        const sliceImageData = this.offscreenCtx.createImageData(sliceWidth, drawHeight);
        
        for (let y = 0; y < drawHeight; y++) {
            // Map Y (bottom to top) to frequency bin
            const percent = 1.0 - (y / drawHeight);
            const bin = Math.floor(percent * bufferLength);
            
            // Linear interpolation for smoother rendering if needed, here just nearest neighbor
            const value = dataArray[Math.min(bin, bufferLength - 1)];
            
            // Look up color
            const colorIdx = value * 4;
            const r = this.colormap[colorIdx];
            const g = this.colormap[colorIdx + 1];
            const b = this.colormap[colorIdx + 2];
            
            for (let x = 0; x < sliceWidth; x++) {
                const pixelIdx = (y * sliceWidth + x) * 4;
                sliceImageData.data[pixelIdx] = r;
                sliceImageData.data[pixelIdx + 1] = g;
                sliceImageData.data[pixelIdx + 2] = b;
                sliceImageData.data[pixelIdx + 3] = 255;
            }
        }

        this.offscreenCtx.putImageData(sliceImageData, drawWidth - sliceWidth, 0);

        // Draw offscreen to main canvas
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0, drawWidth, drawHeight, 0, 0, this.width, this.height);
        this.ctx.restore();

        this._drawOverlays();
    }

    /**
     * Draws axis labels and time info over the spectrogram.
     * @private
     */
    _drawOverlays() {
        const nyquist = this.audioCtx ? this.audioCtx.sampleRate / 2 : 22050;
        
        this.ctx.save();
        
        // Right axis background
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.7)';
        this.ctx.fillRect(this.width - 50, 0, 50, this.height);
        
        // Bottom axis background
        this.ctx.fillRect(0, this.height - 24, this.width, 24);
        
        // Draw Frequency Labels
        this.ctx.fillStyle = '#00f2fe';
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        
        const freqs = [100, 500, 1000, 2000, 5000, 10000, 20000];
        freqs.forEach(f => {
            if (f > nyquist) return;
            const y = this.height - (f / nyquist) * this.height;
            const label = f >= 1000 ? `${f / 1000}k` : `${f}`;
            this.ctx.fillText(label, this.width - 5, y);
            
            // tick mark
            this.ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
            this.ctx.fillRect(this.width - 50, y, 5, 1);
            this.ctx.fillStyle = '#00f2fe';
        });
        
        // Draw Time Info
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'bottom';
        let timeStr = "0:00";
        if (this.audioElement) {
            const t = this.audioElement.currentTime;
            const mins = Math.floor(t / 60);
            const secs = Math.floor(t % 60).toString().padStart(2, '0');
            const ms = Math.floor((t % 1) * 10).toString();
            timeStr = `${mins}:${secs}.${ms}`;
        }
        this.ctx.fillText(`Time: ${timeStr}`, 5, this.height - 5);
        
        this.ctx.restore();
    }

    /**
     * Cleans up resources.
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeHandler);
        if (this.sourceNode) {
            this.sourceNode.disconnect();
        }
        if (this.analyser) {
            this.analyser.disconnect();
        }
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            this.audioCtx.close();
        }
    }
}

// Export for global usage
window.SpectrogramVisualizer = SpectrogramVisualizer;
