# StepAudioEX Studio

**StepAudioEX** は、Q3-TTS 仕様と同等の表現力・精細なパラメータ制御を引継ぎ、**Step Audio EditX** による先進的なテキスト指示型音声編集・修復・Zero-Shot Voice Cloning を実現した、ネイティブ・アメリカ英語による企業・教育動画向け次世代 TTS ＆ オーディオ編集スタジオです。

---

## 🌟 主な機能・特徴

1. **ワンクリック1発起動 ＆ 日英UI切替 ＆ エンジンモード切替**
   - **ダブルクリック起動**: `start_server.bat` を実行するだけで環境構築・サーバー起動・ブラウザ自動オープンまで一括完了。
   - **バイリンガルUI**: 画面右上の切替トグルで画面全体の「日本語 ↔ English」表記をワンクリック切替可能。
   - **[🌐 クラウド高速] ↔ [🏠 完全ローカル (オフライン)] 切替**: インターネット未接続環境やセキュリティ規定の厳しい社内ネットワークでも、ローカルONNX（Piper）および LLM（Qwen2-Audio / F5-TTS / ChatTTS）プロキシエンジンにより100%ローカルPC内のみで完全オフライン音声合成が可能。

2. **グローバル英語・ビジネス動画向け プリセット音声 (完全無料・商用フリー全25種類 ＋ ローカルモデル)**
   - **米国アクセント (US)**: Ava, Andrew, Brian, Emma, Guy, Jenny, Aria, Christopher, Eric, Michelle, Ana, Roger, Steffan
   - **英国アクセント (UK / British)**: Ryan (Executive Male), Sonia (Educator Female), Libby (Storyteller Female), Thomas (Instructor Male)
   - **オーストラリア / カナダ / アイルランド / NZ**: Natasha, William, Clara, Liam, Emily, Connor, Molly, Mitchell
   - **ローカルモデル (Auto-Download)**: Lessac, Ryan (High Quality), LJSpeech, Amy
   - **カテゴリ・性別フィルター**: 「すべての音声」「女性」「男性」「クローン」タブと動的件数バッジ（例: `男性 (13)`）による快適な音声検索。

3. **改行ごと分割WAV出力 ＆ カスタムファイル名命名規則 (ZIPエクスポート)**
   - 複数行の文章を入力した際、改行ごとに個別のWAVファイルを自動生成。
   - **命名規則**: `[任意接頭辞]_[01, 02...]_[文章冒頭20文字].wav` （例: `Lesson1_01_Welcome_to_the_corpo.wav`）
   - 生成したファイル群はZIP圧縮形式で一括ダウンロード可能。

4. **音声精度 ＆ 原稿一致照合診断 (Speech Alignment & Verification Engine)**
   - **ミリ秒単位アライメント抽出**: ニューラル合成時に生成される単語境界タイムスタンプ（WordBoundary）を利用し、AIが発声した生の単語シーケンスを取得。
   - **動的最長共通部分列 (LCS) 照合**: 動的計画法アルゴリズム（`SequenceMatcher`）により、原稿と音声の単語レベルでの一致率（0%〜100%）を精密算出。
   - **差分自動判定 ＆ カラーハイライト**: 一致（緑）・脱落（赤）・音声側での意図しない追加発声（黄）を自動検出し、検品結果をUI上に表示。

5. **Q3-TTS コントロール仕様 ＆ ドラッグ＆ドロップ原稿読み込み**
   - **インライン制御タグ**: `[pause=1.0s]`, `[emotion=enthusiastic]`, `[pitch=+5%]`, `[speed=1.1]`, `[emphasis=high]`
   - **ドラッグ＆ドロップ機能**: テキストファイル（`.txt`, `.md`, `.srt`, `.vtt`, `.csv`）を編集エリアにドロップするだけで即座に自動展開・入力完了。
   - **感情トーン制御**: Professional, Enthusiastic, Serious, Calm, Conversational, Soft
   - **話速・ピッチ・強調調整**: 精密なパラメトリック設定と双方向数値入力ボックス対応

6. **Step Audio EditX 音声編集・修復エンジン**
   - **Text-Guided Audio Edit (テキスト部分差し替え)**: 音声内の特定の時間範囲・フレーズを新しいテキスト音声にシームレスに差し替え
   - **ポーズ挿入**: なめらかなクロスフェードによる無音区間挿入
   - **ピッチシフト / タイムストレッチ**: 音程・テンポの非破壊調整
   - **Corporate Clarity Boost**: ノイズカット（ハイパス）＋ 2k~5kHz ボーカル強調 ＋ ピークノーマライズ

