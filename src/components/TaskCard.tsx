import React, { useState } from 'react';
import { Clock, ArrowRight, CheckSquare, Square, MessageSquare, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { Task, Status, SubTask } from '../types/task';
import { CommentSection } from './CommentSection';
import { EditTaskModal } from './EditTaskModal';

const nextStatus: Record<Status, Status> = {
  backlog: 'focus',
  focus: 'later',
  later: 'backlog',
  completed: 'backlog'
};

export function TaskCard({ task }: { task: Task }) {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { updateTask, updateTaskStatus, deleteTask } = useTaskStore();

  const handleSubtaskToggle = (subtask: SubTask) => {
    updateTask(task.id, {
      subtasks: task.subtasks.map(st =>
        st.id === subtask.id ? { ...st, completed: !st.completed } : st
      )
    });
  };

  const moveToNextStatus = () => {
    updateTaskStatus(task.id, nextStatus[task.status]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progress = Math.round((completedSubtasks / task.subtasks.length) * 100);

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-mono text-sm font-medium">{task.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <div className="bg-gray-100 w-full rounded-full h-2">
                  <div 
                    className="bg-[#ff6600] rounded-full h-2" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{progress}%</span>
              </div>

              <ul className="space-y-1">
                {task.subtasks.map((subtask) => (
                  <li 
                    key={subtask.id} 
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <button
                      onClick={() => handleSubtaskToggle(subtask)}
                      className="text-gray-400 hover:text-[#ff6600]"
                    >
                      {subtask.completed ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className={subtask.completed ? 'line-through' : ''}>
                      {subtask.completed ? `* ${subtask.title}` : subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={moveToNextStatus}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-[#ff6600]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{task.comments.length} comments</span>
            {showComments ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <span>
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {showComments && (
        <div className="border-t bg-gray-50 p-4">
          <CommentSection taskId={task.id} comments={task.comments} />
        </div>
      )}

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}