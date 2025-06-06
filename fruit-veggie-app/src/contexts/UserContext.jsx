import { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await getUserProfile();
        if (userData && userData._id) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        // If error, user is not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
// a custom hook so that anywhere in the app, simply write: const { user, setUser, loading } = useUser();
// Instead of needing to use useContext(UserContext) manually every time.