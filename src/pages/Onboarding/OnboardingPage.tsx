import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Progress from "../../components/Progress/Progress";
import Input from "../../components/Input/Input";
import { useGoalStore } from "../../store/goalStore";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { mainGoal, setMainGoal } = useGoalStore();
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Yza
          </Link>

          <span className="text-sm font-medium text-indigo-300">
            1 / 4 ädim
          </span>
        </header>

        <section className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-2xl">
            <Progress value={25} />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
                <Target size={28} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Esasy maksat
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Seniň iň uly maksadyň näme?
              </h1>

              <p className="mt-4 leading-7 text-slate-400">
                Häzirki wagtda durmuşyňda ýetmek isleýän iň möhüm
                maksadyňy ýaz.
              </p>

              <label
                htmlFor="main-goal"
                className="mt-10 block text-sm font-medium text-slate-300"
              >
                Maksadyň
              </label>

              <Input
  value={mainGoal}
  onChange={(e) => setMainGoal(e.target.value)}
  placeholder="Mysal: 2027-nji ýylyň awgustyna çenli öz IT kompaniýamy gurmak..."
/>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => navigate("/dashboard")}>
  <span className="flex items-center gap-2">
    Dowam et
    <ArrowRight size={20} />
  </span>
</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}