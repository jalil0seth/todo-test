import React from 'react';
import { Inbox, Target, Clock } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { Status } from '../types/task';

const tabs: { id: Status; label: string; icon: React.ReactNode }[] = [
  { id: 'backlog', label: 'Backlog', icon: <Inbox className="w-4 h-4" /> },
  { id: 'focus', label: 'Focus', icon: <Target className="w-4 h-4" /> },
  { id: 'later', label: 'Later', icon: <Clock className="w-4 h-4" /> }
];

export function TaskTabs({ activeTab, onTabChange }: {
  activeTab: Status;
  onTabChange: (tab: Status) => void;
}) {
  const tasks = useTaskStore(state => state.tasks);
  
  const getCount = (status: Status) => 
    tasks.filter(task => task.status === status).length;

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`
              py-3 px-6 font-mono text-sm border-b-2 flex items-center gap-2
              ${activeTab === id 
                ? 'border-[#ff6600] text-[#ff6600]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            {icon}
            <span>{label}</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
              {getCount(id)}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}