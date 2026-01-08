import { AppData } from '../types';
import { getMonthStart, getMonthEnd, formatDate } from '../utils/dateUtils';
import { eachDayOfInterval } from 'date-fns';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodChartProps {
  data: AppData;
  currentMonth: Date;
}

export default function MoodChart({ data, currentMonth }: MoodChartProps) {
  const monthStart = getMonthStart(currentMonth);
  const monthEnd = getMonthEnd(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const chartData = days.map(day => {
    const dateStr = formatDate(day);
    const moodEntry = data.moods.find(m => m.date === dateStr);
    return {
      date: day.getDate(),
      mood: moodEntry?.mood ?? 50, // Default to 50 if no entry
    };
  });

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood/Motivation</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6B7280" stopOpacity={0}/>
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
            formatter={(value: number) => [`${value}%`, 'Mood']}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#6B7280"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMood)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

