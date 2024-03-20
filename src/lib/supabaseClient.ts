import { config } from 'dotenv';
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

config();

const supabaseUrl = process.env.SUPABASE_API_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);

export {
  supabaseClient
};
