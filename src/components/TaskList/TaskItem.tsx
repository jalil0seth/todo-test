import React from 'react';
import { Task } from '../../types/task';
import { Checkbox } from '../ui/Checkbox';
import { TaskText } from './TaskText';

interface TaskItemProps {
  task: Task;
  level?: number;
  onToggle: (taskId: string) => void;
  onUpdateText: (taskId: string, newText: string) => void;
  editingTaskId: string | null;
  onStartEdit: (taskId: string) => void;
  onStopEdit: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  level = 0,
  onToggle,
  onUpdateText,
  editingTaskId,
  onStartEdit,
  onStopEdit,
}) => {
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      <div className="flex items-center gap-2" style={{ paddingLeft }}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <TaskText
          text={task.text}
          completed={task.completed}
          isEditing={editingTaskId === task.id}
          onEdit={(newText) => onUpdateText(task.id, newText)}
          onStartEdit={() => onStartEdit(task.id)}
          onStopEdit={onStopEdit}
        />
      </div>
      {task.children?.map((childTask) => (
        <TaskItem
          key={childTask.id}
          task={childTask}
          level={level + 1}
          onToggle={onToggle}
          onUpdateText={onUpdateText}
          editingTaskId={editingTaskId}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
        />
      ))}
    </div>
  );
};