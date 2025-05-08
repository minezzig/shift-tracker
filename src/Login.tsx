import "./index.css";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { supabase } from "./utilities/supabaseClient";
import { useUser } from "./UserContext";

export default function Login() {
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const navigate = useNavigate();

  // get the setUser function
  const { setUser } = useUser();

  // get the user session
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
      // if we have a session, set the userData
      if (session) {
        setUser(session.user);
      }
    });

    return () => subscription?.unsubscribe();
  }, [setUser]);

  // if there is a user logged in, go to main page
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session]);

  // on input change, make copy of object with new info
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // control what happens when user submits form to login - send email and password to supabase
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setError(error.message);
    } else {
      console.log("Logged in!", data);
      // update userData on login
      setUser(data.user);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-green-200 min-h-screen">
      {!session && (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <a href="/signup">Sign up</a>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}
