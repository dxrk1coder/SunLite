
import { createClient } from '@supabase/supabase-js';

/**
 * SUNLITE.GG Supabase Konfiguratsiyasi
 * Real loyiha ma'lumotlari: oylhpwsgifvbpgvitnqq
 */
const SUPABASE_URL: string = 'https://oylhpwsgifvbpgvitnqq.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGhwd3NnaWZ2YnBndml0bnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzYzODYsImV4cCI6MjA4MjI1MjM4Nn0.k7oRoJo08MTgiRm_ItvWkwt6ARjHYgXQ6HQl-duQTpw';

export const isSupabaseConfigured = 
  SUPABASE_URL.includes('supabase.co') && 
  SUPABASE_ANON_KEY.length > 20;

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder';

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : fallbackUrl,
  isSupabaseConfigured ? SUPABASE_ANON_KEY : fallbackKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);
