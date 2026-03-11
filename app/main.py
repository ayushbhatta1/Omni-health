from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
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

DISCLAIMER = "This is not a substitute for professional medical advice. Always consult a healthcare professional."


class TextRequest(BaseModel):
    text: str


class AnalysisResponse(BaseModel):
    findings: List[str]
    recommendations: List[str]
    confidence: float
    disclaimer: str = DISCLAIMER


def _save_upload(upload: UploadFile, content: bytes) -> str:
    """Save an uploaded file to temp/ and return the path."""
    os.makedirs("temp", exist_ok=True)
    path = f"temp/{upload.filename}"
    with open(path, "wb") as f:
        f.write(content)
    return path


def _cleanup(path: Optional[str]):
    """Remove a temp file if it exists."""
    if path and os.path.exists(path):
        os.remove(path)


def _to_response(results: dict) -> AnalysisResponse:
    """Convert orchestrator results to the frontend AnalysisResponse shape."""
    if "error" in results:
        return AnalysisResponse(
            findings=[f"Error: {results['error']}"],
            recommendations=["Please try again or consult a healthcare professional."],
            confidence=0.0,
        )

    findings = []
    for key in ("text_analysis", "vision_analysis", "audio_analysis", "video_analysis"):
        analysis = results.get(key)
        if analysis:
            if isinstance(analysis, dict):
                for k, v in analysis.items():
                    if v:
                        findings.append(f"{k}: {v}")
            elif isinstance(analysis, str):
                findings.append(analysis)

    for diag in results.get("differential_diagnosis", []):
        if isinstance(diag, dict):
            findings.append(f"Possible: {diag.get('condition', diag)}")
        elif diag:
            findings.append(str(diag))

    if not findings:
        findings = ["No significant findings detected."]

    recommendations = results.get("recommendations", [])
    if not recommendations:
        recommendations = ["Continue routine health monitoring."]

    scores = results.get("confidence_scores", {})
    confidence = max(scores.values()) if scores else 0.0

    return AnalysisResponse(
        findings=findings,
        recommendations=recommendations,
        confidence=confidence,
    )


# --- Individual endpoints (match frontend api.ts) ---

@app.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze a single image file."""
    content = await file.read()
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(image_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze a single audio file."""
    content = await file.read()
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(audio_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    """Analyze a single video file."""
    content = await file.read()
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(video_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextRequest):
    """Analyze text symptoms."""
    results = ai_orchestrator.analyze_input(text=request.text)
    return _to_response(results)


@app.get("/history", response_model=List[AnalysisResponse])
async def get_history():
    """Return analysis history (placeholder — no persistence yet)."""
    return []


# --- Combined multimodal endpoint (backward-compatible) ---

@app.post("/analyze")
async def analyze_input(
    text: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None)
):
    """Analyze any combination of multimodal medical inputs."""
    image_path = None
    audio_path = None
    video_path = None

    try:
        if image:
            image_path = _save_upload(image, await image.read())
        if audio:
            audio_path = _save_upload(audio, await audio.read())
        if video:
            video_path = _save_upload(video, await video.read())

        results = ai_orchestrator.analyze_input(
            text=text,
            image_path=image_path,
            audio_path=audio_path,
            video_path=video_path
        )
        return results
    except Exception as e:
        return {"error": str(e)}
    finally:
        _cleanup(image_path)
        _cleanup(audio_path)
        _cleanup(video_path)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
