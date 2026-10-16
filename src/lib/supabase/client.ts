import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for public catalog reads.
 * Uses the publishable key only. Do not query private tables from here.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy .env.local.example to .env.local and add your project values.",
    );
  }

  return createClient(url, publishableKey);
}
