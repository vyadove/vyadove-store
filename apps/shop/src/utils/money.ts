import { getStoreSettings } from "@/services/store-settings";

import { isEmpty } from "./isEmpty";

type ConvertToLocaleParams = {
  amount: number;
  currency_code?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  minimumIntegerDigits?: number;
  hiddeCurrency?: boolean;
};

export const convertToLocale = ({
  amount,
  currency_code = "ETB",
  locale = "en-US",
  maximumFractionDigits,
  minimumFractionDigits = 0,
  minimumIntegerDigits = 1,
  hiddeCurrency,
}: ConvertToLocaleParams) => {
  const storeConfig = getStoreSettings();

  const value = new Intl.NumberFormat(locale, {
    currency: currency_code || storeConfig?.currency,
    maximumFractionDigits,
    minimumIntegerDigits,
    minimumFractionDigits,
    style: "currency",
  }).format(amount);

  if (hiddeCurrency) {
    const parts = value.split(/[\s\d.,]+/);

    return value.replace(parts[0] || '', "").trim();
  }

  return value;
};
