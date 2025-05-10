import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from './utilities/supabaseClient';

interface UserContextProps {
  user: any; // You can define a proper user type instead of 'any' if you want
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); 
  
  useEffect(() => {
    const getUser = async () => {
      const {data, error } = await supabase.auth.getSession();
      if(data?.session?.user) {
        // rehydrate context
        setUser(data.session.user)
      } else {
        console.log(error);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
