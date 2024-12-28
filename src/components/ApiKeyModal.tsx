import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

export function ApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState('');
  const setApiKey = useTaskStore((state) => state.setApiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(key);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">API Configuration</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                Gemini API Key
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="Enter your API key"
                  required
                />
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}