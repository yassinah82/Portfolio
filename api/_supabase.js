import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer SUPABASE_SERVICE_ROLE_KEY in server-side functions to manage data with full privileges.
// Fallback to SUPABASE_ANON_KEY if service role key is not configured.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[Supabase] Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY is missing from environment variables."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

