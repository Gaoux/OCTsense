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
  login: (username: string, password: string) => Promise<void>;
  register: (form: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
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

  const login = async (username: string, password: string) => {
    const { user, token } = await loginUser(username, password);

    setUser(user);

    // Set cookies with token and user (secure and HTTP-only can be set server-side)
    Cookies.set('token', token, { expires: 7 }); // For security, this should be HttpOnly and set by server
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  };

  const register = async (form: any) => {
    await registerUser(form);
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
