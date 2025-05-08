import { User } from "@supabase/supabase-js";
import { supabase } from "../utilities/supabaseClient";

export default async function getShiftById(id: string, user: User) {
  let { data: shift, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching shift:", error);
    return null;
  }
  return shift;
}
