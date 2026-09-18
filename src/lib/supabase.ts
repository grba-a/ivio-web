import { createClient } from '@supabase/supabase-js';

/**
 * Anon/publishable key only - safe to ship to the browser. RLS on the
 * `reviews` table is the real boundary: public insert + select, no
 * update/delete. Bad reviews get removed by hand in the Supabase table
 * editor, not through this client.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Review = {
  id: number;
  name: string;
  stars: number;
  body: string;
  created_at: string;
};
