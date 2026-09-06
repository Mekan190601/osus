import { supabase } from "./supabase";

import type {
  AppCurrency,
} from "../features/settings/types/settings.types";

import type {
  CurrencyRates,
  ExchangeRateMode,
} from "../store/currencyRateStore";

export type CurrencyRateRow = {
  user_id: string;

  mode: ExchangeRateMode;

  usd_rate: number;
  eur_rate: number;
  cny_rate: number;
  try_rate: number;

  last_updated_at: string | null;
  last_provider_date: string | null;

  created_at: string;
  updated_at: string;

  deleted_at: string | null;
};

export type UserCurrencyRateData = {
  rates: CurrencyRates;

  mode: ExchangeRateMode;

  lastUpdatedAt: string | null;
  lastProviderDate: string | null;
};

export const DEFAULT_RATES:
  CurrencyRates = {
    TMT: 1,
    USD: 19.5,
    EUR: 22.5,
    CNY: 3,
    TRY: 0.48,
  };

async function getUserId() {
  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return user.id;
}

export function mapCurrencyRateRow(
  row: CurrencyRateRow,
): UserCurrencyRateData {
  return {
    rates: {
      TMT: 1,

      USD:
        Number(row.usd_rate),

      EUR:
        Number(row.eur_rate),

      CNY:
        Number(row.cny_rate),

      TRY:
        Number(row.try_rate),
    },

    mode:
      row.mode,

    lastUpdatedAt:
      row.last_updated_at,

    lastProviderDate:
      row.last_provider_date,
  };
}

export async function getUserCurrencyRateRow() {
  const userId =
    await getUserId();

  const { data, error } =
    await supabase
      .from("user_currency_rates")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? (data as CurrencyRateRow)
    : null;
}

export async function getUserCurrencyRates() {
  const row =
    await getUserCurrencyRateRow();

  if (row) {
    return mapCurrencyRateRow(row);
  }

  return saveUserCurrencyRates({
    rates: {
      ...DEFAULT_RATES,
    },

    mode: "manual",

    lastUpdatedAt: null,
    lastProviderDate: null,
  });
}

export async function saveUserCurrencyRates(
  data: UserCurrencyRateData,
  updatedAt =
    new Date().toISOString(),
) {
  const userId =
    await getUserId();

  const { data: saved, error } =
    await supabase
      .from("user_currency_rates")
      .upsert(
        {
          user_id:
            userId,

          mode:
            data.mode,

          usd_rate:
            Math.max(
              0.000001,
              data.rates.USD,
            ),

          eur_rate:
            Math.max(
              0.000001,
              data.rates.EUR,
            ),

          cny_rate:
            Math.max(
              0.000001,
              data.rates.CNY,
            ),

          try_rate:
            Math.max(
              0.000001,
              data.rates.TRY,
            ),

          last_updated_at:
            data.lastUpdatedAt,

          last_provider_date:
            data.lastProviderDate,

          updated_at:
            updatedAt,

          deleted_at: null,
        },
        {
          onConflict:
            "user_id",
        },
      )
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return mapCurrencyRateRow(
    saved as CurrencyRateRow,
  );
}

export async function saveSingleCurrencyRate(
  currency: AppCurrency,
  tmtPerUnit: number,
) {
  if (currency === "TMT") {
    return getUserCurrencyRates();
  }

  const current =
    await getUserCurrencyRates();

  return saveUserCurrencyRates({
    ...current,

    rates: {
      ...current.rates,

      [currency]:
        tmtPerUnit,

      TMT: 1,
    },

    lastUpdatedAt:
      new Date().toISOString(),
  });
}

export async function resetUserCurrencyRates() {
  return saveUserCurrencyRates({
    rates: {
      ...DEFAULT_RATES,
    },

    mode: "manual",

    lastUpdatedAt: null,
    lastProviderDate: null,
  });
}