import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type GuestRole = "AFF member" | "Sponsor" | "Speaker";

export type AuthUser = {
  code: string;
  role: GuestRole;
  name: string;
  email: string;
  organisation: string;
};

export type RegistrationRecord = {
  id: string;
  createdAt: string;
  code: string;
  name: string;
  email: string;
  nationality: string;
  phone: string;
  organisation: string;
  title?: string;
  customerType: string;
};

export type BookingRecord = {
  id: string;
  createdAt: string;
  code: string;
  hotelId: string;
  hotelName: string;
  name: string;
  email: string;
  organisation: string;
  phone: string;
  rooms: number;
  roomType: string;
  guests: number;
  checkin: string;
  checkout: string;
  notes?: string;
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
  registrations: RegistrationRecord[];
  bookings: BookingRecord[];
  addRegistration: (r: Omit<RegistrationRecord, "id" | "createdAt" | "code">) => void;
  addBooking: (b: Omit<BookingRecord, "id" | "createdAt" | "code">) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "asf2026.auth.code";
const REG_KEY = "asf2026.registrations";
const BOOK_KEY = "asf2026.bookings";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function save<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const code = window.localStorage.getItem(STORAGE_KEY);
    if (code && ACCESS_CODES[code]) setUser(ACCESS_CODES[code]);
    setRegistrations(load<RegistrationRecord>(REG_KEY));
    setBookings(load<BookingRecord>(BOOK_KEY));
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

  const addRegistration: AuthContextValue["addRegistration"] = (r) => {
    if (!user) return;
    const rec: RegistrationRecord = {
      ...r,
      id: uid(),
      createdAt: new Date().toISOString(),
      code: user.code,
    };
    setRegistrations((prev) => {
      const next = [rec, ...prev];
      save(REG_KEY, next);
      return next;
    });
  };

  const addBooking: AuthContextValue["addBooking"] = (b) => {
    if (!user) return;
    const rec: BookingRecord = {
      ...b,
      id: uid(),
      createdAt: new Date().toISOString(),
      code: user.code,
    };
    setBookings((prev) => {
      const next = [rec, ...prev];
      save(BOOK_KEY, next);
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithCode,
        logout,
        registrations,
        bookings,
        addRegistration,
        addBooking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
