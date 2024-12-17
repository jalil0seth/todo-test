import React from 'react';
import { Container } from './components/Layout/Container';
import { Header } from './components/Layout/Header';
import { Section } from './components/TaskList/Section';
import { useTaskManager } from './hooks/useTaskManager';
import { initialSections } from './data/initialData';

function App() {
  const {
    sections,
    editingTaskId,
    toggleTask,
    updateTaskText,
    startEditing,
    stopEditing,
  } = useTaskManager(initialSections);

  return (
    <Container>
      <Header />
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          onToggleTask={toggleTask}
          onUpdateTaskText={updateTaskText}
          editingTaskId={editingTaskId}
          onStartEdit={startEditing}
          onStopEdit={stopEditing}
        />
      ))}
    </Container>
  );
}

export default App;