import { User } from "@supabase/supabase-js";
import { supabase } from "../utilities/supabaseClient";


export default async function getShifts(user: User) {
  let { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
  return data;
}
