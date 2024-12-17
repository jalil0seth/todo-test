import React, { ReactNode } from 'react';
import { DocumentList } from './Sidebar/DocumentList';

interface ContainerProps {
  children: ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 h-full">
        <DocumentList />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};