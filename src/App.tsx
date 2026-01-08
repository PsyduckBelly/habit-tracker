import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppData, Habit } from './types';
import { loadData, addHabit, deleteHabit, updateHabit, exportData, importData } from './utils/storage';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';
import SummaryStats from './components/SummaryStats';
import HabitGrid from './components/HabitGrid';
import ProgressChart from './components/ProgressChart';
import MoodChart from './components/MoodChart';
import AnalysisPanel from './components/AnalysisPanel';
import { getStreak } from './utils/calculations';


function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [viewingHabit, setViewingHabit] = useState<Habit | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = () => {
    setData(loadData());
  };

  const handleAddHabit = (habit: Habit) => {
    addHabit(habit);
    refreshData();
  };

  const handleUpdateHabit = (habit: Habit) => {
    updateHabit(habit);
    refreshData();
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
      refreshData();
    }
  };

  const changeMonth = (delta: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const handleExportData = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          refreshData();
          alert('Data imported successfully!');
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewHabit = (habit: Habit) => {
    setViewingHabit(habit);
  };


  const monthName = currentMonth.toLocaleString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-gray-900">
                Habit Tracker
              </h1>
              <p className="text-gray-500 text-lg">Track your habits and build consistency</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/showcase"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
              >
                Showcase
              </Link>
              <button
                onClick={handleExportData}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
                title="Export data"
              >
                Export
              </button>
              <button
                onClick={handleImportData}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
                title="Import data"
              >
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition text-sm font-medium"
            >
              ← Previous
            </button>
            <h2 className="text-xl font-semibold text-gray-900 px-4">{monthName}</h2>
            <button
              onClick={() => changeMonth(1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition text-sm font-medium"
            >
              Next →
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition text-sm font-medium ml-2"
            >
              Today
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded transition text-sm font-medium"
          >
            + Add Habit
          </button>
        </div>

        {/* Summary Stats */}
        <SummaryStats data={data} currentMonth={currentMonth} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Habit Grid */}
          <div className="lg:col-span-2">
            <HabitGrid data={data} currentMonth={currentMonth} onUpdate={refreshData} />
            
            {/* Charts */}
            <ProgressChart data={data} currentMonth={currentMonth} />
            <MoodChart data={data} currentMonth={currentMonth} />
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-1">
            <AnalysisPanel data={data} currentMonth={currentMonth} />
          </div>
        </div>

        {/* Habit List with Delete */}
        {data.habits.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Habits</h3>
            <div className="flex flex-wrap gap-2">
              {data.habits.map((habit) => {
                const streak = getStreak(habit.id, data.completions, habit.goalPerWeek);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded hover:border-gray-300 transition"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <button
                      onClick={() => handleViewHabit(habit)}
                      className="text-gray-700 text-sm hover:text-gray-900 font-medium"
                    >
                      {habit.name}
                    </button>
                    {streak > 0 && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-medium border border-gray-200">
                        🔥 {streak}w
                      </span>
                    )}
                    <span className="text-gray-400 text-xs">
                      ({habit.goalPerWeek === 7 ? 'daily' : `${habit.goalPerWeek}/week`})
                    </span>
                    <button
                      onClick={() => handleEditHabit(habit)}
                      className="ml-1 text-gray-400 hover:text-gray-600 transition text-sm"
                      title="Edit habit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="ml-1 text-gray-400 hover:text-red-500 transition text-lg leading-none"
                      title="Delete habit"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Habit Form Modal */}
      {showForm && (
        <HabitForm 
          habit={editingHabit}
          onAdd={handleAddHabit} 
          onUpdate={handleUpdateHabit}
          onClose={handleCloseForm} 
        />
      )}

      {/* Habit Detail Modal */}
      {viewingHabit && (
        <HabitDetail 
          habit={viewingHabit}
          data={data}
          onClose={() => setViewingHabit(undefined)} 
        />
      )}
    </div>
  );
}

export default App;

