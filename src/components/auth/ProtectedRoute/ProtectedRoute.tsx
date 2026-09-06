import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";

import { supabase } from "../../../services/supabase";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);
      setIsLoading(false);
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;

        setSession(nextSession);
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-primary/15
              bg-primary/[0.06]
            "
          >
            <LoaderCircle
              size={24}
              className="animate-spin text-primary"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-primary">
            ÖSÜŞ
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Hasabyň barlanýar...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}