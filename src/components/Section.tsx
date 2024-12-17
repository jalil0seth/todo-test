import React from 'react';
import { Section as SectionType } from '../types/task';
import { TaskItem } from './TaskItem';

interface SectionProps {
  section: SectionType;
  onToggleTask: (taskId: string) => void;
}

export const Section: React.FC<SectionProps> = ({ section, onToggleTask }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{section.title}</h2>
      <div className="space-y-2">
        {section.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
}