import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default async function getShifts() {
  let { data: shifts, error } = await supabase.from("shifts").select("*");

  return shifts;
}
