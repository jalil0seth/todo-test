import React from 'react';
import { Task } from '../types/task';
import { Checkbox } from './ui/Checkbox';

interface TaskItemProps {
  task: Task;
  level?: number;
  onToggle: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, level = 0, onToggle }) => {
  const textStyle = task.completed ? 'line-through text-gray-400' : '';
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      <div className="flex items-center gap-2" style={{ paddingLeft }}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <span className={textStyle}>{task.text}</span>
      </div>
      {task.children?.map((childTask) => (
        <TaskItem
          key={childTask.id}
          task={childTask}
          level={level + 1}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}