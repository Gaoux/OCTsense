import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { loginUser, registerUser } from '../api/userService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (form: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  validateEmail: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {
    throw new Error('login function not implemented');
  },
  register: async () => {
    throw new Error('register function not implemented');
  },
  logout: () => {
    throw new Error('logout function not implemented');
  },
  isAuthenticated: false,
  validateEmail: (email: string) => false,
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

    // Check if the session has expired
    const sessionExpired = window.localStorage.getItem('sessionExpired');
    if (sessionExpired) {
      logout(); // Call logout if session expired
      window.localStorage.removeItem('sessionExpired'); // Clear the session expired flag
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );
    setUser(user);
    Cookies.set('token', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    return user;
  };

  const register = async (form: any): Promise<void> => {
    await registerUser(form);
  };

  const logout = (): void => {
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
  };

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        validateEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
