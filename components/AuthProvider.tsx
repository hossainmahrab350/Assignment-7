"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { name: string; email: string } | null;
type Auth = { user: User; ready: boolean; signIn: (email: string, password: string) => string | null; signInWithGoogle: () => void; signUp: (name: string, email: string, password: string) => string | null; signOut: () => void };
const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("bazardor-session"); if (saved) setUser(JSON.parse(saved)); setReady(true); }, []);
  const save = (value: User) => { setUser(value); value ? localStorage.setItem("bazardor-session", JSON.stringify(value)) : localStorage.removeItem("bazardor-session"); };
  const signUp = (name: string, email: string, password: string) => {
    if (!name || !email || password.length < 6) return "নাম, সঠিক ইমেইল ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।";
    const accounts = JSON.parse(localStorage.getItem("bazardor-users") || "[]");
    if (accounts.some((a: { email: string }) => a.email === email)) return "এই ইমেইল দিয়ে ইতোমধ্যে নিবন্ধন করা হয়েছে।";
    localStorage.setItem("bazardor-users", JSON.stringify([...accounts, { name, email, password }])); return null;
  };
  const signIn = (email: string, password: string) => {
    const accounts = JSON.parse(localStorage.getItem("bazardor-users") || "[]");
    const account = accounts.find((a: { email: string; password: string }) => a.email === email && a.password === password);
    if (!account) return "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
    save({ name: account.name, email: account.email }); return null;
  };
  const signInWithGoogle = () => save({ name: "Google ব্যবহারকারী", email: "google-user@bazardor.app" });
  return <AuthContext.Provider value={{ user, ready, signIn, signInWithGoogle, signUp, signOut: () => save(null) }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("AuthProvider missing"); return context; }
