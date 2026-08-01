import uvicorn
import os
import sys
import webbrowser
import threading
import time

def open_browser():
    time.sleep(1.5)
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    # Ensure current directory is in sys.path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    print("=" * 60)
    print("  StepAudioEX Studio Server Launching")
    print("  Q3-TTS & Step Audio EditX Engine")
    print("  Access Web Studio at: http://127.0.0.1:8000")
    print("=" * 60)
    from app.main import app
    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=8000)

