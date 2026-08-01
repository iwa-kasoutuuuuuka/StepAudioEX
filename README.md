# StepAudioEX Studio

**StepAudioEX** は、Q3-TTS 仕様と同等の表現力・精細なパラメータ制御を引継ぎ、**Step Audio EditX** による先進的なテキスト指示型音声編集・修復・Zero-Shot Voice Cloning を実現した、ネイティブ・アメリカ英語による企業・教育動画向け次世代 TTS ＆ オーディオ編集スタジオです。

---

## 🌟 主な機能・特徴

1. **ワンクリック1発起動 ＆ 日英UI切替 (i18n)**
   - **ダブルクリック起動**: `start_server.bat` を実行するだけで環境構築・サーバー起動・ブラウザ自動オープンまで一括完了。
   - **バイリンガルUI**: 画面右上の切替トグルで画面全体の「日本語 ↔ English」表記をワンクリック切替可能。

2. **企業・教育動画向け ネイティブ・アメリカ英語 プリセット (全13種類)**
   - **Ava (Training Specialist)**: 明瞭で親しみやすく、社内研修やeラーニングに最適
   - **Andrew (Executive Presenter)**: 役員プレゼンやコンプライアンス等、威厳と明瞭さを備えたトーン
   - **Brian (Tech Instructor)**: IT・システム操作ガイドや製品チュートリアルに最適なテンポ
   - **Emma (Onboarding Coach)**: 温かみのある新入社員オンボーディング・インストラクション向け
   - **Guy (Senior Instructor)**: 長編教育コンテンツ向けの落ち着いたトーン
   - **Jenny (HR & Compliance)**: 規約・安全講習向けの落ち着いたトーン
   - **Aria (Product Walkthrough)**: 製品デモやプロモーション向けの明るいトーン
   - **Christopher (News & Documentary)**: ナレーション・朗読・ニュースに最適な深みのある男性声
   - **Eric (Casual & Friendly)**: ポッドキャストやフレンドリーな解説向け
   - **Michelle (Warm Specialist)**: 医療・カスタマーサクセス・学習者向け温かみのある女性声
   - **Ana (Youth & K-12 Educator)**: 初等教育・子供向け教材に最適
   - **Roger (Broadcast Journalist)**: 報道ニュース・エグゼクティブアナウンス向け
   - **Steffan (Friendly Narrator)**: オーディオブックや長文ガイド向けナレーター

3. **改行ごと分割WAV出力 ＆ カスタムファイル名命名規則 (ZIPエクスポート)**
   - 複数行の文章を入力した際、改行ごとに個別のWAVファイルを自動生成。
   - **命名規則**: `[任意接頭辞]_[01, 02...]_[文章冒頭20文字].wav` （例: `Lesson1_01_Welcome_to_the_corpo.wav`）
   - 生成したファイル群はZIP圧縮形式で一括ダウンロード可能。

4. **Q3-TTS コントロール仕様**
   - **インライン制御タグ**: `[pause=1.0s]`, `[emotion=enthusiastic]`, `[pitch=+5%]`, `[speed=1.1]`, `[emphasis=high]`
   - **感情トーン制御**: Professional, Enthusiastic, Serious, Calm, Conversational, Soft
   - **話速・ピッチ・強調調整**: 精密なパラメトリック設定

5. **Step Audio EditX 音声編集・修復エンジン**
   - **Text-Guided Audio Edit (テキスト部分差し替え)**: 音声内の特定の時間範囲・フレーズを新しいテキスト音声にシームレスに差し替え
   - **ポーズ挿入**: なめらかなクロスフェードによる無音区間挿入
   - **ピッチシフト / タイムストレッチ**: 音程・テンポの非破壊調整
   - **Corporate Clarity Boost**: ノイズカット（ハイパス）＋ 2k~5kHz ボーカル強調 ＋ ピークノーマライズ

6. **Zero-Shot Voice Cloning (ボイスクローニング) ＆ 管理・削除**
   - 10〜30秒の参照音声 (.wav / .mp3) からアコースティックプロファイルを抽出
   - クローン音声を登録し、同一話者声質でのテキスト読み上げを即座に生成
   - 登録済みクローン音声の不要データ・参照WAVの1クリックワンタップ削除機能。

7. **企業動画向け マルチシーン・スクリプトスタジオ**
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

### 🛠️ 利用・流用ライブラリ ＆ フレームワーク一覧
本アプリケーションの構築にあたり、以下のオープンソースソフトウェアおよびライブラリを使用・活用しています。

* **[edge-tts](https://github.com/rany2/edge-tts)**
  - Microsoft Edge のニューラル音声合成 Web API と同期し、ミリ秒単位の単語タイムスタンプ（WordBoundary）取得およびニュアンス・感情コントロールを実現。
* **[FastAPI](https://fastapi.tiangolo.com/)**
  - 高速でモダンな Python Web アプリケーションバックエンド・API フレームワーク。
* **[Uvicorn](https://www.uvicorn.org/)**
  - 非同期処理に対応した高性能 ASGI サーバー実装。
* **[SoundFile (PySoundFile)](https://python-soundfile.readthedocs.io/)** & **[Libsndfile](https://libsndfile.github.io/libsndfile/)**
  - 48kHz / 24kHz 高音質 WAV ファイルの入出力およびメモリ上での非破壊エンコード。
* **[SciPy](https://scipy.org/)** & **[NumPy](https://numpy.org/)**
  - 音声信号処理、ハイパスフィルター・イコライザー（Corporate Clarity Boost）、ピッチシフト・タイムストレッチの算術処理。
* **[Jinja2](https://jinja.palletsprojects.com/)**
  - テンプレートレンダリングエンジン。
* **[Remix Icon](https://remixicon.com/)**
  - UIで使用されている高品質オープンソースアイコンシステム。

---

## 📜 ライセンス ＆ 免責事項 (License & Disclaimer)

* **プロジェクトライセンス**: 本リポジトリのコードおよびUI構成は **[MIT License](https://opensource.org/licenses/MIT)** の下で公開されています。商用・個人利用を問わず自由にご利用・改変いただけます。
* **各サードパーティライセンス遵守**: 使用している各ライブラリ（MIT / Apache 2.0 / BSD / Remix Icon License等）のライセンス条項に準拠して開発されています。
* **商用利用に関する免責事項**: 音声合成（TTS）出力データおよび生成物の商用利用範囲については、ご使用になる環境・クラウドプロバイダーおよび参照音声の権利規定をご確認の上ご使用ください。

