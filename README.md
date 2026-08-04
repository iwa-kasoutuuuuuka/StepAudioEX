# StepAudioEX Studio

**StepAudioEX** は、Q3-TTS 仕様と同等の表現力・精細なパラメータ制御を引継ぎ、**Step Audio EditX** による先進的なテキスト指示型音声編集・修復・Zero-Shot Voice Cloning を実現した、ネイティブ・アメリカ英語による企業・教育動画向け次世代 TTS ＆ オーディオ編集スタジオです。

---

## 🌟 主な機能・特徴

### 1. 🎙️ 音声合成 ＆ 編集・UI/Webインターフェース
- **ワンクリック1発起動 ＆ 日英UI切替**: `start_server.bat` を実行するだけで環境構築・サーバー起動・ブラウザ自動オープンまで一括完了。右上のトグルで「日本語 ↔ English」表記を即座に切替可能。
- **[🌐 クラウド高速] ↔ [🏠 完全ローカル (オフライン)] 切替**: ローカルONNX（Piper）および LLM プロキシエンジンにより、オフラインPC環境でも100%ローカルで音声合成可能。
- **リアルタイムスペクトログラム ＆ 周波数解析ビジュアライザー**:
  - 音声再生時に Web Audio API と Canvas 2D を用いた 60fps スクロール型スペクトログラム（時間-周波数-振幅のヒートマップ）をリアルタイム描画。
  - **「波形 (Waveform) ↔ スペクトログラム (Spectrogram)」表示モード切替** や **FFTサイズ調整（256 / 512 / 1024 / 2048）** に対応。
- **ドラッグ＆ドロップ一括バッチ音声変換 (Batch Audio Processor)**:
  - 複数の音声ファイル（.wav, .mp3, .flac等）やテキストファイル（.txt, .md, .srt等）をD&Dで一括投入。
  - 並列処理によるTTS合成・音声強調（Corporate Clarity Boost）の同時実行と、完了ファイルの **ZIP 一括ダウンロード** に対応。
- **ノイズキャンセリング・音声フィルター ＆ 3バンドEQ (Audio Filter Chain)**:
  - **プリセット**: Podcast（温かみ）, Classroom（クリア発声）, Conference（室内ノイズカット）, Narration（バランス型）, Voiceover Pro（放送品質）
  - **DSPパラメータ**: ハイパスカットオフ、ローパスカットオフ、3バンドイコライザー（Low 320Hz / Mid 2.5kHz / High 6kHz）のサーバーサイド SciPy 処理およびリアルタイムプレビュー・バイパス対応。

---

### 2. 🌍 グローバル英語・ビジネス動画向け プリセット音声 (商用フリー全25種類 ＋ ローカルモデル)
- **米国アクセント (US)**: Ava, Andrew, Brian, Emma, Guy, Jenny, Aria, Christopher, Eric, Michelle, Ana, Roger, Steffan
- **英国アクセント (UK / British)**: Ryan (Executive Male), Sonia (Educator Female), Libby (Storyteller Female), Thomas (Instructor Male)
- **オーストラリア / カナダ / アイルランド / NZ**: Natasha, William, Clara, Liam, Emily, Connor, Molly, Mitchell
- **ローカルモデル (Auto-Download)**: Lessac, Ryan (High Quality), LJSpeech, Amy
- **カテゴリ・性別フィルター**: 「すべての音声」「女性」「男性」「クローン」タブと動的件数バッジによる快適な音声検索。

---

### 3. ✂️ 改行ごと分割WAV出力 ＆ カスタムファイル名命名規則 (ZIPエクスポート)
- 複数行テキスト入力時、改行ごとに個別のWAVファイルを自動生成。
- **命名規則**: `[任意接頭辞]_[01, 02...]_[文章冒頭20文字].wav` （例: `Lesson1_01_Welcome_to_the_corpo.wav`）
- 生成されたファイル群は1クリックでZIP圧縮ダウンロード可能。

---

### 4. 🔍 音声精度 ＆ 原稿一致照合診断 (Speech Alignment & Verification Engine)
- **ミリ秒単位アライメント抽出**: ニューラル合成時に生成される単語境界タイムスタンプ（WordBoundary）を利用し、AIが発声した生の単語シーケンスを取得。
- **動的最長共通部分列 (LCS) 照合**: 原稿と音声の単語レベルでの一致率（0%〜100%）を精密算出。
- **差分自動判定 ＆ カラーハイライト**: 一致（緑）・脱落（赤）・音声側での意図しない追加発声（黄）を自動検出し表示。

---

### 5. 🎛️ Q3-TTS コントロール仕様 ＆ ドラッグ＆ドロップ原稿読み込み
- **インライン制御タグ**: `[pause=1.0s]`, `[emotion=enthusiastic]`, `[pitch=+5%]`, `[speed=1.1]`, `[emphasis=high]`
- **ドラッグ＆ドロップ原稿読み込み**: テキストファイル（`.txt`, `.md`, `.srt`, `.vtt`, `.csv`）をドロップして即座に展開。
- **感情トーン制御 ＆ パラメトリック調整**: Professional, Enthusiastic, Serious, Calm, Conversational, Soft 等のトーン設定と話速・ピッチの双方向数値調整。

