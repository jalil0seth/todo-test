import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialSections } from '../data/initialData';
import { Section, Task, DailyGoal } from '../types/task';
import { generateId, updateTasksRecursively, filterTasksRecursively } from './utils';

interface StoreState {
  sections: Section[];
  pinnedSections: string[];
  dailyGoals: DailyGoal[];
  editingTaskId: string | null;
  audioPlaying: boolean;
  audioVolume: number;
  actions: {
    // Task actions
    toggleTask: (taskId: string) => void;
    updateTaskText: (taskId: string, newText: string) => void;
    addTask: (sectionId: string, parentTaskId?: string) => string;
    deleteTask: (sectionId: string, taskId: string) => void;
    setEditingTaskId: (taskId: string | null) => void;
    
    // Section actions
    addSection: () => string;
    updateSectionTitle: (sectionId: string, newTitle: string) => void;
    deleteSection: (sectionId: string) => void;
    togglePinSection: (sectionId: string) => void;
    
    // Goal actions
    addDailyGoal: (goal: string) => void;
    toggleDailyGoal: (goalId: string) => void;
    deleteDailyGoal: (goalId: string) => void;
    
    // Audio actions
    setAudioPlaying: (playing: boolean) => void;
    setAudioVolume: (volume: number) => void;
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      sections: initialSections,
      pinnedSections: [],
      dailyGoals: [],
      editingTaskId: null,
      audioPlaying: false,
      audioVolume: 0.5,
      actions: {
        // Task actions
        toggleTask: (taskId) =>
          set((state) => ({
            sections: state.sections.map((section) => ({
              ...section,
              tasks: updateTasksRecursively(section.tasks, taskId, (task) => ({
                ...task,
                completed: !task.completed,
              })),
            })),
          })),

        updateTaskText: (taskId, newText) =>
          set((state) => ({
            sections: state.sections.map((section) => ({
              ...section,
              tasks: updateTasksRecursively(section.tasks, taskId, (task) => ({
                ...task,
                text: newText,
              })),
            })),
          })),

        addTask: (sectionId, parentTaskId) => {
          const newId = generateId();
          set((state) => ({
            sections: state.sections.map((section) => {
              if (section.id !== sectionId) return section;
              if (!parentTaskId) {
                return {
                  ...section,
                  tasks: [...section.tasks, { id: newId, text: 'New Task', completed: false }],
                };
              }
              return {
                ...section,
                tasks: updateTasksRecursively(section.tasks, parentTaskId, (task) => ({
                  ...task,
                  children: [...(task.children || []), { id: newId, text: 'New Task', completed: false }],
                })),
              };
            }),
          }));
          return newId;
        },

        deleteTask: (sectionId, taskId) =>
          set((state) => ({
            sections: state.sections.map((section) => {
              if (section.id !== sectionId) return section;
              return {
                ...section,
                tasks: filterTasksRecursively(section.tasks, taskId),
              };
            }),
          })),

        setEditingTaskId: (taskId) =>
          set({ editingTaskId: taskId }),

        // Section actions
        addSection: () => {
          const newId = generateId();
          set((state) => ({
            sections: [...state.sections, { id: newId, title: 'New Section', tasks: [] }],
          }));
          return newId;
        },

        updateSectionTitle: (sectionId, newTitle) =>
          set((state) => ({
            sections: state.sections.map((section) =>
              section.id === sectionId ? { ...section, title: newTitle } : section
            ),
          })),

        deleteSection: (sectionId) =>
          set((state) => ({
            sections: state.sections.filter((section) => section.id !== sectionId),
            pinnedSections: state.pinnedSections.filter((id) => id !== sectionId),
          })),

        togglePinSection: (sectionId) =>
          set((state) => ({
            pinnedSections: state.pinnedSections.includes(sectionId)
              ? state.pinnedSections.filter((id) => id !== sectionId)
              : [...state.pinnedSections, sectionId],
          })),

        // Goal actions
        addDailyGoal: (goal) =>
          set((state) => ({
            dailyGoals: [...state.dailyGoals, { id: generateId(), text: goal, completed: false }],
          })),

        toggleDailyGoal: (goalId) =>
          set((state) => ({
            dailyGoals: state.dailyGoals.map((goal) =>
              goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
            ),
          })),

        deleteDailyGoal: (goalId) =>
          set((state) => ({
            dailyGoals: state.dailyGoals.filter((goal) => goal.id !== goalId),
          })),

        // Audio actions
        setAudioPlaying: (playing) =>
          set({ audioPlaying: playing }),

        setAudioVolume: (volume) =>
          set({ audioVolume: volume }),
      },
    }),
    {
      name: 'task-manager-storage',
    }
  )
);