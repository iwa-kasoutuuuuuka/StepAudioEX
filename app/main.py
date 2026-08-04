import os
import shutil
import zipfile
import numpy as np
import soundfile as sf
from fastapi import FastAPI, Request, File, UploadFile, Form, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.engine.step_audio_ex import StepAudioEXEngine
from app.engine.q3_tts import Q3TTSParser
from app.engine.voice_cloning import VoiceCloningEngine
from app.engine.edit_x import StepAudioEditX

app = FastAPI(title="StepAudioEX Studio", version="2.0.0")

# Setup directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "app", "static")
TEMPLATES_DIR = os.path.join(BASE_DIR, "app", "templates")
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUTS_DIR = os.path.join(DATA_DIR, "outputs")
UPLOADS_DIR = os.path.join(DATA_DIR, "uploads")

os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mount static files and templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Instantiate engines
master_engine = StepAudioEXEngine(output_dir=OUTPUTS_DIR)
q3_parser = Q3TTSParser()
voice_cloner = VoiceCloningEngine(storage_dir=os.path.join(UPLOADS_DIR, "clones"))
edit_x = StepAudioEditX()

# Request Models
class TTSRequest(BaseModel):
    text: str
    voice_id: str = "en-US-AvaMultilingualNeural"
    pitch: str = "+0%"
    rate: str = "+0%"
    volume: str = "+0%"
    emotion: str = "professional"
    clarity_boost: bool = True
    prefix: Optional[str] = "Speech"
    engine_mode: Optional[str] = "cloud"

class VerifyRequest(BaseModel):
    original_text: str
    timestamps: List[Dict[str, Any]] = []

class EditXRequest(BaseModel):
    file_name: str
    action: str  # "insert_pause", "pitch_shift", "speed_stretch", "enhance", "replace_segment"
    position_sec: Optional[float] = 0.0
    duration_sec: Optional[float] = 1.0
    semitones: Optional[float] = 0.0
    speed_rate: Optional[float] = 1.0
    start_sec: Optional[float] = 0.0
    end_sec: Optional[float] = 1.0
    replacement_text: Optional[str] = ""
    voice_id: Optional[str] = "en-US-AvaMultilingualNeural"

class SceneItem(BaseModel):
    scene_name: str
    speaker_voice_id: str
    text: str
    emotion: str = "professional"
    pause_after_sec: float = 0.5

class StudioRenderRequest(BaseModel):
    project_name: str
    scenes: List[SceneItem]

class FilterRequest(BaseModel):
    file_name: str
    preset: Optional[str] = None  # 'podcast', 'classroom', 'conference', 'narration', 'voiceover_pro', 'raw'
    highpass_freq: Optional[float] = 80.0
    lowpass_freq: Optional[float] = 16000.0
    eq_low_gain: Optional[float] = 0.0
    eq_mid_gain: Optional[float] = 0.0
    eq_high_gain: Optional[float] = 0.0

class BatchDownloadRequest(BaseModel):
    file_names: List[str]

