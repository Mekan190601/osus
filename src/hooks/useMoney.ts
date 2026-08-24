import { useCallback } from "react";

import { useSettingsStore } from "../store/settingsStore";
import { useCurrencyRateStore } from "../store/currencyRateStore";
import { formatMoney } from "../utils/formatMoney";

export function useMoney() {
  const currency = useSettingsStore((state) => state.currency);
  const rates = useCurrencyRateStore((state) => state.rates);

  const convertFromTMT = useCallback(
    (valueInTMT: number, targetCurrency = currency) => {
      if (targetCurrency === "TMT") return valueInTMT;

      const tmtPerUnit = rates[targetCurrency];
      if (!Number.isFinite(tmtPerUnit) || tmtPerUnit <= 0) {
        return valueInTMT;
      }

      return valueInTMT / tmtPerUnit;
    },
    [currency, rates],
  );

  const convertToTMT = useCallback(
    (value: number, sourceCurrency = currency) => {
      if (sourceCurrency === "TMT") return value;

      const tmtPerUnit = rates[sourceCurrency];
      if (!Number.isFinite(tmtPerUnit) || tmtPerUnit <= 0) {
        return value;
      }

      return value * tmtPerUnit;
    },
    [currency, rates],
  );

  const money = useCallback(
    (valueInTMT: number) =>
      formatMoney(convertFromTMT(valueInTMT, currency), currency),
    [convertFromTMT, currency],
  );

  return {
    currency,
    rates,
    money,
    convertFromTMT,
    convertToTMT,
  };
}