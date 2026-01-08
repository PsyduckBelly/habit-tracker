import { useState, useEffect } from 'react';
import { Habit } from '../types';

// Notion-style colors: soft, low saturation, elegant
const COLORS = [
  '#9B9A97', // gray (default)
  '#E3E2E0', // light gray
  '#F1F1EF', // beige
  '#FBF3DB', // yellow
  '#F7E6CC', // orange
  '#EAD4D6', // pink
  '#D5CFE1', // purple
  '#D3E5EF', // blue
  '#CCE5D4', // green
  '#B4DDD1', // teal
  '#E8DDD5', // brown
  '#F5E1E9', // rose
  '#E1E5E9', // slate
  '#D4E4F7', // sky blue
  '#E8F4E8', // mint
  '#F0E6F2', // lavender
];

// Fun and interesting preset habits
const PRESET_HABITS: Omit<Habit, 'id' | 'createdAt'>[] = [
  { name: '10k Steps', color: '#EAD4D6', goalPerWeek: 5 }, // soft pink
  { name: 'Call a Friend', color: '#D3E5EF', goalPerWeek: 2 }, // soft blue
  { name: 'Try a New Recipe', color: '#D5CFE1', goalPerWeek: 1 }, // soft purple
  { name: 'No Phone Before Bed', color: '#B4DDD1', goalPerWeek: 7 }, // soft teal
  { name: 'Random Act of Kindness', color: '#FBF3DB', goalPerWeek: 3 }, // soft yellow
  { name: 'Watch a Documentary', color: '#F5E1E9', goalPerWeek: 1 }, // soft rose
  { name: 'Go Outside', color: '#CCE5D4', goalPerWeek: 5 }, // soft green
  { name: 'Practice Gratitude', color: '#E8F4E8', goalPerWeek: 7 }, // soft mint
  { name: 'Learn a Joke', color: '#E1E5E9', goalPerWeek: 2 }, // soft slate
  { name: 'Dance Party', color: '#D4E4F7', goalPerWeek: 2 }, // soft sky blue
  { name: 'Read for 20min', color: '#F0E6F2', goalPerWeek: 5 }, // lavender
  { name: 'Declutter Something', color: '#E8DDD5', goalPerWeek: 1 }, // brown
];

interface HabitFormProps {
  habit?: Habit; // Optional: if provided, we're editing
  onAdd: (habit: Habit) => void;
  onUpdate?: (habit: Habit) => void;
  onClose: () => void;
}

export default function HabitForm({ habit, onAdd, onUpdate, onClose }: HabitFormProps) {
  const isEditing = !!habit;
  const [name, setName] = useState(habit?.name || '');
  const [color, setColor] = useState(habit?.color || COLORS[0]);
  const [goalPerWeek, setGoalPerWeek] = useState(habit?.goalPerWeek || 7);

  // Update form when habit prop changes
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setColor(habit.color);
      setGoalPerWeek(habit.goalPerWeek);
    } else {
      setName('');
      setColor(COLORS[0]);
      setGoalPerWeek(7);
    }
  }, [habit]);

  const handlePresetClick = (preset: Omit<Habit, 'id' | 'createdAt'>) => {
    setName(preset.name);
    setColor(preset.color);
    setGoalPerWeek(preset.goalPerWeek);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const habitData: Habit = {
        id: habit?.id || crypto.randomUUID(),
        name: name.trim(),
        color,
        goalPerWeek: Math.max(1, Math.min(7, goalPerWeek)), // Clamp between 1 and 7
        createdAt: habit?.createdAt || new Date().toISOString(),
      };
      
      if (isEditing && onUpdate) {
        onUpdate(habitData);
      } else {
        onAdd(habitData);
      }
      
      setName('');
      setGoalPerWeek(7);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl mt-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEditing ? 'Edit Habit' : 'Add New Habit'}
        </h2>
        
        {/* Preset Habits - only show when adding new habit */}
        {!isEditing && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-gray-700 mb-3 text-sm font-medium">Quick Add - Preset Habits</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_HABITS.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition text-sm"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span>{preset.name}</span>
                  <span className="text-gray-400 text-xs">
                    ({preset.goalPerWeek === 7 ? 'daily' : `${preset.goalPerWeek}/week`})
                  </span>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-2">Click a preset to fill the form, or create your own below</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Wake up early, Exercise, Read..."
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Goal per week</label>
            <input
              type="number"
              min="1"
              max="7"
              value={goalPerWeek}
              onChange={(e) => setGoalPerWeek(parseInt(e.target.value) || 7)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., 4 for 4 times per week"
            />
            <p className="text-gray-500 text-xs mt-1">
              {goalPerWeek === 7 ? 'Daily habit' : `${goalPerWeek} times per week`}
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-900 scale-110' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded transition text-sm font-medium"
            >
              {isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

