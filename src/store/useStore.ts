import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialSections } from '../data/initialData';
import { Section, Task } from '../types/task';
import { generateId } from './utils';

interface StoreState {
  documents: Section[];
  pinnedDocuments: string[];
  selectedDocument: string | null;
  editingTaskId: string | null;
  actions: {
    // Document actions
    createDocument: () => void;
    updateDocument: (documentId: string, updates: Partial<Section>) => void;
    deleteDocument: (documentId: string) => void;
    togglePinDocument: (documentId: string) => void;
    selectDocument: (documentId: string) => void;
    
    // Task actions
    toggleTask: (documentId: string, taskId: string) => void;
    updateTaskText: (documentId: string, taskId: string, newText: string) => void;
    addTask: (documentId: string, parentTaskId?: string) => void;
    deleteTask: (documentId: string, taskId: string) => void;
    setEditingTaskId: (taskId: string | null) => void;
  };
}

const updateTasksRecursively = (tasks: Task[], taskId: string, updater: (task: Task) => Task): Task[] => {
  return tasks.map(task => {
    if (task.id === taskId) {
      return updater(task);
    }
    if (task.children) {
      return {
        ...task,
        children: updateTasksRecursively(task.children, taskId, updater),
      };
    }
    return task;
  });
};

const filterTasksRecursively = (tasks: Task[], taskId: string): Task[] => {
  return tasks
    .filter(task => task.id !== taskId)
    .map(task => ({
      ...task,
      children: task.children ? filterTasksRecursively(task.children, taskId) : undefined,
    }));
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      documents: initialSections,
      pinnedDocuments: [],
      selectedDocument: null,
      editingTaskId: null,
      actions: {
        createDocument: () => {
          const newId = generateId();
          set((state) => ({
            documents: [
              ...state.documents,
              {
                id: newId,
                title: 'Untitled Document',
                tasks: [],
                tags: [],
              },
            ],
            selectedDocument: newId,
          }));
        },

        updateDocument: (documentId, updates) =>
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId ? { ...doc, ...updates } : doc
            ),
          })),

        deleteDocument: (documentId) =>
          set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== documentId),
            pinnedDocuments: state.pinnedDocuments.filter((id) => id !== documentId),
            selectedDocument:
              state.selectedDocument === documentId ? null : state.selectedDocument,
          })),

        togglePinDocument: (documentId) =>
          set((state) => ({
            pinnedDocuments: state.pinnedDocuments.includes(documentId)
              ? state.pinnedDocuments.filter((id) => id !== documentId)
              : [...state.pinnedDocuments, documentId],
          })),

        selectDocument: (documentId) =>
          set({ selectedDocument: documentId }),

        toggleTask: (documentId, taskId) =>
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId
                ? {
                    ...doc,
                    tasks: updateTasksRecursively(doc.tasks, taskId, (task) => ({
                      ...task,
                      completed: !task.completed,
                    })),
                  }
                : doc
            ),
          })),

        updateTaskText: (documentId, taskId, newText) =>
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId
                ? {
                    ...doc,
                    tasks: updateTasksRecursively(doc.tasks, taskId, (task) => ({
                      ...task,
                      text: newText,
                    })),
                  }
                : doc
            ),
          })),

        addTask: (documentId, parentTaskId) => {
          const newTask: Task = {
            id: generateId(),
            text: 'New Task',
            completed: false,
          };

          set((state) => ({
            documents: state.documents.map((doc) => {
              if (doc.id !== documentId) return doc;

              if (!parentTaskId) {
                return {
                  ...doc,
                  tasks: [...doc.tasks, newTask],
                };
              }

              return {
                ...doc,
                tasks: updateTasksRecursively(doc.tasks, parentTaskId, (task) => ({
                  ...task,
                  children: [...(task.children || []), newTask],
                })),
              };
            }),
          }));
        },

        deleteTask: (documentId, taskId) =>
          set((state) => ({
            documents: state.documents.map((doc) =>
              doc.id === documentId
                ? {
                    ...doc,
                    tasks: filterTasksRecursively(doc.tasks, taskId),
                  }
                : doc
            ),
          })),

        setEditingTaskId: (taskId) =>
          set({ editingTaskId: taskId }),
      },
    }),
    {
      name: 'document-manager-storage',
    }
  )
);