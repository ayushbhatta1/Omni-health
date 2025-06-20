from transformers import CLIPProcessor, CLIPModel, Wav2Vec2Processor, Wav2Vec2Model, AutoTokenizer, AutoModelForSequenceClassification
import os

def download_models():
    print("Downloading models...")
    
    # Create models directory if it doesn't exist
    os.makedirs("models", exist_ok=True)
    
    # Download CLIP model
    print("Downloading CLIP model...")
    clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    clip_model.save_pretrained("models/clip")
    clip_processor.save_pretrained("models/clip")
    
    # Download Wav2Vec2 model
    print("Downloading Wav2Vec2 model...")
    wav2vec_processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
    wav2vec_model = Wav2Vec2Model.from_pretrained("facebook/wav2vec2-base-960h")
    wav2vec_model.save_pretrained("models/wav2vec2")
    wav2vec_processor.save_pretrained("models/wav2vec2")
    
    # Download Bio_ClinicalBERT model
    print("Downloading Bio_ClinicalBERT model...")
    tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    model = AutoModelForSequenceClassification.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    model.save_pretrained("models/bio_clinical_bert")
    tokenizer.save_pretrained("models/bio_clinical_bert")
    
    print("All models downloaded successfully!")

if __name__ == "__main__":
    download_models() 