import { Link } from 'react-router-dom';
import { Habit } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Demo data for showcase
const demoHabits: Habit[] = [
  {
    id: '1',
    name: '10k Steps',
    color: '#EAD4D6',
    goalPerWeek: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Call a Friend',
    color: '#D3E5EF',
    goalPerWeek: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Practice Gratitude',
    color: '#E8F4E8',
    goalPerWeek: 7,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export default function Showcase() {

  const features = [
    {
      title: 'Visual Habit Tracking',
      description: 'Track your habits with an intuitive calendar grid view',
      icon: '📅',
    },
    {
      title: 'Weekly Goals',
      description: 'Set flexible goals - daily or X times per week',
      icon: '🎯',
    },
    {
      title: 'Progress Analytics',
      description: 'Visualize your progress with charts and statistics',
      icon: '📊',
    },
    {
      title: 'Streak Tracking',
      description: 'Build consistency with weekly streak tracking',
      icon: '🔥',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-20 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-semibold mb-6 text-gray-900">
              Habit Tracker
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build a Better Routine with Visual Habit Tracking
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              Make consistency easy and watch your results. Track your habits, build streaks, and achieve your goals.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-lg font-medium"
              >
                View on GitHub
              </a>
              <Link
                to="/"
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition text-lg font-medium"
              >
                Try Demo
              </Link>
            </div>
          </div>

          {/* Main Preview */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 text-sm text-gray-500">habit-tracker.app</div>
            </div>
            <div className="p-8">
              {/* Mock Interface */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">January 2026</h2>
                  <p className="text-gray-500">Track your habits and build consistency</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded transition text-sm font-medium">
                  + Add Habit
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-gray-500 text-sm mb-1">Habits</div>
                  <div className="text-3xl font-semibold text-gray-900">3</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-gray-500 text-sm mb-1">Completed</div>
                  <div className="text-3xl font-semibold text-gray-900">7</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-gray-500 text-sm mb-1">Progress</div>
                  <div className="text-3xl font-semibold text-gray-900">85%</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              {/* Habit Grid Preview */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EAD4D6' }}></div>
                  <span className="text-sm font-medium text-gray-700">10k Steps</span>
                  <span className="text-xs px-1 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                    🔥 2w
                  </span>
                  <span className="text-xs text-gray-400">(5/week)</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const isCompleted = i === 0 || i === 1 || i === 2;
                    return (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded border-2 ${
                          isCompleted
                            ? 'bg-gray-200 border-gray-300'
                            : 'bg-white border-gray-200'
                        } flex items-center justify-center`}
                      >
                        {isCompleted && (
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <h2 className="text-4xl font-semibold text-center mb-12 text-gray-900">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 py-20 max-w-7xl">
          <h2 className="text-4xl font-semibold text-center mb-12 text-gray-900">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Habit Grid View</h3>
                <div className="space-y-3">
                  {demoHabits.map((habit) => (
                    <div key={habit.id} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: habit.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{habit.name}</span>
                      <span className="text-xs text-gray-400">
                        ({habit.goalPerWeek === 7 ? 'daily' : `${habit.goalPerWeek}/week`})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Progress Analytics</h3>
                <div className="h-32 bg-gray-100 rounded flex items-end justify-around gap-2">
                  {[60, 80, 70, 90, 85, 75, 95].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gray-400 rounded-t"
                      style={{ width: '20px', height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Histogram Demonstration */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Goal Achievements - Histogram</h3>
              <p className="text-sm text-gray-500 mb-6">
                Visualize your habit completion rates with interactive horizontal bar charts
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '10k Steps', count: 12, color: '#EAD4D6' },
                      { name: 'Call a Friend', count: 8, color: '#D3E5EF' },
                      { name: 'Practice Gratitude', count: 20, color: '#E8F4E8' },
                      { name: 'Go Outside', count: 15, color: '#CCE5D4' },
                      { name: 'Read for 20min', count: 18, color: '#F0E6F2' },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      type="number" 
                      stroke="#6B7280" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      domain={[0, 25]}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#6B7280" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        color: '#111827',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number) => [`${value} completions`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {[
                        { name: '10k Steps', count: 12, color: '#EAD4D6' },
                        { name: 'Call a Friend', count: 8, color: '#D3E5EF' },
                        { name: 'Practice Gratitude', count: 20, color: '#E8F4E8' },
                        { name: 'Go Outside', count: 15, color: '#CCE5D4' },
                        { name: 'Read for 20min', count: 18, color: '#F0E6F2' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Each bar represents the total completions for a habit this month. Colors match your habit colors for easy identification.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <h2 className="text-4xl font-semibold text-center mb-12 text-gray-900">Built With</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'date-fns'].map((tech) => (
            <div
              key={tech}
              className="px-6 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
          <h2 className="text-4xl font-semibold mb-4">Ready to Build Better Habits?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start tracking your habits today and see the difference consistency makes.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition text-lg font-medium"
            >
              View Source Code
            </a>
            <Link
              to="/"
              className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition text-lg font-medium"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

