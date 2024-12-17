import { StateCreator } from 'zustand';
import { DailyGoal } from '../../types/task';
import { generateId } from '../utils';

export interface GoalSlice {
  dailyGoals: DailyGoal[];
  goalActions: {
    addDailyGoal: (goal: string) => void;
    toggleDailyGoal: (goalId: string) => void;
    deleteDailyGoal: (goalId: string) => void;
  };
}

export const createGoalSlice: StateCreator<GoalSlice & any> = (set) => ({
  dailyGoals: [],
  goalActions: {
    addDailyGoal: (goal) =>
      set((state) => ({
        dailyGoals: [
          ...state.dailyGoals,
          { id: generateId(), text: goal, completed: false },
        ],
      })),

    toggleDailyGoal: (goalId) =>
      set((state) => ({
        dailyGoals: state.dailyGoals.map((goal) =>
          goal.id === goalId
            ? { ...goal, completed: !goal.completed }
            : goal
        ),
      })),

    deleteDailyGoal: (goalId) =>
      set((state) => ({
        dailyGoals: state.dailyGoals.filter((goal) => goal.id !== goalId),
      })),
  },
});