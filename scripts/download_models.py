import os
import torch
from transformers import CLIPProcessor, CLIPModel, Wav2Vec2Processor, Wav2Vec2Model, AutoTokenizer, AutoModelForSequenceClassification
from ultralytics import YOLO

def download_models():
    """
    Download all required model weights
    """
    print("Downloading model weights...")
    
    # Create models directory
    os.makedirs("models", exist_ok=True)
    
    # Download CLIP model
    print("Downloading CLIP model...")
    CLIPModel.from_pretrained("openai/clip-vit-base-patch32", cache_dir="models")
    CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", cache_dir="models")
    
    # Download Wav2Vec2 model
    print("Downloading Wav2Vec2 model...")
    Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base-960h", cache_dir="models")
    Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h", cache_dir="models")
    
    # Download BioClinicalBERT model
    print("Downloading BioClinicalBERT model...")
    AutoModelForSequenceClassification.from_pretrained("emilyalsentzer/Bio_ClinicalBERT", cache_dir="models")
    AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT", cache_dir="models")
    
    # Download YOLOv8 model
    print("Downloading YOLOv8 model...")
    YOLO('yolov8n.pt')
    
    print("All models downloaded successfully!")

if __name__ == "__main__":
    download_models() 