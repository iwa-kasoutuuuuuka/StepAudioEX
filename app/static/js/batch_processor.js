/**
 * BatchProcessor for StepAudioEX Studio
 * Handles drag-and-drop, queuing, and processing of multiple files for TTS and audio enhancement.
 */
class BatchProcessor {
    /**
     * @param {string} dropZoneId - ID of the drop zone element
     * @param {string} listContainerId - ID of the container for the file list
     * @param {Object} options - Configuration options
     * @param {number} [options.maxConcurrent=3] - Maximum number of concurrent processing tasks
     * @param {string} [options.voiceId=''] - Selected voice ID for TTS
     * @param {number} [options.pitch=1.0] - Pitch multiplier for TTS
     * @param {number} [options.rate=1.0] - Speech rate multiplier for TTS
     * @param {string} [options.emotion='neutral'] - Emotion for TTS
     * @param {boolean} [options.clarityBoost=false] - Apply Corporate Clarity Boost
     */
    constructor(dropZoneId, listContainerId, options = {}) {
        this.dropZone = document.getElementById(dropZoneId);
        this.listContainer = document.getElementById(listContainerId);
        
        this.options = {
            maxConcurrent: 3,
            voiceId: '',
            pitch: 1.0,
            rate: 1.0,
            emotion: 'neutral',
            clarityBoost: false,
            ...options
        };

        this.queue = [];
        this.processingCount = 0;
        
        this._initUI();
        this._bindEvents();
    }

    /**
     * Initialize UI elements and styles
     * @private
     */
    _initUI() {
        if (!this.dropZone || !this.listContainer) return;

        // Ensure the list container has some basic styles if not already set
        this.listContainer.style.display = 'flex';
        this.listContainer.style.flexDirection = 'column';
        this.listContainer.style.gap = '10px';
        this.listContainer.style.maxHeight = '400px';
        this.listContainer.style.overflowY = 'auto';
        this.listContainer.style.padding = '10px';

        // Hidden file input for fallback
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = true;
        this.fileInput.style.display = 'none';
        this.fileInput.accept = '.wav,.mp3,.ogg,.flac,.m4a,.txt,.md,.srt,.vtt,.csv';
        this.dropZone.appendChild(this.fileInput);
    }

