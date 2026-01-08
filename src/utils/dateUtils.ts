import { format, startOfMonth, endOfMonth, eachWeekOfInterval, eachDayOfInterval, getDay, isSameDay, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const getMonthStart = (date: Date = new Date()): Date => {
  return startOfMonth(date);
};

export const getMonthEnd = (date: Date = new Date()): Date => {
  return endOfMonth(date);
};

export const getWeeksInMonth = (date: Date = new Date()): Date[][] => {
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 } // Monday
  );

  return weeks.map(weekStart => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  });
};

export const getDayLabel = (date: Date): string => {
  const day = getDay(date);
  // Convert to Monday=1, Tuesday=2, etc.
  const adjustedDay = day === 0 ? 7 : day;
  return `T${adjustedDay}`;
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

