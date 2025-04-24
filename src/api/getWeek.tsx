import { supabase } from "../utilities/supabaseClient";

export async function getWeek(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from("test")
      .select("*")
      .gte("shift_date", startDate)
      .lte("shift_date", endDate);
    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
}
