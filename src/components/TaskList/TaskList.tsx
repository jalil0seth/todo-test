import React from 'react';
import { Task } from '../../types/task';
import { TaskItem } from './TaskItem';
import { useStore } from '../../store/useStore';

interface TaskListProps {
  tasks: Task[];
  documentId: string;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, documentId }) => {
  const { editingTaskId, actions } = useStore();

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          documentId={documentId}
          editingTaskId={editingTaskId}
          onToggle={() => actions.toggleTask(documentId, task.id)}
          onUpdateText={(newText) => actions.updateTaskText(documentId, task.id, newText)}
          onStartEdit={() => actions.setEditingTaskId(task.id)}
          onStopEdit={() => actions.setEditingTaskId(null)}
          onAddSubtask={() => actions.addTask(documentId, task.id)}
          onDelete={() => actions.deleteTask(documentId, task.id)}
        />
      ))}
    </div>
  );
};