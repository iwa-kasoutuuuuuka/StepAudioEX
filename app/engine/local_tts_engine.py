import os
import io
import wave
import urllib.request
import numpy as np
from typing import Tuple, List, Dict, Any

class LocalTTSEngine:
    """
    Offline Local TTS Engine using Piper ONNX models.
    Operates 100% locally without external network connections once model is cached.
    """
    MODEL_URL = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx"
    CONFIG_URL = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json"

    def __init__(self, models_dir: str = "data/models"):
        self.models_dir = models_dir
        os.makedirs(self.models_dir, exist_ok=True)
        self.model_path = os.path.join(self.models_dir, "en_US-lessac-medium.onnx")
        self.config_path = os.path.join(self.models_dir, "en_US-lessac-medium.onnx.json")
        self._piper_voice = None

    def is_model_ready(self) -> bool:
        return os.path.exists(self.model_path) and os.path.exists(self.config_path)

    def ensure_model_downloaded(self):
        """Downloads lightweight ONNX voice model for offline use if not present."""
        if not os.path.exists(self.model_path):
            print(f"[LocalTTSEngine] Downloading offline voice model to {self.model_path}...")
            urllib.request.urlretrieve(self.MODEL_URL, self.model_path)
        if not os.path.exists(self.config_path):
            print(f"[LocalTTSEngine] Downloading offline model config to {self.config_path}...")
            urllib.request.urlretrieve(self.CONFIG_URL, self.config_path)

    def load_voice(self):
        if self._piper_voice is not None:
            return self._piper_voice

        self.ensure_model_downloaded()
        try:
            from piper import PiperVoice
            self._piper_voice = PiperVoice.load(self.model_path, config_path=self.config_path)
            return self._piper_voice
        except Exception as e:
            print(f"[LocalTTSEngine] Failed to load PiperVoice: {e}")
            return None

    def synthesize(self, text: str) -> Tuple[np.ndarray, int, List[Dict[str, Any]]]:
        """
        Synthesizes text 100% offline.
        Returns (audio_data_numpy, sample_rate, word_timestamps).
        """
        voice = self.load_voice()
        if voice is None:
            # Fallback offline tone if model load fails
            sr = 22050
            dur = max(0.5, len(text) * 0.06)
            t = np.linspace(0, dur, int(sr * dur), dtype=np.float32)
            audio = np.sin(2 * np.pi * 440.0 * t) * 0.1
            words = text.split()
            ts = []
            word_dur = dur / max(1, len(words))
            for i, w in enumerate(words):
                ts.append({"word": w, "offset": i * word_dur, "duration": word_dur})
            return audio, sr, ts

        # Synthesize audio with Piper
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, "wb") as wav_file:
            voice.synthesize_wav(text, wav_file)

        wav_buffer.seek(0)
        with wave.open(wav_buffer, "rb") as wav_file:
            sr = wav_file.getframerate()
            n_frames = wav_file.getnframes()
            audio_bytes = wav_file.readframes(n_frames)
            audio_int16 = np.frombuffer(audio_bytes, dtype=np.int16)
            audio_data = audio_int16.astype(np.float32) / 32768.0

        # Generate approximate word timestamps for subtitle & alignment verification
        words = [w.strip(".,!?;:\"'()[]") for w in text.split() if w.strip()]
        total_duration = len(audio_data) / sr
        timestamps = []
        if words:
            word_dur = total_duration / len(words)
            for idx, w in enumerate(words):
                timestamps.append({
                    "word": w,
                    "offset": round(idx * word_dur, 3),
                    "duration": round(word_dur, 3)
                })

        return audio_data, sr, timestamps
