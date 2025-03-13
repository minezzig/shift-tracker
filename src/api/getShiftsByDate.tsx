import { supabase } from "../utilities/supabaseClient";
export async function getShiftsByDate(date: string) {
  try {
    const { data, error } = await supabase
      .from("shifts") 
      .select("*")
      .eq("shift_date", date); 

    if (error) throw error;

    return data; 
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
}