---

### 6. 🛠️ Step Audio EditX 音声編集・修復 ＆ Voice Cloning
- **Text-Guided Audio Edit (テキスト部分差し替え)**: 音声内の特定の時間範囲・フレーズを新しいテキスト音声にシームレスに差し替え。
- **ポーズ挿入 ＆ ピッチシフト / タイムストレッチ**: なめらかなクロスフェードによる無音区間挿入、非破壊テンポ・音程調整。
- **Corporate Clarity Boost**: ノイズカット（ハイパス）＋ 2k~5kHz ボーカル強調 ＋ ピークノーマライズ。
- **Zero-Shot Voice Cloning**: 10〜30秒の参照音声 (.wav / .mp3) からアコースティックプロファイルを抽出・クローン保存・不要データの一括削除管理。

---

### 7. 🎬 企業動画向け マルチシーン・スクリプトスタジオ
- スライド/シーンごとのスクリプト管理・複数話者の割り当て。
- 字幕ファイル (SRT / VTT) の自動生成と一括エクスポート。

---

## 🚀 起動方法

### 方法1: バッチファイルで起動（推奨・簡単）
プロジェクト直下にある **`start_server.bat`** をダブルクリックします。
自動的に仮想環境が適用され、ブラウザで `http://127.0.0.1:8000` が開きます。

### 方法2: コマンドラインから起動
```bash
.venv\Scripts\python.exe run_server.py
```

---

## 🏗️ システム構造 (System Architecture)

```
StepAudioEX/
├── app/
│   ├── engine/                  # バックエンドコアエンジン
│   │   ├── step_audio_ex.py     # Master Synthesis Engine
│   │   ├── edit_x.py            # Audio Editing & DSP Filter Chain
│   │   ├── q3_tts.py            # Q3-TTS Tag Parser
│   │   ├── voice_cloning.py     # Zero-Shot Voice Cloning
│   │   └── local_tts_engine.py  # Local ONNX Engine (Piper)
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css        # Modern Glassmorphism & Visualizer Styles
│   │   └── js/
│   │       ├── app.js           # Main App Controller & i18n
│   │       ├── audio_waveform.js # Waveform Controller & Visualizer Switcher
│   │       ├── spectrogram.js   # Real-time Spectrogram Visualizer (Canvas 2D)
│   │       ├── audio_filters.js # Web Audio API Filter & EQ Chain
│   │       └── batch_processor.js # Drag & Drop Batch Processor
│   ├── templates/
│   │   └── index.html           # Single Page Application Layout
│   └── main.py                  # FastAPI Routes & Endpoints
├── data/                        # 成果物出力・アップロード・クローンプロファイル保存先
├── start_server.bat             # 1クリック起動バッチ
└── requirements.txt
```

---

## 🔍 本家 Step-Audio (基盤モデル) との比較

| 比較項目 | 本家 Step-Audio (基盤モデル) | StepAudioEX Studio (本システム) |
| :--- | :--- | :--- |
| **主な用途・目的** | 汎用音声会話・対話LLM研究 | **企業・教育動画ナレーション制作・検品・音声加工** |
| **起動・マウント時間** | 数GBのVRAMマウントに数分要する | **0秒即時起動** (軽量ハイブリッド構成) |
| **生成スピード** | リアルタイム比 0.5〜1.0倍 (やや遅い) | **リアルタイム比 10倍以上 (超高速)** |
| **可視化・ビジュアライザ** | なし | **リアルタイム波形 ＆ スペクトログラム (FFT 256~2048)** |
| **一括バッチ処理** | 手動単一処理 | **D&D 複数ファイル一括変換 ＆ ZIP エクスポート** |
| **フィルター・EQ処理** | なし | **6種プリセット（Podcast/Conference等） ＋ 3バンドEQ** |
| **アライメント・検品** | タイムスタンプ抽出なし | **ミリ秒単位 WordBoundary 抽出 ＆ 原稿照合診断** |
| **字幕エクスポート** | SRT/VTT生成不可 | **SRT / VTT 字幕ファイル自動生成** |
| **音声ラインナップ** | 中国語中心 ＆ 英語混在 | **多国籍ネイティブ英語 25話者 (米・英・豪・加・愛・NZ)** |

---

## 📜 ライセンス ＆ 免責事項 (License & Disclaimer)

* **プロジェクトライセンス**: 本リポジトリのコードおよびUI構成は **[MIT License](https://opensource.org/licenses/MIT)** の下で公開されています。商用・個人利用を問わず自由にご利用・改変いただけます。
* **各サードパーティライセンス遵守**: 使用している各ライブラリ（MIT / Apache 2.0 / BSD / Remix Icon License等）のライセンス条項に準拠して開発されています。
* **商用利用に関する免責事項**: 音声合成（TTS）出力データおよび生成物の商用利用範囲については、ご使用になる環境・クラウドプロバイダーおよび参照音声の権利規定をご確認の上ご使用ください。
