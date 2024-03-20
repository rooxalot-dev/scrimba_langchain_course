import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_API_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);

export {
  supabaseClient
};
