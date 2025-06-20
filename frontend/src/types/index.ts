export interface AnalysisResult {
  id: string;
  type: 'image' | 'audio' | 'video' | 'text';
  date: Date;
  findings: string[];
  recommendations: string[];
  confidence: number;
  disclaimer: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface AnalysisHistory {
  id: string;
  userId: string;
  type: 'image' | 'audio' | 'video' | 'text';
  date: Date;
  findings: string[];
  recommendations: string[];
  confidence: number;
  fileUrl?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface FileUpload {
  file: File;
  preview?: string;
  type: 'image' | 'audio' | 'video' | 'text';
  size: number;
  name: string;
} 