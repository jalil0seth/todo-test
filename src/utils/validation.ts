import { z } from 'zod';
import { GeminiError } from './errors';

const TaskAnalysisSchema = z.object({
  priority: z.enum(['high', 'medium', 'low']),
  subtasks: z.array(z.string()).min(1),
  complexity: z.string().min(1),
  dependencies: z.array(z.string())
}).strict(); // Ensure no extra properties

export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;

export function validateTaskAnalysis(data: unknown): TaskAnalysis {
  try {
    return TaskAnalysisSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => i.message).join(', ');
      throw new GeminiError(`Invalid AI response format: ${issues}`);
    }
    throw new GeminiError('Invalid response format from AI. Please try again.');
  }
}