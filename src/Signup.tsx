import { useState } from "react";
import { supabase } from "./utilities/supabaseClient";

export default function Signup() {
  const [formData, setFormData] = useState({name: "", email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [confirm, setConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { display_name: formData.name },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setConfirm(true);
      console.log("Signup successful!", data);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-green-200 min-h-screen">
      {!confirm ? (
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <a href="/login">Login</a>
        </form>
      ) : (
        <div>Verify email to continue</div>
      )}
    </div>
  );
}
