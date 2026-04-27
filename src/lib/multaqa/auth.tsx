import { createContext, useContext, useState, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  login: (email: string) => void;
  loginAdmin: () => void;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string) => {
    const isAdmin = email.toLowerCase().includes("admin");
    setUser({
      name: isAdmin ? "Admin User" : "Khalid Mansour",
      email,
      role: isAdmin ? "admin" : "user",
    });
  };
  const loginAdmin = () => setUser({ name: "Admin User", email: "admin@multaqa.ps", role: "admin" });
  const logout = () => setUser(null);

  return <Ctx.Provider value={{ user, login, loginAdmin, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}