    /**
     * Bind drag and drop events
     * @private
     */
    _bindEvents() {
        if (!this.dropZone) return;

        // Drop zone events
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.style.border = '2px solid var(--primary, #00f2fe)';
            this.dropZone.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.3)';
        });

        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropZone.style.border = '';
            this.dropZone.style.boxShadow = '';
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.style.border = '';
            this.dropZone.style.boxShadow = '';
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.addFiles(Array.from(e.dataTransfer.files));
            }
        });

        // Click to open file dialog
        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                this.addFiles(Array.from(e.target.files));
                this.fileInput.value = ''; // Reset
            }
        });
    }

    /**
     * Add files to the processing queue
     * @param {File[]} fileList - Array of File objects
     */
    addFiles(fileList) {
        const allowedExtensions = ['wav', 'mp3', 'ogg', 'flac', 'm4a', 'txt', 'md', 'srt', 'vtt', 'csv'];
        
        fileList.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes(ext)) {
                const isAudio = ['wav', 'mp3', 'ogg', 'flac', 'm4a'].includes(ext);
                const fileItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    file: file,
                    name: file.name,
                    size: this._formatSize(file.size),
                    type: isAudio ? 'audio' : 'text',
                    status: 'queued', // 'queued' | 'processing' | 'complete' | 'error'
                    audio_url: null,
                    error_msg: null
                };
                
                this.queue.push(fileItem);
                
                this._emitEvent('batch-file-added', { file: fileItem });
            }
        });

        this.renderFileList();
        this.processQueue();
    }

    /**
     * Process the queue, respecting concurrency limits
     */
    processQueue() {
        if (this.processingCount >= this.options.maxConcurrent) return;

        const nextFiles = this.queue.filter(item => item.status === 'queued');
        if (nextFiles.length === 0) return;

        const filesToProcess = nextFiles.slice(0, this.options.maxConcurrent - this.processingCount);
        
        filesToProcess.forEach(item => {
            this._processFile(item);
        });
    }

    /**
     * Process a single file
     * @param {Object} item - Queue item
     * @private
     */
    async _processFile(item) {
        item.status = 'processing';
        this.processingCount++;
        this.renderFileList();

        try {
            if (item.type === 'text') {
                await this._processTextFile(item);
            } else {
                await this._processAudioFile(item);
            }
            item.status = 'complete';
            this._emitEvent('batch-complete', { file: item });
        } catch (error) {
            item.status = 'error';
            item.error_msg = error.message;
            this._emitEvent('batch-error', { file: item, error: error.message });
        } finally {
            this.processingCount--;
            this.renderFileList();
            this.processQueue();
        }
    }

    /**
     * Process a text file for TTS
     * @param {Object} item 
     * @private
     */
    async _processTextFile(item) {
        const textContent = await item.file.text();
        
        const payload = {
            text: textContent,
            voiceId: this.options.voiceId,
            pitch: this.options.pitch,
            rate: this.options.rate,
            emotion: this.options.emotion
        };

        // Mocking API call for TTS
        const response = await fetch('/api/tts/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('TTS Generation failed');
        
        const data = await response.json();
        item.audio_url = data.audio_url || URL.createObjectURL(new Blob(['mock audio data'], { type: 'audio/wav' })); // Mock fallback
    }

    /**
     * Process an audio file for enhancement
     * @param {Object} item 
     * @private
     */
    async _processAudioFile(item) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('action', 'enhance');
        if (this.options.clarityBoost) {
             formData.append('clarityBoost', 'true');
        }

        // Mocking API call for Audio Edit
        const response = await fetch('/api/editx/edit', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Audio enhancement failed');
        
        const data = await response.json();
        item.audio_url = data.audio_url || URL.createObjectURL(item.file); // Mock fallback
    }

    /**
     * Render the list of files in the queue
     */
    renderFileList() {
        if (!this.listContainer) return;
        
        this.listContainer.innerHTML = '';
        
        this.queue.forEach(item => {
            const el = document.createElement('div');
            el.className = 'batch-item';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.padding = '12px 16px';
            el.style.background = 'var(--bg-card, rgba(30, 41, 59, 0.7))';
            el.style.borderRadius = '8px';
            el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            el.style.backdropFilter = 'blur(10px)';
            el.style.color = '#fff';
            el.style.fontFamily = 'system-ui, -apple-system, sans-serif';

            // Icon
            const icon = document.createElement('span');
            icon.style.marginRight = '12px';
            icon.style.fontSize = '1.2em';
            icon.innerHTML = item.type === 'audio' ? '🎵' : '📄';
            el.appendChild(icon);

            // Info Container
            const info = document.createElement('div');
            info.style.flex = '1';
            info.style.overflow = 'hidden';
            
            const name = document.createElement('div');
            name.textContent = item.name;
            name.style.fontWeight = '500';
            name.style.whiteSpace = 'nowrap';
            name.style.overflow = 'hidden';
            name.style.textOverflow = 'ellipsis';
            
            const size = document.createElement('div');
            size.textContent = item.size;
            size.style.fontSize = '0.8em';
            size.style.color = 'rgba(255, 255, 255, 0.6)';
            
            info.appendChild(name);
            info.appendChild(size);
            el.appendChild(info);

            // Status Badge
            const statusBadge = document.createElement('div');
            statusBadge.textContent = item.status;
            statusBadge.style.padding = '4px 8px';
            statusBadge.style.borderRadius = '12px';
            statusBadge.style.fontSize = '0.75em';
            statusBadge.style.fontWeight = '600';
            statusBadge.style.textTransform = 'uppercase';
            statusBadge.style.marginLeft = '12px';

            switch(item.status) {
                case 'queued':
                    statusBadge.style.background = 'rgba(255, 255, 255, 0.1)';
                    statusBadge.style.color = '#aaa';
                    break;
                case 'processing':
                    statusBadge.style.background = 'rgba(0, 242, 254, 0.2)';
                    statusBadge.style.color = 'var(--primary, #00f2fe)';
                    statusBadge.style.animation = 'pulse 1.5s infinite';
                    break;
                case 'complete':
                    statusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
                    statusBadge.style.color = '#10b981';
                    break;
                case 'error':
                    statusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
                    statusBadge.style.color = '#ef4444';
                    statusBadge.title = item.error_msg;
                    break;
            }
            el.appendChild(statusBadge);

            // Actions for complete files
            if (item.status === 'complete' && item.audio_url) {
                const actions = document.createElement('div');
                actions.style.display = 'flex';
                actions.style.gap = '8px';
                actions.style.marginLeft = '16px';

                // Play Button
                const playBtn = document.createElement('button');
                playBtn.innerHTML = '▶';
                playBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                playBtn.style.border = 'none';
                playBtn.style.color = '#fff';
                playBtn.style.borderRadius = '50%';
                playBtn.style.width = '32px';
                playBtn.style.height = '32px';
                playBtn.style.cursor = 'pointer';
                playBtn.style.display = 'flex';
                playBtn.style.alignItems = 'center';
                playBtn.style.justifyContent = 'center';
                
                playBtn.onclick = (e) => {
                    e.stopPropagation();
                    const audio = new Audio(item.audio_url);
                    audio.play();
                };
                
                // Download Button
                const dlBtn = document.createElement('button');
                dlBtn.innerHTML = '⬇';
                dlBtn.style.background = 'var(--primary, #00f2fe)';
                dlBtn.style.border = 'none';
                dlBtn.style.color = '#000';
                dlBtn.style.borderRadius = '50%';
                dlBtn.style.width = '32px';
                dlBtn.style.height = '32px';
                dlBtn.style.cursor = 'pointer';
                dlBtn.style.display = 'flex';
                dlBtn.style.alignItems = 'center';
                dlBtn.style.justifyContent = 'center';
                
                dlBtn.onclick = (e) => {
                    e.stopPropagation();
                    const a = document.createElement('a');
                    a.href = item.audio_url;
                    a.download = `processed_${item.name.split('.')[0]}.wav`;
                    a.click();
                };

                actions.appendChild(playBtn);
                actions.appendChild(dlBtn);
                el.appendChild(actions);
            }

            this.listContainer.appendChild(el);
        });

        // Add keyframes for pulse animation if not exists
        if (!document.getElementById('batch-processor-styles')) {
            const style = document.createElement('style');
            style.id = 'batch-processor-styles';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .batch-item:hover {
                    background: rgba(40, 51, 69, 0.9) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Download all completed files as a ZIP archive
     */
    async downloadAllAsZip() {
        const completedFiles = this.queue.filter(item => item.status === 'complete');
        if (completedFiles.length === 0) return;

        const fileNames = completedFiles.map(item => `processed_${item.name.split('.')[0]}.wav`); // Assuming server has them
        
        try {
            const response = await fetch('/api/batch/download-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: fileNames })
            });

            if (!response.ok) throw new Error('ZIP generation failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'batch_processing_results.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Download All failed:', error);
            alert('Failed to download batch ZIP: ' + error.message);
        }
    }

    /**
     * Clear all items from the queue
     */
    clearAll() {
        this.queue = [];
        this.renderFileList();
    }

    /**
     * Cancel ongoing processing (rudimentary implementation)
     */
    cancelAll() {
        // In a real scenario with fetch, we'd need AbortControllers.
        // For now, we'll mark queued as 'error' or just remove them.
        this.queue.forEach(item => {
            if (item.status === 'queued') {
                item.status = 'error';
                item.error_msg = 'Cancelled';
            }
        });
        this.renderFileList();
    }

    /**
     * Update processing options
     * @param {Object} options 
     */
    updateSettings(options) {
        this.options = { ...this.options, ...options };
    }

    /**
     * Get statistics about the queue
     * @returns {Object} { total, queued, processing, complete, error }
     */
    getStats() {
        const stats = {
            total: this.queue.length,
            queued: 0,
            processing: 0,
            complete: 0,
            error: 0
        };
        this.queue.forEach(item => {
            if (stats[item.status] !== undefined) {
                stats[item.status]++;
            }
        });
        return stats;
    }

    /**
     * Format file size
     * @param {number} bytes 
     * @returns {string} Formatted size
     * @private
     */
    _formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Emit custom events
     * @param {string} eventName 
     * @param {Object} detail 
     * @private
     */
    _emitEvent(eventName, detail) {
        if (this.dropZone) {
            const event = new CustomEvent(eventName, { detail });
            this.dropZone.dispatchEvent(event);
        }
    }
}

window.BatchProcessor = BatchProcessor;
