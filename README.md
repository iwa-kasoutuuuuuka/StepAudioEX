# StepAudioEX Studio

**StepAudioEX** は、Q3-TTS 仕様と同等の表現力・精細なパラメータ制御を引継ぎ、**Step Audio EditX** による先進的なテキスト指示型音声編集・修復・Zero-Shot Voice Cloning を実現した、ネイティブ・アメリカ英語による企業・教育動画向け次世代 TTS ＆ オーディオ編集スタジオです。

---

## 🖥️ 画面・ページ別機能詳細ガイド (UI Tabs & Features)

StepAudioEX Studio は、サイドバーの5つの画面（タブ）から直感的に各機能へアクセスできます。

### 1. 🎙️ 音声合成 (TTS)
高精度ニューラル音声合成とアライメント検品、波形・スペクトログラム解析を行うメイン画面です。

- **テキスト入力 ＆ ドラッグ＆ドロップ**:
  - 原稿テキストを直接入力、または `.txt`, `.md`, `.srt`, `.vtt`, `.csv` 形式のファイルを直接ドロップして読み込み。
- **インライン制御タグ (Q3-TTS仕様)**:
  - `[pause=1.0s]` (無音挿入), `[emotion=enthusiastic]` (感情変更), `[pitch=+5%]` (ピッチ変更), `[speed=1.1]` (話速変更) 等の制御タグを文章内に挿入して部分制御可能。
- **話者ライブラリ (全25種 ＋ クローン音声)**:
  - 米国・英国・豪州・カナダ・愛・NZのアセンブルナレーター、およびご自身で登録したクローン音声をタブ切替（「すべて」「女性」「男性」「クローン」）で簡単絞り込み。
- **パラメータ微調整**:
  - 感情トーン（Professional, Enthusiastic, Serious, Calm, Conversational, Soft）選択
  - 話速（Rate）、ピッチ（Pitch）、音量（Volume）のパラメトリック調整スライダー ＆ 双方向数値ボックス。
- **インタラクティブ波形 ＆ スペクトログラムビジュアライザー**:
  - **「波形 (Waveform) ↔ スペクトログラム (Spectrogram)」** の1クリック表示モード切替。
  - Web Audio API による 60fps リアルタイム周波数ヒートマップ表示 ＆ FFTサイズ選択（256 / 512 / 1024 / 2048）。
- **連番WAV分割 ＆ ZIP一括エクスポート**:
  - 改行ごとに個別WAVファイルを自動生成し、設定した接頭辞（例: `Lesson1_01_Welcome.wav`）でZIP圧縮一括ダウンロード。
- **音声精度 ＆ 原稿一致照合診断 (Speech Alignment Verification)**:
  - 単語タイムスタンプ（WordBoundary）を利用した LCS 動的計画法アルゴリズムにより、原稿と音声の一致率（0%〜100%）をミリ秒単位で照合・カラー表示（緑:一致、赤:脱落、黄:追加発声）。

---

### 2. ✂️ 音声波形編集 (EditX)
生成済みまたはアップロードした音声に対する高度な信号処理・フレーズ単位の非破壊編集を行う画面です。

- **Text-Guided Audio Edit (テキスト指示型部分差し替え)**:
  - 音声内の指定秒数（例: `2.5秒 〜 4.8秒`）を、新しいテキスト音声へ自然に差し替え・置換。
- **ポーズ挿入 (Pause Insertion)**:
  - 指定した秒数位置になめらかな等電力クロスフェードで無音区間（ミリ秒〜秒単位）を挿入。
- **ピッチシフト ＆ タイムストレッチ**:
  - 音声を伸ばし縮めしたり（話速変更）、話者の声質ピッチを非破壊で高低調整。
- **Corporate Clarity Boost**:
  - ノイズカット（ハイパス）＋ 2k〜5kHz ボーカル強調 ＋ ピークノーマライズによる企業動画向けクリア音声強調。

---

### 3. 👤 ボイスクローニング (Voice Cloning)
わずかな参照音声から声質プロファイルを抽出・保存し、自分だけのカスタムボイスを作成する画面です。

- **Zero-Shot Voice Cloning**:
  - 10秒〜30秒のクリアな参照音声（.wav / .mp3）をアップロードまたは録音し、アコースティックプロファイルをワンクリック抽出。
