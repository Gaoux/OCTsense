import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { loginUser, registerUser } from "../api/userService";
import { updateUser as updateUserService } from "../api/userService";

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
  updateUser: (updatedUser: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {
    // Esto solo se ejecuta si se usa fuera del AuthProvider
    throw new Error("login function not implemented");
  },
  register: async () => {
    throw new Error("register function not implemented");
  },
  logout: () => {
    throw new Error("logout function not implemented");
  },
  isAuthenticated: false,
  validateEmail: (email: string) => false,
  updateUser: async () => {
    throw new Error("updateUser function not implemented");
  },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user, token } = await loginUser(email, password);
    setUser(user);
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    return user;
  };

  const register = async (form: any): Promise<void> => {
    await registerUser(form);
  };

  const logout = (): void => {
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const updateUser = async (updatedUser: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error("No user is currently logged in");
    }

    const newUser = await updateUserService(updatedUser); // Llama al servicio para actualizar
    setUser(newUser); // Actualiza el estado del usuario
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 }); // Actualiza las cookies
    return newUser;
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
