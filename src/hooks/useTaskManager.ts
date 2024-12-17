import { useState, useEffect } from 'react';
import { Section, Task } from '../types/task';

const STORAGE_KEY = 'taskManagerData';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useTaskManager = (initialSections: Section[]) => {
  const [sections, setSections] = useState<Section[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialSections;
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  const updateTasksRecursively = (
    tasks: Task[],
    taskId: string,
    updater: (task: Task) => Task
  ): Task[] => {
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

  const toggleTask = (taskId: string) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: updateTasksRecursively(section.tasks, taskId, task => ({
        ...task,
        completed: !task.completed,
      })),
    })));
  };

  const updateTaskText = (taskId: string, newText: string) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: updateTasksRecursively(section.tasks, taskId, task => ({
        ...task,
        text: newText,
      })),
    })));
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      title: 'New Section',
      tasks: [],
    };
    setSections([...sections, newSection]);
    return newSection.id;
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    ));
  };

  const addTask = (sectionId: string, parentTaskId?: string) => {
    const newTask: Task = {
      id: generateId(),
      text: 'New Task',
      completed: false,
    };

    setSections(sections.map(section => {
      if (section.id !== sectionId) return section;

      if (!parentTaskId) {
        return {
          ...section,
          tasks: [...section.tasks, newTask],
        };
      }

      return {
        ...section,
        tasks: updateTasksRecursively(section.tasks, parentTaskId, task => ({
          ...task,
          children: [...(task.children || []), newTask],
        })),
      };
    }));

    return newTask.id;
  };

  const deleteTask = (sectionId: string, taskId: string) => {
    setSections(sections.map(section => {
      if (section.id !== sectionId) return section;

      const filterTasksRecursively = (tasks: Task[]): Task[] => {
        return tasks
          .filter(task => task.id !== taskId)
          .map(task => ({
            ...task,
            children: task.children ? filterTasksRecursively(task.children) : undefined,
          }));
      };

      return {
        ...section,
        tasks: filterTasksRecursively(section.tasks),
      };
    }));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const startEditing = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const stopEditing = () => {
    setEditingTaskId(null);
  };

  return {
    sections,
    editingTaskId,
    toggleTask,
    updateTaskText,
    startEditing,
    stopEditing,
    addSection,
    updateSectionTitle,
    addTask,
    deleteTask,
    deleteSection,
  };
};