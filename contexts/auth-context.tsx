import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { Session, User } from "@supabase/supabase-js";

import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { supabase } from "@/lib/supabase";

export type UserRole = "lojista" | "consultor";

export type UserProfile = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeRole(value: unknown): UserRole {
  return value === "lojista" ? "lojista" : "consultor";
}

async function fetchProfile(user: User): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data) {
    return {
      id: data.id,
      full_name: data.full_name,
      role: normalizeRole(data.role),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    full_name:
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      user.email ||
      "Usuário",
    role: normalizeRole(metadata.role),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  const syncProfile = async (user: User | null) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await fetchProfile(user);
    setProfile(nextProfile);
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.warn(error.message);
      }

      setSession(data.session ?? null);

      if (data.session?.user) {
        await syncProfile(data.session.user);
      }

      setInitializing(false);
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user) {
        void syncProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(getFriendlyAuthErrorMessage(error.message));
    }
  };

  const signUp = async ({ fullName, email, password, role }: RegisterInput) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      throw new Error(getFriendlyAuthErrorMessage(error.message));
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(getFriendlyAuthErrorMessage(error.message));
    }
  };

  const refreshProfile = async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    await syncProfile(session.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? normalizeRole(session?.user.user_metadata?.role),
      initializing,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [initializing, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
