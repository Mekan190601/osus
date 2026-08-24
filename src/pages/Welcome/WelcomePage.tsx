import { ArrowRight, CheckCircle2, Target, TrendingUp } from "lucide-react";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";


const benefits = [
  {
    icon: Target,
    title: "Maksadyňy anykla",
    description: "Uly maksadyňy takyk, ölçenip bolýan görnüşe geçir.",
  },
  {
    icon: CheckCircle2,
    title: "Gündelik hereket et",
    description: "Her gün ýerine ýetirmeli iň möhüm işleri gör.",
  },
  {
    icon: TrendingUp,
    title: "Ösüşiňi yzarla",
    description: "Netijeleriňi, endikleriňi we ösüş derejäňi ölçäp bar.",
  },
];

export default function WelcomePage() {
    const navigate = useNavigate();


  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-wider">
            ÖSÜŞ
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Her gün bir ädim
          </span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            Şahsy ösüş we maksat ulgamy
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Maksadyňy arzuwdan
            <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              gündelik herekete öwür
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            ÖSÜŞ saňa maksadyňy kesgitlemäge, gündelik meýilnama
            düzmäge, güýçli endikleri döretmäge we netijeleriňi
            yzygiderli yzarlamaga kömek edýär.
          </p>

          <div className="mt-10">
            <Button onClick={() => navigate("/onboarding")}>
  <span className="flex items-center gap-2">
    Başla
    <ArrowRight size={20} />
  </span>
</Button>
          </div>

          <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Icon size={24} />
                </div>

                <h2 className="text-xl font-semibold">{title}</h2>

                <p className="mt-3 leading-7 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          ÖSÜŞ — Her gün bir ädim. Her ädim bir ösüş.
        </footer>
      </div>
    </main>
  );
}