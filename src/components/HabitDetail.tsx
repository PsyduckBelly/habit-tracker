import { AppData, Habit } from '../types';
import { getHabitStats } from '../utils/calculations';
import { format, parseISO, startOfWeek } from 'date-fns';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HabitDetailProps {
  habit: Habit;
  data: AppData;
  onClose: () => void;
}

export default function HabitDetail({ habit, data, onClose }: HabitDetailProps) {
  const stats = getHabitStats(habit, data.completions);
  
  // Prepare chart data for completion history
  const chartData = stats.allCompletions.map((date, index) => ({
    date: format(date, 'MMM dd'),
    day: index + 1,
    completed: 1,
  }));

  // Calculate weekly completion data
  const weeklyData: { week: string; completions: number; goal: number }[] = [];
  const weeksMap = new Map<string, number>();
  
  stats.allCompletions.forEach(date => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    weeksMap.set(weekKey, (weeksMap.get(weekKey) || 0) + 1);
  });

  let weekIndex = 1;
  weeksMap.forEach((completions) => {
    weeklyData.push({
      week: `Week ${weekIndex++}`,
      completions,
      goal: habit.goalPerWeek,
    });
  });

  weeklyData.sort((a, b) => {
    // Sort by week number
    const aNum = parseInt(a.week.split(' ')[1]);
    const bNum = parseInt(b.week.split(' ')[1]);
    return aNum - bNum;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: habit.color }}
            />
            <h2 className="text-2xl font-semibold text-gray-900">{habit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-500 text-sm mb-1">Current Streak</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.streak}</div>
              <div className="text-gray-400 text-xs mt-1">weeks</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-500 text-sm mb-1">Total Completions</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.totalCompletions}</div>
              <div className="text-gray-400 text-xs mt-1">this month</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-500 text-sm mb-1">Completion Rate</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.completionRate.toFixed(1)}%</div>
              <div className="text-gray-400 text-xs mt-1">this month</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-500 text-sm mb-1">Goal</div>
              <div className="text-3xl font-semibold text-gray-900">{habit.goalPerWeek}</div>
              <div className="text-gray-400 text-xs mt-1">per week</div>
            </div>
          </div>

          {/* Completion History Chart */}
          {chartData.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion History</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[0, 1]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      color: '#111827',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#111827"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompletion)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weekly Performance */}
          {weeklyData.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
              <div className="space-y-2">
                {weeklyData.slice(-8).map((week, index) => {
                  const percentage = (week.completions / week.goal) * 100;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-600">{week.week}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                        <div
                          className={`h-6 rounded-full ${
                            percentage >= 100 ? 'bg-gray-900' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-700 font-medium">
                          {week.completions}/{week.goal}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {format(parseISO(habit.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              {stats.firstCompletion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">First Completion:</span>
                  <span className="text-gray-900">
                    {format(stats.firstCompletion, 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              {stats.lastCompletion && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Completion:</span>
                  <span className="text-gray-900">
                    {format(stats.lastCompletion, 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Total Days Tracked:</span>
                <span className="text-gray-900">{stats.allCompletions.length} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

