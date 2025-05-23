import { supabase } from "../utilities/supabaseClient";

interface NewShiftType {
  shift_date: String;
  enter: String;
  exit: String;
  regular_hours: Number;
  night_hours: Number;
  overnight_hours: Number;
  total_hours: Number;
  user_id: String
}

export default async function addShift(newShift: NewShiftType) {
  try {
    const { data, error } = await supabase
      .from("shifts")
      .insert(newShift)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("addShift error:", error);
    return { data: null, error };
  }
}
