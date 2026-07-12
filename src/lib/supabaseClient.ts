import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (
  supabaseUrl === "https://placeholder-project.supabase.co" ||
  supabaseAnonKey === "placeholder-key"
) {
  console.warn(
    "PCCycle: Supabase environment variables are missing! " +
    "Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local " +
    "or GitHub Secrets. Currently falling back to local storage mock simulation."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper helper to detect if credentials are set
export const isSupabaseConfigured = (): boolean => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );
};
