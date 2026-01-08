export interface Habit {
  id: string;
  name: string;
  color: string;
  icon?: string;
  goalPerWeek: number; // Target number of completions per week (e.g., 4 for "exercise 4 times per week")
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD format
  mood: number; // 0-100
}

export interface AppData {
  habits: Habit[];
  completions: HabitCompletion[];
  moods: MoodEntry[];
}

