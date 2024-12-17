import React from 'react';
import { DocumentItem } from './DocumentItem';
import { Plus } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const DocumentList: React.FC = () => {
  const { documents, pinnedDocuments, actions } = useStore();

  return (
    <div className="h-full bg-gray-50 border-r">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Documents</h2>
          <button
            onClick={() => actions.createDocument()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            title="Create Document"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New</span>
          </button>
        </div>

        {pinnedDocuments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">📌 Pinned</h3>
            <div className="space-y-1">
              {documents
                .filter((doc) => pinnedDocuments.includes(doc.id))
                .map((document) => (
                  <DocumentItem
                    key={document.id}
                    document={document}
                    isPinned={true}
                  />
                ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">All Documents</h3>
          <div className="space-y-1">
            {documents
              .filter((doc) => !pinnedDocuments.includes(doc.id))
              .map((document) => (
                <DocumentItem
                  key={document.id}
                  document={document}
                  isPinned={false}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};