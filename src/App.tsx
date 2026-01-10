import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppData, Habit } from './types';
import { loadData, addHabit, deleteHabit, updateHabit, exportData, importData, saveData } from './utils/storage';
import { supabase, isSupabaseConfigured } from './utils/supabase';
import { loadWorkspaceData, saveWorkspaceData, subscribeToWorkspaceData } from './utils/cloudStorage';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';
import LoginModal from './components/LoginModal';
import WorkspaceManager from './components/WorkspaceManager';
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
  
  // Cloud sync state
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showWorkspaceManager, setShowWorkspaceManager] = useState(false);
  const [isCloudMode, setIsCloudMode] = useState(false);

  const loadCloudData = async (workspaceId: string) => {
    const cloudData = await loadWorkspaceData(workspaceId);
    if (cloudData) {
      setData(cloudData);
      saveData(cloudData); // Backup to localStorage
    }
  };

  useEffect(() => {
    // Check if user is logged in
    if (isSupabaseConfigured()) {
      try {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.email) {
            setUserEmail(session.user.email);
            setIsCloudMode(true);
            // Load workspace from localStorage
            const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
            if (savedWorkspaceId) {
              setCurrentWorkspaceId(savedWorkspaceId);
              loadCloudData(savedWorkspaceId);
            } else {
              setShowWorkspaceManager(true);
            }
          } else {
            // Check for auth callback
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            if (hashParams.get('access_token')) {
              // User just logged in via magic link
              supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user?.email) {
                  setUserEmail(session.user.email);
                  setIsCloudMode(true);
                  setShowWorkspaceManager(true);
                  // Clean up URL
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
              });
            }
          }
        }).catch((error) => {
          console.error('Error checking session:', error);
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user?.email) {
            setUserEmail(session.user.email);
            setIsCloudMode(true);
          } else {
            setUserEmail(null);
            setIsCloudMode(false);
            setCurrentWorkspaceId(null);
            localStorage.removeItem('currentWorkspaceId');
          }
        });
      } catch (error) {
        console.error('Supabase initialization error:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Subscribe to workspace changes in cloud mode
    if (isCloudMode && currentWorkspaceId) {
      const subscription = subscribeToWorkspaceData(currentWorkspaceId, (newData) => {
        setData(newData);
        // Also save to localStorage as backup
        saveData(newData);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentWorkspaceId, isCloudMode]);

  const refreshData = () => {
    if (isCloudMode && currentWorkspaceId) {
      loadCloudData(currentWorkspaceId);
    } else {
      setData(loadData());
    }
  };

  const syncDataToCloud = async (newData: AppData) => {
    if (isCloudMode && currentWorkspaceId) {
      await saveWorkspaceData(currentWorkspaceId, newData);
    }
    // Always save to localStorage as backup
    saveData(newData);
  };

  const handleAddHabit = (habit: Habit) => {
    addHabit(habit);
    const newData = loadData();
    setData(newData);
    syncDataToCloud(newData);
  };

  const handleUpdateHabit = (habit: Habit) => {
    updateHabit(habit);
    const newData = loadData();
    setData(newData);
    syncDataToCloud(newData);
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
      const newData = loadData();
      setData(newData);
      syncDataToCloud(newData);
    }
  };

  const handleToggleCompletion = () => {
    // This will be called from HabitGrid after toggle
    const newData = loadData();
    setData(newData);
    syncDataToCloud(newData);
  };

  const handleWorkspaceChange = async (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    localStorage.setItem('currentWorkspaceId', workspaceId);
    await loadCloudData(workspaceId);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUserEmail(null);
    setIsCloudMode(false);
    setCurrentWorkspaceId(null);
    localStorage.removeItem('currentWorkspaceId');
    setData(loadData()); // Load local data
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
            <div className="flex gap-2 flex-wrap">
              <Link
                to="/showcase"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
              >
                Showcase
              </Link>
              {isSupabaseConfigured() ? (
                <>
                  {userEmail ? (
                    <>
                      <button
                        onClick={() => setShowWorkspaceManager(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
                        title="Manage workspaces"
                      >
                        {currentWorkspaceId ? 'Workspace' : 'Select Workspace'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
                        title="Sign out"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm font-medium"
                    >
                      Sign In
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm font-medium"
                  title="Cloud sync requires Supabase configuration"
                >
                  Sign In
                </button>
              )}
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
            <HabitGrid data={data} currentMonth={currentMonth} onUpdate={handleToggleCompletion} />
            
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

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            // Only show workspace manager if Supabase is configured and user is logged in
            if (isSupabaseConfigured() && userEmail) {
              setShowWorkspaceManager(true);
            }
          }}
        />
      )}

      {/* Workspace Manager Modal */}
      {showWorkspaceManager && userEmail && (
        <WorkspaceManager
          userEmail={userEmail}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          onClose={() => setShowWorkspaceManager(false)}
        />
      )}
    </div>
  );
}

export default App;

