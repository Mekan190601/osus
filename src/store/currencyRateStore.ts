import { create } from "zustand";

import { supabase } from "../services/supabase";

import {
  getOfflineCurrencyRates,
  saveOfflineCurrencyRates,
} from "../services/offlineCurrencyRateService";

import {
  initializeCurrencyRateSync,
  syncCurrencyRateQueue,
} from "../services/currencyRateSyncService";

import type {
  OfflineCurrencyRateSettings,
} from "../services/offlineDb";

import type {
  AppCurrency,
} from "../features/settings/types/settings.types";

export type ExchangeRateMode =
  | "auto"
  | "manual";

export type CurrencyRates = Record<
  AppCurrency,
  number
>;

export const DEFAULT_CURRENCY_RATES:
  CurrencyRates = {
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
  isInitialized: boolean;

  error: string | null;

  loadRates: () => Promise<void>;

  setMode: (
    mode: ExchangeRateMode,
  ) => Promise<void>;

  setRate: (
    currency: AppCurrency,
    tmtPerUnit: number,
  ) => Promise<void>;

  setRates: (
    rates: Partial<CurrencyRates>,
    providerDate?: string | null,
  ) => Promise<void>;

  setLoading: (
    value: boolean,
  ) => void;

  setError: (
    value: string | null,
  ) => void;

  resetRates: () => Promise<void>;

  clearLocalRates: () => void;
};

const initialState = {
  rates: {
    ...DEFAULT_CURRENCY_RATES,
  },

  mode:
    "manual" as ExchangeRateMode,

  lastUpdatedAt:
    null as string | null,

  lastProviderDate:
    null as string | null,

  isLoading: false,
  isInitialized: false,

  error:
    null as string | null,
};

function getErrorMessage(
  error: unknown,
) {
  return error instanceof Error
    ? error.message
    : "Näbelli ýalňyşlyk ýüze çykdy.";
}

async function getUserId() {
  const {
    data: { session },
    error,
  } =
    await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    throw new Error(
      "Ulanyjy hasaba girmändir.",
    );
  }

  return session.user.id;
}

function applyData(
  data: OfflineCurrencyRateSettings,
) {
  return {
    rates: {
      ...data.rates,
      TMT: 1,
    },

    mode:
      data.mode,

    lastUpdatedAt:
      data.lastUpdatedAt,

    lastProviderDate:
      data.lastProviderDate,
  };
}

export const useCurrencyRateStore =
  create<CurrencyRateState>()(
    (set, get) => {
      async function persist(
        overrides: Partial<{
          rates: CurrencyRates;
          mode: ExchangeRateMode;
          lastUpdatedAt:
            string | null;
          lastProviderDate:
            string | null;
        }> = {},
      ) {
        const userId =
          await getUserId();

        const existing =
          await getOfflineCurrencyRates(
            userId,
          );

        const state =
          get();

        const now =
          new Date().toISOString();

        const data:
          OfflineCurrencyRateSettings =
          {
            userId,

            rates: {
              ...(
                overrides.rates ??
                state.rates
              ),

              TMT: 1,
            },

            mode:
              overrides.mode ??
              state.mode,

            lastUpdatedAt:
              overrides.lastUpdatedAt !==
              undefined
                ? overrides.lastUpdatedAt
                : state.lastUpdatedAt,

            lastProviderDate:
              overrides.lastProviderDate !==
              undefined
                ? overrides.lastProviderDate
                : state.lastProviderDate,

            createdAt:
              existing?.createdAt ??
              now,

            updatedAt:
              now,

            deletedAt: null,
          };

        await saveOfflineCurrencyRates(
          data,
          true,
        );

        if (navigator.onLine) {
          void syncCurrencyRateQueue().catch(
            (error) => {
              console.warn(
                "Currency rate background sync failed:",
                error,
              );
            },
          );
        }

        return data;
      }

      return {
        ...initialState,

        rates: {
          ...DEFAULT_CURRENCY_RATES,
        },

        loadRates: async () => {
          set({
            isLoading: true,
            error: null,
          });

          try {
            const userId =
              await getUserId();

            let data =
              await getOfflineCurrencyRates(
                userId,
              );

            if (data) {
              set(
                applyData(data),
              );
            }

            if (navigator.onLine) {
              const synced =
                await initializeCurrencyRateSync();

              if (synced) {
                data = synced;

                set(
                  applyData(
                    synced,
                  ),
                );
              }
            }

            if (!data) {
              const now =
                new Date().toISOString();

              data = {
                userId,

                rates: {
                  ...DEFAULT_CURRENCY_RATES,
                },

                mode:
                  "manual",

                lastUpdatedAt:
                  null,

                lastProviderDate:
                  null,

                createdAt:
                  now,

                updatedAt:
                  now,

                deletedAt:
                  null,
              };

              await saveOfflineCurrencyRates(
                data,
                true,
              );

              set(
                applyData(data),
              );
            }

            set({
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              isInitialized: true,

              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

        setMode: async (
          mode,
        ) => {
          set({
            mode,
            error: null,
          });

          try {
            await persist({
              mode,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

        setRate: async (
          currency,
          tmtPerUnit,
        ) => {
          if (
            currency === "TMT"
          ) {
            return;
          }

          if (
            !Number.isFinite(
              tmtPerUnit,
            ) ||
            tmtPerUnit <= 0
          ) {
            return;
          }

          const now =
            new Date().toISOString();

          const rates:
            CurrencyRates = {
              ...get().rates,

              [currency]:
                tmtPerUnit,

              TMT: 1,
            };

          set({
            rates,
            lastUpdatedAt:
              now,
            error: null,
          });

          try {
            await persist({
              rates,

              lastUpdatedAt:
                now,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

        setRates: async (
          incomingRates,
          providerDate = null,
        ) => {
          const cleanRates =
            Object.fromEntries(
              Object.entries(
                incomingRates,
              ).filter(
                ([, value]) =>
                  typeof value ===
                    "number" &&
                  Number.isFinite(
                    value,
                  ) &&
                  value > 0,
              ),
            ) as Partial<CurrencyRates>;

          const now =
            new Date().toISOString();

          const rates:
            CurrencyRates = {
              ...get().rates,
              ...cleanRates,
              TMT: 1,
            };

          set({
            rates,

            lastUpdatedAt:
              now,

            lastProviderDate:
              providerDate,

            error: null,
          });

          try {
            await persist({
              rates,

              lastUpdatedAt:
                now,

              lastProviderDate:
                providerDate,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

        setLoading: (
          value,
        ) => {
          set({
            isLoading: value,
          });
        },

        setError: (
          value,
        ) => {
          set({
            error: value,
          });
        },

        resetRates: async () => {
          const rates = {
            ...DEFAULT_CURRENCY_RATES,
          };

          set({
            rates,

            mode:
              "manual",

            lastUpdatedAt:
              null,

            lastProviderDate:
              null,

            error: null,
          });

          try {
            await persist({
              rates,

              mode:
                "manual",

              lastUpdatedAt:
                null,

              lastProviderDate:
                null,
            });

            set({
              isInitialized: true,
            });
          } catch (error) {
            set({
              error:
                getErrorMessage(
                  error,
                ),
            });
          }
        },

        clearLocalRates: () => {
          set({
            ...initialState,

            rates: {
              ...DEFAULT_CURRENCY_RATES,
            },
          });
        },
      };
    },
  );