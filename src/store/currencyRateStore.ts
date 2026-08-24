import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AppCurrency } from "../features/settings/types/settings.types";

export type ExchangeRateMode = "auto" | "manual";
export type CurrencyRates = Record<AppCurrency, number>;

export const DEFAULT_CURRENCY_RATES: CurrencyRates = {
  TMT: 1,
  USD: 19.5,
  EUR: 22.5,
  CNY: 3,
  TRY: 0.48,
};

type CurrencyRateState = {
  rates: CurrencyRates;
  mode: ExchangeRateMode;
  lastUpdatedAt: string | null;
  lastProviderDate: string | null;
  isLoading: boolean;
  error: string | null;
  setMode: (mode: ExchangeRateMode) => void;
  setRate: (currency: AppCurrency, tmtPerUnit: number) => void;
  setRates: (rates: Partial<CurrencyRates>, providerDate?: string | null) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  resetRates: () => void;
};

export const useCurrencyRateStore = create<CurrencyRateState>()(
  persist(
    (set) => ({
      rates: DEFAULT_CURRENCY_RATES,
      mode: "manual",
      lastUpdatedAt: null,
      lastProviderDate: null,
      isLoading: false,
      error: null,

      setMode: (mode) => set({ mode, error: null }),

      setRate: (currency, tmtPerUnit) => {
        if (currency === "TMT") return;
        if (!Number.isFinite(tmtPerUnit) || tmtPerUnit <= 0) return;

        set((state) => ({
          rates: {
            ...state.rates,
            [currency]: tmtPerUnit,
            TMT: 1,
          },
          lastUpdatedAt: new Date().toISOString(),
          error: null,
        }));
      },

      setRates: (incomingRates, providerDate = null) => {
        const cleanRates = Object.fromEntries(
          Object.entries(incomingRates).filter(([, value]) =>
            typeof value === "number" && Number.isFinite(value) && value > 0,
          ),
        ) as Partial<CurrencyRates>;

        set((state) => ({
          rates: {
            ...state.rates,
            ...cleanRates,
            TMT: 1,
          },
          lastUpdatedAt: new Date().toISOString(),
          lastProviderDate: providerDate,
          error: null,
        }));
      },

      setLoading: (value) => set({ isLoading: value }),
      setError: (value) => set({ error: value }),

      resetRates: () =>
        set({
          rates: DEFAULT_CURRENCY_RATES,
          mode: "manual",
          lastUpdatedAt: null,
          lastProviderDate: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "osus-currency-rates-storage",
      version: 2,
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<CurrencyRateState> | undefined;

        return {
          ...persisted,
          rates: {
            ...DEFAULT_CURRENCY_RATES,
            ...persisted?.rates,
            TMT: 1,
          },
          // v1-de auto režim ulanyjynyň manual kursuny üstünden ýazýardy.
          // Bir gezeklik migrasiýada howpsuz manual režime geçirýäris.
          mode: version < 2 ? "manual" : (persisted?.mode ?? "manual"),
          isLoading: false,
          error: null,
        };
      },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<CurrencyRateState>),
        rates: {
          ...DEFAULT_CURRENCY_RATES,
          ...(persistedState as Partial<CurrencyRateState>)?.rates,
          TMT: 1,
        },
        isLoading: false,
      }),
    },
  ),
);
