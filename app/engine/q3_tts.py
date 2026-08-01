import re
from typing import Dict, List, Any, Tuple

class Q3TTSParser:
    """
    Q3-TTS Specification Parser & Speech Controller.
    Supports inline control tags:
    - [pause=0.5s] or [pause=1200ms]
    - [emotion=enthusiastic] / [emotion=professional] / [emotion=serious] / [emotion=calm] / [emotion=conversational]
    - [pitch=+10%] or [pitch=-5%]
    - [speed=1.1] or [rate=1.2]
    - [emphasis=high] or [emphasis=low]
    """
    
    EMOTION_MAP = {
        "professional": {"pitch": "+0%", "rate": "+0%", "volume": "+0%", "style": "customerservice"},
        "enthusiastic": {"pitch": "+5%", "rate": "+8%", "volume": "+5%", "style": "cheerful"},
        "serious": {"pitch": "-5%", "rate": "-5%", "volume": "+0%", "style": "empathetic"},
        "calm": {"pitch": "-3%", "rate": "-8%", "volume": "-5%", "style": "calm"},
        "conversational": {"pitch": "+2%", "rate": "+3%", "volume": "+0%", "style": "chat"},
        "soft": {"pitch": "-4%", "rate": "-10%", "volume": "-10%", "style": "gentle"},
    }

    NATIVE_US_VOICES = [
        {
            "id": "en-US-AvaMultilingualNeural",
            "name": "Ava - Training Specialist (Female)",
            "gender": "Female",
            "category": "Corporate E-Learning",
            "description": "Articulate, friendly, and engaging American English speaker ideal for video modules and training.",
            "accent": "Native US (Standard American)",
            "styles": ["professional", "enthusiastic", "conversational", "calm"]
        },
        {
            "id": "en-US-AndrewMultilingualNeural",
            "name": "Andrew - Executive Presenter (Male)",
            "gender": "Male",
            "category": "Executive & Leadership",
            "description": "Authoritative, confident, and clear tone tailored for executive briefings and compliance.",
            "accent": "Native US (General American)",
            "styles": ["professional", "serious", "calm"]
        },
        {
            "id": "en-US-BrianMultilingualNeural",
            "name": "Brian - Tech Instructor (Male)",
            "gender": "Male",
            "category": "Technical & Software",
            "description": "Precise, energetic, and informative voice for software walkthroughs and technical tutorials.",
            "accent": "Native US (West Coast)",
            "styles": ["professional", "enthusiastic", "conversational"]
        },
        {
            "id": "en-US-EmmaMultilingualNeural",
            "name": "Emma - Onboarding Coach (Female)",
            "gender": "Female",
            "category": "Corporate Onboarding",
            "description": "Warm, encouraging, and clear voice for new employee onboarding and instructional guides.",
            "accent": "Native US (Midwest)",
            "styles": ["conversational", "enthusiastic", "soft", "calm"]
        },
        {
            "id": "en-US-GuyNeural",
            "name": "Guy - Senior Instructor (Male)",
            "gender": "Male",
            "category": "Corporate E-Learning",
            "description": "Deep, calm, and reassuring voice suitable for long-form educational courses.",
            "accent": "Native US (General American)",
            "styles": ["professional", "calm", "serious"]
        },
        {
            "id": "en-US-JennyNeural",
            "name": "Jenny - HR & Compliance (Female)",
            "gender": "Female",
            "category": "Compliance & Safety",
            "description": "Polished, reassuring, and highly legible tone for regulatory and compliance videos.",
            "accent": "Native US (Standard American)",
            "styles": ["professional", "calm"]
        },
        {
            "id": "en-US-AriaNeural",
            "name": "Aria - Product Walkthrough (Female)",
            "gender": "Female",
            "category": "Product Demos",
            "description": "Vibrant, dynamic voice for marketing presentations, product tours, and quick guides.",
            "accent": "Native US (Standard American)",
            "styles": ["enthusiastic", "conversational"]
        }
    ]

    def parse_script(self, raw_text: str) -> List[Dict[str, Any]]:
        """
        Parses script text into segment chunks with inline properties and pause instructions.
        """
        # Split by pause tags first: e.g. [pause=1.2s] or [pause=800ms]
        pause_pattern = re.compile(r'\[pause\s*=\s*([\d\.]+)\s*(s|ms)?\]', re.IGNORECASE)
        
        segments = []
        last_end = 0
        
        for match in pause_pattern.finditer(raw_text):
            text_part = raw_text[last_end:match.start()].strip()
            if text_part:
                segments.append({"type": "text", "content": text_part})
            
            val = float(match.group(1))
            unit = (match.group(2) or "s").lower()
            pause_sec = val if unit == "s" else val / 1000.0
            segments.append({"type": "pause", "duration": pause_sec})
            
            last_end = match.end()
            
        remaining = raw_text[last_end:].strip()
        if remaining:
            segments.append({"type": "text", "content": remaining})
            
        return segments

    def extract_tags(self, text: str) -> Tuple[str, Dict[str, Any]]:
        """
        Extracts control tags like [emotion=enthusiastic], [pitch=+10%], [speed=1.2]
        Returns clean text and extracted tag dictionary.
        """
        tags = {
            "emotion": "professional",
            "pitch": "+0%",
            "rate": "+0%",
            "volume": "+0%",
            "emphasis": "normal"
        }
        
        # [emotion=...]
        emo_match = re.search(r'\[emotion\s*=\s*(\w+)\]', text, re.IGNORECASE)
        if emo_match:
            emo = emo_match.group(1).lower()
            if emo in self.EMOTION_MAP:
                tags["emotion"] = emo
                tags.update(self.EMOTION_MAP[emo])
            text = re.sub(r'\[emotion\s*=\s*\w+\]', '', text, flags=re.IGNORECASE)
            
        # [pitch=...]
        pitch_match = re.search(r'\[pitch\s*=\s*([+-]?\d+%)\]', text, re.IGNORECASE)
        if pitch_match:
            tags["pitch"] = pitch_match.group(1)
            text = re.sub(r'\[pitch\s*=\s*[+-]?\d+%\]', '', text, flags=re.IGNORECASE)

        # [speed=...] or [rate=...]
        rate_match = re.search(r'\[(?:speed|rate)\s*=\s*([+-]?\d+%)\]', text, re.IGNORECASE)
        if rate_match:
            tags["rate"] = rate_match.group(1)
            text = re.sub(r'\[(?:speed|rate)\s*=\s*[+-]?\d+%\]', '', text, flags=re.IGNORECASE)
            
        # Clean up double spaces
        clean_text = re.sub(r'\s+', ' ', text).strip()
        return clean_text, tags
