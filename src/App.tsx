
import { useNavigate } from "react-router";
import CreateShfit from "./CreateShfit";
import { weekDays, months } from "./utilities/days-months";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const navigate = useNavigate();

  useEffect(() => {
   // check if user logged in - if not, redirect to login page
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, []);
  
  // date variables
  const today = new Date();
  const day = today.getDay();
  const date = today.getDate();
  const month = today.getMonth();

  return (
    <div className="flex h-full items-center flex-col">
      <div className="text-2xl">
        {weekDays[day]}, {date} de {months[month]}
      </div>
      <CreateShfit />
    </div>
  );
}

export default App;
