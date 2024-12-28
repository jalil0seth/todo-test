import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { analyzeTask } from '../services/gemini';
import { ErrorMessage } from './ErrorMessage';
import { getErrorMessage } from '../utils/errors';

export function TaskInput() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a task description');
      return;
    }
    if (!apiKey) {
      setError('Please configure your API key in settings');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeTask(apiKey, input);
      addTask({
        title: input,
        description: '',
        priority: analysis.priority,
        status: 'backlog',
        subtasks: analysis.subtasks.map((task: string) => ({
          id: crypto.randomUUID(),
          title: task,
          completed: false,
        })),
      });
      setInput('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 p-2 border rounded font-mono text-sm"
          disabled={isAnalyzing}
        />
        <button
          type="submit"
          disabled={isAnalyzing || !apiKey}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}