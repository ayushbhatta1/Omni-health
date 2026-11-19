// Symptom analysis for the SymptomAnalysis component.
//
// This used to call OpenAI straight from the browser with VITE_OPENAI_API_KEY.
// Anything prefixed VITE_ is baked into the public JavaScript bundle, so anyone
// visiting the site could copy the key. It now goes through the backend's
// /analyze/text endpoint, which keeps any keys on the server.
import { analyzeText } from './api';

export interface DiagnosisResponse {
  diagnosis: string;
  confidence: number; // percent, 0-100
  recommendations: string[];
}

export const analyzeSymptoms = async (symptoms: string): Promise<DiagnosisResponse> => {
  try {
    const result = await analyzeText(symptoms);
    // The backend reports confidence as 0-1; the UI shows a percentage
    const confidence = result.confidence <= 1 ? result.confidence * 100 : result.confidence;
    return {
      diagnosis: result.findings.join('\n') || 'No significant findings detected.',
      confidence: Math.round(confidence),
      recommendations: result.recommendations,
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms');
  }
};
