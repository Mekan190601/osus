import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { supabase } from "../../services/supabase";
import { signOut } from "../../services/auth";
import { useProfileStore } from "../../store/profileStore";


type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

export default function ProfilePage() {
  const navigate = useNavigate();

  const setProfileName = useProfileStore(
    (state) => state.setName,
  );
  const setProfileRole = useProfileStore(
  (state) => state.setRole,
);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [originalName, setOriginalName] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const userName =
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

    if (!mounted) return;
    if (userName) {
  setProfileName(userName);
}

setProfileRole("Şahsy profil");

    setName(userName);
    setOriginalName(userName);
    setEmail(user.email ?? "");
    setCreatedAt(user.created_at ?? "");

    if (userName) {
  setProfileName(userName);
}

setProfileRole("Şahsy profil");
  } catch (error) {
    if (!mounted) return;

    setFeedback({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Profil maglumatlaryny ýükläp bolmady.",
    });
  } finally {
    if (mounted) {
      setIsLoading(false);
    }
  }
}

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, setProfileName, setProfileRole]);

  const initials = useMemo(() => {
    const cleanName = name.trim();

    if (cleanName) {
      return cleanName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }

    if (email) {
      return email[0]?.toUpperCase() ?? "Ö";
    }

    return "Ö";
  }, [name, email]);

  const formattedCreatedAt = useMemo(() => {
    if (!createdAt) return "—";

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("tk-TM", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }, [createdAt]);

  const hasChanges =
    name.trim() !== originalName.trim();

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanName = name.trim();

    setFeedback(null);

    if (!cleanName) {
      setFeedback({
        type: "error",
        message: "Adyň boş bolup bilmez.",
      });

      return;
    }

    try {
      setIsSaving(true);

      const { error } =
        await supabase.auth.updateUser({
          data: {
            name: cleanName,
          },
        });

      if (error) {
        throw error;
      }

      setName(cleanName);
setOriginalName(cleanName);
setProfileName(cleanName);

setFeedback({
        type: "success",
        message:
          "Profil maglumatlaryň üstünlikli täzelendi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Profili täzeläp bolmady.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Hasapdan çykyp bolmady.",
      });

      setIsSigningOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle
            size={22}
            className="animate-spin text-emerald-400"
          />

          Profil ýüklenýär...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-emerald-400/25 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm font-semibold text-emerald-400">
              Şahsy hasap
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
              Profil
            </h1>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={[
            "mb-6 flex gap-3 rounded-2xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
              : "border-red-400/20 bg-red-400/[0.07] text-red-200",
          ].join(" ")}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
          )}

          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* LEFT PROFILE CARD */}
        <section className="rounded-[28px] border border-white/10 bg-[#0b2028] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 to-cyan-400/5 text-4xl font-black text-emerald-300 shadow-[0_20px_70px_rgba(16,185,129,0.12)]">
              {initials}
            </div>

            <h2 className="mt-5 text-2xl font-black text-white">
              {name.trim() || "ÖSÜŞ ulanyjysy"}
            </h2>

            <p className="mt-2 break-all text-sm text-slate-400">
              {email}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={14} />
              Tassyklanan hasap
            </div>
          </div>

          <div className="mt-7 space-y-3 border-t border-white/[0.08] pt-6">
            <div className="flex items-center gap-3 rounded-2xl bg-black/15 px-4 py-3">
              <Mail
                size={18}
                className="shrink-0 text-slate-500"
              />

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  E-mail
                </p>

                <p className="truncate text-sm font-medium text-slate-200">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-black/15 px-4 py-3">
              <CalendarDays
                size={18}
                className="shrink-0 text-slate-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Hasap döredilen
                </p>

                <p className="text-sm font-medium text-slate-200">
                  {formattedCreatedAt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          {/* PERSONAL INFO */}
          <section className="rounded-[28px] border border-white/10 bg-[#0b2028] p-6 sm:p-7">
            <div className="mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400">
                <UserRound size={20} />
              </div>

              <h2 className="mt-4 text-xl font-black text-white">
                Şahsy maglumatlar
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Profiliňde görünýän adyňy şu ýerden
                üýtgedip bilersiň.
              </p>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5"
            >
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Adyň
                </span>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Adyňy giriz"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  E-mail
                </span>

                <input
                  value={email}
                  disabled
                  className="h-14 w-full cursor-not-allowed rounded-2xl border border-white/[0.07] bg-black/10 px-4 text-sm text-slate-500 outline-none"
                />

                <span className="mt-2 block text-xs text-slate-600">
                  E-mail howpsuzlyk sebäpli bu ýerde
                  göni üýtgedilmeýär.
                </span>
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    !hasChanges || isSaving
                  }
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 font-bold text-[#06130e] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  Ýatda sakla
                </button>
              </div>
            </form>
          </section>

          {/* SECURITY */}
          <section className="rounded-[28px] border border-white/10 bg-[#0b2028] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-400">
                  <KeyRound size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    Parol we howpsuzlyk
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                    Parolyňy üýtgetmek isleseň,
                    e-mailiňe howpsuz dikeltme linkini
                    iberip bilersiň.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="h-11 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-300"
              >
                Paroly dolandyr
              </button>
            </div>
          </section>

          {/* SIGN OUT */}
          <section className="rounded-[28px] border border-red-400/10 bg-red-400/[0.025] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-white">
                  Hasapdan çyk
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Bu enjamdaky ÖSÜŞ sessiýasy ýapylar.
                  Täzeden girmek üçin e-mail we parol gerek
                  bolar.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void handleSignOut()
                }
                disabled={isSigningOut}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 text-sm font-bold text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
              >
                {isSigningOut ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut size={17} />
                )}

                Hasapdan çyk
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}