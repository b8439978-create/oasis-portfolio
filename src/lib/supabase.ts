import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValid = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10;

export const supabase = isValid
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : (null as any);
