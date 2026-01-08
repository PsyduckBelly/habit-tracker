import { AppData } from '../types';
import { getWeeksInMonth, formatDate, getDayLabel, isToday } from '../utils/dateUtils';
import { toggleCompletion } from '../utils/storage';
import { getStreak } from '../utils/calculations';
import { isAfter } from 'date-fns';

interface HabitGridProps {
  data: AppData;
  currentMonth: Date;
  onUpdate: () => void;
}

export default function HabitGrid({ data, currentMonth, onUpdate }: HabitGridProps) {
  const weeks = getWeeksInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long' });

  const isCompleted = (habitId: string, date: Date): boolean => {
    const dateStr = formatDate(date);
    const completion = data.completions.find(
      c => c.habitId === habitId && c.date === dateStr
    );
    return completion?.completed ?? false;
  };

  const handleToggle = (habitId: string, date: Date) => {
    toggleCompletion(habitId, formatDate(date));
    onUpdate();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{monthName}</h2>
      
      <div className="min-w-full">
        {/* Header */}
        <div className="flex mb-4">
          <div className="w-48 flex-shrink-0 font-medium text-gray-700">My Habits</div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex-1 min-w-[200px]">
              <div className="text-center text-sm text-gray-600 mb-2 font-medium">Week {weekIndex + 1}</div>
              <div className="flex justify-between text-xs text-gray-500">
                {week.map((day) => (
                  <div key={day.getTime()} className="text-center w-7">
                    {getDayLabel(day)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Habits */}
        {data.habits.map((habit) => {
          const streak = getStreak(habit.id, data.completions, habit.goalPerWeek);
          return (
            <div key={habit.id} className="flex items-center mb-3">
              <div className="w-48 flex-shrink-0 flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="text-gray-700 text-sm">{habit.name}</span>
                {streak > 0 && (
                  <span className="text-xs px-1 py-0.5 bg-gray-100 text-gray-700 rounded font-medium border border-gray-200">
                    🔥 {streak}w
                  </span>
                )}
                <span className="text-gray-400 text-xs">
                  ({habit.goalPerWeek === 7 ? 'daily' : `${habit.goalPerWeek}/week`})
                </span>
              </div>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex-1 min-w-[200px] flex justify-between">
                {week.map((day) => {
                  const completed = isCompleted(habit.id, day);
                  const today = isToday(day);
                  const isFuture = isAfter(day, new Date());
                  const habitCreatedDate = new Date(habit.createdAt);
                  habitCreatedDate.setHours(0, 0, 0, 0);
                  const dayDate = new Date(day);
                  dayDate.setHours(0, 0, 0, 0);
                  const isBeforeCreation = dayDate < habitCreatedDate;
                  const isDisabled = isFuture || isBeforeCreation;
                  
                  return (
                    <button
                      key={day.getTime()}
                      onClick={() => !isDisabled && handleToggle(habit.id, day)}
                      disabled={isDisabled}
                      className={`w-7 h-7 rounded transition-all ${
                        completed
                          ? 'bg-gray-200 border-2 border-gray-300'
                          : isDisabled
                          ? 'bg-gray-50 border-2 border-gray-100 cursor-not-allowed opacity-50'
                          : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${today ? 'ring-2 ring-gray-300 ring-opacity-50' : ''}`}
                      title={isDisabled ? (isFuture ? 'Future dates cannot be marked' : 'Date before habit creation') : formatDate(day)}
                    >
                      {completed && (
                        <svg
                          className="w-4 h-4 m-auto text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          );
        })}

        {data.habits.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No habits yet. Click the button in the top right to add your first habit!
          </div>
        )}
      </div>
    </div>
  );
}