from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, Response

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Render StepAudioEX Studio Dashboard."""
    return templates.TemplateResponse(request=request, name="index.html")

@app.get("/api/voices")
async def get_voices():
    """Retrieve available native preset voices, local offline models, and custom cloned voices."""
    presets = q3_parser.NATIVE_US_VOICES
    clones = voice_cloner.list_cloned_voices()
    local_models = [
        {
            "id": k,
            "name": f"🏠 [Local] {v['name']}",
            "gender": "Female" if "Female" in v["name"] else "Male",
            "category": "Offline Local Model",
            "description": "100% Offline ONNX Neural Voice Model (Auto-downloaded on first use).",
            "accent": "Native US (Offline)",
            "styles": ["professional", "conversational"]
        }
        for k, v in master_engine.local_engine.LOCAL_MODELS.items()
    ]
    return {
        "status": "success",
        "native_us_voices": presets,
        "cloned_voices": clones,
        "local_voices": local_models
    }

@app.post("/api/tts/generate")
async def generate_tts(req: TTSRequest):
    """Generate TTS with Q3-TTS tags and StepAudioEX processing."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Script text cannot be empty.")
        
    res = await master_engine.generate_full_script_async(
        script_text=req.text,
        voice_id=req.voice_id,
        pitch=req.pitch,
        rate=req.rate,
        volume=req.volume,
        emotion=req.emotion,
        clarity_boost=req.clarity_boost,
        engine_mode=req.engine_mode or "cloud"
    )
    
    return {
        "status": "success",
        "audio_url": f"/outputs/{res['file_name']}",
        "file_name": res["file_name"],
        "duration": res["duration"],
        "sample_rate": res["sample_rate"],
        "timestamps": res["timestamps"],
        "srt_content": res["srt_content"],
        "vtt_content": res["vtt_content"]
    }

