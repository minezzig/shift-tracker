import { supabase } from "../utilities/supabaseClient";

export default async function getShifts() {
  let { data, error } = await supabase.from("test").select("*");

  if (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
  return data;
}
