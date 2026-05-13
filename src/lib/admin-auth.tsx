import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAdminRoles } from "@/lib/admin-roles.functions";

export type AppRole = "super_admin" | "event_admin" | "editor";

export type UserRole = {
  role: AppRole;
  event_id: string | null;
};

type AdminAuthContextValue = {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  loading: boolean;
  rolesLoading: boolean;
  isSuperAdmin: boolean;
  canManageEvent: (eventId: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const loadRoles = async (_uid: string) => {
    setRolesLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Missing admin session token");

      const data = await getAdminRoles({
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles((data ?? []) as UserRole[]);
    } catch (error) {
      console.error("Unable to load admin roles", error);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setRolesLoading(true);
        // Defer the roles fetch to avoid deadlock
        setTimeout(() => loadRoles(newSession.user.id), 0);
      } else {
        setRoles([]);
        setRolesLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        loadRoles(existing.user.id);
      } else {
        setRolesLoading(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isSuperAdmin = roles.some((r) => r.role === "super_admin");
  const canManageEvent = (eventId: string) =>
    isSuperAdmin ||
    roles.some(
      (r) => (r.role === "event_admin" || r.role === "editor") && r.event_id === eventId,
    );

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName },
      },
    });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshRoles = async () => {
    if (user) await loadRoles(user.id);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        rolesLoading,
        isSuperAdmin,
        canManageEvent,
        signIn,
        signUp,
        signOut,
        refreshRoles,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
