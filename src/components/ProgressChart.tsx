import { AppData } from '../types';
import { getHabitProgressData } from '../utils/calculations';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: AppData;
  currentMonth: Date;
}

export default function ProgressChart({ data, currentMonth }: ProgressChartProps) {
  const progressData = getHabitProgressData(data.habits, data.completions, currentMonth);

  const chartData = progressData.map(d => ({
    date: new Date(d.date).getDate(),
    progress: d.progress,
  }));

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              color: '#111827',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']}
          />
          <Area
            type="monotone"
            dataKey="progress"
            stroke="#111827"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProgress)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