@app.post("/api/tts/generate-split")
async def generate_tts_split(req: TTSRequest):
    """Generate individual WAV files per line and package into a ZIP file."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Script text cannot be empty.")

    res = await master_engine.generate_split_lines_async(
        script_text=req.text,
        prefix=req.prefix or "Speech",
        voice_id=req.voice_id,
        pitch=req.pitch,
        rate=req.rate,
        volume=req.volume,
        emotion=req.emotion,
        clarity_boost=req.clarity_boost
    )

    return {
        "status": "success",
        "zip_url": f"/outputs/{res['zip_filename']}",
        "zip_filename": res["zip_filename"],
        "file_count": res["file_count"],
        "files": res["files"]
    }

@app.post("/api/tts/verify")
async def verify_tts_speech(req: VerifyRequest):
    """Verify audio alignment against original text script."""
    if not req.original_text.strip():
        raise HTTPException(status_code=400, detail="Original text cannot be empty.")

    verification = master_engine.verify_audio_transcript(
        original_text=req.original_text,
        audio_timestamps=req.timestamps
    )

    return {
        "status": "success",
        "verification": verification
    }

@app.post("/api/editx/edit")
async def apply_edit_x(req: EditXRequest):
    """Apply Step Audio EditX audio operations."""
    input_file_path = os.path.join(OUTPUTS_DIR, req.file_name)
    if not os.path.exists(input_file_path):
        raise HTTPException(status_code=404, detail="Input audio file not found.")

    audio_data, sr = edit_x.read_audio(input_file_path)

    if req.action == "insert_pause":
        edited_audio = edit_x.insert_pause(audio_data, sr, req.position_sec, req.duration_sec)
    elif req.action == "pitch_shift":
        edited_audio = edit_x.pitch_shift(audio_data, sr, req.semitones)
    elif req.action == "speed_stretch":
        edited_audio = edit_x.time_stretch(audio_data, req.speed_rate)
    elif req.action == "enhance":
        edited_audio = edit_x.enhance_corporate_audio(audio_data, sr, clarity_boost=True)
    elif req.action == "replace_segment":
        # Synthesize replacement text
        rep_res = await master_engine.generate_full_script_async(
            script_text=req.replacement_text,
            voice_id=req.voice_id
        )
        rep_audio, rep_sr = edit_x.read_audio(rep_res["file_path"])
        edited_audio = edit_x.replace_segment(audio_data, sr, req.start_sec, req.end_sec, rep_audio)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown edit action: {req.action}")

    # Save edited audio
    output_filename = f"editx_{req.action}_{os.path.basename(req.file_name)}"
    output_path = os.path.join(OUTPUTS_DIR, output_filename)
    edit_x.save_audio(edited_audio, sr, output_path)

    duration = float(len(edited_audio) / sr)

    return {
        "status": "success",
        "action": req.action,
        "audio_url": f"/outputs/{output_filename}",
        "file_name": output_filename,
        "duration": round(duration, 2),
        "sample_rate": sr
    }

@app.post("/api/clone/upload")
async def create_voice_clone(
    file: UploadFile = File(...),
    voice_name: str = Form(...),
    transcript: str = Form("")
):
    """Upload reference audio and register zero-shot voice clone profile."""
    if not file.filename.endswith((".wav", ".mp3", ".m4a", ".ogg", ".flac")):
        raise HTTPException(status_code=400, detail="Invalid audio file format.")

    content = await file.read()
    audio_data, sr = edit_x.read_audio(content)

    profile = voice_cloner.register_cloned_voice(
        audio_data=audio_data,
        samplerate=sr,
        voice_name=voice_name,
        transcript=transcript
    )

    return {
        "status": "success",
        "message": f"Successfully registered cloned voice '{voice_name}'.",
        "voice_profile": profile
    }

@app.delete("/api/clone/{voice_id}")
async def delete_voice_clone(voice_id: str):
    """Delete cloned voice profile."""
    if not voice_id.startswith("clone_"):
        raise HTTPException(status_code=400, detail="Cannot delete preset voices.")

    success = voice_cloner.delete_cloned_voice(voice_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cloned voice not found.")

    return {"status": "success", "message": f"Deleted voice profile {voice_id}."}

@app.post("/api/studio/render-scene")
async def render_studio_scenes(req: StudioRenderRequest):
    """Render multi-scene corporate training video script and combine narration."""
    if not req.scenes:
        raise HTTPException(status_code=400, detail="Scenes list cannot be empty.")

    rendered_files = []
    combined_audio_chunks = []
    final_sr = 24000
    all_timestamps = []
    current_time = 0.0

    for idx, scene in enumerate(req.scenes, 1):
        scene_res = await master_engine.generate_full_script_async(
            script_text=scene.text,
            voice_id=scene.speaker_voice_id,
            emotion=scene.emotion
        )
        
        chunk_audio, sr = edit_x.read_audio(scene_res["file_path"])
        final_sr = sr
        combined_audio_chunks.append(chunk_audio)

        for ts in scene_res["timestamps"]:
            all_timestamps.append({
                "word": ts["word"],
                "start": round(current_time + ts["start"], 3),
                "end": round(current_time + ts["end"], 3)
            })

        current_time += len(chunk_audio) / sr

        # Pause after scene
        if scene.pause_after_sec > 0:
            pause_len = int(scene.pause_after_sec * sr)
            combined_audio_chunks.append(np.zeros(pause_len, dtype=np.float32))
            current_time += scene.pause_after_sec

    full_audio = np.concatenate(combined_audio_chunks)
    output_filename = f"studio_full_{os.path.basename(req.project_name).replace(' ', '_')}.wav"
    output_path = os.path.join(OUTPUTS_DIR, output_filename)
    edit_x.save_audio(full_audio, final_sr, output_path)

    srt_content = master_engine.generate_srt(all_timestamps)
    vtt_content = master_engine.generate_vtt(all_timestamps)

    return {
        "status": "success",
        "project_name": req.project_name,
        "audio_url": f"/outputs/{output_filename}",
        "file_name": output_filename,
        "total_duration": round(current_time, 2),
        "scene_count": len(req.scenes),
        "srt_content": srt_content,
        "vtt_content": vtt_content
    }

@app.post("/api/filters/apply")
async def apply_filter(req: FilterRequest):
    """Apply filter chain to an audio file."""
    input_file_path = os.path.join(OUTPUTS_DIR, req.file_name)
    if not os.path.exists(input_file_path):
        raise HTTPException(status_code=404, detail="Input audio file not found.")

    audio_data, sr = edit_x.read_audio(input_file_path)

    if req.preset and req.preset in edit_x.FILTER_PRESETS:
        params = edit_x.FILTER_PRESETS[req.preset]
        filtered_audio = edit_x.apply_filter_chain(
            audio=audio_data, 
            samplerate=sr,
            highpass_freq=params.get('highpass_freq', 80.0),
            lowpass_freq=params.get('lowpass_freq', 16000.0),
            eq_low_gain=params.get('eq_low_gain', 0.0),
            eq_mid_gain=params.get('eq_mid_gain', 0.0),
            eq_high_gain=params.get('eq_high_gain', 0.0)
        )
        preset_name = req.preset
    else:
        filtered_audio = edit_x.apply_filter_chain(
            audio=audio_data,
            samplerate=sr,
            highpass_freq=req.highpass_freq,
            lowpass_freq=req.lowpass_freq,
            eq_low_gain=req.eq_low_gain,
            eq_mid_gain=req.eq_mid_gain,
            eq_high_gain=req.eq_high_gain
        )
        preset_name = "custom"

    output_filename = f"filtered_{preset_name}_{req.file_name}"
    output_path = os.path.join(OUTPUTS_DIR, output_filename)
    edit_x.save_audio(filtered_audio, sr, output_path)

    duration = float(len(filtered_audio) / sr)

    return {
        "status": "success",
        "audio_url": f"/outputs/{output_filename}",
        "file_name": output_filename,
        "duration": round(duration, 2),
        "sample_rate": sr
    }

@app.get("/api/filters/presets")
async def get_filter_presets():
    """Return available filter presets."""
    return {
        "status": "success",
        "presets": edit_x.FILTER_PRESETS
    }

@app.post("/api/batch/process")
async def batch_process(
    files: List[UploadFile] = File(...),
    voice_id: str = Form("en-US-AvaMultilingualNeural"),
    pitch: str = Form("+0%"),
    rate: str = Form("+0%"),
    emotion: str = Form("professional"),
    clarity_boost: bool = Form(True)
):
    """Accept multiple files for batch processing."""
    results = []
    
    for file in files:
        content = await file.read()
        
        if file.filename.endswith(".txt"):
            text_content = content.decode("utf-8")
            res = await master_engine.generate_full_script_async(
                script_text=text_content,
                voice_id=voice_id,
                pitch=pitch,
                rate=rate,
                emotion=emotion,
                clarity_boost=clarity_boost
            )
            results.append({
                "filename": res["file_name"],
                "audio_url": f"/outputs/{res['file_name']}",
                "duration": res["duration"]
            })
            
        elif file.filename.endswith((".wav", ".mp3", ".m4a", ".ogg", ".flac")):
            upload_path = os.path.join(UPLOADS_DIR, file.filename)
            with open(upload_path, "wb") as f:
                f.write(content)
                
            audio_data, sr = edit_x.read_audio(upload_path)
            enhanced = edit_x.enhance_corporate_audio(audio_data, sr, clarity_boost=clarity_boost)
            
            out_name = f"batch_enhanced_{file.filename}"
            out_path = os.path.join(OUTPUTS_DIR, out_name)
            edit_x.save_audio(enhanced, sr, out_path)
            
            results.append({
                "filename": out_name,
                "audio_url": f"/outputs/{out_name}",
                "duration": round(len(enhanced) / sr, 2)
            })
            
    return {
        "status": "success",
        "results": results
    }

@app.post("/api/batch/download-zip")
async def download_zip(req: BatchDownloadRequest):
    """Package completed files into ZIP."""
    if not req.file_names:
        raise HTTPException(status_code=400, detail="No files specified.")
        
    zip_filename = "batch_download.zip"
    zip_path = os.path.join(OUTPUTS_DIR, zip_filename)
    
    with zipfile.ZipFile(zip_path, 'w') as zf:
        for fname in req.file_names:
            fpath = os.path.join(OUTPUTS_DIR, fname)
            if os.path.exists(fpath):
                zf.write(fpath, arcname=fname)
                
    return FileResponse(zip_path, media_type="application/zip", filename=zip_filename)

