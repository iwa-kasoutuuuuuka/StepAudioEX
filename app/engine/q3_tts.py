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
        },
        {
            "id": "en-US-ChristopherNeural",
            "name": "Christopher - News & Documentary (Male)",
            "gender": "Male",
            "category": "Narration & Broadcast",
            "description": "Deep, resonant, and articulate voice tailored for audiobooks, documentaries, and news.",
            "accent": "Native US (General American)",
            "styles": ["professional", "serious", "calm"]
        },
        {
            "id": "en-US-EricNeural",
            "name": "Eric - Casual & Friendly (Male)",
            "gender": "Male",
            "category": "Casual & Lifestyle",
            "description": "Relaxed, natural, and conversational tone ideal for podcasts and friendly tutorials.",
            "accent": "Native US (General American)",
            "styles": ["conversational", "enthusiastic"]
        },
        {
            "id": "en-US-MichelleNeural",
            "name": "Michelle - Warm Specialist (Female)",
            "gender": "Female",
            "category": "Corporate E-Learning",
            "description": "Soft, empathetic, and highly clear voice perfect for healthcare and customer training.",
            "accent": "Native US (Southern / General)",
            "styles": ["soft", "calm", "conversational"]
        },
        {
            "id": "en-US-AnaNeural",
            "name": "Ana - Youth & K-12 Educator (Female)",
            "gender": "Female",
            "category": "K-12 & Youth Education",
            "description": "Bright, clear, and energetic voice designed for primary education and children's content.",
            "accent": "Native US (Standard American)",
            "styles": ["enthusiastic", "conversational"]
        },
        {
            "id": "en-US-RogerNeural",
            "name": "Roger - Broadcast Journalist (Male)",
            "gender": "Male",
            "category": "Executive & Broadcast",
            "description": "Crisp, authoritative, and formal tone for news announcements and corporate podcasts.",
            "accent": "Native US (Mid-Atlantic)",
            "styles": ["professional", "serious"]
        },
        {
            "id": "en-US-SteffanNeural",
            "name": "Steffan - Friendly Narrator (Male)",
            "gender": "Male",
            "category": "Training & Guides",
            "description": "Smooth, approachable male voice suitable for long-form audiobooks and step-by-step guides.",
            "accent": "Native US (General American)",
            "styles": ["conversational", "calm"]
        },
        {
            "id": "en-GB-RyanNeural",
            "name": "Ryan - British Executive (Male)",
            "gender": "Male",
            "category": "Global Corporate & UK",
            "description": "Sophisticated, clear British English male voice ideal for global business and narration.",
            "accent": "British English (RP)",
            "styles": ["professional", "serious"]
        },
        {
            "id": "en-GB-SoniaNeural",
            "name": "Sonia - British Educator (Female)",
            "gender": "Female",
            "category": "Global Corporate & UK",
            "description": "Refined, articulate British English female voice for academic and corporate e-learning.",
            "accent": "British English (RP)",
            "styles": ["professional", "conversational"]
        },
        {
            "id": "en-GB-LibbyNeural",
            "name": "Libby - British Storyteller (Female)",
            "gender": "Female",
            "category": "Global Narration",
            "description": "Warm, expressive British female tone suitable for audiobooks and educational presentations.",
            "accent": "British English",
            "styles": ["soft", "calm"]
        },
        {
            "id": "en-GB-ThomasNeural",
            "name": "Thomas - British Instructor (Male)",
            "gender": "Male",
            "category": "Global Technical",
            "description": "Calm, trustworthy British male speaker for technical guides and course material.",
            "accent": "British English",
            "styles": ["professional", "calm"]
        },
        {
            "id": "en-AU-NatashaNeural",
            "name": "Natasha - Australian Guide (Female)",
            "gender": "Female",
            "category": "Oceania & International",
            "description": "Friendly, clear Australian English female speaker for global corporate training.",
            "accent": "Australian English",
            "styles": ["conversational", "enthusiastic"]
        },
        {
            "id": "en-AU-WilliamMultilingualNeural",
            "name": "William - Australian Presenter (Male)",
            "gender": "Male",
            "category": "Oceania & International",
            "description": "Confident, approachable Australian English male narrator for business and media.",
            "accent": "Australian English",
            "styles": ["professional", "conversational"]
        },
        {
            "id": "en-CA-ClaraNeural",
            "name": "Clara - Canadian Specialist (Female)",
            "gender": "Female",
            "category": "North American Corporate",
            "description": "Natural, clear Canadian English female voice tailored for North American modules.",
            "accent": "Canadian English",
            "styles": ["conversational", "professional"]
        },
        {
            "id": "en-CA-LiamNeural",
            "name": "Liam - Canadian Coach (Male)",
            "gender": "Male",
            "category": "North American Corporate",
            "description": "Warm, engaging Canadian English male voice suitable for training and walkthroughs.",
            "accent": "Canadian English",
            "styles": ["professional", "enthusiastic"]
        },
        {
            "id": "en-IE-EmilyNeural",
            "name": "Emily - Irish Presenter (Female)",
            "gender": "Female",
            "category": "European & Global",
            "description": "Melodic, charming Irish English female voice for storytelling and engaging courses.",
            "accent": "Irish English",
            "styles": ["conversational", "soft"]
        },
        {
            "id": "en-IE-ConnorNeural",
            "name": "Connor - Irish Instructor (Male)",
            "gender": "Male",
            "category": "European & Global",
            "description": "Articulate, friendly Irish English male speaker for lectures and global content.",
            "accent": "Irish English",
            "styles": ["conversational", "calm"]
        },
        {
            "id": "en-NZ-MollyNeural",
            "name": "Molly - New Zealand Guide (Female)",
            "gender": "Female",
            "category": "Oceania & Global",
            "description": "Distinctive, clear New Zealand English female voice for global e-learning.",
            "accent": "New Zealand English",
            "styles": ["conversational", "calm"]
        },
        {
            "id": "en-NZ-MitchellNeural",
            "name": "Mitchell - New Zealand Coach (Male)",
            "gender": "Male",
            "category": "Oceania & Global",
            "description": "Relaxed, authentic New Zealand English male speaker for instructional videos.",
            "accent": "New Zealand English",
            "styles": ["professional", "conversational"]
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