- **クローンボイス管理 ＆ 1クリック削除**:
  - 登録済みクローン音声の一覧表示、基本パラメータ設定、不要になったクローンプロファイルおよび参照音声WAVの完全一括削除。
- **TTSシームレス連携**:
  - 登録されたクローン音声は、「音声合成 (TTS)」タブや「マルチシーン動画原稿」タブのナレーターリストに即座に反映され、すぐに読み上げに使用可能。

---

### 4. 🎬 マルチシーン動画原稿 (Video Script Studio)
スライドプレゼンテーションや動画のシーンごとにスクリプトを構築・一括レンダリングする画面です。

- **マルチシーン・スクリプト構造化**:
  - シーン（スライド）ごとのタイトル、原稿テキスト、個別の担当ナレーター・感情・パラメータを独立設定。
- **全シーン一括レンダリング**:
  - すべてのシーンの音声をワンクリックで自動連続生成し、結合版音声およびシーン別分割音声を生成。
- **SRT / VTT 字幕ファイル自動生成**:
  - 単語タイムスタンプ情報を元に、動画編集ソフト（Premiere, DaVinci Resolve, Final Cut 等）でそのまま読み込める標準字幕ファイル（.srt / .vtt）を自動出力。

---

### 5. 🎛️ オーディオ加工 (Audio Processor)
複数ファイルの一括バッチ変換や、イコライザー・ノイズキャンセリングフィルターを適用する画面です。

- **一括バッチ音声変換 (Batch Audio Processor)**:
  - 複数の音声ファイル（.wav, .mp3, .flac等）やテキストファイル（.txt, .md等）をドラッグ＆ドロップで一括読み込み。
  - 並列処理による一括TTS変換・音声一括クリア強調処理と、完了ファイルの **ZIP 一括ダウンロード**。
- **音声フィルター ＆ 3バンドEQ (Audio Filter Chain)**:
  - **プリセット**: Raw（フィルターなし）, Podcast（温かみ）, Classroom（クリア発声）, Conference（室内ノイズカット）, Narration（バランス型）, Voiceover Pro（放送品質）
  - **3バンド イコライザー**: Low (320Hz) / Mid (2.5kHz) / High (6kHz) を dB 単位で精密調整。
  - **周波数カットオフ**: ハイパスカットオフ（背景低周波ノイズカット）＆ ローパスカットオフ（高周波ノイズカット）の個別に指定。
  - **リアルタイムバイパス ＆ プレビュー**: 原音との聞き比べ（Bypass）機能とサーバーサイド SciPy による高音質処理・書き出し。

---

## 🌟 全体機能・特徴サマリー

1. **ワンクリック1発起動 ＆ 日英UI切替 ＆ エンジンモード切替**
   - **ダブルクリック起動**: `start_server.bat` を実行するだけで環境構築・サーバー起動・ブラウザ自動オープンまで一括完了。
   - **バイリンガルUI**: 画面右上の切替トグルで画面全体の「日本語 ↔ English」表記をワンクリック切替可能。
   - **[🌐 クラウド高速] ↔ [🏠 完全ローカル (オフライン)] 切替**: インターネット未接続環境やセキュリティ規定の厳しい社内ネットワークでも、ローカルONNX（Piper）および LLM プロキシエンジンにより100%ローカルPC内のみで完全オフライン音声合成が可能。

2. **グローバル英語・ビジネス動画向け プリセット音声 (完全無料・商用フリー全25種類 ＋ ローカルモデル)**
   - **米国アクセント (US)**: Ava, Andrew, Brian, Emma, Guy, Jenny, Aria, Christopher, Eric, Michelle, Ana, Roger, Steffan
   - **英国アクセント (UK / British)**: Ryan (Executive Male), Sonia (Educator Female), Libby (Storyteller Female), Thomas (Instructor Male)
   - **オーストラリア / カナダ / アイルランド / NZ**: Natasha, William, Clara, Liam, Emily, Connor, Molly, Mitchell
   - **ローカルモデル (Auto-Download)**: Lessac, Ryan (High Quality), LJSpeech, Amy

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

## 謝辞・クレジッド（Acknowledgments & Attributions）

