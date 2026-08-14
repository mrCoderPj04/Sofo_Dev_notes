import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dggcqbvdvgjdhtsqfkby.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WbrNkwir_npCMKkI2Qmmxw_9XhSrtiH";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
