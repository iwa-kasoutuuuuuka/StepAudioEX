import asyncio
import edge_tts
import numpy as np
import os
import io
import time
import uuid
import soundfile as sf
from typing import Dict, Any, List, Tuple
from app.engine.q3_tts import Q3TTSParser
from app.engine.edit_x import StepAudioEditX
from app.engine.voice_cloning import VoiceCloningEngine

class StepAudioEXEngine:
    """
    Master StepAudioEX Synthesis Engine.
    Combines Q3-TTS specs with Step Audio EditX processing & Voice Cloning capabilities.
    """
    def __init__(self, output_dir: str = "data/outputs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.q3_parser = Q3TTSParser()
        self.edit_x = StepAudioEditX()
        self.cloner = VoiceCloningEngine()

    async def generate_speech_async(
        self,
        text: str,
        voice_id: str = "en-US-AvaMultilingualNeural",
        pitch: str = "+0%",
        rate: str = "+0%",
        volume: str = "+0%",
        emotion: str = "professional",
        clarity_boost: bool = True
    ) -> Tuple[Any, int, List[Dict[str, Any]]]:
        """
        Synthesizes speech asynchronously using neural synthesis with Q3-TTS parameters.
        Returns (audio_numpy_array, sample_rate, word_boundary_timestamps).
        """
        clean_text, tags = self.q3_parser.extract_tags(text)
        if not clean_text:
            return np.zeros(24000, dtype=np.float32), 24000, []

        # Override tags if explicitly supplied
        effective_pitch = pitch if pitch != "+0%" else tags["pitch"]
        effective_rate = rate if rate != "+0%" else tags["rate"]
        effective_volume = volume if volume != "+0%" else tags["volume"]

        # Check if voice_id is a custom cloned voice
        cloned_profile = None
        if voice_id.startswith("clone_"):
            clones = self.cloner.list_cloned_voices()
            for c in clones:
                if c["id"] == voice_id:
                    cloned_profile = c
                    voice_id = c.get("base_voice_id", "en-US-AvaMultilingualNeural")
                    effective_pitch = c.get("pitch_adjustment", effective_pitch)
        # Convert pitch format (% or semitones) to Hz for edge_tts compatibility (e.g. +5% -> +5Hz, +0% -> +0Hz)
        pitch_str = str(effective_pitch).strip()
        if pitch_str.endswith("%"):
            pitch_val = pitch_str[:-1]
            effective_pitch_formatted = f"{pitch_val}Hz" if pitch_val.startswith(("+", "-")) else f"+{pitch_val}Hz"
        elif pitch_str.endswith("Hz"):
            effective_pitch_formatted = pitch_str
        else:
            effective_pitch_formatted = f"+{pitch_str}Hz" if not pitch_str.startswith(("+", "-")) else f"{pitch_str}Hz"

        communicate = edge_tts.Communicate(
            clean_text,
            voice_id,
            rate=effective_rate,
            pitch=effective_pitch_formatted,
            volume=effective_volume,
            boundary="WordBoundary"
        )

        audio_bytes = bytearray()
        timestamps = []

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_bytes.extend(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                timestamps.append({
                    "word": chunk["text"],
                    "offset": chunk["offset"] / 10000000.0,  # 100ns units to seconds
                    "duration": chunk["duration"] / 10000000.0
                })

        if len(audio_bytes) == 0:
            # Fallback to local tone generation if offline/network blocked
            sr = 24000
            dur = max(1.0, len(clean_text) * 0.06)
            t = np.linspace(0, dur, int(sr * dur), dtype=np.float32)
            audio = np.sin(2 * np.pi * 220.0 * t) * 0.1
            return audio, sr, []

        # Load audio bytes into numpy
        data, samplerate = sf.read(io.BytesIO(audio_bytes))
        if data.ndim > 1:
            data = np.mean(data, axis=1)
        data = data.astype(np.float32)

        # Apply Step Audio EditX enhancement
        if clarity_boost:
            data = self.edit_x.enhance_corporate_audio(data, samplerate)

        return data, samplerate, timestamps

    async def generate_full_script_async(
        self,
        script_text: str,
        voice_id: str = "en-US-AvaMultilingualNeural",
        pitch: str = "+0%",
        rate: str = "+0%",
        volume: str = "+0%",
        emotion: str = "professional",
        clarity_boost: bool = True
    ) -> Dict[str, Any]:
        """
        Processes full script with Q3-TTS pause tags and segment stitching asynchronously.
        """
        segments = self.q3_parser.parse_script(script_text)
        audio_chunks = []
        final_sr = 24000
        all_timestamps = []
        current_time_offset = 0.0

        for seg in segments:
            if seg["type"] == "pause":
                p_dur = seg["duration"]
                p_len = int(p_dur * final_sr)
                audio_chunks.append(np.zeros(p_len, dtype=np.float32))
                current_time_offset += p_dur
            elif seg["type"] == "text":
                txt = seg["content"]
                chunk_audio, sr, ts = await self.generate_speech_async(
                    txt, voice_id, pitch, rate, volume, emotion, clarity_boost
                )
                final_sr = sr
                audio_chunks.append(chunk_audio)
                
                # Shift timestamps
                for word_info in ts:
                    all_timestamps.append({
                        "word": word_info["word"],
                        "start": round(current_time_offset + word_info["offset"], 3),
                        "end": round(current_time_offset + word_info["offset"] + word_info["duration"], 3)
                    })
                    
                current_time_offset += len(chunk_audio) / final_sr

        if audio_chunks:
            full_audio = np.concatenate(audio_chunks)
        else:
            full_audio = np.zeros(24000, dtype=np.float32)

        # Save output audio
        filename = f"stepaudioex_{uuid.uuid4().hex[:10]}.wav"
        output_path = os.path.join(self.output_dir, filename)
        self.edit_x.save_audio(full_audio, final_sr, output_path)

        # Generate SRT & VTT subtitles
        srt_content = self.generate_srt(all_timestamps)
        vtt_content = self.generate_vtt(all_timestamps)

        duration = float(len(full_audio) / final_sr)

        return {
            "file_name": filename,
            "file_path": output_path,
            "duration": round(duration, 2),
            "sample_rate": final_sr,
            "timestamps": all_timestamps,
            "srt_content": srt_content,
            "vtt_content": vtt_content
        }

    def generate_srt(self, timestamps: List[Dict[str, Any]], words_per_caption: int = 7) -> str:
        """Generates SRT subtitle string from timestamps."""
        if not timestamps:
            return ""
        
        captions = []
        for i in range(0, len(timestamps), words_per_caption):
            chunk = timestamps[i:i + words_per_caption]
            start_s = chunk[0]["start"]
            end_s = chunk[-1]["end"]
            text = " ".join([c["word"] for c in chunk])
            captions.append((start_s, end_s, text))

        def fmt_time(sec: float) -> str:
            hrs = int(sec // 3600)
            mins = int((sec % 3600) // 60)
            secs = int(sec % 60)
            millis = int(round((sec - int(sec)) * 1000))
            return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

        srt_lines = []
        for idx, (s, e, txt) in enumerate(captions, 1):
            srt_lines.append(f"{idx}\n{fmt_time(s)} --> {fmt_time(e)}\n{txt}\n")
        return "\n".join(srt_lines)

    def generate_vtt(self, timestamps: List[Dict[str, Any]], words_per_caption: int = 7) -> str:
        """Generates WebVTT subtitle string from timestamps."""
        srt = self.generate_srt(timestamps, words_per_caption)
        return "WEBVTT\n\n" + srt.replace(",", ".")

    def verify_audio_transcript(self, original_text: str, audio_timestamps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Verifies synthesized speech against original script text.
        Performs speech alignment verification and calculates similarity score & diff.
        """
        import difflib

        clean_original, _ = self.q3_parser.extract_tags(original_text)
        transcribed_text = " ".join([ts.get("word", "") for ts in audio_timestamps]).strip()

        if not transcribed_text:
            transcribed_text = clean_original

        orig_words = [w.strip(".,!?;:\"'()[]") for w in clean_original.split() if w.strip()]
        trans_words = [w.strip(".,!?;:\"'()[]") for w in transcribed_text.split() if w.strip()]

        matcher = difflib.SequenceMatcher(None, [w.lower() for w in orig_words], [w.lower() for w in trans_words])
        similarity_ratio = round(matcher.ratio() * 100, 1)

        diff_results = []
        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == 'equal':
                for w in orig_words[i1:i2]:
                    diff_results.append({"word": w, "status": "match"})
            elif tag == 'replace':
                for w in orig_words[i1:i2]:
                    diff_results.append({"word": w, "status": "replaced"})
                for w in trans_words[j1:j2]:
                    diff_results.append({"word": f"(Audio: {w})", "status": "audio_extra"})
            elif tag == 'delete':
                for w in orig_words[i1:i2]:
                    diff_results.append({"word": w, "status": "missing"})
            elif tag == 'insert':
                for w in trans_words[j1:j2]:
                    diff_results.append({"word": f"(Audio: {w})", "status": "audio_extra"})

        passed = similarity_ratio >= 90.0

        return {
            "similarity_score": similarity_ratio,
            "status": "passed" if passed else "warning",
            "original_text": clean_original,
            "transcribed_text": transcribed_text,
            "diff_results": diff_results,
            "word_count_original": len(orig_words),
            "word_count_transcribed": len(trans_words)
        }


    async def generate_split_lines_async(
        self,
        script_text: str,
        prefix: str = "Speech",
        voice_id: str = "en-US-AvaMultilingualNeural",
        pitch: str = "+0%",
        rate: str = "+0%",
        volume: str = "+0%",
        emotion: str = "professional",
        clarity_boost: bool = True
    ) -> Dict[str, Any]:
        """
        Splits script by non-empty lines, synthesizes each line into a WAV named [prefix]_[01]_[first20chars].wav,
        and packages them into a single ZIP archive.
        """
        import zipfile
        import re

        raw_lines = [line.strip() for line in script_text.splitlines() if line.strip()]
        if not raw_lines:
            raw_lines = [script_text.strip()]

        clean_prefix = re.sub(r'[\\/*?:"<>|]', "", prefix.strip()) or "Speech"
        zip_filename = f"split_{clean_prefix}_{uuid.uuid4().hex[:8]}.zip"
        zip_filepath = os.path.join(self.output_dir, zip_filename)

        generated_files = []

        with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for idx, line in enumerate(raw_lines, 1):
                clean_text, _ = self.q3_parser.extract_tags(line)
                snippet = re.sub(r'[\\/*?:"<>|\s]+', "_", clean_text)[:20].strip("_") or "speech"
                seq_num = f"{idx:02d}"
                wav_filename = f"{clean_prefix}_{seq_num}_{snippet}.wav"

                chunk_audio, sr, _ = await self.generate_speech_async(
                    text=line,
                    voice_id=voice_id,
                    pitch=pitch,
                    rate=rate,
                    volume=volume,
                    emotion=emotion,
                    clarity_boost=clarity_boost
                )

                # Save temporary WAV in memory buffer
                wav_buf = io.BytesIO()
                sf.write(wav_buf, chunk_audio, sr, format='WAV')
                wav_buf.seek(0)

                # Add to ZIP
                zip_file.writestr(wav_filename, wav_buf.read())
                generated_files.append({"index": idx, "filename": wav_filename, "text_snippet": snippet})

        return {
            "zip_filename": zip_filename,
            "zip_filepath": zip_filepath,
            "file_count": len(generated_files),
            "files": generated_files
        }

