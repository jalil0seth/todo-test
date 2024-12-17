import React, { useState } from 'react';
import { Section as SectionType } from '../../types/task';
import { TaskItem } from './TaskItem';
import { Plus, Trash2 } from 'lucide-react';

interface SectionProps {
  section: SectionType;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskText: (taskId: string, newText: string) => void;
  editingTaskId: string | null;
  onStartEdit: (taskId: string) => void;
  onStopEdit: () => void;
  onUpdateSectionTitle: (sectionId: string, newTitle: string) => void;
  onAddTask: (sectionId: string, parentTaskId?: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export const Section: React.FC<SectionProps> = ({
  section,
  onToggleTask,
  onUpdateTaskText,
  editingTaskId,
  onStartEdit,
  onStopEdit,
  onUpdateSectionTitle,
  onAddTask,
  onDeleteTask,
  onDeleteSection,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);

  const handleTitleSubmit = () => {
    onUpdateSectionTitle(section.id, title);
    setIsEditingTitle(false);
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitle(section.title);
                setIsEditingTitle(false);
              }
            }}
            className="text-xl font-bold w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h2
            className="text-xl font-bold cursor-pointer hover:text-blue-600"
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {section.title}
          </h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onAddTask(section.id)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Add Task"
          >
            <Plus className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={() => onDeleteSection(section.id)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete Section"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {section.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onUpdateText={onUpdateTaskText}
            editingTaskId={editingTaskId}
            onStartEdit={onStartEdit}
            onStopEdit={onStopEdit}
            onAddTask={(parentTaskId) => onAddTask(section.id, parentTaskId)}
            onDeleteTask={(taskId) => onDeleteTask(section.id, taskId)}
          />
        ))}
      </div>
    </div>
  );
};