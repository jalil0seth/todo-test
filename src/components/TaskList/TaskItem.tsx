import React from 'react';
import { Task } from '../../types/task';
import { Checkbox } from '../ui/Checkbox';
import { TaskText } from './TaskText';
import { Plus, Trash2 } from 'lucide-react';

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
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      <div className="group flex items-center gap-2 hover:bg-gray-50 rounded p-1" style={{ paddingLeft }}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <div className="flex-1">
          <TaskText
            text={task.text}
            completed={task.completed}
            isEditing={editingTaskId === task.id}
            onEdit={(newText) => onUpdateText(task.id, newText)}
            onStartEdit={() => onStartEdit(task.id)}
            onStopEdit={onStopEdit}
          />
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
          <button
            onClick={() => onAddTask(task.id)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Add Subtask"
          >
            <Plus className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
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