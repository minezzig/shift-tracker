import { useNavigate } from "react-router";
import { supabase } from "./utilities/supabaseClient";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  email: string;
  name: string;
}
export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  //get user on load
  useEffect(() => {
    async function getUserData(){
      const { data, error } = await supabase.auth.getUser();
    
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUser({
        id: data.user.id,
        name: data.user.user_metadata.display_name,
        email: data.user.user_metadata.email
      })
    }
    getUserData();
  }, [])
  
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
      <div>{user?.name}</div>
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
