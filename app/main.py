from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import logging
import os
import tempfile
from .ai_models.orchestrator import AIOrchestrator

app = FastAPI(title="Medical AI Assistant API")

logger = logging.getLogger(__name__)

# Configure CORS. Browsers reject "*" together with credentials, and the API uses no
# cookies, so list the frontend origins explicitly (comma-separated in ALLOWED_ORIGINS).
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Upload limits in megabytes, overridable with MAX_UPLOAD_MB
MAX_UPLOAD_BYTES = int(float(os.getenv("MAX_UPLOAD_MB", "100")) * 1024 * 1024)
MAX_TEXT_CHARS = 5000

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


async def _read_upload(upload: UploadFile) -> bytes:
    """Read an upload, refusing empty files and files over MAX_UPLOAD_BYTES."""
    content = await upload.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File is too large")
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")
    return content


def _save_upload(upload: UploadFile, content: bytes) -> str:
    """Save an upload to a fresh temp file and return its path.

    The client's filename is never used as a path: a name like "../app/main.py"
    would otherwise write outside temp/, and two uploads with the same name
    would overwrite each other. Only the extension is kept, so the analysers
    can still tell the format.
    """
    suffix = os.path.splitext(os.path.basename(upload.filename or ""))[1][:10]
    fd, path = tempfile.mkstemp(prefix="upload_", suffix=suffix)
    with os.fdopen(fd, "wb") as f:
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
    content = await _read_upload(file)
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(image_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze a single audio file."""
    content = await _read_upload(file)
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(audio_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    """Analyze a single video file."""
    content = await _read_upload(file)
    path = _save_upload(file, content)
    try:
        results = ai_orchestrator.analyze_input(video_path=path)
        return _to_response(results)
    finally:
        _cleanup(path)


@app.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: TextRequest):
    """Analyze text symptoms."""
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is empty")
    if len(text) > MAX_TEXT_CHARS:
        raise HTTPException(status_code=413, detail=f"Text is over {MAX_TEXT_CHARS} characters")
    results = ai_orchestrator.analyze_input(text=text)
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
        if text and len(text) > MAX_TEXT_CHARS:
            raise HTTPException(status_code=413, detail=f"Text is over {MAX_TEXT_CHARS} characters")
        if image:
            image_path = _save_upload(image, await _read_upload(image))
        if audio:
            audio_path = _save_upload(audio, await _read_upload(audio))
        if video:
            video_path = _save_upload(video, await _read_upload(video))

        results = ai_orchestrator.analyze_input(
            text=text,
            image_path=image_path,
            audio_path=audio_path,
            video_path=video_path
        )
        return results
    except HTTPException:
        raise
    except Exception:
        # Log the details server-side; don't send stack details to the browser
        logger.exception("Multimodal analysis failed")
        return {"error": "Analysis failed"}
    finally:
        _cleanup(image_path)
        _cleanup(audio_path)
        _cleanup(video_path)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    # Local development defaults; set HOST=0.0.0.0 to expose it on your network
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("RELOAD", "true").lower() == "true",
    )
