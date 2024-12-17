import React from 'react';
import { Container } from './components/Layout/Container';
import { Header } from './components/Layout/Header';
import { DocumentContent } from './components/Document/DocumentContent';
import { useStore } from './store/useStore';

function App() {
  const { documents, selectedDocument } = useStore();
  const currentDocument = documents.find((doc) => doc.id === selectedDocument);

  return (
    <Container>
      <div className="h-full flex flex-col">
        <Header />
        {currentDocument ? (
          <DocumentContent document={currentDocument} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                No Document Selected
              </h2>
              <p className="text-gray-500">
                Select a document from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default App;