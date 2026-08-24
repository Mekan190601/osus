import type { AppCurrency } from "../features/settings/types/settings.types";
import type { CurrencyRates } from "../store/currencyRateStore";

type FrankfurterRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const SUPPORTED_QUOTES: Exclude<AppCurrency, "TMT">[] = [
  "USD",
  "EUR",
  "CNY",
  "TRY",
];

const FRANKFURTER_URL =
  "https://api.frankfurter.dev/v2/rates?base=TMT&quotes=USD,EUR,CNY,TRY";

export type CurrencyRateFetchResult = {
  rates: Partial<CurrencyRates>;
  providerDate: string | null;
};

export async function fetchOfficialCurrencyRates(): Promise<CurrencyRateFetchResult> {
  const response = await fetch(FRANKFURTER_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Kurs servisi jogap bermedi (${response.status}).`);
  }

  const data = (await response.json()) as FrankfurterRate[];

  if (!Array.isArray(data)) {
    throw new Error("Kurs maglumatynyň formasy nädogry.");
  }

  const rates: Partial<CurrencyRates> = { TMT: 1 };
  let providerDate: string | null = null;

  for (const item of data) {
    if (
      item.base !== "TMT" ||
      !SUPPORTED_QUOTES.includes(item.quote as Exclude<AppCurrency, "TMT">) ||
      !Number.isFinite(item.rate) ||
      item.rate <= 0
    ) {
      continue;
    }

    const currency = item.quote as Exclude<AppCurrency, "TMT">;
    rates[currency] = 1 / item.rate;

    if (!providerDate || item.date > providerDate) {
      providerDate = item.date;
    }
  }

  const missing = SUPPORTED_QUOTES.filter((currency) => !rates[currency]);
  if (missing.length > 0) {
    throw new Error(`Kurs tapylmady: ${missing.join(", ")}`);
  }

  return { rates, providerDate };
}