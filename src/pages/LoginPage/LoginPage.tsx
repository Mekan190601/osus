import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  getCurrentSession,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "../../services/auth";

type Mode = "login" | "register";

type Feedback =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] =
    useSearchParams();

  const [lampOn, setLampOn] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [ropePull, setRopePull] =
    useState(0);

  const [mode, setMode] =
    useState<Mode>("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    rememberMe,
    setRememberMe,
  ] = useState(true);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isResetting,
    setIsResetting,
  ] = useState(false);

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  const startY = useRef(0);

  const MAX_PULL = 96;
  const SWITCH_POINT = 46;

  useEffect(() => {
    let mounted = true;

    async function initializeLogin() {
      try {
        const confirmed =
          searchParams.get("confirmed");

        if (confirmed === "1") {
          await signOut();

          if (!mounted) return;

          setLampOn(true);

          setFeedback({
            type: "success",
            message:
              "E-mailiň üstünlikli tassyklandy. Indi e-mailiňi we parolyňy ýazyp hasabyňa gir.",
          });

          return;
        }

        const session =
          await getCurrentSession();

        if (mounted && session) {
          navigate("/dashboard", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error,
        );
      }
    }

    void initializeLogin();

    return () => {
      mounted = false;
    };
  }, [navigate, searchParams]);

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setDragging(true);

    startY.current =
      event.clientY;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!dragging) return;

    const distance = Math.max(
      0,
      Math.min(
        MAX_PULL,
        event.clientY -
          startY.current,
      ),
    );

    setRopePull(distance);
  }

  function handlePointerEnd() {
    if (!dragging) return;

    if (
      ropePull >= SWITCH_POINT
    ) {
      setLampOn(
        (current) => !current,
      );
    }

    setDragging(false);
    setRopePull(0);
  }

  function getErrorMessage(
    error: unknown,
  ) {
    if (!(error instanceof Error)) {
      return "Näbelli ýalňyşlyk ýüze çykdy.";
    }

    const message =
      error.message.toLowerCase();

    if (
      message.includes(
        "invalid login credentials",
      )
    ) {
      return "E-mail ýa-da parol nädogry.";
    }

    if (
      message.includes(
        "email not confirmed",
      )
    ) {
      return "Ilki e-mailiňe gelen tassyklama linkine bas.";
    }

    if (
      message.includes(
        "user already registered",
      )
    ) {
      return "Bu e-mail bilen hasap eýýäm döredilen.";
    }

    if (
      message.includes(
        "password should be at least",
      )
    ) {
      return "Parol azyndan 6 belgiden ybarat bolmaly.";
    }

    if (
      message.includes(
        "unable to validate email",
      )
    ) {
      return "E-mail salgysyny dogry giriz.";
    }

    if (
      message.includes(
        "rate limit",
      )
    ) {
      return "Gaty köp synanyşyk edildi. Biraz soň gaýtadan synan.";
    }

    return error.message;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isLoading) return;

    setFeedback(null);

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setFeedback({
        type: "error",
        message:
          "E-mail salgysyny giriz.",
      });

      return;
    }

    if (!password) {
      setFeedback({
        type: "error",
        message:
          "Parolyňy giriz.",
      });

      return;
    }

    if (
      password.length < 6
    ) {
      setFeedback({
        type: "error",
        message:
          "Parol azyndan 6 belgiden ybarat bolmaly.",
      });

      return;
    }

    if (
      mode === "register" &&
      !name.trim()
    ) {
      setFeedback({
        type: "error",
        message:
          "Adyňy giriz.",
      });

      return;
    }

    try {
      setIsLoading(true);

      if (
        mode === "register"
      ) {
        const data =
          await signUp(
            name,
            cleanEmail,
            password,
          );

        if (data.session) {
          navigate(
            "/dashboard",
            {
              replace: true,
            },
          );

          return;
        }

        setFeedback({
          type: "success",
          message:
            "Hasabyň döredildi. E-mailiňe gelen tassyklama linkine bas, soň hasabyňa gir.",
        });

        setPassword("");
        setMode("login");

        return;
      }

      await signIn(
        cleanEmail,
        password,
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        },
      );
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    setFeedback(null);

    if (!cleanEmail) {
      setFeedback({
        type: "error",
        message:
          "Paroly dikeltmek üçin ilki e-mailiňi giriz.",
      });

      return;
    }

    try {
      setIsResetting(true);

      await resetPassword(
        cleanEmail,
      );

      setFeedback({
        type: "success",
        message:
          "Paroly dikeltmek üçin link e-mailiňe ugradyldy.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          getErrorMessage(error),
      });
    } finally {
      setIsResetting(false);
    }
  }

  function switchMode() {
    if (isLoading) return;

    setMode((current) =>
      current === "login"
        ? "register"
        : "login",
    );

    setFeedback(null);
    setPassword("");
  }

  const loginReady =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (mode === "login" ||
      name.trim().length > 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02080b] text-white">
      {/* GLOBAL BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(15,118,110,0.08),transparent_35%)]" />

        <div
          className={`
            absolute left-[-8%] top-[4%]
            h-[850px] w-[850px]
            rounded-full
            transition-all duration-1000
            ${
              lampOn
                ? "bg-[radial-gradient(circle,rgba(255,184,72,0.18)_0%,rgba(230,145,48,0.09)_27%,rgba(20,88,63,0.07)_47%,transparent_72%)] blur-[38px]"
                : "bg-[radial-gradient(circle,rgba(88,130,128,0.07)_0%,rgba(27,62,63,0.035)_35%,transparent_70%)] blur-[65px]"
            }
          `}
        />

        <div
          className={`
            absolute right-[-8%] top-[20%]
            h-[700px] w-[700px]
            rounded-full
            transition-all duration-1000
            ${
              lampOn
                ? "bg-emerald-500/[0.055] blur-[150px]"
                : "bg-emerald-500/[0.015] blur-[170px]"
            }
          `}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1700px] lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative flex min-h-[620px] flex-col overflow-hidden border-white/[0.08] px-6 pb-8 pt-7 sm:px-10 lg:min-h-screen lg:border-r lg:px-20 lg:pb-14 lg:pt-10">
          {/* BRAND */}
          <div className="relative z-30">
            <div className="text-[30px] font-black tracking-[-0.05em] text-emerald-400 sm:text-[34px]">
              ÖSÜŞ
            </div>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Şahsy ösüş dolandyryş ulgamy
            </p>
          </div>

          {/* LAMP STAGE */}
          <div className="relative flex min-h-[390px] flex-1 items-center justify-center lg:min-h-0">
            {/* MAIN WARM LIGHT */}
            <div
              className={`
                pointer-events-none
                absolute left-1/2 top-[20%]
                h-[620px] w-[720px]
                -translate-x-1/2
                rounded-full
                transition-all duration-1000
                ${
                  lampOn
                    ? "opacity-100"
                    : "opacity-[0.13]"
                }
              `}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,196,84,0.38) 0%, rgba(255,176,54,0.21) 24%, rgba(209,132,39,0.11) 39%, rgba(36,95,66,0.07) 54%, transparent 75%)",
                filter:
                  "blur(24px)",
              }}
            />

            {/* STRONG FLOOR GLOW */}
            <div
              className={`
                pointer-events-none
                absolute left-1/2 top-[68%]
                h-[135px] w-[460px]
                -translate-x-1/2
                rounded-[100%]
                transition-all duration-1000
                ${
                  lampOn
                    ? "bg-amber-300/[0.20] opacity-100 blur-[38px]"
                    : "bg-slate-400/[0.025] opacity-70 blur-[45px]"
                }
              `}
            />

            {/* LAMP */}
            <div className="relative z-20 flex -translate-y-4 flex-col items-center lg:-translate-y-8">
              {/* SHADE */}
              <div className="relative">
                <div
                  className={`
                    relative
                    h-[108px] w-[270px]
                    overflow-hidden
                    rounded-[52%_52%_8%_8%/85%_85%_12%_12%]
                    border
                    transition-all duration-700
                    sm:h-[118px] sm:w-[300px]
                    ${
                      lampOn
                        ? "border-[#4b443a] bg-[linear-gradient(180deg,#1f282b_0%,#0a1012_68%,#24170c_100%)] shadow-[0_28px_48px_rgba(0,0,0,0.92),0_10px_32px_rgba(255,190,76,0.36),0_0_75px_rgba(255,176,55,0.16)]"
                        : "border-[#4b585d] bg-[linear-gradient(180deg,#354247_0%,#202b2f_35%,#101719_75%,#080d0f_100%)] shadow-[0_24px_44px_rgba(0,0,0,0.92),0_0_26px_rgba(89,131,133,0.10)]"
                    }
                  `}
                >
                  {/* METAL REFLECTION */}
                  <div
                    className={`
                      absolute left-[15%] top-[9%]
                      h-[22px] w-[52%]
                      rotate-[-5deg]
                      rounded-full
                      blur-md
                      transition-all duration-700
                      ${
                        lampOn
                          ? "bg-white/[0.065]"
                          : "bg-white/[0.085]"
                      }
                    `}
                  />

                  {/* UNDERSIDE LIGHT */}
                  <div
                    className={`
                      absolute inset-x-[7%] bottom-[-3px]
                      h-[10px]
                      rounded-full
                      transition-all duration-700
                      ${
                        lampOn
                          ? "bg-[#ffd67d] shadow-[0_0_32px_rgba(255,214,125,1),0_0_85px_rgba(255,177,55,0.70)]"
                          : "bg-[#7f704d]/65 shadow-[0_0_12px_rgba(218,176,92,0.12)]"
                      }
                    `}
                  />
                </div>

                {/* UNDER SHADE HALO */}
                <div
                  className={`
                    pointer-events-none
                    absolute left-1/2 top-[82%]
                    h-[120px] w-[340px]
                    -translate-x-1/2
                    rounded-full
                    transition-all duration-700
                    ${
                      lampOn
                        ? "bg-amber-300/[0.22] opacity-100 blur-[45px]"
                        : "bg-slate-300/[0.02] opacity-100 blur-[55px]"
                    }
                  `}
                />
              </div>

              {/* STEM */}
              <div
                className={`
                  h-[245px] w-[14px]
                  transition-all duration-700
                  ${
                    lampOn
                      ? "bg-[linear-gradient(90deg,#281a0d_0%,#9b6b33_38%,#5c3e21_55%,#24170c_100%)] shadow-[0_0_22px_rgba(231,171,83,0.22)]"
                      : "bg-[linear-gradient(90deg,#202b2e_0%,#59676c_38%,#39464a_58%,#1b2427_100%)] shadow-[0_0_12px_rgba(102,133,136,0.10)]"
                  }
                `}
              />

              {/* BASE */}
              <div
                className={`
                  relative h-[21px] w-[170px]
                  rounded-[50%]
                  transition-all duration-700
                  ${
                    lampOn
                      ? "bg-[linear-gradient(180deg,#684924,#27180b)] shadow-[0_16px_30px_rgba(0,0,0,0.80),0_0_34px_rgba(237,174,76,0.18)]"
                      : "bg-[linear-gradient(180deg,#465458,#202a2e)] shadow-[0_13px_26px_rgba(0,0,0,0.78),0_0_16px_rgba(90,120,123,0.06)]"
                  }
                `}
              />

              <div
                className={`
                  mt-[-4px] h-[13px] w-[135px]
                  rounded-[50%]
                  transition-all duration-700
                  ${
                    lampOn
                      ? "bg-[#1b1108]"
                      : "bg-[#151d20]"
                  }
                `}
              />

              {/* ROPE */}
              <div className="absolute left-[calc(50%+102px)] top-[103px] sm:left-[calc(50%+113px)]">
                <div
                  className={`
                    mx-auto w-[2px]
                    origin-top
                    transition-colors duration-500
                    ${
                      lampOn
                        ? "bg-[#aa895a]"
                        : "bg-[#7c898d]"
                    }
                  `}
                  style={{
                    height: `${
                      112 +
                      ropePull
                    }px`,
                  }}
                />

                {/* METAL PULL BALL */}
                <div
                  onPointerDown={
                    handlePointerDown
                  }
                  onPointerMove={
                    handlePointerMove
                  }
                  onPointerUp={
                    handlePointerEnd
                  }
                  onPointerCancel={
                    handlePointerEnd
                  }
                  className={`
                    relative -ml-[15px]
                    h-[32px] w-[32px]
                    touch-none
                    cursor-grab
                    rounded-full border
                    transition-all duration-150
                    ${
                      dragging
                        ? "scale-110 cursor-grabbing"
                        : ""
                    }
                    ${
                      lampOn
                        ? "border-[#ae8747] bg-[radial-gradient(circle_at_34%_28%,#f5cb7c,#9a6732_52%,#49301d_78%,#22160f_100%)] shadow-[0_7px_18px_rgba(0,0,0,0.60),0_0_24px_rgba(255,191,83,0.30)]"
                        : "border-[#7b898e] bg-[radial-gradient(circle_at_34%_28%,#87969a,#515e63_48%,#303a3e_73%,#192124_100%)] shadow-[0_6px_16px_rgba(0,0,0,0.65),0_0_14px_rgba(117,153,157,0.08)]"
                    }
                  `}
                  title="Ýüpi aşak çek"
                >
                  <div className="absolute inset-[8px] rounded-full bg-black/20" />
                </div>

                {/* HELPER */}
                <div
                  className={`
                    pointer-events-none
                    absolute left-[42px] top-[128px]
                    w-[165px]
                    transition-all duration-700
                    ${
                      lampOn
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }
                  `}
                >
                  <div className="relative">
                    <div className="absolute -left-[30px] top-[-35px] h-[60px] w-[30px] rotate-[24deg] rounded-full border-r-2 border-amber-300/65" />

                    <ArrowRight
                      size={18}
                      className="absolute -left-[38px] top-[18px] rotate-[118deg] text-amber-300/80"
                    />

                    <p className="font-medium italic text-amber-200/80">
                      Ýüpi aşak çek
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT CONTENT */}
          <div
            className={`
              relative z-20
              max-w-[650px]
              transition-all duration-1000
              ${
                lampOn
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-65"
              }
            `}
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
              Täze başlangyç
            </p>

            <h1 className="mt-4 max-w-[620px] text-[38px] font-black leading-[1.03] tracking-[-0.045em] sm:text-[48px] lg:text-[58px]">
              Ösüşiňi bir ýerden
              <br />
              dolandyr.
            </h1>

            <p className="mt-5 max-w-[590px] text-sm leading-7 text-slate-400 sm:text-[15px]">
              Maksatlaryňy, maliýäňi we
              meýilnamaňy bir ulgamda
              birleşdir. Her gün iň möhüm
              ädimiňi gör.
            </p>

            {/* FEATURES */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-10">
              <div className="flex items-start gap-3 border-white/[0.07] sm:border-r sm:pr-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/[0.05] text-emerald-400">
                  <Target size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Maksatlar
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Anyk we ölçäp bolýan
                    maksatlar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-white/[0.07] sm:border-r sm:px-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04] text-emerald-400">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Maliýe
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Girdejileriňi we
                    çykdajylaryňy dolandyr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:pl-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04] text-emerald-400">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Meýilnama
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Gündeligiňi
                    meýilleşdir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CENTER ARROW */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div
            className={`
              flex h-[64px] w-[64px]
              items-center justify-center
              rounded-full
              border
              bg-[#061015]/85
              backdrop-blur-xl
              transition-all duration-700
              ${
                lampOn
                  ? "border-emerald-400/45 shadow-[0_0_35px_rgba(16,185,129,0.15)]"
                  : "border-white/10"
              }
            `}
          >
            <ArrowRight
              size={28}
              className={
                lampOn
                  ? "text-emerald-400"
                  : "text-slate-700"
              }
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <section className="relative flex min-h-[620px] items-center justify-center px-5 py-10 sm:px-8 lg:min-h-screen lg:px-16">
          {!lampOn ? (
            <div className="max-w-xs text-center">
              <div className="mx-auto h-2.5 w-2.5 rounded-full bg-slate-700 shadow-[0_0_12px_rgba(100,116,139,0.16)]" />

              <p className="mt-5 text-sm leading-6 text-slate-600">
                Giriş üçin lampanyň
                ýüpi çekilip ýagtylygy
                ýakylmaly.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-[510px] animate-[loginAppear_650ms_cubic-bezier(0.22,1,0.36,1)_both]">
              {/* CARD */}
              <div
                className="
                  relative overflow-hidden
                  rounded-[32px]
                  border border-white/[0.12]
                  p-7
                  shadow-[0_35px_100px_rgba(0,0,0,0.48)]
                  backdrop-blur-2xl
                  sm:p-9
                "
                style={{
                  background:
                    "linear-gradient(145deg, rgba(114,88,50,0.17) 0%, rgba(8,29,35,0.93) 28%, rgba(6,22,28,0.97) 100%)",
                }}
              >
                <div className="pointer-events-none absolute -left-24 top-[-30px] h-64 w-64 rounded-full bg-amber-300/[0.06] blur-[80px]" />

                <div className="pointer-events-none absolute right-[-90px] top-[10%] h-72 w-72 rounded-full bg-emerald-400/[0.05] blur-[110px]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-semibold text-emerald-400">
                        Hoş geldiň
                      </p>

                      <h2 className="mt-2 text-[34px] font-black tracking-[-0.045em] sm:text-[38px]">
                        {mode === "login"
                          ? "Hasabyňa gir"
                          : "Täze hasap döred"}
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08]">
                      <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
                    </div>
                  </div>

                  <p className="mt-4 max-w-[390px] text-sm leading-7 text-slate-400">
                    {mode === "login"
                      ? "Maksatlaryňy we gündelik ösüşiňi dowam etmek üçin hasabyňa gir."
                      : "ÖSÜŞ-i özüňe laýyk sazlamak üçin täze hasabyňy döred."}
                  </p>

                  {feedback && (
                    <div
                      className={`
                        mt-5 flex gap-3
                        rounded-2xl border
                        px-4 py-3
                        text-sm leading-5
                        ${
                          feedback.type ===
                          "success"
                            ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                            : "border-red-400/20 bg-red-400/[0.07] text-red-200"
                        }
                      `}
                    >
                      {feedback.type ===
                      "success" ? (
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

                      <span>
                        {feedback.message}
                      </span>
                    </div>
                  )}

                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="mt-7 space-y-5"
                  >
                    {mode ===
                      "register" && (
                      <label className="block animate-[loginAppear_300ms_ease-out_both]">
                        <span className="mb-2.5 block text-sm font-semibold text-slate-200">
                          Adyň
                        </span>

                        <div className="flex h-[60px] items-center gap-3 rounded-2xl border border-white/[0.10] bg-[#061218]/70 px-4 transition-all focus-within:border-emerald-400/55 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.05)]">
                          <UserRound
                            size={18}
                            className="shrink-0 text-slate-500"
                          />

                          <input
                            value={name}
                            onChange={(
                              event,
                            ) =>
                              setName(
                                event
                                  .target
                                  .value,
                              )
                            }
                            disabled={
                              isLoading
                            }
                            placeholder="Adyňy giriz"
                            autoComplete="name"
                            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                          />
                        </div>
                      </label>
                    )}

                    <label className="block">
                      <span className="mb-2.5 block text-sm font-semibold text-slate-200">
                        E-mail
                      </span>

                      <div className="flex h-[60px] items-center gap-3 rounded-2xl border border-white/[0.10] bg-[#061218]/70 px-4 transition-all focus-within:border-emerald-400/55 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.05)]">
                        <Mail
                          size={18}
                          className="shrink-0 text-slate-500"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(
                            event,
                          ) =>
                            setEmail(
                              event.target
                                .value,
                            )
                          }
                          disabled={
                            isLoading
                          }
                          placeholder="email@example.com"
                          autoComplete="email"
                          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2.5 block text-sm font-semibold text-slate-200">
                        Parol
                      </span>

                      <div className="flex h-[60px] items-center gap-3 rounded-2xl border border-white/[0.10] bg-[#061218]/70 px-4 transition-all focus-within:border-emerald-400/55 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.05)]">
                        <LockKeyhole
                          size={18}
                          className="shrink-0 text-slate-500"
                        />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            password
                          }
                          onChange={(
                            event,
                          ) =>
                            setPassword(
                              event.target
                                .value,
                            )
                          }
                          disabled={
                            isLoading
                          }
                          placeholder="Parolyňy giriz"
                          autoComplete={
                            mode ===
                            "login"
                              ? "current-password"
                              : "new-password"
                          }
                          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600 disabled:opacity-50"
                        />

                        <button
                          type="button"
                          disabled={
                            isLoading
                          }
                          onClick={() =>
                            setShowPassword(
                              (
                                current,
                              ) =>
                                !current,
                            )
                          }
                          className="shrink-0 text-slate-500 transition hover:text-slate-200 disabled:opacity-40"
                          aria-label={
                            showPassword
                              ? "Paroly gizle"
                              : "Paroly görkez"
                          }
                        >
                          {showPassword ? (
                            <EyeOff
                              size={19}
                            />
                          ) : (
                            <Eye
                              size={19}
                            />
                          )}
                        </button>
                      </div>
                    </label>

                    {mode ===
                      "login" && (
                      <div className="flex items-center justify-between gap-4">
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-400">
                          <input
                            type="checkbox"
                            checked={
                              rememberMe
                            }
                            onChange={(
                              event,
                            ) =>
                              setRememberMe(
                                event
                                  .target
                                  .checked,
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-white/10 bg-transparent accent-emerald-500"
                          />

                          <span>
                            Meni ýatda
                            sakla
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            void handleForgotPassword()
                          }
                          disabled={
                            isLoading ||
                            isResetting
                          }
                          className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isResetting
                            ? "Ugradylýar..."
                            : "Paroly unutdym?"}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        !loginReady ||
                        isLoading
                      }
                      className="
                        mt-1 flex h-[62px] w-full
                        items-center justify-center
                        gap-3
                        rounded-2xl
                        bg-[linear-gradient(90deg,#12c981,#20d98e)]
                        text-[16px] font-black
                        text-[#04150e]
                        shadow-[0_14px_42px_rgba(16,185,129,0.20)]
                        transition-all duration-200
                        hover:-translate-y-[1px]
                        hover:shadow-[0_18px_55px_rgba(16,185,129,0.30)]
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                        disabled:hover:translate-y-0
                      "
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle
                            size={19}
                            className="animate-spin"
                          />

                          Garaş...
                        </>
                      ) : (
                        <>
                          {mode ===
                          "login"
                            ? "Gir"
                            : "Hasap döret"}

                          <ArrowRight
                            size={19}
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-7 border-t border-white/[0.08] pt-6 text-center text-sm text-slate-500">
                    {mode === "login"
                      ? "Täze ulanyjymy?"
                      : "Hasabyň eýýäm barmy?"}

                    <button
                      type="button"
                      disabled={
                        isLoading
                      }
                      onClick={
                        switchMode
                      }
                      className="ml-2 font-semibold text-emerald-400 transition hover:text-emerald-300 disabled:opacity-50"
                    >
                      {mode === "login"
                        ? "Hasap döret"
                        : "Hasabyňa gir"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
                <LockKeyhole
                  size={14}
                />

                <span>
                  Maglumatlaryň seniň şahsy
                  hasabyň bilen baglanyşykly
                  saklanar.
                </span>
              </div>

              <div className="mx-auto mt-7 flex max-w-[340px] items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-400">
                  <Lightbulb
                    size={19}
                  />
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  Yzygiderli kiçi ädimler
                  <br />
                  <span className="font-semibold text-white">
                    uly netijäni getirýär.
                  </span>
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <style>
        {`
          @keyframes loginAppear {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.97);
              filter: blur(6px);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }
        `}
      </style>
    </main>
  );
}