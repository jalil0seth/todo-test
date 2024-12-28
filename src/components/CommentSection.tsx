import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { Comment } from '../types/task';

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
}

export function CommentSection({ taskId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const addComment = useTaskStore(state => state.addComment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(taskId, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="text-sm">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-700">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm p-2 border rounded"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-3 py-2 bg-[#ff6600] text-white rounded hover:bg-[#ff7733] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}