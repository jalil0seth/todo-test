import React from 'react';
import { Task } from '../../types/task';
import { Checkbox } from '../ui/Checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  documentId: string;
  editingTaskId: string | null;
  level?: number;
  onToggle: () => void;
  onUpdateText: (newText: string) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onAddSubtask: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  documentId,
  editingTaskId,
  level = 0,
  onToggle,
  onUpdateText,
  onStartEdit,
  onStopEdit,
  onAddSubtask,
  onDelete,
}) => {
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      <div
        className="group flex items-center gap-2 hover:bg-gray-50 rounded p-1"
        style={{ paddingLeft }}
      >
        <Checkbox checked={task.completed} onCheckedChange={onToggle} />
        <div className="flex-1">
          {editingTaskId === task.id ? (
            <input
              type="text"
              value={task.text}
              onChange={(e) => onUpdateText(e.target.value)}
              onBlur={onStopEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onStopEdit();
                if (e.key === 'Escape') {
                  onUpdateText(task.text);
                  onStopEdit();
                }
              }}
              className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span
              className={`${task.completed ? 'line-through text-gray-400' : ''}`}
              onDoubleClick={onStartEdit}
            >
              {task.text}
            </span>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
          <button
            onClick={onAddSubtask}
            className="p-1 hover:bg-gray-200 rounded"
            title="Add Subtask"
          >
            <Plus className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={onDelete}
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
          documentId={documentId}
          editingTaskId={editingTaskId}
          level={level + 1}
          onToggle={() => onToggle()}
          onUpdateText={onUpdateText}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onAddSubtask={onAddSubtask}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};