import { useState } from 'react';
import { GeminiService, GeminiRequest, GeminiResponse } from '@/lib/gemini';

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (request: GeminiRequest): Promise<GeminiResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await GeminiService.generateContent(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePDF = async (pdfContent: string, task: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await GeminiService.analyzePDF(pdfContent, task);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getConversionInstructions = async (fileType: string, targetType: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await GeminiService.getConversionInstructions(fileType, targetType);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    analyzePDF,
    getConversionInstructions,
    isLoading,
    error
  };
};