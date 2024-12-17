import React from 'react';
import { Section } from '../../types/task';
import { TaskList } from '../TaskList/TaskList';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface DocumentContentProps {
  document: Section;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const { actions } = useStore();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <button
          onClick={() => actions.addTask(document.id)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>
      <TaskList
        tasks={document.tasks}
        documentId={document.id}
      />
    </div>
  );
};