export const generateId = () => Math.random().toString(36).substr(2, 9);

export const updateTasksRecursively = (tasks: any[], taskId: string, updater: (task: any) => any) => {
  return tasks.map((task) => {
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

export const filterTasksRecursively = (tasks: any[], taskId: string) => {
  return tasks
    .filter((task) => task.id !== taskId)
    .map((task) => ({
      ...task,
      children: task.children
        ? filterTasksRecursively(task.children, taskId)
        : undefined,
    }));