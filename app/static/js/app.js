document.addEventListener('DOMContentLoaded', () => {
    // i18n Dictionary
    const i18n = {
        en: {
            page_title: "Corporate Educational Audio Studio",
            page_desc: "Native American English TTS & Text-Guided Audio Editing Engine",
            q3_badge: '<i class="ri-sparkles-line"></i> Q3-TTS Specification Enabled',
            nav_tts: "TTS Generator",
            nav_editx: "Step Audio EditX",
            nav_cloning: "Voice Cloning",
            nav_studio: "Video Script Studio",
            status_ready: "Native US Engine Ready",
            script_panel_title: '<i class="ri-edit-2-line"></i> Script & Q3-TTS Control Markup',
            tag_label: "INSERT TAGS:",
            clarity_boost_label: "Corporate Clarity Boost (EQ & Highpass)",
            btn_generate_tts: '<i class="ri-voiceprint-line"></i> Generate Speech (Q3-TTS)',
            waveform_title: '<i class="ri-waveform-line"></i> Interactive Audio Waveform Visualizer',
            btn_download_wav: '<i class="ri-download-line"></i> Download WAV',
            btn_export_srt: '<i class="ri-subtitles-line"></i> Export SRT',
            srt_title: '<i class="ri-subtitles-line"></i> Auto-Generated SRT Subtitles',
            srt_placeholder: "Captions will appear here after synthesis...",
            voice_select_title: '<i class="ri-user-star-line"></i> Voice Selection',
            label_active_preset: "Active Preset",
            label_pitch_shift: "Pitch Shift",
            label_speech_rate: "Speech Rate",
            label_emotion: "Emotion Tone",
            voice_library_title: '<i class="ri-mic-2-line"></i> Native US Voice Library',
            editx_title: '<i class="ri-scissors-cut-line"></i> Step Audio EditX Processing Suite',
            editx_desc: "Perform text-guided audio segment editing, pitch contouring, pause insertion, speed scaling, and noise reduction directly on audio waveforms.",
            label_target_file: "Target Audio File",
            placeholder_no_file: "No file selected (Generate speech first)",
            label_editx_op: "EditX Operation",
            op_replace: "Text-Guided Segment Replacement",
            op_pause: "Insert Silent Pause",
            op_pitch: "Pitch Shift (Semitones)",
            op_speed: "Time-Stretch / Speed Ramp",
            op_enhance: "Corporate Audio Enhance & Denoise",
            label_start_time: "Start Time (seconds)",
            label_end_time: "End Time (seconds)",
            label_replacement_text: "Replacement Text (for Segment Replacement)",
            placeholder_replace_text: "Enter replacement text phrase to synthesize and stitch...",
            label_pause_dur: "Pause Duration (sec)",
            label_pitch_shift_semi: "Pitch Shift (Semitones)",
            label_speed_mult: "Speed Multiplier",
            btn_apply_editx: '<i class="ri-magic-line"></i> Apply Step Audio EditX',
            cloning_title: '<i class="ri-user-voice-line"></i> Zero-Shot Voice Cloning Studio',
            cloning_desc: "Upload a 10-30 second clean audio recording of an American English speaker to extract zero-shot acoustic features and add to your corporate voice library.",
            label_voice_name: "Voice Name / Speaker Title",
            placeholder_voice_name: "e.g. Dr. Robert Vance - VP Training",
            label_ref_audio: "Reference Audio File (.wav or .mp3)",
            label_ref_transcript: "Reference Prompt Transcript (Optional)",
            placeholder_transcript: "Optional text corresponding to the sample audio for exact prompt matching...",
            btn_register_clone: '<i class="ri-cpu-line"></i> Register Cloned Voice Profile',
            studio_title: '<i class="ri-clapperboard-line"></i> Multi-Scene Video Script Timeline Studio',
            btn_add_scene: '<i class="ri-add-line"></i> Add Scene',
            label_proj_title: "Project Title",
            btn_render_studio: '<i class="ri-film-line"></i> Render Complete Corporate Narration',
            scene_speaker_voice: "Speaker Voice",
            scene_pause_after: "Pause After (seconds)",
            scene_script_text: "Scene Script Text",
            scene_delete: "Delete",
            label_prefix: "Prefix:",
            btn_generate_split: '<i class="ri-file-zip-line"></i> Split WAV per Line (ZIP)',
            btn_verify_audio: '<i class="ri-search-eye-line"></i> Verify Audio & Text Match',
            verify_card_title: '<i class="ri-checkbox-circle-line"></i> Audio Accuracy & Text Verification',
            verify_placeholder: "Click 'Verify Audio & Text Match' after speech generation to perform speech alignment verification.",
            filter_all: "All Voices",
            filter_female: "Female Voices",
            filter_male: "Male Voices",
            filter_clone: "Custom Cloned"
        },
        ja: {
            page_title: "企業・教育向け 英語音声合成＆編集スタジオ",
            page_desc: "ネイティブ・アメリカ英語 TTS ＆ テキスト指示型音声編集エンジン",
            q3_badge: '<i class="ri-sparkles-line"></i> Q3-TTS タグ制御有効',
            nav_tts: "音声合成 (TTS)",
            nav_editx: "音声波形編集 (EditX)",
            nav_cloning: "ボイスクローニング",
            nav_studio: "マルチシーン動画原稿",
            status_ready: "アメリカ英語エンジン 準備完了",
            script_panel_title: '<i class="ri-edit-2-line"></i> 原稿テキスト ＆ Q3-TTS 制御タグ',
            tag_label: "タグ挿入:",
            clarity_boost_label: "音質補正 Boost (ノイズカット ＆ イコライザー)",
            btn_generate_tts: '<i class="ri-voiceprint-line"></i> 音声を生成する',
            waveform_title: '<i class="ri-waveform-line"></i> インタラクティブ音声波形プレビュー',
            btn_download_wav: '<i class="ri-download-line"></i> WAVダウンロード',
            btn_export_srt: '<i class="ri-subtitles-line"></i> SRT字幕出力',
            srt_title: '<i class="ri-subtitles-line"></i> 自動生成字幕 (SRTキャプション)',
            srt_placeholder: "音声生成後にここに字幕データが表示されます...",
            voice_select_title: '<i class="ri-user-star-line"></i> ナレーター・パラメータ設定',
            label_active_preset: "使用ナレーター (声質)",
            label_pitch_shift: "ピッチ調整",
            label_speech_rate: "話速 (スピード)",
            label_emotion: "感情・トーン",
            voice_library_title: '<i class="ri-mic-2-line"></i> ナレーター音色ライブラリ',
            editx_title: '<i class="ri-scissors-cut-line"></i> Step Audio EditX 音声編集スイート',
            editx_desc: "波形上の指定範囲に対して、テキスト指示による部分差し替え・ポーズ挿入・ピッチ変更・速度調整・ノイズ除去を行います。",
            label_target_file: "対象音声ファイル",
            placeholder_no_file: "ファイル未選択（最初に音声を生成してください）",
            label_editx_op: "編集モード (Operation)",
            op_replace: "テキスト指示による部分音声差し替え",
            op_pause: "無音ポーズの挿入",
            op_pitch: "ピッチ変更 (半音/Semitones)",
            op_speed: "タイムストレッチ / 速度変更",
            op_enhance: "ノイズ除去＆音質クリア補正",
            label_start_time: "開始位置 (秒)",
            label_end_time: "終了位置 (秒)",
            label_replacement_text: "差し替え後の新しい英文テキスト",
            placeholder_replace_text: "差し替えたい新しい英語フレーズを入力...",
            label_pause_dur: "挿入する無音時間 (秒)",
            label_pitch_shift_semi: "ピッチシフト量 (半音)",
            label_speed_mult: "再生速度倍率",
            btn_apply_editx: '<i class="ri-magic-line"></i> Step Audio EditX を適用',
            cloning_title: '<i class="ri-user-voice-line"></i> Zero-Shot ボイスクローニング',
            cloning_desc: "10〜30秒のクリアな英語音声ファイルをアップロードして、独自の声質プロファイルを作成・登録します。",
            label_voice_name: "話者名・タイトル",
            placeholder_voice_name: "例: 研修講師 ロバート先生",
            label_ref_audio: "参照音声ファイル (.wav または .mp3)",
            label_ref_transcript: "参照音声の発言テキスト (任意)",
            placeholder_transcript: "より高精度にクローンするための発言内容テキスト...",
            btn_register_clone: '<i class="ri-cpu-line"></i> クローン声質を登録する',
            studio_title: '<i class="ri-clapperboard-line"></i> マルチシーン動画スクリプトタイムライン',
            btn_add_scene: '<i class="ri-add-line"></i> シーンを追加',
            label_proj_title: "プロジェクトタイトル",
            btn_render_studio: '<i class="ri-film-line"></i> 動画全編の音声を一括レンダリング',
            scene_speaker_voice: "使用ナレーター (声質)",
            scene_pause_after: "シーン後のポーズ時間 (秒)",
            scene_script_text: "シーン原稿テキスト",
            scene_delete: "削除",
            label_prefix: "接頭辞:",
            btn_generate_split: '<i class="ri-file-zip-line"></i> 改行ごとに分割WAV出力 (ZIP)',
            btn_verify_audio: '<i class="ri-search-eye-line"></i> 音声精度・原稿照合テスト',
            verify_card_title: '<i class="ri-checkbox-circle-line"></i> 音声精度 ＆ 原稿一致照合診断',
            verify_placeholder: "音声を生成後「音声精度・原稿照合テスト」をクリックすると、原稿と音声の精度検品が行われます。",
            filter_all: "すべての音声",
            filter_female: "女性ナレーター",
            filter_male: "男性ナレーター",
            filter_clone: "オリジナル (クローン)"
        }
    };

    let currentLang = localStorage.getItem('stepaudio_lang') || 'ja';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('stepaudio_lang', lang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[lang] && i18n[lang][key]) {
                el.innerHTML = i18n[lang][key];
            }
        });

        // Update placeholders safely
        const scriptInputEl = document.getElementById('scriptInput');
        const editXFileRefEl = document.getElementById('editXFileRef');
        const editXReplaceTextEl = document.getElementById('editXReplaceText');
        const cloneNameInputEl = document.getElementById('cloneNameInput');
        const cloneTranscriptInputEl = document.getElementById('cloneTranscriptInput');

        if (lang === 'ja') {
            if (scriptInputEl) scriptInputEl.placeholder = "英語の講義原稿やナレーション文章を入力してください...";
            if (editXFileRefEl) editXFileRefEl.placeholder = "ファイル未選択（最初に音声を生成してください）";
            if (editXReplaceTextEl) editXReplaceTextEl.placeholder = "差し替えたい新しい英語フレーズを入力...";
            if (cloneNameInputEl) cloneNameInputEl.placeholder = "例: 研修講師 ロバート先生";
            if (cloneTranscriptInputEl) cloneTranscriptInputEl.placeholder = "より高精度にクローンするための発言内容テキスト...";
        } else {
            if (scriptInputEl) scriptInputEl.placeholder = "Type your corporate training script here...";
            if (editXFileRefEl) editXFileRefEl.placeholder = "No file selected (Generate speech first)";
            if (editXReplaceTextEl) editXReplaceTextEl.placeholder = "Enter replacement text phrase to synthesize and stitch...";
            if (cloneNameInputEl) cloneNameInputEl.placeholder = "e.g. Dr. Robert Vance - VP Training";
            if (cloneTranscriptInputEl) cloneTranscriptInputEl.placeholder = "Optional text corresponding to the sample audio for exact prompt matching...";
        }

        // Re-render voice options and scenes UI
        if (availableVoices.length > 0) {
            renderVoicesGrid(availableVoices);
        }
        renderScenesUI();
    }

    // Bind lang button clicks
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // App State
    let availableVoices = [];
    let currentVoiceId = "en-US-AvaMultilingualNeural";
    let currentAudioFile = null;
    let visualizer = null;
    let latestTimestamps = [];
    let latestScriptText = "";
    let lastVerificationData = null;
    let scenesList = [
        {
            id: 1,
            scene_name: "Module 1: Executive Intro",
            speaker_voice_id: "en-US-AndrewMultilingualNeural",
            emotion: "professional",
            pause_after_sec: 1.0,
            text: "Welcome to today's corporate training session on enterprise security policies. [pause=0.8s] [emotion=enthusiastic] Let's begin by reviewing our core values."
        },
        {
            id: 2,
            scene_name: "Module 2: Technical Deep Dive",
            speaker_voice_id: "en-US-BrianMultilingualNeural",
            emotion: "professional",
            pause_after_sec: 0.5,
            text: "In this section, we will walk through the deployment architecture and system authentication flow step by step."
        }
    ];

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const voiceSelect = document.getElementById('voiceSelect');
    const voicesGrid = document.getElementById('voicesGrid');
    const scriptInput = document.getElementById('scriptInput');
    const btnGenerateTTS = document.getElementById('btnGenerateTTS');
    const mainAudioPlayer = document.getElementById('mainAudioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    const srtPreview = document.getElementById('srtPreview');
    const btnDownloadWav = document.getElementById('btnDownloadWav');
    const btnDownloadSrt = document.getElementById('btnDownloadSrt');

    // Initialize Canvas Visualizer
    visualizer = new WaveformVisualizer('waveformCanvas', 'mainAudioPlayer');

    // Load available voices from API
    loadVoices();

    // Set initial language
    setLanguage(currentLang);

    // Bind Navigation Tabs
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            navItems.forEach(n => n.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPanel = document.getElementById(`tab-${targetTab}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Tag Toolbar Insert Buttons
    document.querySelectorAll('.btn-tag').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.getAttribute('data-tag');
            insertTextAtCursor(scriptInput, tag);
        });
    });

    // Range Sliders Value Updates
    setupSlider('pitchSlider', 'pitchVal', '%');
    setupSlider('rateSlider', 'rateVal', '%');

    // Generate TTS Button Click
    btnGenerateTTS.addEventListener('click', async () => {
        const text = scriptInput.value.strip ? scriptInput.value.strip() : scriptInput.value.trim();
        if (!text) {
            alert("Please enter a script text to synthesize.");
            return;
        }

        setButtonLoading(btnGenerateTTS, true, "Synthesizing Audio...");

        try {
            const pitchVal = document.getElementById('pitchSlider').value;
            const rateVal = document.getElementById('rateSlider').value;
            const emotionVal = document.getElementById('emotionSelect').value;
            const clarityVal = document.getElementById('clarityToggle').checked;

            const response = await fetch('/api/tts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    voice_id: currentVoiceId,
                    pitch: `${pitchVal >= 0 ? '+' : ''}${pitchVal}%`,
                    rate: `${rateVal >= 0 ? '+' : ''}${rateVal}%`,
                    emotion: emotionVal,
                    clarity_boost: clarityVal
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                currentAudioFile = data.file_name;
                latestScriptText = text;
                latestTimestamps = data.timestamps || [];
                mainAudioPlayer.src = data.audio_url;
                mainAudioPlayer.play();
                updatePlayPauseIcon(true);

                // Load visualizer
                visualizer.loadAudio(data.audio_url);

                // Update SRT Preview
                srtPreview.textContent = data.srt_content || "No captions generated.";

                // Set download links
                btnDownloadWav.href = data.audio_url;
                btnDownloadWav.download = data.file_name;
                btnDownloadSrt.onclick = () => downloadFile("captions.srt", data.srt_content);

                // Update EditX tab target file
                document.getElementById('editXFileRef').value = data.file_name;

                // Auto Trigger Verification Update
                updateVerificationUI(text, latestTimestamps);
            } else {
                alert(`Synthesis Error: ${data.detail || 'Failed'}`);
            }
        } catch (e) {
            console.error("TTS request error:", e);
            alert("Network error during synthesis.");
        } finally {
            setButtonLoading(btnGenerateTTS, false, i18n[currentLang].btn_generate_tts);
        }
    });

    // Generate Split WAV (ZIP) Button Click
    const btnGenerateSplit = document.getElementById('btnGenerateSplit');
    if (btnGenerateSplit) {
        btnGenerateSplit.addEventListener('click', async () => {
            const text = scriptInput.value.strip ? scriptInput.value.strip() : scriptInput.value.trim();
            if (!text) {
                alert(currentLang === 'ja' ? "原稿テキストを入力してください。" : "Please enter a script text.");
                return;
            }

            const prefixVal = document.getElementById('prefixInput').value.trim() || "Speech";
            setButtonLoading(btnGenerateSplit, true, currentLang === 'ja' ? "分割音声生成中..." : "Generating Split WAVs...");

            try {
                const pitchVal = document.getElementById('pitchSlider').value;
                const rateVal = document.getElementById('rateSlider').value;
                const emotionVal = document.getElementById('emotionSelect').value;
                const clarityVal = document.getElementById('clarityToggle').checked;

                const response = await fetch('/api/tts/generate-split', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: text,
                        prefix: prefixVal,
                        voice_id: currentVoiceId,
                        pitch: `${pitchVal >= 0 ? '+' : ''}${pitchVal}%`,
                        rate: `${rateVal >= 0 ? '+' : ''}${rateVal}%`,
                        emotion: emotionVal,
                        clarity_boost: clarityVal
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    // Trigger ZIP download
                    const element = document.createElement('a');
                    element.setAttribute('href', data.zip_url);
                    element.setAttribute('download', data.zip_filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);

                    const fileListMsg = data.files.map(f => ` - ${f.filename}`).join('\n');
                    alert((currentLang === 'ja' ? `改行ごとに${data.file_count}個のWAVファイルを生成し、ZIPでダウンロードしました！\n\n生成ファイル一覧:\n` : `Generated ${data.file_count} split WAV files in ZIP!\n\nFiles:\n`) + fileListMsg);
                } else {
                    alert(`Split Synthesis Error: ${data.detail || 'Failed'}`);
                }
            } catch (e) {
                console.error("Split TTS request error:", e);
                alert("Network error during split synthesis.");
            } finally {
                setButtonLoading(btnGenerateSplit, false, i18n[currentLang].btn_generate_split);
            }
        });
    }

    async function updateVerificationUI(originalText, timestamps) {
        const verifyResultBox = document.getElementById('verifyResultBox');
        if (!verifyResultBox) return;

        try {
            const verifyRes = await fetch('/api/tts/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_text: originalText,
                    timestamps: timestamps || []
                })
            });

            const vData = await verifyRes.json();
            if (vData.status === 'success') {
                const info = vData.verification;
                const badgeColor = info.status === 'passed' ? '#10b981' : '#f59e0b';
                const badgeText = info.status === 'passed' ? (currentLang === 'ja' ? '一致度 良好 (合格)' : 'High Match (Passed)') : (currentLang === 'ja' ? '一部不一致あり' : 'Diff Detected');

                const diffHtml = info.diff_results.map(d => {
                    if (d.status === 'match') return `<span style="color:#10b981;">${d.word}</span>`;
                    if (d.status === 'replaced' || d.status === 'missing') return `<span style="color:#ef4444; text-decoration:line-through;">${d.word}</span>`;
                    return `<span style="color:#f59e0b;">${d.word}</span>`;
                }).join(' ');

                verifyResultBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:16px; font-weight:700; color:${badgeColor};">
                            <i class="ri-dashboard-line"></i> ${currentLang === 'ja' ? 'テキスト原稿 ↔ 音声一致度' : 'Audio Similarity'}: ${info.similarity_score}%
                        </span>
                        <span style="background:${badgeColor}22; border:1px solid ${badgeColor}; color:${badgeColor}; font-size:11px; padding:2px 8px; border-radius:99px; font-weight:600;">
                            ${badgeText}
                        </span>
                    </div>
                    <div style="font-size:12px; color:var(--text-dim); margin-bottom:8px;">
                        ${currentLang === 'ja' ? `原稿単語数: ${info.word_count_original} 語 / 音声検知単語数: ${info.word_count_transcribed} 語` : `Script Words: ${info.word_count_original} / Audio Words: ${info.word_count_transcribed}`}
                    </div>
                    <div style="background:rgba(10,14,24,0.7); border:1px solid var(--border-glass); padding:10px; border-radius:8px; font-family:var(--font-mono); font-size:12px; line-height:1.6; max-height:100px; overflow-y:auto;">
                        ${diffHtml}
                    </div>
                `;
            }
        } catch (e) {
            console.error("Verification UI update error:", e);
        }
    }

    // Verify Audio Button Click
    const btnVerifyAudio = document.getElementById('btnVerifyAudio');

    if (btnVerifyAudio) {
        btnVerifyAudio.addEventListener('click', async () => {
            const text = scriptInput.value.strip ? scriptInput.value.strip() : scriptInput.value.trim();
            if (!text) {
                alert(currentLang === 'ja' ? "原稿テキストを入力してください。" : "Please enter a script text.");
                return;
            }

            setButtonLoading(btnVerifyAudio, true, currentLang === 'ja' ? "原稿と音声の精度照合中..." : "Verifying Speech Alignment...");

            try {
                const pitchVal = document.getElementById('pitchSlider').value;
                const rateVal = document.getElementById('rateSlider').value;
                const emotionVal = document.getElementById('emotionSelect').value;
                const clarityVal = document.getElementById('clarityToggle').checked;

                if (latestTimestamps.length > 0 && latestScriptText === text) {
                    await updateVerificationUI(text, latestTimestamps);
                } else {
                    const response = await fetch('/api/tts/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text: text,
                            voice_id: currentVoiceId,
                            pitch: `${pitchVal >= 0 ? '+' : ''}${pitchVal}%`,
                            rate: `${rateVal >= 0 ? '+' : ''}${rateVal}%`,
                            emotion: emotionVal,
                            clarity_boost: clarityVal
                        })
                    });

                    const ttsData = await response.json();

                    if (ttsData.status === 'success') {
                        latestScriptText = text;
                        latestTimestamps = ttsData.timestamps || [];
                        await updateVerificationUI(text, latestTimestamps);
                    } else {
                        alert(`Verification Error: ${ttsData.detail || 'Failed'}`);
                    }
                }
            } catch (e) {
                console.error("Verification error:", e);
                alert("Network error during audio verification.");
            } finally {
                setButtonLoading(btnVerifyAudio, false, i18n[currentLang].btn_verify_audio);
            }
        });
    }

    // Play / Pause Toggle
    playPauseBtn.addEventListener('click', () => {
        if (mainAudioPlayer.paused) {
            mainAudioPlayer.play();
            updatePlayPauseIcon(true);
        } else {
            mainAudioPlayer.pause();
            updatePlayPauseIcon(false);
        }
    });

    mainAudioPlayer.addEventListener('timeupdate', () => {
        currentTimeDisplay.textContent = formatTime(mainAudioPlayer.currentTime);
        totalTimeDisplay.textContent = formatTime(mainAudioPlayer.duration || 0);
    });

    mainAudioPlayer.addEventListener('ended', () => {
        updatePlayPauseIcon(false);
    });

    // Step Audio EditX Form Action
    const btnApplyEditX = document.getElementById('btnApplyEditX');
    if (btnApplyEditX) {
        btnApplyEditX.addEventListener('click', async () => {
            const fileName = document.getElementById('editXFileRef').value;
            const action = document.getElementById('editXActionSelect').value;

            if (!fileName) {
                alert("Please generate or select an audio file first.");
                return;
            }

            setButtonLoading(btnApplyEditX, true, "Applying EditX...");

            try {
                const payload = {
                    file_name: fileName,
                    action: action,
                    position_sec: parseFloat(document.getElementById('editXPos').value || 0),
                    duration_sec: parseFloat(document.getElementById('editXDur').value || 1),
                    semitones: parseFloat(document.getElementById('editXSemitones').value || 0),
                    speed_rate: parseFloat(document.getElementById('editXSpeedRate').value || 1),
                    start_sec: parseFloat(document.getElementById('editXStartSec').value || 0),
                    end_sec: parseFloat(document.getElementById('editXEndSec').value || 1),
                    replacement_text: document.getElementById('editXReplaceText').value,
                    voice_id: currentVoiceId
                };

                const response = await fetch('/api/editx/edit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.status === 'success') {
                    currentAudioFile = data.file_name;
                    mainAudioPlayer.src = data.audio_url;
                    mainAudioPlayer.play();
                    updatePlayPauseIcon(true);
                    visualizer.loadAudio(data.audio_url);
                    alert(`Step Audio EditX Action '${action}' applied successfully!`);
                } else {
                    alert(`EditX Error: ${data.detail}`);
                }
            } catch (e) {
                console.error("EditX Error:", e);
            } finally {
                setButtonLoading(btnApplyEditX, false, "Apply Step Audio EditX");
            }
        });
    }

    // Voice Cloning Form Submit
    const cloneForm = document.getElementById('cloneForm');
    if (cloneForm) {
        cloneForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const voiceName = document.getElementById('cloneNameInput').value;
            const audioFileInput = document.getElementById('cloneAudioInput');
            const transcript = document.getElementById('cloneTranscriptInput').value;

            if (!voiceName || !audioFileInput.files.length) {
                alert("Please specify a voice name and select an audio sample.");
                return;
            }

            const btnSubmit = cloneForm.querySelector('button[type="submit"]');
            setButtonLoading(btnSubmit, true, "Cloning Voice Profile...");

            const formData = new FormData();
            formData.append('file', audioFileInput.files[0]);
            formData.append('voice_name', voiceName);
            formData.append('transcript', transcript);

            try {
                const response = await fetch('/api/clone/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.status === 'success') {
                    alert(`Voice '${voiceName}' cloned successfully!`);
                    loadVoices();
                    cloneForm.reset();
                } else {
                    alert(`Cloning error: ${data.detail}`);
                }
            } catch (err) {
                console.error("Cloning network error:", err);
            } finally {
                setButtonLoading(btnSubmit, false, "Register Cloned Voice Profile");
            }
        });
    }

    // Multi-Scene Render Studio
    renderScenesUI();
    const btnRenderStudio = document.getElementById('btnRenderStudio');
    if (btnRenderStudio) {
        btnRenderStudio.addEventListener('click', async () => {
            const projName = document.getElementById('studioProjName').value || "Corporate_Training_Video";

            setButtonLoading(btnRenderStudio, true, "Rendering Full Narration Track...");

            try {
                const payload = {
                    project_name: projName,
                    scenes: scenesList
                };

                const response = await fetch('/api/studio/render-scene', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.status === 'success') {
                    currentAudioFile = data.file_name;
                    mainAudioPlayer.src = data.audio_url;
                    mainAudioPlayer.play();
                    updatePlayPauseIcon(true);
                    visualizer.loadAudio(data.audio_url);

                    srtPreview.textContent = data.srt_content;
                    btnDownloadWav.href = data.audio_url;
                    btnDownloadWav.download = data.file_name;
                    btnDownloadSrt.onclick = () => downloadFile(`${projName}.srt`, data.srt_content);

                    alert(`Studio Narration Rendered! Duration: ${data.total_duration} seconds across ${data.scene_count} scenes.`);
                } else {
                    alert(`Studio Render Error: ${data.detail}`);
                }
            } catch (e) {
                console.error("Studio render error:", e);
            } finally {
                setButtonLoading(btnRenderStudio, false, "Render Complete Corporate Narration");
            }
        });
    }

    // Functions
    async function loadVoices() {
        try {
            const response = await fetch('/api/voices');
            const data = await response.json();
            if (data.status === 'success') {
                availableVoices = [...data.native_us_voices, ...data.cloned_voices];
                renderVoicesGrid(availableVoices);
                populateVoiceSelect(availableVoices);
                renderScenesUI();
            }
        } catch (e) {
            console.error("Failed to load voices:", e);
        }
    }

    let currentFilter = 'all';

    const filterBtns = document.querySelectorAll('.voice-filter-bar .btn-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderVoicesGrid(availableVoices);
        });
    });

    function updateVoiceCounts(voices) {
        let all = voices.length;
        let female = 0, male = 0, clone = 0;
        voices.forEach(v => {
            const isClone = v.id && v.id.indexOf('clone_') === 0;
            const gender = (v.gender || '').toLowerCase();
            if (isClone) clone++;
            else if (gender === 'female') female++;
            else if (gender === 'male') male++;
        });

        const cAll = document.getElementById('countAll');
        const cFem = document.getElementById('countFemale');
        const cMale = document.getElementById('countMale');
        const cClone = document.getElementById('countClone');

        if (cAll) cAll.textContent = `(${all})`;
        if (cFem) cFem.textContent = `(${female})`;
        if (cMale) cMale.textContent = `(${male})`;
        if (cClone) cClone.textContent = `(${clone})`;
    }

    function renderVoicesGrid(voices) {
        if (!voicesGrid) return;
        voicesGrid.innerHTML = '';
        updateVoiceCounts(voices);

        const filtered = voices.filter(voice => {
            const isClone = voice.id && voice.id.indexOf('clone_') === 0;
            const gender = (voice.gender || '').toLowerCase();
            if (currentFilter === 'female') return !isClone && gender === 'female';
            if (currentFilter === 'male') return !isClone && gender === 'male';
            if (currentFilter === 'clone') return isClone;
            return true;
        });

        if (filtered.length === 0) {
            voicesGrid.innerHTML = `<div style="padding:16px; text-align:center; font-size:12px; color:var(--text-muted);">${currentLang === 'ja' ? '該当する音声がありません' : 'No voices matched'}</div>`;
            return;
        }

        filtered.forEach(voice => {
            const isClone = voice.id && voice.id.indexOf('clone_') === 0;
            const card = document.createElement('div');
            card.className = `voice-card ${voice.id === currentVoiceId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="voice-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
                    <div style="flex:1;">
                        <span class="voice-name" style="font-weight:600;">${voice.name}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                        <span class="voice-badge">${voice.category}</span>
                        ${isClone ? `<button class="btn-delete-voice" title="削除" onclick="event.stopPropagation(); deleteClonedVoice('${voice.id}')" style="background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.5); color:#ef4444; border-radius:6px; padding:3px 8px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;"><i class="ri-delete-bin-line"></i> 削除</button>` : ''}
                    </div>
                </div>
                <p class="voice-desc">${voice.description}</p>
                <div class="voice-accent">
                    <i class="ri-voiceprint-line"></i> ${voice.accent}
                </div>
            `;

            card.addEventListener('click', () => {
                currentVoiceId = voice.id;
                document.querySelectorAll('.voice-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                if (voiceSelect) voiceSelect.value = voice.id;
            });

            voicesGrid.appendChild(card);
        });
    }

    window.deleteClonedVoice = async (voiceId) => {
        if (!confirm(currentLang === 'ja' ? "このクローン音声を削除してもよろしいですか？" : "Are you sure you want to delete this cloned voice?")) return;

        try {
            const response = await fetch(`/api/clone/${voiceId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.status === 'success') {
                if (currentVoiceId === voiceId) {
                    currentVoiceId = "en-US-AvaMultilingualNeural";
                }
                loadVoices();
            } else {
                alert(`Error deleting voice: ${data.detail || 'Failed'}`);
            }
        } catch (e) {
            console.error("Delete voice error:", e);
            alert("Network error while deleting voice.");
        }
    };

    function populateVoiceSelect(voices) {
        if (!voiceSelect) return;
        voiceSelect.innerHTML = '';

        const usVoices = voices.filter(v => (v.id.startsWith('en-US') || (v.accent || '').includes('US')));
        const cloneVoices = voices.filter(v => v.id.startsWith('clone_'));
        const globalVoices = voices.filter(v => !usVoices.includes(v) && !cloneVoices.includes(v));

        const addGroup = (label, items) => {
            if (!items.length) return;
            const group = document.createElement('optgroup');
            group.label = label;
            items.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                opt.textContent = v.name;
                if (v.id === currentVoiceId) opt.selected = true;
                group.appendChild(opt);
            });
            voiceSelect.appendChild(group);
        };

        addGroup(currentLang === 'ja' ? "🇺🇸 アメリカ英語 (Native US)" : "🇺🇸 Native US English", usVoices);
        addGroup(currentLang === 'ja' ? "🎙️ クローン音声 (Custom Cloned)" : "🎙️ Custom Cloned Voices", cloneVoices);
        addGroup(currentLang === 'ja' ? "🌐 グローバル英語 (UK / AU / CA / IE / NZ)" : "🌐 Global English (UK / AU / CA / IE / NZ)", globalVoices);

        voiceSelect.addEventListener('change', (e) => {
            currentVoiceId = e.target.value;
            renderVoicesGrid(availableVoices);
        });
    }

    function renderScenesUI() {
        const scenesContainer = document.getElementById('scenesContainer');
        if (!scenesContainer) return;

        scenesContainer.innerHTML = '';
        const dict = i18n[currentLang] || i18n.en;

        scenesList.forEach((scene, index) => {
            const card = document.createElement('div');
            card.className = 'scene-card';
            card.innerHTML = `
                <div class="scene-card-header">
                    <input type="text" class="scene-title-input" value="${scene.scene_name}" onchange="updateSceneTitle(${index}, this.value)">
                    <button class="btn-secondary" style="padding:4px 10px; font-size:12px;" onclick="removeScene(${index})">
                        <i class="ri-delete-bin-line"></i> ${dict.scene_delete || 'Delete'}
                    </button>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">${dict.scene_speaker_voice || 'Speaker Voice'}</label>
                        <select class="form-select" onchange="updateSceneVoice(${index}, this.value)">
                            ${availableVoices.map(v => `<option value="${v.id}" ${v.id === scene.speaker_voice_id ? 'selected' : ''}>${v.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label class="form-label">${dict.scene_pause_after || 'Pause After (seconds)'}</label>
                        <input type="number" step="0.1" class="form-input" value="${scene.pause_after_sec}" onchange="updateScenePause(${index}, this.value)">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">${dict.scene_script_text || 'Scene Script Text'}</label>
                    <textarea class="script-textarea" style="height:80px;" onchange="updateSceneText(${index}, this.value)">${scene.text}</textarea>
                </div>
            `;
            scenesContainer.appendChild(card);
        });
    }

    window.updateSceneTitle = (idx, val) => { scenesList[idx].scene_name = val; };
    window.updateSceneVoice = (idx, val) => { scenesList[idx].speaker_voice_id = val; };
    window.updateScenePause = (idx, val) => { scenesList[idx].pause_after_sec = parseFloat(val); };
    window.updateSceneText = (idx, val) => { scenesList[idx].text = val; };
    window.removeScene = (idx) => {
        scenesList.splice(idx, 1);
        renderScenesUI();
    };

    const btnAddScene = document.getElementById('btnAddScene');
    if (btnAddScene) {
        btnAddScene.addEventListener('click', () => {
            scenesList.push({
                id: Date.now(),
                scene_name: `Module ${scenesList.length + 1}: New Scene`,
                speaker_voice_id: currentVoiceId,
                emotion: "professional",
                pause_after_sec: 0.8,
                text: "Enter your narration script for this scene..."
            });
            renderScenesUI();
        });
    }

    function insertTextAtCursor(field, text) {
        if (field.selectionStart || field.selectionStart === '0') {
            var startPos = field.selectionStart;
            var endPos = field.selectionEnd;
            field.value = field.value.substring(0, startPos)
                + text
                + field.value.substring(endPos, field.value.length);
            field.selectionStart = startPos + text.length;
            field.selectionEnd = startPos + text.length;
        } else {
            field.value += text;
        }
    }

    function setupSlider(sliderId, displayId, unit) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(displayId);
        if (slider && display) {
            slider.addEventListener('input', () => {
                const val = slider.value;
                display.textContent = `${val >= 0 && unit === '%' ? '+' : ''}${val}${unit}`;
            });
        }
    }

    function setButtonLoading(btn, isLoading, text) {
        if (!btn) return;
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = `<i class="ri-loader-4-line spin"></i> ${text}`;
        } else {
            btn.disabled = false;
            btn.innerHTML = text;
        }
    }

    function updatePlayPauseIcon(isPlaying) {
        if (!playPauseBtn) return;
        playPauseBtn.innerHTML = isPlaying ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>';
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
});
