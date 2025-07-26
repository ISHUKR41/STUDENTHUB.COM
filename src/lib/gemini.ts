// Gemini API integration - secure client-side wrapper
export interface GeminiRequest {
  prompt: string;
  model?: string;
}

export interface GeminiResponse {
  result: string;
}

export class GeminiService {
  private static baseUrl = '/api/gemini'; // This will be your backend endpoint

  static async generateContent(request: GeminiRequest): Promise<GeminiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gemini service error:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  // Specific method for PDF analysis
  static async analyzePDF(pdfContent: string, task: string): Promise<string> {
    const prompt = `
      Task: ${task}
      
      Analyze the following PDF content and provide detailed instructions:
      
      ${pdfContent}
      
      Please provide step-by-step guidance that is:
      - Technically accurate
      - Easy to follow
      - Includes specific code examples where applicable
      - Addresses potential issues and solutions
    `;

    const response = await this.generateContent({ prompt });
    return response.result;
  }

  // Method for generating conversion instructions
  static async getConversionInstructions(fileType: string, targetType: string): Promise<string> {
    const prompt = `
      Create detailed technical instructions for converting ${fileType} to ${targetType}.
      
      Include:
      1. Required libraries and dependencies
      2. Step-by-step conversion process
      3. Error handling strategies
      4. Quality preservation techniques
      5. Sample code implementation
      
      Focus on maintaining original formatting and ensuring compatibility across different platforms.
    `;

    const response = await this.generateContent({ prompt });
    return response.result;
  }
}