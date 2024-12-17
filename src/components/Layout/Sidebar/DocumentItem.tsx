import React, { useState } from 'react';
import { Pin, Tag, Trash2 } from 'lucide-react';
import { Section } from '../../../types/task';
import { useStore } from '../../../store/useStore';

interface DocumentItemProps {
  document: Section;
  isPinned: boolean;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, isPinned }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title);
  const { selectedDocument, actions } = useStore();

  const handleTitleSubmit = () => {
    if (title.trim()) {
      actions.updateDocument(document.id, { title: title.trim() });
    } else {
      setTitle(document.title);
    }
    setIsEditing(false);
  };

  const isSelected = selectedDocument === document.id;

  return (
    <div
      className={`group relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-1 ${
        isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
      }`}
      onClick={() => actions.selectDocument(document.id)}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleTitleSubmit();
            if (e.key === 'Escape') {
              setTitle(document.title);
              setIsEditing(false);
            }
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <>
          <span
            className="flex-1 text-sm truncate"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {document.title}
          </span>
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                actions.togglePinDocument(document.id);
              }}
              className={`p-1 rounded hover:bg-gray-200 ${
                isPinned ? 'text-blue-500' : 'text-gray-500'
              }`}
              title={isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-gray-200 text-gray-500"
              title="Add Tags"
            >
              <Tag className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                actions.deleteDocument(document.id);
              }}
              className="p-1 rounded hover:bg-gray-200 text-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};