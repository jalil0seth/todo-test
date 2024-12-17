import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';

export const GoalsList: React.FC = () => {
  const [newGoal, setNewGoal] = useState('');
  const { dailyGoals, actions } = useStore();

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      actions.addDailyGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h2 className="text-xl font-bold mb-4">Daily Goals</h2>
      <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new goal..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
      <div className="space-y-2">
        {dailyGoals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded"
          >
            <Checkbox
              checked={goal.completed}
              onCheckedChange={() => actions.toggleDailyGoal(goal.id)}
            />
            <span className={goal.completed ? 'line-through text-gray-400' : ''}>
              {goal.text}
            </span>
            <button
              onClick={() => actions.deleteDailyGoal(goal.id)}
              className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};