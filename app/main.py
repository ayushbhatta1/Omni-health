from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import os
from .ai_models.orchestrator import AIOrchestrator

app = FastAPI(title="Medical AI Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Orchestrator
ai_orchestrator = AIOrchestrator()

@app.post("/analyze")
async def analyze_input(
    text: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None)
):
    """
    Analyze medical inputs and provide assessment
    """
    try:
        # Save uploaded files temporarily
        image_path = None
        audio_path = None
        video_path = None
        
        if image:
            image_path = f"temp/{image.filename}"
            os.makedirs("temp", exist_ok=True)
            with open(image_path, "wb") as f:
                f.write(await image.read())
                
        if audio:
            audio_path = f"temp/{audio.filename}"
            os.makedirs("temp", exist_ok=True)
            with open(audio_path, "wb") as f:
                f.write(await audio.read())
                
        if video:
            video_path = f"temp/{video.filename}"
            os.makedirs("temp", exist_ok=True)
            with open(video_path, "wb") as f:
                f.write(await video.read())
        
        # Analyze inputs
        results = ai_orchestrator.analyze_input(
            text=text,
            image_path=image_path,
            audio_path=audio_path,
            video_path=video_path
        )
        
        # Clean up temporary files
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
            
        return results
        
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 