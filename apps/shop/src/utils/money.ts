import { getStoreSettings } from "@/services/store-settings";

import { isEmpty } from "./isEmpty";

type ConvertToLocaleParams = {
  amount: number;
  currency_code?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export const convertToLocale = ({
  amount,
  currency_code = "ETB",
  locale = "en-US",
  maximumFractionDigits,
  minimumFractionDigits=0,
}: ConvertToLocaleParams) => {
  const storeConfig = getStoreSettings();

  return new Intl.NumberFormat(locale, {
    currency: currency_code || storeConfig?.currency,
    maximumFractionDigits,
    minimumFractionDigits,
    style: "currency",
  }).format(amount)
};