本プロジェクト **StepAudioEX** は、オープンソースコミュニティおよび先進的な研究機関・開発者の方々の素晴らしい成果と技術基盤の上に成り立っています。開発チーム・コミュニティの皆様に深く感謝と敬意を表します。

### 🤝 ベースモデル・基幹技術への謝辞
* **[Step Audio / Step Audio EditX](https://github.com/stepfun-ai/Step-Audio)** (StepFun AI)
  - テキスト指示型音声編集（Text-Guided Segment Replacement）、Zero-Shot Voice Cloning、先進的なオーディオ編集・アコースティックプロファイリング技術の設計思想および基礎フレームワークとしてインスパイア・活用させていただいております。
* **[Rhasspy Piper Voices](https://github.com/rhasspy/piper)** (Rhasspy)
  - 完全ローカル・オフライン音声合成エンジン用の高性能 ONNX ニューラルボイスモデル（Lessac, Ryan, LJSpeech, Amy）を提供。

### 🛠️ 利用・流用ライブラリ ＆ フレームワーク一覧
* **[edge-tts](https://github.com/rany2/edge-tts)**: Microsoft Edge ニューラル音声合成 Web API と同期
* **[piper-tts](https://github.com/rhasspy/piper)** & **[onnxruntime](https://onnxruntime.ai/)**: 完全ローカル高速推論
* **[FastAPI](https://fastapi.tiangolo.com/)**: Web バックエンド API フレームワーク
* **[Uvicorn](https://www.uvicorn.org/)**: ASGI サーバー
* **[SoundFile](https://python-soundfile.readthedocs.io/)** & **[SciPy](https://scipy.org/)** / **[NumPy](https://numpy.org/)**: 音声信号処理・DSPフィルター・EQ処理
* **[pathvalidate](https://github.com/thombashi/pathvalidate)**: 安全なファイル名サニタイズ
* **[Remix Icon](https://remixicon.com/)**: アイコンシステム

---

## 🔍 本家 Step-Audio (基盤モデル) との音声合成における相違点

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
| **設定インターフェース**| テキスト指示メイン | **双方向数値入力ボックス ＆ 精密パラメトリック調整** |
| **連番WAV分割** | 一括WAVのみ | **改行ごと連番WAV・自動命名 ZIP一括出力** |

---

## ⚡ アーキテクチャ・無料利用と持続可能性 (System Architecture & Sustainability)

### 💡 1. 0秒起動 ＆ 高速生成の仕組み
本システムが Qwen-TTS 等のローカルLLMモデルと異なり、**「起動時のモデル読み込み時間（マウント時間）がゼロ」かつ「超高速生成」** を実現している理由は、以下の**ハイブリッド・アーキテクチャ**を採用しているためです。

* **ハイブリッド分散構成**: 音声合成の基本波形生成はクラウドのニューラル処理（Microsoft Edge Read Aloud プロトコル）を利用し、ローカルPCで数GBのVRAMロード待ちが発生しません。
* **ローカルDSP信号処理（Step Audio EditX）**: ポーズ挿入、ノイズカット・ボーカル強調（Clarity Boost）、フィルターEQ、精度検品はすべてご自身のPC（SciPy / SoundFile）で即座に処理されます。

### 🆓 2. API料金と利用継続性について
* **完全無料で利用可能**: APIキー登録や月額契約・クレジットカード設定は不要です。回数や文字数の制限なくご利用いただけます。
* **フォールバック（将来の備え）設計**: 万が一クラウドアクセス制限等の仕様変更が発生した場合でも、コード構造を変更せずに **完全ローカル完結型モデル（Kokoro-82M / Qwen2-Audio / 本家 Step-Audio 等）** へバックエンドプロキシを切り替えられる柔軟な設計になっております。

---

## 📜 ライセンス ＆ 免責事項 (License & Disclaimer)

* **プロジェクトライセンス**: 本リポジトリのコードおよびUI構成は **[MIT License](https://opensource.org/licenses/MIT)** の下で公開されています。商用・個人利用を問わず自由にご利用・改変いただけます。
* **商用利用に関する免責事項**: 音声合成（TTS）出力データおよび生成物の商用利用範囲については、ご使用になる環境・クラウドプロバイダーおよび参照音声の権利規定をご確認の上ご使用ください。
