import React from 'react';
import { Task } from '../types/task';
import { Checkbox } from './ui/Checkbox';

interface TaskItemProps {
  task: Task;
  level?: number;
  onToggle: (taskId: string) => void;
  onUpdateText: (taskId: string, newText: string) => void;
  editingTaskId: string | null;
  onStartEdit: (taskId: string) => void;
  onStopEdit: () => void;
  onAddTask: (parentTaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  level = 0,
  onToggle,
  onUpdateText,
  editingTaskId,
  onStartEdit,
  onStopEdit,
  onAddTask,
  onDeleteTask,
}) => {
  const textStyle = task.completed ? 'line-through text-gray-400' : '';
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      <div className="flex items-center gap-2" style={{ paddingLeft }}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <div className="flex-1">
          {editingTaskId === task.id ? (
            <input
              type="text"
              value={task.text}
              onChange={(e) => onUpdateText(task.id, e.target.value)}
              onBlur={onStopEdit}
              autoFocus
              className="w-full p-1 border rounded"
            />
          ) : (
            <span
              className={textStyle}
              onDoubleClick={() => onStartEdit(task.id)}
            >
              {task.text}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddTask(task.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          +
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
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
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};