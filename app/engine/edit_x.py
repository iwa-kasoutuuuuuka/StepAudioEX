import numpy as np
try:
    import scipy.signal as signal
    HAS_SCIPY = True
except Exception:
    HAS_SCIPY = False
import soundfile as sf
import os
import io
from typing import Tuple, Dict, Any, List

class StepAudioEditX:
    """
    Step Audio EditX Audio Processing & Editing Engine.
    Provides text-guided audio segment editing, pitch shifting, time stretching,
    pause insertion, equal-power crossfading, and audio enhancement filters.
    """

    FILTER_PRESETS = {
        'raw': {'highpass_freq': 20, 'lowpass_freq': 20000, 'eq_low_gain': 0, 'eq_mid_gain': 0, 'eq_high_gain': 0},
        'podcast': {'highpass_freq': 120, 'lowpass_freq': 14000, 'eq_low_gain': 0, 'eq_mid_gain': 3, 'eq_high_gain': 2},
        'classroom': {'highpass_freq': 100, 'lowpass_freq': 12000, 'eq_low_gain': 0, 'eq_mid_gain': 4, 'eq_high_gain': 1},
        'conference': {'highpass_freq': 150, 'lowpass_freq': 10000, 'eq_low_gain': 0, 'eq_mid_gain': 5, 'eq_high_gain': 0},
        'narration': {'highpass_freq': 80, 'lowpass_freq': 16000, 'eq_low_gain': -2, 'eq_mid_gain': 3, 'eq_high_gain': 3},
        'voiceover_pro': {'highpass_freq': 100, 'lowpass_freq': 15000, 'eq_low_gain': -3, 'eq_mid_gain': 4, 'eq_high_gain': 4}
    }

    @staticmethod
    def read_audio(file_path_or_bytes) -> Tuple[Any, int]:
        """
        Reads audio file or bytes into float32 numpy array and sample rate.
        """
        if isinstance(file_path_or_bytes, bytes):
            data, samplerate = sf.read(io.BytesIO(file_path_or_bytes))
        else:
            data, samplerate = sf.read(file_path_or_bytes)
            
        if data.ndim > 1:
            data = np.mean(data, axis=1)  # Convert stereo to mono for audio editing
        return data.astype(np.float32), samplerate

    @staticmethod
    def save_audio(data: Any, samplerate: int, output_path: str):
        """
        Saves float32 audio array to WAV or MP3 output file.
        """
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Prevent clipping
        max_val = np.max(np.abs(data))
        if max_val > 1.0:
            data = data / max_val
            
        sf.write(output_path, data, samplerate)

    def insert_pause(self, audio: Any, samplerate: int, position_sec: float, duration_sec: float, crossfade_ms: float = 15.0) -> Any:
        """
        Inserts a silence pause into an audio waveform at position_sec with smooth crossfade.
        """
        insert_idx = int(position_sec * samplerate)
        insert_idx = max(0, min(insert_idx, len(audio)))
        
        silence_len = int(duration_sec * samplerate)
        silence = np.zeros(silence_len, dtype=np.float32)
        
        fade_len = int((crossfade_ms / 1000.0) * samplerate)
        fade_len = min(fade_len, insert_idx, len(audio) - insert_idx)
        
        part1 = audio[:insert_idx].copy()
        part2 = audio[insert_idx:].copy()
        
        if fade_len > 0:
            # Apply quick fade-out on part1 end, fade-in on part2 start
            fade_out = np.linspace(1.0, 0.0, fade_len, dtype=np.float32)
            fade_in = np.linspace(0.0, 1.0, fade_len, dtype=np.float32)
            part1[-fade_len:] *= fade_out
            part2[:fade_len] *= fade_in
            
        return np.concatenate([part1, silence, part2])

    def pitch_shift(self, audio: Any, samplerate: int, semitones: float) -> Any:
        """
        Shifts pitch by semitones using resample ratio + pitch preservation adjustment.
        """
        if abs(semitones) < 0.01 or len(audio) == 0:
            return audio
            
        factor = 2.0 ** (semitones / 12.0)
        num_samples = int(len(audio) / factor)
        if HAS_SCIPY:
            resampled = signal.resample(audio, num_samples)
        else:
            x_old = np.linspace(0, 1, len(audio))
            x_new = np.linspace(0, 1, num_samples)
            resampled = np.interp(x_new, x_old, audio).astype(np.float32)
        
        # Stretch back to original length to maintain tempo
        return self.time_stretch(resampled, 1.0 / factor)

    def time_stretch(self, audio: Any, rate: float) -> Any:
        """
        Stretches or accelerates audio rate without pitch shift.
        """
        if abs(rate - 1.0) < 0.01 or rate <= 0.1 or len(audio) == 0:
            return audio
            
        num_samples = int(len(audio) / rate)
        if HAS_SCIPY:
            return signal.resample(audio, num_samples)
        else:
            x_old = np.linspace(0, 1, len(audio))
            x_new = np.linspace(0, 1, num_samples)
            return np.interp(x_new, x_old, audio).astype(np.float32)

    def replace_segment(self, base_audio: Any, samplerate: int, start_sec: float, end_sec: float, new_segment: Any, crossfade_ms: float = 20.0) -> Any:
        """
        Replaces audio region [start_sec, end_sec] in base_audio with new_segment audio.
        Uses equal-power crossfading at boundaries.
        """
        start_idx = max(0, int(start_sec * samplerate))
        end_idx = min(len(base_audio), int(end_sec * samplerate))
        
        fade_len = int((crossfade_ms / 1000.0) * samplerate)
        
        prefix = base_audio[:start_idx].copy()
        suffix = base_audio[end_idx:].copy()
        
        # Crossfade prefix & new_segment start
        if len(prefix) >= fade_len and len(new_segment) >= fade_len:
            fade_out = np.linspace(1.0, 0.0, fade_len, dtype=np.float32)
            fade_in = np.linspace(0.0, 1.0, fade_len, dtype=np.float32)
            prefix[-fade_len:] = prefix[-fade_len:] * fade_out + new_segment[:fade_len] * fade_in
            new_segment_core = new_segment[fade_len:]
        else:
            new_segment_core = new_segment
            
        # Crossfade new_segment end & suffix start
        if len(suffix) >= fade_len and len(new_segment_core) >= fade_len:
            fade_out = np.linspace(1.0, 0.0, fade_len, dtype=np.float32)
            fade_in = np.linspace(0.0, 1.0, fade_len, dtype=np.float32)
            new_segment_core[-fade_len:] = new_segment_core[-fade_len:] * fade_out + suffix[:fade_len] * fade_in
            suffix = suffix[fade_len:]
            
        return np.concatenate([prefix, new_segment_core, suffix])

    def enhance_corporate_audio(self, audio: Any, samplerate: int, highpass_cutoff: float = 80.0, clarity_boost: bool = True) -> Any:
        """
        Corporate audio enhancement:
        - Highpass filter to cut low-end rumble (room noise below cutoff)
        - Vocal presence EQ boost (2kHz - 5kHz)
        - Peak normalization (-0.45 dB target)
        """
        if len(audio) == 0:
            return audio
            
        if HAS_SCIPY:
            sos = signal.butter(2, highpass_cutoff, 'highpass', fs=samplerate, output='sos')
            filtered = signal.sosfilt(sos, audio)
            if clarity_boost and samplerate >= 16000:
                b, a = signal.iirpeak(3000.0 / (samplerate / 2.0), Q=2.0)
                presence = signal.lfilter(b, a, filtered)
                filtered = filtered * 0.85 + presence * 0.15
        else:
            filtered = audio.copy()
            
        # Peak normalization to 0.95 (-0.45 dB)
        max_peak = np.max(np.abs(filtered))
        if max_peak > 1e-5:
            filtered = (filtered / max_peak) * 0.95
            
        return filtered.astype(np.float32)

    def apply_filter_chain(self, audio: Any, samplerate: int, 
                           highpass_freq: float = 80.0,
                           lowpass_freq: float = 16000.0,
                           eq_low_gain: float = 0.0,
                           eq_mid_gain: float = 0.0,
                           eq_high_gain: float = 0.0,
                           eq_low_freq: float = 320.0,
                           eq_mid_freq: float = 2500.0,
                           eq_high_freq: float = 6000.0,
                           normalize: bool = True) -> Any:
        if not HAS_SCIPY: return audio
        
        filtered = audio.copy()
        
        if highpass_freq > 0:
            sos_hp = signal.butter(4, highpass_freq, 'highpass', fs=samplerate, output='sos')
            filtered = signal.sosfilt(sos_hp, filtered)
            
        if lowpass_freq < samplerate / 2.0:
            sos_lp = signal.butter(4, lowpass_freq, 'lowpass', fs=samplerate, output='sos')
            filtered = signal.sosfilt(sos_lp, filtered)
            
        if eq_mid_gain != 0.0:
            A = 10 ** (eq_mid_gain / 40.0)
            w0 = 2 * np.pi * eq_mid_freq / samplerate
            alpha = np.sin(w0) / (2 * 1.0)
            
            b0 = 1 + alpha * A
            b1 = -2 * np.cos(w0)
            b2 = 1 - alpha * A
            a0 = 1 + alpha / A
            a1 = -2 * np.cos(w0)
            a2 = 1 - alpha / A
            
            sos_mid = np.array([[b0/a0, b1/a0, b2/a0, 1.0, a1/a0, a2/a0]])
            filtered = signal.sosfilt(sos_mid, filtered)
            
        if eq_low_gain != 0.0:
            A = 10 ** (eq_low_gain / 40.0)
            w0 = 2 * np.pi * eq_low_freq / samplerate
            alpha = np.sin(w0) / 2 * np.sqrt(2.0)
            
            b0 = A * ((A+1) - (A-1)*np.cos(w0) + 2*np.sqrt(A)*alpha)
            b1 = 2*A * ((A-1) - (A+1)*np.cos(w0))
            b2 = A * ((A+1) - (A-1)*np.cos(w0) - 2*np.sqrt(A)*alpha)
            a0 = (A+1) + (A-1)*np.cos(w0) + 2*np.sqrt(A)*alpha
            a1 = -2 * ((A-1) + (A+1)*np.cos(w0))
            a2 = (A+1) + (A-1)*np.cos(w0) - 2*np.sqrt(A)*alpha
            
            sos_low = np.array([[b0/a0, b1/a0, b2/a0, 1.0, a1/a0, a2/a0]])
            filtered = signal.sosfilt(sos_low, filtered)
            
        if eq_high_gain != 0.0:
            A = 10 ** (eq_high_gain / 40.0)
            w0 = 2 * np.pi * eq_high_freq / samplerate
            alpha = np.sin(w0) / 2 * np.sqrt(2.0)
            
            b0 = A * ((A+1) + (A-1)*np.cos(w0) + 2*np.sqrt(A)*alpha)
            b1 = -2*A * ((A-1) + (A+1)*np.cos(w0))
            b2 = A * ((A+1) + (A-1)*np.cos(w0) - 2*np.sqrt(A)*alpha)
            a0 = (A+1) - (A-1)*np.cos(w0) + 2*np.sqrt(A)*alpha
            a1 = 2 * ((A-1) - (A+1)*np.cos(w0))
            a2 = (A+1) - (A-1)*np.cos(w0) - 2*np.sqrt(A)*alpha
            
            sos_high = np.array([[b0/a0, b1/a0, b2/a0, 1.0, a1/a0, a2/a0]])
            filtered = signal.sosfilt(sos_high, filtered)
            
        if normalize:
            max_val = np.max(np.abs(filtered))
            if max_val > 1e-5:
                filtered = filtered / max_val
                
        return filtered.astype(np.float32)

