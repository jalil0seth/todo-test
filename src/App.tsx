import React from 'react';
import { Container } from './components/Layout/Container';
import { Header } from './components/Layout/Header';
import { Section } from './components/TaskList/Section';
import { GoalsList } from './components/DailyGoals/GoalsList';
import { CountdownTimer } from './components/Timer/CountdownTimer';
import { AudioPlayer } from './components/Audio/AudioPlayer';
import { useStore } from './store/useStore';
import { Plus, Pin } from 'lucide-react';

function App() {
  const { sections, pinnedSections, editingTaskId, actions } = useStore();

  const pinnedSectionsList = sections.filter((section) =>
    pinnedSections.includes(section.id)
  );
  const unpinnedSectionsList = sections.filter(
    (section) => !pinnedSections.includes(section.id)
  );

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <Header />
            <button
              onClick={() => actions.addSection()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Section
            </button>
          </div>

          {pinnedSectionsList.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-600">
                📌 Pinned Sections
              </h3>
              {pinnedSectionsList.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  isPinned={true}
                  onToggleTask={actions.toggleTask}
                  onUpdateTaskText={actions.updateTaskText}
                  editingTaskId={editingTaskId}
                  onStartEdit={actions.setEditingTaskId}
                  onStopEdit={() => actions.setEditingTaskId(null)}
                  onUpdateSectionTitle={actions.updateSectionTitle}
                  onAddTask={actions.addTask}
                  onDeleteTask={actions.deleteTask}
                  onDeleteSection={actions.deleteSection}
                  onTogglePin={actions.togglePinSection}
                />
              ))}
            </div>
          )}

          {unpinnedSectionsList.map((section) => (
            <Section
              key={section.id}
              section={section}
              isPinned={false}
              onToggleTask={actions.toggleTask}
              onUpdateTaskText={actions.updateTaskText}
              editingTaskId={editingTaskId}
              onStartEdit={actions.setEditingTaskId}
              onStopEdit={() => actions.setEditingTaskId(null)}
              onUpdateSectionTitle={actions.updateSectionTitle}
              onAddTask={actions.addTask}
              onDeleteTask={actions.deleteTask}
              onDeleteSection={actions.deleteSection}
              onTogglePin={actions.togglePinSection}
            />
          ))}
        </div>

        <div className="space-y-8">
          <GoalsList />
          <CountdownTimer />
          <AudioPlayer />
        </div>
      </div>
    </Container>
  );
}

export default App;