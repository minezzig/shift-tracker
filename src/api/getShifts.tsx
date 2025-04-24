import { supabase } from "../utilities/supabaseClient";

export default async function getShifts() {
  let { data: shifts, error } = await supabase.from("test").select("*");

  if (error) {
    console.error("Error fetching shfits:", error);
    return [];
  }
  return shifts || [];
}
