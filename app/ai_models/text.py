from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
from typing import List, Dict

class TextAnalyzer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        self.model = AutoModelForSequenceClassification.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        
    def analyze_symptoms(self, text: str) -> Dict:
        """
        Analyze symptoms from text description
        """
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            outputs = self.model(**inputs)
            predictions = torch.softmax(outputs.logits, dim=1)
            
            return {
                "symptoms": self._extract_symptoms(text),
                "confidence": predictions.detach().numpy().tolist()
            }
        except Exception as e:
            return {"error": str(e)}
            
    def analyze_medical_history(self, text: str) -> Dict:
        """
        Analyze medical history from text
        """
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            outputs = self.model(**inputs)
            predictions = torch.softmax(outputs.logits, dim=1)
            
            return {
                "history": self._extract_medical_history(text),
                "confidence": predictions.detach().numpy().tolist()
            }
        except Exception as e:
            return {"error": str(e)}
            
    def generate_follow_up_questions(self, text: str) -> List[str]:
        """
        Generate relevant follow-up questions based on input
        """
        try:
            # Add logic to generate follow-up questions
            return ["Can you describe the symptoms in more detail?", 
                   "When did you first notice these symptoms?",
                   "Have you experienced similar symptoms before?"]
        except Exception as e:
            return [f"Error generating questions: {str(e)}"]
            
    def _extract_symptoms(self, text: str) -> List[str]:
        """
        Extract symptoms from text
        """
        # Add symptom extraction logic
        return []
        
    def _extract_medical_history(self, text: str) -> Dict:
        """
        Extract medical history from text
        """
        # Add medical history extraction logic
        return {
            "conditions": [],
            "medications": [],
            "allergies": [],
            "family_history": []
        } 