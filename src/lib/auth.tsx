import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type GuestRole = "AFF member" | "Sponsor" | "Speaker";

export type AuthUser = {
  code: string;
  role: GuestRole;
  name: string;
  email: string;
  organisation: string;
};

// Mock access codes — 3 loại khách (AFF / Sponsor / Speaker)
export const ACCESS_CODES: Record<string, AuthUser> = {
  "AFF-2026": {
    code: "AFF-2026",
    role: "AFF member",
    name: "Nguyen Van A",
    email: "aff.member@vbma.org.vn",
    organisation: "VBMA Member Institution",
  },
  "SPN-2026": {
    code: "SPN-2026",
    role: "Sponsor",
    name: "Sarah Tran",
    email: "sponsor@partner.com",
    organisation: "Gold Sponsor Co., Ltd",
  },
  "SPK-2026": {
    code: "SPK-2026",
    role: "Speaker",
    name: "Dr. Hiroshi Tanaka",
    email: "speaker@asf2026.org",
    organisation: "Japan Securities Dealers Assoc.",
  },
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginWithCode: (code: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "asf2026.auth.code";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const code = window.localStorage.getItem(STORAGE_KEY);
    if (code && ACCESS_CODES[code]) setUser(ACCESS_CODES[code]);
  }, []);

  const loginWithCode = (raw: string) => {
    const code = raw.trim().toUpperCase();
    const u = ACCESS_CODES[code];
    if (!u) return { ok: false as const, error: "Mã code không hợp lệ" };
    setUser(u);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, code);
    return { ok: true as const };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginWithCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
