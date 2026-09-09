import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";

import { supabase } from "../../../services/supabase";
import { getOfflineUser } from "../../../services/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [offlineAccess, setOfflineAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const offlineUser = getOfflineUser();

      if (!navigator.onLine && offlineUser) {
        if (!mounted) return;
        setOfflineAccess(true);
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession);
        setOfflineAccess(false);
      } catch {
        if (!mounted) return;

        setOfflineAccess(
          !navigator.onLine && Boolean(offlineUser),
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (!mounted) return;

        if (nextSession) {
          setSession(nextSession);
          setOfflineAccess(false);
          setIsLoading(false);
          return;
        }

        if (!navigator.onLine && getOfflineUser()) {
          setSession(null);
          setOfflineAccess(true);
          setIsLoading(false);
          return;
        }

        if (event === "SIGNED_OUT") {
          setSession(null);
          setOfflineAccess(false);
          setIsLoading(false);
        }
      },
    );

    function handleOnline() {
      void initializeAuth();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      mounted = false;
      window.removeEventListener("online", handleOnline);
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06]">
            <LoaderCircle size={24} className="animate-spin text-primary" />
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

  if (!session && !offlineAccess) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
