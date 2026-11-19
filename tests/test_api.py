"""API tests that run without the heavy ML models.

The real AIOrchestrator loads torch, YOLO and other models, so these tests swap
in a small fake before importing the app. Run with:  pytest tests/
"""
import os
import sys
import types

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)


class FakeOrchestrator:
    def __init__(self):
        self.calls = []

    def analyze_input(self, text=None, image_path=None, audio_path=None, video_path=None):
        path = image_path or audio_path or video_path
        self.calls.append({"text": text, "path": path,
                           "exists": bool(path and os.path.exists(path))})
        return {
            "text_analysis": {"summary": "fake"} if text else None,
            "differential_diagnosis": [],
            "confidence_scores": {"text": 0.4},
            "recommendations": ["See a doctor"],
        }


fake_module = types.ModuleType("app.ai_models.orchestrator")
fake_module.AIOrchestrator = FakeOrchestrator
sys.modules["app.ai_models.orchestrator"] = fake_module

from fastapi.testclient import TestClient  # noqa: E402
from app import main  # noqa: E402

client = TestClient(main.app)


def test_health():
    assert client.get("/health").json() == {"status": "healthy"}


def test_upload_filename_cannot_escape_temp_dir(tmp_path):
    target = os.path.join(ROOT, "app", "owned.txt")
    files = {"file": ("../app/owned.txt", b"not an image", "image/png")}
    res = client.post("/analyze/image", files=files)
    assert res.status_code == 200
    assert not os.path.exists(target)
    call = main.ai_orchestrator.calls[-1]
    assert call["exists"]
    assert os.path.dirname(call["path"]) != os.path.join(ROOT, "app")
    assert not os.path.exists(call["path"])  # cleaned up afterwards


def test_upload_too_large(monkeypatch):
    monkeypatch.setattr(main, "MAX_UPLOAD_BYTES", 10)
    res = client.post("/analyze/audio", files={"file": ("a.wav", b"x" * 11, "audio/wav")})
    assert res.status_code == 413


def test_empty_upload_rejected():
    res = client.post("/analyze/video", files={"file": ("v.mp4", b"", "video/mp4")})
    assert res.status_code == 400


def test_text_limits():
    assert client.post("/analyze/text", json={"text": "   "}).status_code == 400
    assert client.post("/analyze/text", json={"text": "x" * 6000}).status_code == 413
    res = client.post("/analyze/text", json={"text": "headache for two days"})
    assert res.status_code == 200
    body = res.json()
    assert body["recommendations"] == ["See a doctor"]
    assert body["confidence"] == pytest.approx(0.4)


def test_cors_does_not_allow_any_origin():
    res = client.options("/analyze/text", headers={
        "Origin": "https://evil.example",
        "Access-Control-Request-Method": "POST",
    })
    assert res.headers.get("access-control-allow-origin") != "https://evil.example"
    assert res.headers.get("access-control-allow-origin") != "*"
