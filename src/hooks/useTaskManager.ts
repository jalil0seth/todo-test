import { useState } from 'react';
import { Section, Task } from '../types/task';

export const useTaskManager = (initialSections: Section[]) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
  };
};