import { HabitCompletion, Habit } from '../types';
import { getMonthStart, getMonthEnd, formatDate } from './dateUtils';
import { isWithinInterval, parseISO, eachWeekOfInterval, startOfWeek, subDays, format } from 'date-fns';

export const getCompletionsForMonth = (
  completions: HabitCompletion[],
  monthDate: Date = new Date()
): HabitCompletion[] => {
  const monthStart = getMonthStart(monthDate);
  const monthEnd = getMonthEnd(monthDate);

  return completions.filter(c => {
    const completionDate = parseISO(c.date);
    return isWithinInterval(completionDate, { start: monthStart, end: monthEnd });
  });
};

export const getTotalCompletions = (completions: HabitCompletion[]): number => {
  return completions.filter(c => c.completed).length;
};

export const getProgressPercentage = (
  habits: Habit[],
  completions: HabitCompletion[],
  monthDate: Date = new Date()
): number => {
  if (habits.length === 0) return 0;

  const monthStart = getMonthStart(monthDate);
  const monthEnd = getMonthEnd(monthDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the earliest start date: either earliest habit creation or earliest completion
  let earliestStart: Date | null = null;
  
  // Check habit creation dates
  habits.forEach(habit => {
    const createdDate = parseISO(habit.createdAt);
    createdDate.setHours(0, 0, 0, 0);
    if (!earliestStart || createdDate < earliestStart) {
      earliestStart = createdDate;
    }
  });
  
  // Check completion dates
  completions.forEach(completion => {
    if (completion.completed) {
      const completionDate = parseISO(completion.date);
      if (!earliestStart || completionDate < earliestStart) {
        earliestStart = completionDate;
      }
    }
  });
  
  // If no start date found, use month start
  if (!earliestStart) {
    earliestStart = monthStart;
  }
  
  // Use the later of: earliest start or month start
  const actualStart = earliestStart > monthStart ? earliestStart : monthStart;
  // Use the earlier of: today or month end
  const actualEnd = today < monthEnd ? today : monthEnd;
  
  // If actualStart is after actualEnd, return 0
  if (actualStart > actualEnd) {
    return 0;
  }

  let totalGoal = 0;
  let totalCompleted = 0;

  habits.forEach(habit => {
    const habitCreatedDate = parseISO(habit.createdAt);
    habitCreatedDate.setHours(0, 0, 0, 0);
    
    // Start from the later of: habit creation date or actual start
    const habitStart = habitCreatedDate > actualStart ? habitCreatedDate : actualStart;
    
    // If habit starts after actual end, skip it
    if (habitStart > actualEnd) {
      return;
    }
    
    const habitCompletions = completions.filter(
      c => c.habitId === habit.id && c.completed
    );
    
    // Calculate based on days, not full weeks
    // Count days from habitStart to actualEnd
    const daysDiff = Math.ceil((actualEnd.getTime() - habitStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate goal: prorated for partial weeks
    const fullWeeks = Math.floor(daysDiff / 7);
    const remainingDays = daysDiff % 7;
    const proratedGoal = (fullWeeks * habit.goalPerWeek) + 
      (remainingDays > 0 ? Math.ceil((remainingDays / 7) * habit.goalPerWeek) : 0);
    
    // Count actual completions in the period
    const periodCompletions = habitCompletions.filter(c => {
      const completionDate = parseISO(c.date);
      return completionDate >= habitStart && completionDate <= actualEnd;
    }).length;

    totalGoal += proratedGoal;
    totalCompleted += Math.min(periodCompletions, proratedGoal); // Cap at goal
  });

  if (totalGoal === 0) return 0;
  return Math.round((totalCompleted / totalGoal) * 100 * 100) / 100;
};

export const getHabitProgressData = (
  habits: Habit[],
  completions: HabitCompletion[],
  monthDate: Date = new Date()
): { date: string; progress: number }[] => {
  const monthStart = getMonthStart(monthDate);
  const monthEnd = getMonthEnd(monthDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the earliest start date
  let earliestStart: Date | null = null;
  
  habits.forEach(habit => {
    const createdDate = parseISO(habit.createdAt);
    createdDate.setHours(0, 0, 0, 0);
    if (!earliestStart || createdDate < earliestStart) {
      earliestStart = createdDate;
    }
  });
  
  completions.forEach(completion => {
    if (completion.completed) {
      const completionDate = parseISO(completion.date);
      if (!earliestStart || completionDate < earliestStart) {
        earliestStart = completionDate;
      }
    }
  });
  
  if (!earliestStart) {
    earliestStart = monthStart;
  }
  
  // Use the later of: earliest start or month start
  const actualStart = earliestStart > monthStart ? earliestStart : monthStart;
  // Use the earlier of: today or month end
  const actualEnd = today < monthEnd ? today : monthEnd;
  
  const days: Date[] = [];
  for (let d = new Date(actualStart); d <= actualEnd; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days.map(date => {
    const dateStr = formatDate(date);
    
    // Only count habits that existed on this date
    const habitsOnDate = habits.filter(habit => {
      const habitCreatedDate = parseISO(habit.createdAt);
      habitCreatedDate.setHours(0, 0, 0, 0);
      return date >= habitCreatedDate;
    });
    
    const dayCompletions = completions.filter(
      c => c.date === dateStr && c.completed
    );
    
    // Calculate progress as percentage of habits completed vs habits that existed on this date
    const totalHabits = habitsOnDate.length;
    const completedHabits = dayCompletions.length;
    
    return {
      date: dateStr,
      progress: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
    };
  });
};

export const getStreak = (
  habitId: string,
  completions: HabitCompletion[],
  goalPerWeek: number
): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all completed dates for this habit
  const completedDates = completions
    .filter(c => c.habitId === habitId && c.completed)
    .map(c => parseISO(c.date));

  if (completedDates.length === 0) return 0;

  // Group completions by week (Monday to Sunday)
  const weeksMap = new Map<string, number>();
  completedDates.forEach(date => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    weeksMap.set(weekKey, (weeksMap.get(weekKey) || 0) + 1);
  });

  // Get current week
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');

  // Check if current week or last week met the goal
  const currentWeekCompletions = weeksMap.get(currentWeekKey) || 0;
  const lastWeekStart = subDays(currentWeekStart, 7);
  const lastWeekKey = format(lastWeekStart, 'yyyy-MM-dd');
  const lastWeekCompletions = weeksMap.get(lastWeekKey) || 0;

  let streak = 0;
  let checkWeekStart = new Date(currentWeekStart);

  // If current week met goal, start from current week
  if (currentWeekCompletions >= goalPerWeek) {
    streak = 1;
  } else if (lastWeekCompletions >= goalPerWeek) {
    // If current week didn't meet goal but last week did, start from last week
    checkWeekStart = lastWeekStart;
    streak = 1;
  } else {
    return 0; // No recent completion
  }

  // Count consecutive weeks backwards
  for (let i = 1; i < 104; i++) { // Max 2 years (104 weeks)
    const checkWeek = subDays(checkWeekStart, i * 7);
    const weekKey = format(checkWeek, 'yyyy-MM-dd');
    const weekCompletions = weeksMap.get(weekKey) || 0;
    
    if (weekCompletions >= goalPerWeek) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getHabitStats = (
  habit: Habit,
  completions: HabitCompletion[],
  monthDate: Date = new Date()
) => {
  const monthCompletions = getCompletionsForMonth(completions, monthDate);
  const habitCompletions = monthCompletions.filter(
    c => c.habitId === habit.id && c.completed
  );
  
  const streak = getStreak(habit.id, completions, habit.goalPerWeek);
  const totalCompletions = habitCompletions.length;
  
  // Calculate completion rate for the month
  const monthStart = getMonthStart(monthDate);
  const monthEnd = getMonthEnd(monthDate);
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  );
  const totalGoal = weeks.length * habit.goalPerWeek;
  const completionRate = totalGoal > 0 ? (totalCompletions / totalGoal) * 100 : 0;

  // Get all completion dates
  const allCompletions = completions
    .filter(c => c.habitId === habit.id && c.completed)
    .map(c => parseISO(c.date))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    streak,
    totalCompletions,
    completionRate: Math.round(completionRate * 100) / 100,
    allCompletions,
    firstCompletion: allCompletions.length > 0 ? allCompletions[0] : null,
    lastCompletion: allCompletions.length > 0 ? allCompletions[allCompletions.length - 1] : null,
  };
};

