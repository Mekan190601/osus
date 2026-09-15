import { supabase } from "./supabase";

const OFFLINE_USER_KEY = "osus-offline-user";

export type OfflineUser = {
  id: string;
  email: string | null;
  name: string | null;
};

function saveOfflineUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const offlineUser: OfflineUser = {
    id: user.id,
    email: user.email ?? null,
    name:
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null,
  };

  localStorage.setItem(
    OFFLINE_USER_KEY,
    JSON.stringify(offlineUser),
  );
}

export function getOfflineUser(): OfflineUser | null {
  try {
    const raw =
      localStorage.getItem(OFFLINE_USER_KEY);

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw) as Partial<OfflineUser>;

    if (
      !parsed.id ||
      typeof parsed.id !== "string"
    ) {
      return null;
    }

    return {
      id: parsed.id,

      email:
        typeof parsed.email === "string"
          ? parsed.email
          : null,

      name:
        typeof parsed.name === "string"
          ? parsed.name
          : null,
    };
  } catch {
    return null;
  }
}

export function clearOfflineUser() {
  localStorage.removeItem(
    OFFLINE_USER_KEY,
  );
}

/**
 * Häzirki ulanyjynyň ID-sini offline-safe görnüşde berýär.
 *
 * 1. Ilki Supabase local session barlanýar.
 * 2. Session bar bolsa şol user ID ulanylýar.
 * 3. Session ýok bolsa ýa-da session barlagy şowsuz bolsa,
 *    soňky üstünlikli login-den saklanan local user ulanylýar.
 *
 * Bu funksiýa IndexedDB maglumatlaryna uzak wagt
 * offline bolanda hem ýetmek üçin niýetlenendir.
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const {
      data: { session },
      error,
    } =
      await supabase.auth.getSession();

    if (!error && session?.user?.id) {
      return session.user.id;
    }
  } catch (error) {
    console.warn(
      "Supabase session unavailable, using offline user:",
      error,
    );
  }

  const offlineUser =
    getOfflineUser();

  if (offlineUser?.id) {
    return offlineUser.id;
  }

  throw new Error(
    "Ulanyjy hasaba girmändir.",
  );
}

export async function signUp(
  name: string,
  email: string,
  password: string,
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          name: name.trim(),
        },

        emailRedirectTo:
          `${window.location.origin}/login?confirmed=1`,
      },
    });

  if (error) {
    throw error;
  }

  if (
    data.user &&
    data.session
  ) {
    saveOfflineUser(
      data.user,
    );
  }

  return data;
}

export async function signIn(
  email: string,
  password: string,
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  if (
    data.user &&
    data.session
  ) {
    saveOfflineUser(
      data.user,
    );
  }

  return data;
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut({
      scope: "local",
    });

  clearOfflineUser();

  if (
    error &&
    navigator.onLine
  ) {
    throw error;
  }
}

export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

export async function resetPassword(
  email: string,
) {
  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/reset-password`,
      },
    );

  if (error) {
    throw error;
  }
}