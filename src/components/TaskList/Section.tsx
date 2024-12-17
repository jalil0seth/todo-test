import React from 'react';
import { Section as SectionType } from '../../types/task';
import { TaskItem } from './TaskItem';

interface SectionProps {
  section: SectionType;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskText: (taskId: string, newText: string) => void;
  editingTaskId: string | null;
  onStartEdit: (taskId: string) => void;
  onStopEdit: () => void;
}

export const Section: React.FC<SectionProps> = ({
  section,
  onToggleTask,
  onUpdateTaskText,
  editingTaskId,
  onStartEdit,
  onStopEdit,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{section.title}</h2>
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
          />
        ))}
      </div>
    </div>
  );
};