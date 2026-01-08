import { AppData } from '../types';
import { getTotalCompletions, getProgressPercentage, getCompletionsForMonth } from '../utils/calculations';

interface SummaryStatsProps {
  data: AppData;
  currentMonth: Date;
}

export default function SummaryStats({ data, currentMonth }: SummaryStatsProps) {
  const monthCompletions = getCompletionsForMonth(data.completions, currentMonth);
  const completedCount = getTotalCompletions(monthCompletions);
  const progress = getProgressPercentage(data.habits, data.completions, currentMonth);

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-gray-500 text-sm mb-1">Number of Habits</div>
          <div className="text-3xl font-semibold text-gray-900">{data.habits.length}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm mb-1">Completed Habits</div>
          <div className="text-3xl font-semibold text-gray-900">{completedCount}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm mb-1">Progress</div>
          <div className="text-3xl font-semibold text-gray-900">{progress.toFixed(1)}%</div>
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gray-400 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

