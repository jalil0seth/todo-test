import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface TaskTextProps {
  text: string;
  completed: boolean;
  isEditing: boolean;
  onEdit: (newText: string) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

export const TaskText: React.FC<TaskTextProps> = ({
  text,
  completed,
  isEditing,
  onEdit,
  onStartEdit,
  onStopEdit,
}) => {
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textStyle = completed ? 'line-through text-gray-400' : '';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing]);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEdit(editText);
      onStopEdit();
    } else if (e.key === 'Escape') {
      setEditText(text);
      onStopEdit();
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={() => {
          onEdit(editText);
          onStopEdit();
        }}
        onKeyDown={handleKeyDown}
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={Math.max(1, editText.split('\n').length)}
      />
    );
  }

  return (
    <div
      className={`flex-1 cursor-pointer ${textStyle}`}
      onDoubleClick={onStartEdit}
    >
      <ReactMarkdown className="prose prose-sm max-w-none">
        {text}
      </ReactMarkdown>
    </div>
  );
};