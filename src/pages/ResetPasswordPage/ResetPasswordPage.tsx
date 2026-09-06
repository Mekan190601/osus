import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  XCircle,
} from "lucide-react";

import { supabase } from "../../services/supabase";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFeedback(null);

    if (password.length < 6) {
      setFeedback({
        type: "error",
        message:
          "Täze parol azyndan 6 belgiden ybarat bolmaly.",
      });

      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message:
          "Iki parol biri-birine gabat gelenok.",
      });

      return;
    }

    try {
      setIsLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        throw error;
      }

      setFeedback({
        type: "success",
        message:
          "Parolyň üstünlikli täzelendi.",
      });

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1600);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Paroly täzeläp bolmady.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const ready =
    password.length >= 6 &&
    confirmPassword.length >= 6;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05090c] px-5 py-10 text-white">
      <div className="w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-emerald-400">
            ÖSÜŞ
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Täze parol goý
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Täze parolyňy iki gezek giriz.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0b1f27]/90 p-6 shadow-2xl sm:p-8">
          {feedback && (
            <div
              className={[
                "mb-5 flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-5",
                feedback.type === "success"
                  ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200"
                  : "border-red-400/20 bg-red-400/[0.08] text-red-200",
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

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Täze parol
              </span>

              <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-emerald-400/45">
                <LockKeyhole
                  size={18}
                  className="text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  placeholder="Täze paroly giriz"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="text-slate-500 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Paroly tassykla
              </span>

              <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 focus-within:border-emerald-400/45">
                <LockKeyhole
                  size={18}
                  className="text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  placeholder="Paroly gaýtadan giriz"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={!ready || isLoading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 font-bold text-[#06130e] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Garaş...
                </>
              ) : (
                "Paroly täzele"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}