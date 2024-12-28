import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiError } from '../utils/errors';
import { TASK_ANALYSIS_PROMPT } from './prompts';
import { validateTaskAnalysis } from '../utils/validation';

export async function analyzeTask(apiKey: string, taskDescription: string) {
  if (!apiKey) {
    throw new GeminiError('API key is required. Please configure it in settings.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = TASK_ANALYSIS_PROMPT.replace('{{task}}', taskDescription);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to clean the response if it's not pure JSON
    const jsonString = text.replace(/^```json\n?|\n?```$/g, '').trim();
    
    try {
      const parsed = JSON.parse(jsonString);
      const validated = validateTaskAnalysis(parsed);
      return validated;
    } catch (e) {
      console.error('Parse error:', e);
      // Retry once with a more explicit prompt
      const retryResult = await model.generateContent(
        prompt + "\n\nIMPORTANT: Return ONLY valid JSON without any markdown or additional text."
      );
      const retryText = retryResult.response.text().trim()
        .replace(/^```json\n?|\n?```$/g, '').trim();
      
      const retryParsed = JSON.parse(retryText);
      return validateTaskAnalysis(retryParsed);
    }
  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }
    console.error('API error:', error);
    throw new GeminiError('Failed to analyze task. Please try again or check your API key.');
  }
}