import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

export interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('users');
      const parsed = stored ? JSON.parse(stored) : {};
      return parsed.loggedUser || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('users');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('users', JSON.stringify({ ...parsed, loggedUser: user }));
    } catch {
      localStorage.setItem('users', JSON.stringify({ loggedUser: user }));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, setUser }}>
        <AppRoutes />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;