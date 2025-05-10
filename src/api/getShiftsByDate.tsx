import { User } from "@supabase/supabase-js";
import { supabase } from "../utilities/supabaseClient";

export async function getShiftsByDate(date: string, user: User) {
  try {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .eq("shift_date", date)
      .eq("user_id", user.id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
}
