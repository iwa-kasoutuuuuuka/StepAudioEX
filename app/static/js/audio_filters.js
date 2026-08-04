/**
 * AudioFilterChain class for real-time Web Audio API filtering.
 * Connects an HTMLAudioElement through a chain of processing nodes:
 * HighPass -> LowPass -> Compressor -> EQ(Low) -> EQ(Mid) -> EQ(High) -> Destination
 */
class AudioFilterChain {
    /**
     * @param {HTMLAudioElement} audioElement - The audio element to process
     */
    constructor(audioElement) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.nodes = {};
        this.source = null;
        this.bypassed = false;
        this.currentPreset = 'raw';
        
        this._initNodes();
        if (audioElement) {
            this.connectAudioElement(audioElement);
        }
    }

    /**
     * Initialize all audio nodes with default values
     * @private
     */
    _initNodes() {
        // HighPass
        this.nodes.highPass = this.audioContext.createBiquadFilter();
        this.nodes.highPass.type = 'highpass';
        this.nodes.highPass.frequency.value = 80;
        this.nodes.highPass.Q.value = 0.7;

        // LowPass
        this.nodes.lowPass = this.audioContext.createBiquadFilter();
        this.nodes.lowPass.type = 'lowpass';
        this.nodes.lowPass.frequency.value = 16000;
        this.nodes.lowPass.Q.value = 0.7;

        // Compressor
        this.nodes.compressor = this.audioContext.createDynamicsCompressor();
        this.nodes.compressor.threshold.value = -24;
        this.nodes.compressor.knee.value = 30;
        this.nodes.compressor.ratio.value = 4;
        this.nodes.compressor.attack.value = 0.003;
        this.nodes.compressor.release.value = 0.25;

        // EQ Low
        this.nodes.eqLow = this.audioContext.createBiquadFilter();
        this.nodes.eqLow.type = 'lowshelf';
        this.nodes.eqLow.frequency.value = 320;
        this.nodes.eqLow.gain.value = 0;

        // EQ Mid
        this.nodes.eqMid = this.audioContext.createBiquadFilter();
        this.nodes.eqMid.type = 'peaking';
        this.nodes.eqMid.frequency.value = 2500;
        this.nodes.eqMid.Q.value = 1.0;
        this.nodes.eqMid.gain.value = 0;

        // EQ High
        this.nodes.eqHigh = this.audioContext.createBiquadFilter();
        this.nodes.eqHigh.type = 'highshelf';
        this.nodes.eqHigh.frequency.value = 6000;
        this.nodes.eqHigh.gain.value = 0;

        // Connect the chain
        this.nodes.highPass.connect(this.nodes.lowPass);
        this.nodes.lowPass.connect(this.nodes.compressor);
        this.nodes.compressor.connect(this.nodes.eqLow);
        this.nodes.eqLow.connect(this.nodes.eqMid);
        this.nodes.eqMid.connect(this.nodes.eqHigh);
        this.nodes.eqHigh.connect(this.audioContext.destination);
    }

    /**
     * Presets configuration
     */
    static get PRESETS() {
        return {
            'raw': {
                labels: { en: 'Raw / Bypass', ja: 'オリジナル / バイパス' },
                settings: {
                    highPass: { freq: 20 },
                    lowPass: { freq: 20000 },
                    compressor: { threshold: 0, ratio: 1 },
                    eqLow: { gain: 0 },
                    eqMid: { gain: 0 },
                    eqHigh: { gain: 0 }
                }
            },
            'podcast': {
                labels: { en: 'Podcast Studio', ja: 'ポッドキャストスタジオ' },
                settings: {
                    highPass: { freq: 120 },
                    lowPass: { freq: 14000 },
                    compressor: { threshold: -24, ratio: 4 },
                    eqLow: { gain: 0 },
                    eqMid: { gain: 3 },
                    eqHigh: { gain: 2 }
                }
            },
            'classroom': {
                labels: { en: 'Classroom / Lecture', ja: '教室 / 講義' },
                settings: {
                    highPass: { freq: 100 },
                    lowPass: { freq: 12000 },
                    compressor: { threshold: -24, ratio: 4 },
                    eqLow: { gain: 0 },
                    eqMid: { gain: 4 },
                    eqHigh: { gain: 1 }
                }
            },
            'conference': {
                labels: { en: 'Conference Call', ja: '会議通話' },
                settings: {
                    highPass: { freq: 150 },
                    lowPass: { freq: 10000 },
                    compressor: { threshold: -24, ratio: 6 },
                    eqLow: { gain: 0 },
                    eqMid: { gain: 5 },
                    eqHigh: { gain: 0 }
                }
            },
            'narration': {
                labels: { en: 'Narration / Audio Book', ja: 'ナレーション / オーディオブック' },
                settings: {
                    highPass: { freq: 80 },
                    lowPass: { freq: 16000 },
                    compressor: { threshold: -24, ratio: 3 },
                    eqLow: { gain: -2 },
                    eqMid: { gain: 3 },
                    eqHigh: { gain: 3 }
                }
            },
            'voiceover_pro': {
                labels: { en: 'Pro Voiceover', ja: 'プロフェッショナルボイスオーバー' },
                settings: {
                    highPass: { freq: 100 },
                    lowPass: { freq: 15000 },
                    compressor: { threshold: -24, ratio: 5 },
                    eqLow: { gain: -3 },
                    eqMid: { gain: 4 },
                    eqHigh: { gain: 4 }
                }
            }
        };
    }

    /**
     * Get available presets with localized labels
     * @param {string} lang - Language code (e.g., 'en', 'ja')
     * @returns {Array} Array of preset objects { id, label }
     */
    static getPresets(lang = 'en') {
        return Object.entries(AudioFilterChain.PRESETS).map(([id, preset]) => ({
            id,
            label: preset.labels[lang] || preset.labels['en']
        }));
    }

    /**
     * Apply a predefined configuration preset
     * @param {string} presetName - Name of the preset to apply
     */
    applyPreset(presetName) {
        const preset = AudioFilterChain.PRESETS[presetName];
        if (!preset) return;

        this.currentPreset = presetName;
        const s = preset.settings;

        if (s.highPass) this.setHighPassFreq(s.highPass.freq);
        if (s.lowPass) this.setLowPassFreq(s.lowPass.freq);
        if (s.compressor) this.setCompressor(s.compressor);
        if (s.eqLow) this.setEQ('low', s.eqLow);
        if (s.eqMid) this.setEQ('mid', s.eqMid);
        if (s.eqHigh) this.setEQ('high', s.eqHigh);
    }

    /**
     * Set HighPass filter frequency
     * @param {number} freq - Cutoff frequency in Hz
     */
    setHighPassFreq(freq) {
        if (freq !== undefined) this.nodes.highPass.frequency.value = freq;
    }

    /**
     * Set LowPass filter frequency
     * @param {number} freq - Cutoff frequency in Hz
     */
    setLowPassFreq(freq) {
        if (freq !== undefined) this.nodes.lowPass.frequency.value = freq;
    }

    /**
     * Update compressor parameters
     * @param {Object} params - Compressor parameters
     */
    setCompressor(params) {
        if (params.threshold !== undefined) this.nodes.compressor.threshold.value = params.threshold;
        if (params.knee !== undefined) this.nodes.compressor.knee.value = params.knee;
        if (params.ratio !== undefined) this.nodes.compressor.ratio.value = params.ratio;
        if (params.attack !== undefined) this.nodes.compressor.attack.value = params.attack;
        if (params.release !== undefined) this.nodes.compressor.release.value = params.release;
    }

    /**
     * Update EQ parameters for a specific band
     * @param {string} band - 'low', 'mid', or 'high'
     * @param {Object} params - EQ parameters {freq, gain, Q}
     */
    setEQ(band, params) {
        let node;
        switch(band) {
            case 'low': node = this.nodes.eqLow; break;
            case 'mid': node = this.nodes.eqMid; break;
            case 'high': node = this.nodes.eqHigh; break;
            default: return;
        }

        if (params.freq !== undefined) node.frequency.value = params.freq;
        if (params.gain !== undefined) node.gain.value = params.gain;
        if (params.Q !== undefined) node.Q.value = params.Q;
    }

    /**
     * Bypass or enable the filter chain
     * @param {boolean} enabled - True to bypass filters, false to enable
     */
    bypass(enabled) {
        this.bypassed = enabled;
        if (!this.source) return;

        this.source.disconnect();
        
        if (enabled) {
            this.source.connect(this.audioContext.destination);
        } else {
            this.source.connect(this.nodes.highPass);
        }
    }

    /**
     * Connect a new HTMLAudioElement to the filter chain
     * @param {HTMLAudioElement} audioElement 
     */
    connectAudioElement(audioElement) {
        if (this.source) {
            this.source.disconnect();
        }
        
        // AudioContext requires user interaction to resume in most browsers
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        try {
            this.source = this.audioContext.createMediaElementSource(audioElement);
            this.bypass(this.bypassed); // reconnects properly based on state
        } catch (e) {
            console.error("AudioFilterChain: Error connecting audio element", e);
        }
    }

    /**
     * Get the current state of all parameters
     * @returns {Object} Current state
     */
    getState() {
        return {
            preset: this.currentPreset,
            bypassed: this.bypassed,
            highPass: {
                freq: this.nodes.highPass.frequency.value,
                Q: this.nodes.highPass.Q.value
            },
            lowPass: {
                freq: this.nodes.lowPass.frequency.value,
                Q: this.nodes.lowPass.Q.value
            },
            compressor: {
                threshold: this.nodes.compressor.threshold.value,
                knee: this.nodes.compressor.knee.value,
                ratio: this.nodes.compressor.ratio.value,
                attack: this.nodes.compressor.attack.value,
                release: this.nodes.compressor.release.value
            },
            eqLow: {
                freq: this.nodes.eqLow.frequency.value,
                gain: this.nodes.eqLow.gain.value
            },
            eqMid: {
                freq: this.nodes.eqMid.frequency.value,
                Q: this.nodes.eqMid.Q.value,
                gain: this.nodes.eqMid.gain.value
            },
            eqHigh: {
                freq: this.nodes.eqHigh.frequency.value,
                gain: this.nodes.eqHigh.gain.value
            }
        };
    }

    /**
     * Cleanup nodes and context
     */
    destroy() {
        if (this.source) {
            this.source.disconnect();
        }
        
        // Disconnect all nodes
        Object.values(this.nodes).forEach(node => {
            try { node.disconnect(); } catch (e) {}
        });

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

window.AudioFilterChain = AudioFilterChain;
