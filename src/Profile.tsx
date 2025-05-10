import { useNavigate } from "react-router";
import { supabase } from "./utilities/supabaseClient";
import { useUser } from "./UserContext";

export default function Profile() {
  const { user } = useUser();
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
      <div>{user?.user_metadata.display_name}</div>
      <div>{user?.email}</div>
      <button
        onClick={signOut}
        className="p-3 border bg-yellow-400 rounded-lg text-xl cursor-pointer hover:bg-yellow-600"
      >
        Sign out
      </button>
    </div>
  );
}
