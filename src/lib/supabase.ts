import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://bzgjelifmzgcvkcdpywa.supabase.co';
const supabaseKey = 'sb_publishable_wVTFGlxmsMSZ3MPoOMiKTg_gK_oQgzc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };