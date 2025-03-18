import "./index.css";
import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // get the user info
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => console.error("Error getting session:", error));


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe(); 
  }, []);

  // if there is a user logged in, go to main page
  useEffect(() => {
    if (session) {
      navigate("/"); 
    }
  }, [session, navigate]);

  return (
    <div className="flex items-center justify-center bg-green-200 min-h-screen">
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }}  providers={[]}/>
      ) : (
        <div>Logged in</div>
      )}
    </div>
  );
}
