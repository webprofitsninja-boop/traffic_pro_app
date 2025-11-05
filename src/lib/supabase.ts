import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bzgjelifmzgcvkcdpywa.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Z2plbGlmbXpnY3ZrY2RweXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDUxNTgsImV4cCI6MjA0NjQyMTE1OH0.Lh9EcM5wZYg9cLTI_2P_N2uLqBh3-wJXpP-VWGPyFWs';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };