import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AnalysisResponse {
  findings: string[];
  recommendations: string[];
  confidence: number;
  disclaimer: string;
}

export const analyzeImage = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<AnalysisResponse>('/analyze/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const analyzeAudio = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<AnalysisResponse>('/analyze/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const analyzeVideo = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<AnalysisResponse>('/analyze/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const analyzeText = async (text: string): Promise<AnalysisResponse> => {
  const response = await api.post<AnalysisResponse>('/analyze/text', { text });
  return response.data;
};

export const getAnalysisHistory = async (): Promise<AnalysisResponse[]> => {
  const response = await api.get<AnalysisResponse[]>('/history');
  return response.data;
}; 