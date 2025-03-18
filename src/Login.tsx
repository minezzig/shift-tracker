import "./index.css";
import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get current session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => console.error("Error getting session:", error));

    // Subscribe to session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <div className="flex items-center justify-center bg-green-200 min-h-screen">
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      ) : (
        <div>
          <div>Logged in!</div>
          <div><a href="/">Home</a></div>
        </div>
      )}
    </div>
  );
}
