import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLocalMode, setIsLocalMode] = useState(!isSupabaseConfigured());

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!isSupabaseConfigured()) {
      setMessage('Supabase is not configured. Please set up Supabase to use cloud sync. See SUPABASE_SETUP.md for instructions.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin + '/habit-tracker/',
          shouldCreateUser: true, // Auto-create user if doesn't exist
        },
      });

      if (error) throw error;

      setMessage('Check your email for the magic link! Click the link to sign in.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };


  const handleLocalMode = () => {
    setIsLocalMode(true);
    // Remember user's choice to use local storage
    localStorage.setItem('preferLocalStorage', 'true');
    onClose(); // Close the modal
    onLoginSuccess();
  };

  if (isLocalMode || !isSupabaseConfigured()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mt-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Habit Tracker</h2>
          <p className="text-gray-600 mb-6">
            {isSupabaseConfigured() 
              ? 'Choose how you want to use the app:'
              : 'Supabase is not configured. Using local storage mode.'}
          </p>
          
          {isSupabaseConfigured() && (
            <div className="mb-6">
              <button
                onClick={() => setIsLocalMode(false)}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded transition text-sm font-medium mb-3"
              >
                Sign in with Email (Cloud Sync)
              </button>
              <button
                onClick={handleLocalMode}
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
              >
                Continue with Local Storage
              </button>
            </div>
          )}

          {!isSupabaseConfigured() && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-4">
                To enable cloud sync and sharing, configure Supabase in your environment variables.
              </p>
              <button
                onClick={handleLocalMode}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm font-medium mb-3"
              >
                Continue with Local Storage
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm"
              >
                Close
              </button>
            </div>
          )}

          {isSupabaseConfigured() && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mt-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-6">
          Sign in to sync your habits across devices and share with others.
        </p>

        <form onSubmit={handleMagicLink}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="name@example.com"
              required
              autoFocus
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.includes('Check your email') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Sending magic link...' : 'Continue'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLocalMode}
            className="text-sm text-gray-500 hover:text-gray-700 transition w-full text-center"
          >
            Continue without signing in
          </button>
        </div>
      </div>
    </div>
  );
}

