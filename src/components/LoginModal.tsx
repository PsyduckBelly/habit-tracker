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
        
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full mb-4 px-4 py-3 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 transition text-sm font-medium flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {googleLoading ? (
            'Signing in...'
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

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

