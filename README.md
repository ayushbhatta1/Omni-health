<<<<<<< HEAD
# Omni-health
=======
# Medical AI Assistant

A state-of-the-art, multimodal medical AI system designed to detect early signs of various diseases through analysis of text, audio, images, and video inputs.

## Features

- **Visual Analysis**: Detect abnormalities from images (skin, eyes, tongue, nails), scans (X-ray, MRI, CT), rashes, moles, body posture, lesions, discoloration
- **Audio Analysis**: Detect signs of respiratory issues, vocal tremors, cough patterns, speech changes
- **Video/Gait Analysis**: Analyze eye movement, body motion, tremors, facial symmetry, and behavioral signs
- **Textual Reasoning**: Understand symptoms, lifestyle, genetic risk, family history, and prior medical conditions
- **Adaptive Interviewing**: Ask relevant follow-up questions based on observed or reported data
- **Early Cancer Detection**: Identify warning signs of various cancers from multimodal data

## Prerequisites

- Python 3.8+
- CUDA-capable GPU (recommended for optimal performance)
- 16GB+ RAM
- 50GB+ free disk space

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medical-ai-assistant.git
cd medical-ai-assistant
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download required model weights:
```bash
python scripts/download_models.py
```

## Usage

1. Start the backend server:
```bash
python -m app.main
```

2. The API will be available at `http://localhost:8000`

3. API Endpoints:
   - POST `/analyze`: Submit multimodal data for analysis
   - GET `/health`: Check API health status

## API Documentation

### Analyze Endpoint

Submit a POST request to `/analyze` with any combination of:
- Text description of symptoms
- Medical images
- Audio recordings
- Video recordings

Example request:
```python
import requests

files = {
    'image': ('image.jpg', open('image.jpg', 'rb')),
    'audio': ('audio.wav', open('audio.wav', 'rb')),
    'video': ('video.mp4', open('video.mp4', 'rb'))
}

data = {
    'text': 'Patient reports persistent cough and fatigue'
}

response = requests.post('http://localhost:8000/analyze', files=files, data=data)
print(response.json())
```

## Safety & Ethics

- This AI system is not a replacement for professional medical advice
- Always consult with healthcare professionals for proper diagnosis and treatment
- The system maintains user privacy and complies with HIPAA/GDPR regulations
- All data is processed locally and not stored permanently

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical imaging datasets: ISIC, HAM10000, Breast Cancer Wisconsin, NIH Chest X-rays
- Audio datasets: Coswara, Parkinson's Voice Initiative
- Video datasets: Parkinson's Gait Dataset, Facial Expression Datasets
- AI models: CLIP, SAM, EfficientNet, YOLOv8, DINOv2, Whisper, HuBERT 
>>>>>>> 7289f4d (Initial commit — upload Omni-health project)
