import { AppData, Habit } from '../types';

const STORAGE_KEY = 'habit-tracker-data';

const defaultData: AppData = {
  habits: [],
  completions: [],
  moods: [],
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Migrate old habits that don't have goalPerWeek
      if (data.habits) {
        data.habits = data.habits.map((habit: Habit) => ({
          ...habit,
          goalPerWeek: habit.goalPerWeek ?? 7, // Default to daily if missing
        }));
      }
      return data;
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
  return defaultData;
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const addHabit = (habit: Habit): void => {
  const data = loadData();
  data.habits.push(habit);
  saveData(data);
};

export const deleteHabit = (habitId: string): void => {
  const data = loadData();
  data.habits = data.habits.filter(h => h.id !== habitId);
  data.completions = data.completions.filter(c => c.habitId !== habitId);
  saveData(data);
};

export const updateHabit = (updatedHabit: Habit): void => {
  const data = loadData();
  const index = data.habits.findIndex(h => h.id === updatedHabit.id);
  if (index >= 0) {
    data.habits[index] = updatedHabit;
    saveData(data);
  }
};

export const toggleCompletion = (habitId: string, date: string): void => {
  const data = loadData();
  const existingIndex = data.completions.findIndex(
    c => c.habitId === habitId && c.date === date
  );

  if (existingIndex >= 0) {
    data.completions[existingIndex].completed = !data.completions[existingIndex].completed;
  } else {
    data.completions.push({ habitId, date, completed: true });
  }

  saveData(data);
};

export const setMood = (date: string, mood: number): void => {
  const data = loadData();
  const existingIndex = data.moods.findIndex(m => m.date === date);

  if (existingIndex >= 0) {
    data.moods[existingIndex].mood = mood;
  } else {
    data.moods.push({ date, mood });
  }

  saveData(data);
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    // Validate data structure
    if (data.habits && Array.isArray(data.habits) && 
        data.completions && Array.isArray(data.completions) &&
        data.moods && Array.isArray(data.moods)) {
      saveData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

