# StepAudioEX Studio

**StepAudioEX** は、Q3-TTS 仕様と同等の表現力・精細なパラメータ制御を引継ぎ、**Step Audio EditX** による先進的なテキスト指示型音声編集・修復・Zero-Shot Voice Cloning を実現した、ネイティブ・アメリカ英語による企業・教育動画向け次世代 TTS ＆ オーディオ編集スタジオです。

---

## 📖 目次 (Table of Contents)

1. [🌟 主な機能・特徴概要](#-主な機能特徴概要)
2. [🖥️ 画面・ページ別機能詳細ガイド (UI Tabs & Features)](#-画面ページ別機能詳細ガイド-ui-tabs--features)
   - [1. 🎙️ 音声合成 (TTS)](#1-🎙️-音声合成-tts)
   - [2. ✂️ 音声波形編集 (EditX)](#2-✂️-音声波形編集-editx)
   - [3. 👤 ボイスクローニング (Voice Cloning)](#3-👤-ボイスクローニング-voice-cloning)
   - [4. 🎬 マルチシーン動画原稿 (Video Script Studio)](#4-🎬-マルチシーン動画原稿-video-script-studio)
   - [5. 🎛️ オーディオ加工 (Audio Processor)](#5-🎛️-オーディオ加工-audio-processor)
3. [💡 目的別・逆引き実務ユースケースガイド (Workflows & Use Cases)](#-目的別逆引き実務ユースケースガイド-workflows--use-cases)
4. [🏷️ Q3-TTS インライン制御タグ 完全リファレンス (Tag Guide)](#-q3-tts-インライン制御タグ-完全リファレンス-tag-guide)
5. [🎛️ DSP ＆ イコライザー (EQ) 音響補正実践マニュアル](#-dsp--イコライザー-eq-音響補正実践マニュアル)
6. [🔬 音声精度 ＆ LCS 原稿照合エンジンの技術仕様](#-音声精度--lcs-原稿照合エンジンの技術仕様)
7. [🚀 起動方法 ＆ システム動作環境](#-起動方法--システム動作環境)
8. [🏗️ システム構造 (System Architecture)](#-システム構造-system-architecture)
9. [🔌 API エンドポイントリファレンス (API Reference)](#-api-エンドポイントリファレンス-api-reference)
10. [🔍 本家 Step-Audio (基盤モデル) との比較](#-本家-step-audio-基盤モデル-との比較)
11. [⚡ アーキテクチャ・無料利用と持続可能性](#-アーキテクチャ無料利用と持続可能性)
12. [❓ トラブルシューティング ＆ よくある質問 (FAQ)](#-トラブルシューティング--よくある質問-faq)
13. [🙌 謝辞・クレジッド (Acknowledgments & Attributions)](#-謝辞クレジッド-acknowledgments--attributions)
14. [📜 ライセンス ＆ 免責事項 (License & Disclaimer)](#-ライセンス--免責事項-license--disclaimer)

---

## 🌟 主な機能・特徴概要

- **ワンクリック1発起動 ＆ 日英UI切替 ＆ エンジンモード切替**: `start_server.bat` を実行するだけで環境構築・サーバー起動・ブラウザ自動オープンまで一括完了。右上のトグルで「日本語 ↔ English」表記を即座に切替可能。
- **[🌐 クラウド高速] ↔ [🏠 完全ローカル (オフライン)] 切替**: ローカルONNX（Piper）および LLM プロキシエンジンにより、オフラインPC環境でも100%ローカルで音声合成可能。
- **リアルタイムスペクトログラム ＆ 周波数解析ビジュアライザー (New)**: Web Audio API による 60fps ヒートマップ描画。波形 ↔ スペクトログラム切替 ＆ FFTサイズ調整（256〜2048）対応。
- **ドラッグ＆ドロップ一括バッチ音声変換 (Batch Audio Processor) (New)**: 複数音声・テキストのD&D受入、並列TTS処理＆音声強調、ZIP一括ダウンロード。
- **ノイズキャンセリング・音声フィルター ＆ 3バンドEQ (Audio Filter Chain) (New)**: 6種プリセット（Podcast, Classroom, Conference等）、ハイパス/ローパス周波数切断、3バンドパラメトリックEQ、リアルタイムプレビュー＆バイパス切替。
- **商用フリー全25種類ネイティブ英語音声 ＋ ローカルモデル**: 米国・英国・豪州・カナダ・愛・NZのアセンブル話者を搭載。
- **原稿一致照合診断 (Speech Alignment Verification)**: 単語タイムスタンプを用いた LCS アルゴリズムによる一致率算出 ＆ 色分け差分判定。

---

## 🖥️ 画面・ページ別機能詳細ガイド (UI Tabs & Features)

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

## 💡 目的別・逆引き実務ユースケースガイド (Workflows & Use Cases)

### ユースケース 1: 企業向け E-Learning / 研修動画ナレーションの作成
1. **「マルチシーン動画原稿」** タブを開きます。
2. 章やスライドごとにシーン（Scene 1, Scene 2...）を追加し、原稿テキストを入力します。
3. ナレーターに `en-US-AvaMultilingualNeural`（プロフェッショナルな女性ナレーター）を指定し、感情トーンを `Professional` に設定します。
4. **「全シーン一括レンダリング」** を実行すると、結合版音声とあわせて動画編集用の **.srt 字幕ファイル** が一括エクスポートされます。

### ユースケース 2: 英語リスニング教材・検定試験音源の作成
1. **「音声合成 (TTS)」** タブに長文スクリプトを入力し、改行で文ごとに区切ります。
2. タイトル指定（例: `Unit1_Listening`）を入力し、**「改行ごとにWAV分割出力」** をクリックします。
3. `Unit1_Listening_01_Good_morning_class.wav`, `Unit1_Listening_02_Today_we_will.wav` のようにナンバリングされた連番WAVファイル群がZIP形式でダウンロードされます。

### ユースケース 3: ポッドキャスト・解説動画の音響クオリティ向上
1. **「オーディオ加工」** タブを開きます。
2. 合成した音声または手持ちの録音音声をターゲットファイルに指定します。
3. フィルタープリセットから **「Podcast (温かみのある音声)」** または **「Voiceover Pro (放送品質)」** を選択します。
4. 低域のボツボツ音（ポップノイズ）が気になる場合は Highpass Cutoff を `120Hz` に引き上げ、**「フィルターチェーンを適用」** をクリックします。

---

## 🏷️ Q3-TTS インライン制御タグ 完全リファレンス (Tag Guide)

文章の中に直接組み込むことで、発声の途中でリアルタイムにピッチ・話速・ポーズ・感情を変更できるタグ一覧です。

| タグ構文 | 例 | 動作説明 |
| :--- | :--- | :--- |
| `[pause=X.Xs]` | `Hello.[pause=1.5s]Welcome!` | 1.5秒間の無音（ポーズ）を挿入します。 |
| `[speed=X.X]` | `This is [speed=1.3]fast speech.` | タグ以降の読み上げ速度を 1.3 倍速に変更します。 |
| `[pitch=+X%]` | `Higher [pitch=+15%]pitch tone.` | タグ以降の音程（ピッチ）を +15% 高くします。 |
| `[pitch=-X%]` | `Lower [pitch=-10%]pitch tone.` | タグ以降の音程（ピッチ）を -10% 低くします。 |
| `[emotion=X]` | `[emotion=enthusiastic]Great!` | 感情トーンを変更します（`professional`, `enthusiastic`, `serious`, `calm`, `conversational`, `soft`）。 |
| `[emphasis=high]` | `This is [emphasis=high]critical.` | 当該フレーズの強弱アクセント（強調）を強めます。 |

---

## 🎛️ DSP ＆ イコライザー (EQ) 音響補正実践マニュアル

### 1. フィルタープリセットの周波数特性と適用例

- **Podcast (ポッドキャスト)**:
  - ハイパス `120Hz` でマイクのボツボツ音（マイク近接効果・空調音）を遮断し、Mid (2.5kHz) を `+3dB` ブーストして声の明瞭度をアップ。
- **Classroom (教室・講義)**:
  - ハイパス `100Hz`, ローパス `12kHz` で高域の刺さるキンキン感を抑え、長時間のリスニングでも耳が疲れない落ち着いたトーンを実現。
- **Conference (会議室)**:
  - ハイパス `150Hz`, ローパス `10kHz` と強めのコンプレッサー処理で、室内残響ノイズを大幅カット。
- **Voiceover Pro (放送品質)**:
  - 低域 `320Hz` を `-3dB` シェビングして籠もりを取り除き、Mid (2.5kHz) `+4dB`, High (6kHz) `+4dB` のダブルブーストで透明感と抜けのあるプロ品質を実現。

### 2. 3バンド イコライザー (EQ) 帯域の役割
- **LOW (320 Hz)**: 声の厚みや低域の重み。上げすぎると「籠もった声」、下げると「すっきりしたシャープな声」になります。
- **MID (2.5 kHz)**: 子音（t, k, s等）の輪郭と滑舌の聞き取りやすさ。人間が最も聞き取りやすい周波数帯です。
- **HIGH (6.0 kHz)**: 息成分や子音のサ行・エア感。適切に上げると「透明感と煌びやかさ」が加わります。

---

## 🔬 音声精度 ＆ LCS 原稿照合エンジンの技術仕様

合成された音声と元の原稿テキストに乖離がないか自動診断する **Speech Alignment Verification** の仕組み：

1. **WordBoundary タイムスタンプ取得**:
   - 音声合成エンジン（edge-tts / Piper）から発声された各単語の開始時刻・終了時刻（ミリ秒）を取得。
2. **テキスト正規化 (Text Normalization)**:
   - 記号・カンマ・ピリオドを除去し、小文字化（Lowercasing）して比較用単語アレイを作成。
3. **最長共通部分列 (LCS: Longest Common Subsequence)**:
   - 動的計画法（Dynamic Programming）を用いて、入力原稿単語列と音声認識結果単語列の最大一致部分列を算出。
4. **一致率 ＆ 差分スコアリング**:
   - `一致率 = (2 * LCSの長さ) / (原稿単語数 + 音声単語数) * 100%`
   - 脱落単語（Missing Word）は **赤背景**、意図しない追加発声（Inserted Word）は **黄背景** でテキストハイライト表示。

---

## 🚀 起動方法 ＆ システム動作環境

### 動作環境
- **OS**: Windows 10 / 11 (64-bit)
- **Python**: Python 3.10 / 3.11 / 3.12 (環境構築バッチにより自動セットアップ)
- **必要メモリ**: 4 GB 以上 (ローカルモデル使用時は 8 GB 以上推奨)

### 起動手順
1. `start_server.bat` をダブルクリック。
2. 自動的に Python 仮想環境 (`.venv`) の作成と必要パッケージのインストールが実行されます。
3. Uvicorn サーバーが起動し、自動的にデフォルトブラウザで `http://127.0.0.1:8000` が開きます。

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
│   ├── outputs/                 # 生成WAV/MP3/ZIP/SRT保存先
│   ├── uploads/                 # アップロード音声保存先
│   └── clones/                  # クローン音声プロファイル保存先
├── start_server.bat             # 1クリック起動バッチ
├── run_server.py                # サーバー起動スクリプト
└── requirements.txt
```

---

## 🔌 API エンドポイントリファレンス (API Reference)

StepAudioEX サーバーが提供する主要な REST API エンドポイント一覧です。

### 1. `POST /api/tts/generate`
テキスト音声合成を実行します。
- **Request Body (JSON)**:
  ```json
  {
    "text": "Hello world! [pause=1s] Welcome to StepAudioEX.",
    "voice_id": "en-US-AvaMultilingualNeural",
    "pitch": "+0%",
    "rate": "+0%",
    "volume": "+0%",
    "emotion": "professional",
    "clarity_boost": true,
    "engine_mode": "cloud"
  }
  ```
- **Response (JSON)**:
  ```json
  {
    "status": "success",
    "audio_url": "/outputs/output_123456789.wav",
    "file_name": "output_123456789.wav",
    "duration": 3.45,
    "sample_rate": 24000
  }
  ```

### 2. `POST /api/filters/apply`
音声ファイルにノイズフィルターやイコライザーを適用します。
- **Request Body (JSON)**:
  ```json
  {
    "file_name": "output_123456789.wav",
    "preset": "podcast",
    "highpass_freq": 120.0,
    "lowpass_freq": 14000.0,
    "eq_low_gain": 0.0,
    "eq_mid_gain": 3.0,
    "eq_high_gain": 2.0
  }
  ```

### 3. `POST /api/batch/process`
複数ファイルの一括バッチ変換を実行します (`multipart/form-data`)。

### 4. `POST /api/batch/download-zip`
処理完了したファイル群をまとめて ZIP 圧縮ダウンロードします。

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
| **設定インターフェース**| テキスト指示メイン | **双方向数値入力ボックス ＆ 精密パラメトリック調整** |
| **連番WAV分割** | 一括WAVのみ | **改行ごと連番WAV・自動命名 ZIP一括出力** |

---

## ⚡ アーキテクチャ・無料利用と持続可能性

### 💡 1. 0秒起動 ＆ 高速生成の仕組み
- **ハイブリッド分散構成**: 音声合成の基本波形生成はクラウドのニューラル処理（Microsoft Edge Read Aloud プロトコル）を利用し、ローカルPCで数GBのVRAMロード待ちが発生しません。
- **ローカルDSP信号処理（Step Audio EditX）**: ポーズ挿入、ノイズカット・ボーカル強調（Clarity Boost）、フィルターEQ、精度検品はすべてご自身のPC（SciPy / SoundFile）で即座に処理されます。

### 🆓 2. API料金と利用継続性について
- **完全無料で利用可能**: APIキー登録や月額契約・クレジットカード設定は不要です。回数や文字数の制限なくご利用いただけます。
- **フォールバック（将来の備え）設計**: 万が一クラウドアクセス制限等の仕様変更が発生した場合でも、コード構造を変更せずに **完全ローカル完結型モデル（Kokoro-82M / Qwen2-Audio / 本家 Step-Audio 等）** へバックエンドプロキシを切り替えられる柔軟な設計になっております。

---

## ❓ トラブルシューティング ＆ よくある質問 (FAQ)

### Q1. `start_server.bat` を実行してもブラウザが開かない・エラーになる
- **対策**: ポート `8000` が他のアプリで使われていないか確認してください。コマンドプロンプトで `.venv\Scripts\python.exe run_server.py` を実行すると詳しいエラーログが表示されます。

### Q2. 音声を再生しても音が出ない・波形が動かない
- **対策**: ブラウザの自動再生ポリシーによりブロックされている場合があります。画面上の再生ボタン `▶` を一度クリックして再生を開始してください。

### Q3. オフライン（ネットなし）環境で音声合成したい
- **対策**: 画面右上のエンジン切替トグルを **「🏠 完全ローカル (オフライン)」** に切り替えてください。初回のみローカル軽量ONNXモデルが自動取得され、以降は完全オフラインで動作します。

---

## 🙌 謝辞・クレジッド (Acknowledgments & Attributions)

本プロジェクト **StepAudioEX** は、オープンソースコミュニティおよび先進的な研究機関・開発者の方々の素晴らしい成果と技術基盤の上に成り立っています。開発チーム・コミュニティの皆様に深く感謝と敬意を表します。

### 🤝 ベースモデル・基幹技術への謝辞
* **[Step Audio / Step Audio EditX](https://github.com/stepfun-ai/Step-Audio)** (StepFun AI)
  - テキスト指示型音声編集（Text-Guided Segment Replacement）、Zero-Shot Voice Cloning、先進的なオーディオ編集・アコースティックプロファイリング技術の設計思想および基礎フレームワークとしてインスパイア・活用させていただいております。
* **[Rhasspy Piper Voices](https://github.com/rhasspy/piper)** (Rhasspy)
  - 完全ローカル・オフライン音声合成エンジン用の高性能 ONNX ニューラルボイスモデル（Lessac, Ryan, LJSpeech, Amy）を提供。

### 🛠️ 利用・流用ライブラリ ＆ フレームワーク一覧
本アプリケーションの構築にあたり、以下のオープンソースソフトウェアおよびライブラリを使用・活用しています。

* **[edge-tts](https://github.com/rany2/edge-tts)**
  - Microsoft Edge のニューラル音声合成 Web API と同期し、ミリ秒単位の単語タイムスタンプ（WordBoundary）取得およびニュアンス・感情コントロールを実現。
* **[piper-tts](https://github.com/rhasspy/piper)** & **[onnxruntime](https://onnxruntime.ai/)**
  - 完全ローカル（オフライン）環境でのニューラル音声合成および高速推論。
* **[FastAPI](https://fastapi.tiangolo.com/)**
  - 高速でモダンな Python Web アプリケーションバックエンド・API フレームワーク。
* **[Uvicorn](https://www.uvicorn.org/)**
  - 非同期処理に対応した高性能 ASGI サーバー実装。
* **[SoundFile (PySoundFile)](https://python-soundfile.readthedocs.io/)** & **[Libsndfile](https://libsndfile.github.io/libsndfile/)**
  - 48kHz / 24kHz 高音質 WAV ファイルの入出力およびメモリ上での非破壊エンコード。
* **[SciPy](https://scipy.org/)** & **[NumPy](https://numpy.org/)**
  - 音声信号処理、ハイパスフィルター・イコライザー（Corporate Clarity Boost）、ピッチシフト・タイムストレッチの算術処理。
* **[pathvalidate](https://github.com/thombashi/pathvalidate)**
  - エクスポートファイル名および文字コードの安全なサニタイズ処理。
* **[Jinja2](https://jinja.palletsprojects.com/)**
  - テンプレートレンダリングエンジン。
* **[Remix Icon](https://remixicon.com/)**
  - UIで使用されている高品質オープンソースアイコンシステム。

---

## 📜 ライセンス ＆ 免責事項 (License & Disclaimer)

* **プロジェクトライセンス**: 本リポジトリのコードおよびUI構成は **[MIT License](https://opensource.org/licenses/MIT)** の下で公開されています。商用・個人利用を問わず自由にご利用・改変いただけます。
* **各サードパーティライセンス遵守**: 使用している各ライブラリ（MIT / Apache 2.0 / BSD / Remix Icon License等）のライセンス条項に準拠して開発されています。
* **商用利用に関する免責事項**: 音声合成（TTS）出力データおよび生成物の商用利用範囲については、ご使用になる環境・クラウドプロバイダーおよび参照音声の権利規定をご確認の上ご使用ください。
