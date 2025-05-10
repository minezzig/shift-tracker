import { User } from "@supabase/supabase-js";
import { supabase } from "../utilities/supabaseClient";

export async function getWeek(startDate: string, endDate: string, user: User) {
  try {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .eq("user_id", user.id)
      .gte("shift_date", startDate)
      .lte("shift_date", endDate);
    if (error) throw error;
    data.sort((a,b) => a.shift_date < b.shift_date ? -1 : 1);
    return data;
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
}
