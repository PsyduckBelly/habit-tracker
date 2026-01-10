import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These will be set via environment variables
// For now, using placeholder values - user needs to set up Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if not configured to prevent errors
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a dummy client that won't crash but won't work
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

