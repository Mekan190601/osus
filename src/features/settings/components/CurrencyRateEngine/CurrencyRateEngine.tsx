import { useEffect } from "react";

import { useCurrencyRates } from "../../../../hooks/useCurrencyRates";

export default function CurrencyRateEngine() {
  const { mode, refresh } = useCurrencyRates();

  useEffect(() => {
    if (mode !== "auto") {
      return;
    }

    void refresh();

    const interval = window.setInterval(() => {
      void refresh();
    }, 60 * 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [mode, refresh]);

  return null;
}