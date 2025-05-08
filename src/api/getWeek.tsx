import { supabase } from "../utilities/supabaseClient";

export async function getWeek(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from("test")
      .select("*")
      .gte("shift_date", startDate)
      .lte("shift_date", endDate);
    if (error) throw error;
    data.sort((a,b) => a.shift_date < b.shift_date ? -1 : 1);
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
}
