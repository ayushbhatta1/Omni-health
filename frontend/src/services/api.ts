import axios from 'axios';
import type { AnalysisHistory } from '../types';

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

// The History page needs id, type and date for each entry. The backend's
// /history is still a placeholder that returns [], so when it's implemented it
// must return these fields too (see AnalysisHistory in ../types).
export const getAnalysisHistory = async (): Promise<AnalysisHistory[]> => {
  const response = await api.get<AnalysisHistory[]>('/history');
  return response.data;
}; 