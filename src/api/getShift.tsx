import { supabase } from "../utilities/supabaseClient";

export default async function getShiftById(id: number) {
  let { data: shift, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching shift:", error);
    return null;
  }
  return shift;
}
