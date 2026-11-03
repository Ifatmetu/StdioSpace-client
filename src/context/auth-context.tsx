
"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    image?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  const user: User | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  // Login
  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  // Register
  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      ...(image ? { image } : {}),
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
