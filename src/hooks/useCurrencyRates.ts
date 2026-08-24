import { useCallback } from "react";

import { fetchOfficialCurrencyRates } from "../services/currencyRates";
import { useCurrencyRateStore } from "../store/currencyRateStore";

const AUTO_REFRESH_MS = 24 * 60 * 60 * 1000;

export function useCurrencyRates() {
  const mode = useCurrencyRateStore((state) => state.mode);
  const rates = useCurrencyRateStore((state) => state.rates);
  const lastUpdatedAt = useCurrencyRateStore((state) => state.lastUpdatedAt);
  const lastProviderDate = useCurrencyRateStore((state) => state.lastProviderDate);
  const isLoading = useCurrencyRateStore((state) => state.isLoading);
  const error = useCurrencyRateStore((state) => state.error);
  const setRates = useCurrencyRateStore((state) => state.setRates);
  const setLoading = useCurrencyRateStore((state) => state.setLoading);
  const setError = useCurrencyRateStore((state) => state.setError);

  const refresh = useCallback(
    async (force = false) => {
      if (mode !== "auto") return false;

      if (!force && lastUpdatedAt) {
        const age = Date.now() - new Date(lastUpdatedAt).getTime();
        if (Number.isFinite(age) && age < AUTO_REFRESH_MS) {
          return true;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchOfficialCurrencyRates();
        setRates(result.rates, result.providerDate);
        return true;
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Kurslary täzeläp bolmady.",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [mode, lastUpdatedAt, setError, setLoading, setRates],
  );

  return {
    mode,
    rates,
    lastUpdatedAt,
    lastProviderDate,
    isLoading,
    error,
    refresh,
  };
}