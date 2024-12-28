import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { analyzeTask } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: 'Hi! I\'m your AI task assistant. I can help you break down tasks, analyze complexity, and suggest improvements. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = useTaskStore(state => state.apiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const analysis = await analyzeTask(apiKey, userMessage);
      const response = `Here's my analysis:

### Priority
${analysis.priority.toUpperCase()}

### Complexity
${analysis.complexity}

### Suggested Subtasks
${analysis.subtasks.map(task => `- ${task}`).join('\n')}

### Dependencies
${analysis.dependencies.map(dep => `- ${dep}`).join('\n')}

Would you like me to help you create this as a task?`;

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure your API key is configured correctly.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2 text-[#ff6600]">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#ff6600] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <ReactMarkdown
                className="prose prose-sm max-w-none"
                components={{
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 my-1">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm">{children}</li>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm mb-1">{children}</p>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about task management..."
            className="flex-1 p-2 border rounded text-sm"
            disabled={isLoading || !apiKey}
          />
          <button
            type="submit"
            disabled={isLoading || !apiKey || !input.trim()}
            className="px-3 py-2 bg-[#ff6600] text-white rounded hover:bg-[#ff7733] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}