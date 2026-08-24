import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../app/routePaths";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--app-shadow)] sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX size={26} />
        </div>

        <p className="mt-6 text-sm font-semibold text-primary">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
          Bu sahypa tapylmady
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-muted">
          Açjak bolan sahypaň ýok ýa-da adresi
          üýtgedilen bolup biler.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
            Yza dolan
          </button>

          <Link
            to={ROUTES.dashboard}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-slate-950 transition hover:bg-primary-hover"
          >
            <Home size={16} />
            Baş sahypa
          </Link>
        </div>
      </div>
    </div>
  );
}