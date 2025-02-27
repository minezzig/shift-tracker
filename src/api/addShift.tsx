import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface NewShiftType {
  shift_date: String;
  enter: String;
  exit: String;
  regular_hours: Number;
  night_hours: Number;
  total_hours: Number;
}

export default async function addShift( newShift : NewShiftType) {
  const { data, error } = await supabase
    .from("shifts")
    .insert(newShift)
    .select();

  return { data, error };
}
