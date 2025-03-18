import { useNavigate } from "react-router";
import { supabase } from "./utilities/supabaseClient";

export default function Profile() {
  const navigate = useNavigate();

  // sign out and be directed to home...sent to login
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Signed out successfully");
      navigate("/")
    }
  }
  return (
    <div>
      <div>Profile</div>
      <button
        onClick={signOut}
        className="p-3 border bg-yellow-400 rounded-lg text-xl cursor-pointer hover:bg-yellow-600"
      >
        Sign out
      </button>
    </div>
  );
}
