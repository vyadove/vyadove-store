import { getStoreSettings } from "@/services/store-settings";

type ConvertToLocaleParams = {
  amount: number;
  currency_code?: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  minimumIntegerDigits?: number;
  hiddeCurrency?: boolean;
};

/**
 * Format amount to locale currency string
 * @deprecated For client components with currency selection, use useCurrency().formatPrice() instead
 */
export const convertToLocale = ({
  amount,
  currency_code,
  locale = "en-US",
  maximumFractionDigits,
  minimumFractionDigits = 0,
  minimumIntegerDigits = 1,
  hiddeCurrency,
}: ConvertToLocaleParams) => {
  const storeConfig = getStoreSettings();
  const currency = currency_code || storeConfig?.currency || "USD";

  const value = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits,
    minimumIntegerDigits,
    minimumFractionDigits,
    style: "currency",
  }).format(amount);

  if (hiddeCurrency) {
    const parts = value.split(/[\s\d.,]+/);

    return value.replace(parts[0] || "", "").trim();
  }

  return value;
};

/**
 * Format price with specific currency (for server components)
 */
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert and format price (for server components with known exchange rates)
 */
export function convertAndFormatPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  locale: string = "en-US",
): string {
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  const converted = (amount / fromRate) * toRate;
  const rounded = Math.round(converted * 100) / 100;

  return formatPrice(rounded, toCurrency, locale);
}
