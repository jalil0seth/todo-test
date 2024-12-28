import React, { useState } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TaskInput } from './components/TaskInput';
import { TaskTabs } from './components/TaskTabs';
import { TaskCard } from './components/TaskCard';
import { AIAssistant } from './components/AIAssistant';
import { useTaskStore } from './store/useTaskStore';
import { Status } from './types/task';

function App() {
  const [activeTab, setActiveTab] = useState<Status>('backlog');
  const tasks = useTaskStore(state => 
    state.tasks.filter(task => task.status === activeTab)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#ff6600] text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-mono font-bold">TaskAI Manager</h1>
          <ApiKeyModal />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
          
          <div className="lg:col-span-3">
            <TaskInput />
            
            <div className="mb-6">
              <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No tasks in {activeTab}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}