import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Status } from '../types/task';

export function TaskList({ status }: { status: Status }) {
  const tasks = useTaskStore((state) => 
    state.tasks.filter((task) => task.status === status)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-4 rounded border">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm">{task.title}</h3>
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          {task.subtasks.length > 0 && (
            <ul className="mt-2 space-y-1">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {/* Add subtask toggle handler */}}
                    className="rounded"
                  />
                  <span>{subtask.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}