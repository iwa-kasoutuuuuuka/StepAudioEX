import os
import io
import wave
import urllib.request
import numpy as np
from typing import Tuple, List, Dict, Any

class LocalTTSEngine:
    """
    Offline Local TTS Engine using Piper ONNX models.
    Supports multiple corporate & educational US English voices with auto-downloading.
    Operates 100% locally without external network connections once model is cached.
    """
    LOCAL_MODELS = {
        "local_en_US_lessac_medium": {
            "name": "Lessac - Corporate Instructor (Female)",
            "onnx_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
            "json_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
            "filename": "en_US-lessac-medium.onnx"
        },
        "local_en_US_ryan_high": {
            "name": "Ryan - Executive Narrator (Male)",
            "onnx_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx",
            "json_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx.json",
            "filename": "en_US-ryan-high.onnx"
        },
        "local_en_US_ljspeech_high": {
            "name": "LJSpeech - Educational Specialist (Female)",
            "onnx_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/en_US-ljspeech-high.onnx",
            "json_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/en_US-ljspeech-high.onnx.json",
            "filename": "en_US-ljspeech-high.onnx"
        },
        "local_en_US_amy_medium": {
            "name": "Amy - Clear Tutor (Female)",
            "onnx_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx",
            "json_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json",
            "filename": "en_US-amy-medium.onnx"
        }
    }

    def __init__(self, models_dir: str = "data/models"):
        self.models_dir = models_dir
        os.makedirs(self.models_dir, exist_ok=True)
        self._loaded_voices = {}

    def ensure_model_downloaded(self, model_key: str) -> Tuple[str, str]:
        """Downloads lightweight ONNX voice model for offline use if not present."""
        info = self.LOCAL_MODELS.get(model_key, self.LOCAL_MODELS["local_en_US_lessac_medium"])
        model_path = os.path.join(self.models_dir, info["filename"])
        config_path = os.path.join(self.models_dir, info["filename"] + ".json")

        if not os.path.exists(model_path):
            print(f"[LocalTTSEngine] Downloading offline voice model '{info['name']}' to {model_path}...")
            urllib.request.urlretrieve(info["onnx_url"], model_path)
        if not os.path.exists(config_path):
            print(f"[LocalTTSEngine] Downloading model config to {config_path}...")
            urllib.request.urlretrieve(info["json_url"], config_path)

        return model_path, config_path

    def load_voice(self, model_key: str):
        if model_key in self._loaded_voices:
            return self._loaded_voices[model_key]

        model_path, config_path = self.ensure_model_downloaded(model_key)
        try:
            from piper import PiperVoice
            voice = PiperVoice.load(model_path, config_path=config_path)
            self._loaded_voices[model_key] = voice
            return voice
        except Exception as e:
            print(f"[LocalTTSEngine] Failed to load PiperVoice '{model_key}': {e}")
            return None

    def synthesize(self, text: str, model_key: str = "local_en_US_lessac_medium") -> Tuple[np.ndarray, int, List[Dict[str, Any]]]:
        """
        Synthesizes text 100% offline using specified local ONNX model.
        Returns (audio_data_numpy, sample_rate, word_timestamps).
        """
        voice = self.load_voice(model_key)
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
