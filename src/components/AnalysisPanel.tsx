import { AppData } from '../types';
import { getCompletionsForMonth } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisPanelProps {
  data: AppData;
  currentMonth: Date;
}

export default function AnalysisPanel({ data, currentMonth }: AnalysisPanelProps) {
  const monthCompletions = getCompletionsForMonth(data.completions, currentMonth);
  
  const habitStats = data.habits.map(habit => {
    const completions = monthCompletions.filter(
      c => c.habitId === habit.id && c.completed
    );
    return {
      name: habit.name,
      count: completions.length,
      color: habit.color,
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Achievements</h3>
      {habitStats.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={habitStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#6B7280" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              width={100}
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {habitStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No data available
        </div>
      )}
    </div>
  );
}

