import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export interface DiagnosisResponse {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
}

export const analyzeSymptoms = async (symptoms: string): Promise<DiagnosisResponse> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant that analyzes symptoms and provides diagnoses. 
            Always include:
            1. A preliminary diagnosis
            2. Confidence level (0-100%)
            3. Recommended next steps
            Format the response as JSON with keys: diagnosis, confidence, recommendations`
          },
          {
            role: 'user',
            content: symptoms
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms');
  }
};

export const analyzeImage = async (file: File): Promise<DiagnosisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/analyze/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};

export const analyzeAudio = async (file: File): Promise<DiagnosisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/analyze/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw new Error('Failed to analyze audio');
  }
};

export const analyzeVideo = async (file: File): Promise<DiagnosisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/analyze/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw new Error('Failed to analyze video');
  }
}; 