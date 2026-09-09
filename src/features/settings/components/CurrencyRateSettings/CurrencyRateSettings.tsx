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
    <section className="rounded-xl border border-border bg-surface p-3.5 sm:rounded-2xl sm:p-6">
      <div>
        <p className="text-[10px] font-semibold text-primary sm:text-sm">
          Pul kurslary
        </p>

        <h2 className="mt-1 text-base font-bold text-text-primary sm:mt-2 sm:text-xl">
          Konwertasiýa sazlamasy
        </h2>

        <p className="mt-1 text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
          Programmadaky esasy sanlar TMT hökmünde saklanýar.
          Beýleki pul birlikleri görkezilende kurs boýunça öwrülýär.
        </p>
      </div>

      <div className="mt-3 grid w-full grid-cols-2 rounded-lg border border-border bg-background/40 p-1 sm:mt-5 sm:inline-flex sm:w-auto sm:rounded-xl">
        <button
          type="button"
          onClick={() => setMode("auto")}
          className={[
            "rounded-md px-3 py-2 text-[10px] font-semibold transition sm:rounded-lg sm:px-4 sm:text-sm",
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
            "rounded-md px-3 py-2 text-[10px] font-semibold transition sm:rounded-lg sm:px-4 sm:text-sm",
            mode === "manual"
              ? "bg-primary text-slate-950"
              : "text-text-muted",
          ].join(" ")}
        >
          El bilen
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
        {FOREIGN_CURRENCIES.map((currency) => (
          <label
            key={currency}
            className="min-w-0 rounded-lg border border-border bg-background/35 p-2.5 sm:rounded-xl sm:p-4"
          >
            <span className="text-[9px] text-text-muted sm:text-xs">
              1 {currency} = näçe TMT
            </span>

            <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2 sm:gap-3">
              <input
                type="number"
                min="0.000001"
                step="0.000001"
                value={rates[currency]}
                disabled={mode === "auto"}
                onChange={(event) =>
                  setRate(currency, Number(event.target.value))
                }
                className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-text-primary outline-none disabled:opacity-60 sm:h-11 sm:rounded-xl sm:px-3 sm:text-sm"
              />

              <span className="text-[9px] font-semibold text-text-muted sm:text-xs">
                TMT
              </span>
            </div>

            <p className="mt-1 truncate text-[9px] text-text-disabled sm:mt-2 sm:text-[11px]">
              {LABELS[currency]}
            </p>
          </label>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:mt-5 sm:gap-4 sm:pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] text-text-muted sm:text-xs">
            {lastProviderDate
              ? `Kurs senesi: ${lastProviderDate}`
              : "Heniz internetden kurs alynmady"}
          </p>

          <p className="mt-0.5 text-[9px] text-text-disabled sm:mt-1 sm:text-[11px]">
            {lastUpdatedAt
              ? `Soňky sinhron: ${new Date(lastUpdatedAt).toLocaleString()}`
              : "Offline ýagdaýda soňky saklanan kurs ulanylýar."}
          </p>

          {error && (
            <p className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-warning sm:mt-2 sm:gap-1.5 sm:text-xs">
              <WifiOff size={13} />
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={mode !== "auto" || isLoading}
          onClick={() => void refresh(true)}
          className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 text-[10px] font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50 sm:h-10 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
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

      <p className="mt-2 text-[9px] leading-4 text-text-disabled sm:mt-4 sm:text-[11px] sm:leading-5">
        Awtomatik kurslar Frankfurter API arkaly resmi/merkezi bank
        çeşmelerinden alynýar. TMT resmi kurs maglumatynyň täzeleniş
        ýygylygy beýleki walýutalardan seýrek bolup biler.
      </p>
    </section>
  );
}