7. **Zero-Shot Voice Cloning (ボイスクローニング) ＆ 管理・削除**
   - 10〜30秒の参照音声 (.wav / .mp3) からアコースティックプロファイルを抽出
   - クローン音声を登録し、同一話者声質でのテキスト読み上げを即座に生成
   - 登録済みクローン音声の不要データ・参照WAVの1クリックワンタップ削除機能。

8. **企業動画向け マルチシーン・スクリプトスタジオ**
   - スライド/シーンごとのスクリプト管理・複数話者の割り当て
   - 字幕ファイル (SRT / VTT) の自動生成と一括エクスポート

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

## 謝辞・クレジッド（Acknowledgments & Attributions）

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

## 🔍 本家 Step-Audio (基盤モデル) との音声合成における相違点

本プロジェクトは、StepFun AI が公開しているオープンソースのローカルLLM基盤「Step-Audio」の先進的な音声編集思想を元に、**企業・教育動画制作の現場実務に特化**して再構築したシステムです。一般的な基盤モデルとの主な違いは以下の通りです：

| 比較項目 | 本家 Step-Audio (基盤モデル) | StepAudioEX Studio (本システム) |
| :--- | :--- | :--- |
| **主な用途・目的** | 汎用音声会話・対話LLM研究 | **企業・教育動画ナレーション制作・検品** |
| **起動・マウント時間** | 数GBのVRAMマウントに数分要する | **0秒即時起動** (軽量ハイブリッド構成) |
| **生成スピード** | リアルタイム比 0.5〜1.0倍 (やや遅い) | **リアルタイム比 10倍以上 (超高速)** |
| **アライメント・検品** | タイムスタンプ抽出なし | **ミリ秒単位 WordBoundary 抽出 ＆ 原稿照合診断** |
| **字幕エクスポート** | SRT/VTT生成不可 | **SRT / VTT 字幕ファイル自動生成** |
| **音声ラインナップ** | 中国語中心 ＆ 英語混在 | **多国籍ネイティブ英語 25話者 (米・英・豪・加・愛・NZ)** |
| **設定インターフェース**| テキスト指示メイン | **双方向数値入力ボックス ＆ 精密パラメトリック調整** |
| **連番WAV分割** | 一括WAVのみ | **改行ごと連番WAV・自動命名 ZIP一括出力** |

---

## ⚡ アーキテクチャ・無料利用と持続可能性 (System Architecture & Sustainability)

### 💡 1. 0秒起動 ＆ 高速生成の仕組み
本システムが Qwen-TTS 等のローカルLLMモデルと異なり、**「起動時のモデル読み込み時間（マウント時間）がゼロ」かつ「超高速生成」** を実現している理由は、以下の**ハイブリッド・アーキテクチャ**を採用しているためです。

* **ハイブリッド分散構成**:
  - 音声合成の基本波形生成は、クラウドのニューラル処理（Microsoft Edge Read Aloud プロトコル）を利用。ローカルPCで数GBの重いVRAMロード待ちが発生しません。
* **ローカルDSP信号処理（Step Audio EditX）**:
  - ポーズの精確挿入、ノイズカット・ボーカル強調（Clarity Boost）、ピッチ調整、精度検品（文字起こし照合）は、すべてご自身のPC（SciPy / SoundFile）で即座に非破壊処理されます。

### 🆓 2. API料金と利用継続性について
* **完全無料で利用可能**:
  - APIキー登録や月額契約・クレジットカード設定は不要です。回数や文字数の制限なくご利用いただけます。
* **今後の持続可能性・将来のリスク**:
  - 現状は無料で安定してご利用いただけますが、将来的にクラウドプロバイダー側のアクセシビリティ通信の仕様変更や認証制限が行われた場合、一時的に影響を受ける可能性があります。
* **フォールバック（将来の備え）設計**:
  - 万が一クラウドアクセス制限等の仕様変更が発生した場合でも、本アプリはコード構造を変更せずに **完全ローカル完結型モデル（Kokoro-82M / Qwen2-Audio / 本家 Step-Audio 等）** へバックエンドプロキシを切り替えられる柔軟な設計になっております。

---

## 📜 ライセンス ＆ 免責事項 (License & Disclaimer)

* **プロジェクトライセンス**: 本リポジトリのコードおよびUI構成は **[MIT License](https://opensource.org/licenses/MIT)** の下で公開されています。商用・個人利用を問わず自由にご利用・改変いただけます。
* **各サードパーティライセンス遵守**: 使用している各ライブラリ（MIT / Apache 2.0 / BSD / Remix Icon License等）のライセンス条項に準拠して開発されています。
* **商用利用に関する免責事項**: 音声合成（TTS）出力データおよび生成物の商用利用範囲については、ご使用になる環境・クラウドプロバイダーおよび参照音声の権利規定をご確認の上ご使用ください。


