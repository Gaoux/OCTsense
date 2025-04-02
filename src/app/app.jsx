import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

export const AuthContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      // error en localStorage
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
