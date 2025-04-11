import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { loginUser, registerUser } from '../api/userService';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  register: (form: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {
    // Esto solo se ejecuta si se usa fuera del AuthProvider
    throw new Error('login function not implemented');
  },
  register: async () => {
    throw new Error('register function not implemented');
  },
  logout: () => {
    throw new Error('logout function not implemented');
  },
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove('user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const { user, token } = await loginUser(username, password);
    setUser(user);
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return user;
  };

  const register = async (form: any): Promise<void> => {
    await registerUser(form);
  };

  const logout = (): void => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
