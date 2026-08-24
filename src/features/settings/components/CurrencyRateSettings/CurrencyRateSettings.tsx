import {
  RefreshCw,
  WifiOff,
} from "lucide-react";

import { useCurrencyRateStore } from "../../../../store/currencyRateStore";
import { useCurrencyRates } from "../../../../hooks/useCurrencyRates";

import type { AppCurrency } from "../../types/settings.types";
const FOREIGN_CURRENCIES: Exclude<AppCurrency, "TMT">[] = [
  "USD",
  "EUR",
  "CNY",
  "TRY",
];

const LABELS: Record<AppCurrency, string> = {
  TMT: "Türkmen manady",
  USD: "ABŞ dollary",
  EUR: "Ýewro",
  CNY: "Hytaý ýuany",
  TRY: "Türk lirasy",
};

export default function CurrencyRateSettings() {
  const mode = useCurrencyRateStore((state) => state.mode);
  const rates = useCurrencyRateStore((state) => state.rates);
  const setMode = useCurrencyRateStore((state) => state.setMode);
  const setRate = useCurrencyRateStore((state) => state.setRate);

  const {
    lastUpdatedAt,
    lastProviderDate,
    isLoading,
    error,
    refresh,
  } = useCurrencyRates();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div>
        <p className="text-sm font-semibold text-primary">
          Pul kurslary
        </p>

        <h2 className="mt-2 text-xl font-bold text-text-primary">
          Konwertasiýa sazlamasy
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          Programmadaky esasy sanlar TMT hökmünde saklanýar.
          Beýleki pul birlikleri görkezilende kurs boýunça öwrülýär.
        </p>
      </div>

      <div className="mt-5 inline-flex rounded-xl border border-border bg-background/40 p-1">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={[
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            mode === "auto"
              ? "bg-primary text-slate-950"
              : "text-text-muted",
          ].join(" ")}
        >
          Awtomatik
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          className={[
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            mode === "manual"
              ? "bg-primary text-slate-950"
              : "text-text-muted",
          ].join(" ")}
        >
          El bilen
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FOREIGN_CURRENCIES.map((currency) => (
          <label
            key={currency}
            className="rounded-xl border border-border bg-background/35 p-4"
          >
            <span className="text-xs text-text-muted">
              1 {currency} = näçe TMT
            </span>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min="0.000001"
                step="0.000001"
                value={rates[currency]}
                disabled={mode === "auto"}
                onChange={(event) =>
                  setRate(currency, Number(event.target.value))
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text-primary outline-none disabled:opacity-60"
              />

              <span className="text-xs font-semibold text-text-muted">
                TMT
              </span>
            </div>

            <p className="mt-2 text-[11px] text-text-disabled">
              {LABELS[currency]}
            </p>
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-text-muted">
            {lastProviderDate
              ? `Kurs senesi: ${lastProviderDate}`
              : "Heniz internetden kurs alynmady"}
          </p>

          <p className="mt-1 text-[11px] text-text-disabled">
            {lastUpdatedAt
              ? `Soňky sinhron: ${new Date(lastUpdatedAt).toLocaleString()}`
              : "Offline ýagdaýda soňky saklanan kurs ulanylýar."}
          </p>

          {error && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-warning">
              <WifiOff size={13} />
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={mode !== "auto" || isLoading}
          onClick={() => void refresh(true)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin" : ""}
          />

          {isLoading
            ? "Täzelenýär..."
            : "Kurslary täzele"}
        </button>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-text-disabled">
        Awtomatik kurslar Frankfurter API arkaly resmi/merkezi bank
        çeşmelerinden alynýar. TMT resmi kurs maglumatynyň täzeleniş
        ýygylygy beýleki walýutalardan seýrek bolup biler.
      </p>
    </section>
  );
}
