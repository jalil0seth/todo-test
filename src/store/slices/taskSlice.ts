import { StateCreator } from 'zustand';
import { Task } from '../../types/task';

export interface TaskSlice {
  editingTaskId: string | null;
  taskActions: {
    toggleTask: (taskId: string) => void;
    updateTaskText: (taskId: string, newText: string) => void;
    addTask: (sectionId: string, parentTaskId?: string) => string;
    deleteTask: (sectionId: string, taskId: string) => void;
    setEditingTaskId: (taskId: string | null) => void;
  };
}

export const createTaskSlice: StateCreator<TaskSlice & any> = (set) => ({
  editingTaskId: null,
  taskActions: {
    toggleTask: (taskId) =>
      set((state: any) => ({
        sections: state.sections.map((section: any) => ({
          ...section,
          tasks: updateTasksRecursively(section.tasks, taskId, (task) => ({
            ...task,
            completed: !task.completed,
          })),
        })),
      })),

    updateTaskText: (taskId, newText) =>
      set((state: any) => ({
        sections: state.sections.map((section: any) => ({
          ...section,
          tasks: updateTasksRecursively(section.tasks, taskId, (task) => ({
            ...task,
            text: newText,
          })),
        })),
      })),

    addTask: (sectionId, parentTaskId) => {
      const newId = generateId();
      set((state: any) => ({
        sections: state.sections.map((section: any) => {
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
              children: [
                ...(task.children || []),
                { id: newId, text: 'New Task', completed: false },
              ],
            })),
          };
        }),
      }));
      return newId;
    },

    deleteTask: (sectionId, taskId) =>
      set((state: any) => ({
        sections: state.sections.map((section: any) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            tasks: filterTasksRecursively(section.tasks, taskId),
          };
        }),
      })),

    setEditingTaskId: (taskId) =>
      set({ editingTaskId: taskId }),
  },
});