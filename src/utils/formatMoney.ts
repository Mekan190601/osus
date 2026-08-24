import type { AppCurrency } from "../features/settings/types/settings.types";

const CURRENCY_CONFIG: Record<
  AppCurrency,
  {
    locale: string;
    symbol: string;
    position: "before" | "after";
    maximumFractionDigits: number;
  }
> = {
  TMT: { locale: "tk-TM", symbol: "m", position: "after", maximumFractionDigits: 0 },
  USD: { locale: "en-US", symbol: "$", position: "before", maximumFractionDigits: 2 },
  EUR: { locale: "de-DE", symbol: "€", position: "after", maximumFractionDigits: 2 },
  CNY: { locale: "zh-CN", symbol: "¥", position: "before", maximumFractionDigits: 2 },
  TRY: { locale: "tr-TR", symbol: "₺", position: "before", maximumFractionDigits: 2 },
};

export function formatMoney(value: number, currency: AppCurrency = "TMT") {
  const config = CURRENCY_CONFIG[currency];
  const safeValue = Number.isFinite(value) ? value : 0;

  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(safeValue);

  return config.position === "before"
    ? `${config.symbol}${formatted}`
    : `${formatted} ${config.symbol}`;
}