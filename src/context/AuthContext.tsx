import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";

interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  signUp: (input: SignUpInput) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

interface StoredUser extends User {
  password: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "finpulse-users";
const SESSION_KEY = "finpulse-session";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error(
      "We couldn't save your details. Please make sure browser storage is enabled."
    );
  }
}

function readSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionId(id: string | null) {
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const id = readSessionId();
    if (!id) return null;
    const found = readUsers().find((u) => u.id === id);
    return found ? toPublicUser(found) : null;
  });

  function signUp({ name, email, password }: SignUpInput) {
    const normalizedEmail = normalizeEmail(email);
    const users = readUsers();

    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    writeUsers([...users, newUser]);
    writeSessionId(newUser.id);
    setUser(toPublicUser(newUser));
  }

  function login(email: string, password: string) {
    const normalizedEmail = normalizeEmail(email);
    const found = readUsers().find((u) => u.email === normalizedEmail);

    if (!found || found.password !== password) {
      throw new Error("Invalid email or password.");
    }

    writeSessionId(found.id);
    setUser(toPublicUser(found));
  }

  function logout() {
    writeSessionId(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
