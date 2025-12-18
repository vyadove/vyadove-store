import { unstable_cache } from "next/cache";

import { CacheTags } from "@vyadove/types/cache";

// Currency codes are dynamic - sourced from CMS StoreSettings
export type ExchangeRates = Record<string, number>;

export type ExchangeRateOverride = {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
};

export type RoundingRule = "charm" | "clean" | "none";

export type PriceRoundingRule = {
  currency: string;
  rule: RoundingRule;
};

export type CurrencyConfig = {
  baseCurrency: string;
  supportedCurrencies: string[];
  exchangeRateSource: "api" | "manual";
  exchangeRateOverrides?: ExchangeRateOverride[];
  defaultRoundingRule?: RoundingRule;
  priceRoundingRules?: PriceRoundingRule[];
};

// Fallback rate for USD (base) - other rates fetched from API
const FALLBACK_BASE_RATE = 1;

// Cache exchange rates for 24 hours
const CACHE_DURATION = 60 * 60 * 24;

/**
 * Fetch exchange rates from ExchangeRate-API (free tier: 1500 req/mo)
 */
async function fetchExchangeRatesFromAPI(
  baseCurrency: string,
): Promise<ExchangeRates | null> {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { next: { revalidate: CACHE_DURATION } },
    );

    if (!response.ok) {
      console.error("Exchange rate API error:", response.status);

      return null;
    }

    const data: any = await response.json();

    return data?.rates as ExchangeRates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    return null;
  }
}

/**
 * Get cached exchange rates
 */
export const getExchangeRates = unstable_cache(
  async (config: CurrencyConfig): Promise<ExchangeRates> => {
    const {
      baseCurrency,
      supportedCurrencies,
      exchangeRateSource,
      exchangeRateOverrides,
    } = config;

    // Initialize with base currency rate of 1
    let rates: ExchangeRates = { [baseCurrency]: FALLBACK_BASE_RATE };

    // Fetch from API if configured
    if (exchangeRateSource === "api") {
      const apiRates = await fetchExchangeRatesFromAPI(baseCurrency);

      if (apiRates) {
        rates = apiRates;
      }
    }

    // Apply manual overrides
    if (exchangeRateOverrides?.length) {
      for (const override of exchangeRateOverrides) {
        if (override.fromCurrency === baseCurrency) {
          rates[override.toCurrency] = override.rate;
        }
      }
    }

    // Ensure all supported currencies have a rate (fallback to 1 if missing)
    for (const currency of supportedCurrencies) {
      if (!(currency in rates)) {
        console.warn(`Missing exchange rate for ${currency}, defaulting to 1`);
        rates[currency] = 1;
      }
    }

    return rates;
  },
  [CacheTags.EXCHANGE_RATES],
  { revalidate: CACHE_DURATION, tags: [CacheTags.EXCHANGE_RATES] },
);

/**
 * Convert price from one currency to another
 */
export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates,
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert via base currency rates
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // amount in base = amount / fromRate
  // amount in target = amountInBase * toRate
  const converted = (amount / fromRate) * toRate;

  // Round to 2 decimal places
  return Math.round(converted * 100) / 100;
}

/**
 * Get currency symbol using Intl API (dynamic, no hardcoding)
 */
export function getCurrencySymbol(currency: string, locale = "en-US"): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);

    const symbolPart = parts.find((part) => part.type === "currency");

    return symbolPart?.value || currency;
  } catch {
    return currency;
  }
}

/**
 * Get currency display name using Intl API (dynamic, no hardcoding)
 */
export function getCurrencyName(currency: string, locale = "en-US"): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: "currency" });

    return displayNames.of(currency) || currency;
  } catch {
    return currency;
  }
}

/**
 * Get country flag emoji from currency code (best effort mapping)
 */
export function getCurrencyFlag(currency: string): string {
  // Common currency to country mappings
  const currencyToCountry: Record<string, string> = {
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    ETB: "ET",
    JPY: "JP",
    CNY: "CN",
    INR: "IN",
    CAD: "CA",
    AUD: "AU",
    CHF: "CH",
    KRW: "KR",
    BRL: "BR",
    MXN: "MX",
    RUB: "RU",
    ZAR: "ZA",
    SGD: "SG",
    HKD: "HK",
    NOK: "NO",
    SEK: "SE",
    DKK: "DK",
    NZD: "NZ",
    THB: "TH",
    MYR: "MY",
    IDR: "ID",
    PHP: "PH",
    PLN: "PL",
    TRY: "TR",
    AED: "AE",
    SAR: "SA",
    EGP: "EG",
    NGN: "NG",
    KES: "KE",
  };

  const countryCode = currencyToCountry[currency];

  if (!countryCode) return "🏳️";

  // Convert country code to flag emoji
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

/**
 * Apply price rounding based on rule
 * - charm: Round to nearest .99 (e.g., 27.43 → 26.99 or 27.99)
 * - clean: Round to whole number (e.g., 27.43 → 27)
 * - none: No rounding (keep 2 decimal places)
 */
export function applyRounding(
  amount: number,
  rule: RoundingRule = "charm",
): number {
  switch (rule) {
    case "charm": {
      // Round to nearest .99
      // e.g., 27.43 → 27.99, 27.01 → 26.99
      const floor = Math.floor(amount);
      const decimal = amount - floor;

      // If decimal is <= 0.49, round down to previous .99
      // If decimal is > 0.49, round up to current .99
      if (decimal <= 0.49) {
        return floor - 0.01;
      }

      return floor + 0.99;
    }

    case "clean": {
      // Round to nearest whole number
      return Math.round(amount);
    }

    case "none":

    default: {
      // Keep 2 decimal places
      return Math.round(amount * 100) / 100;
    }
  }
}

/**
 * Get rounding rule for a specific currency
 */
export function getRoundingRule(
  currency: string,
  defaultRule: RoundingRule = "charm",
  perCurrencyRules?: PriceRoundingRule[],
): RoundingRule {
  const currencyRule = perCurrencyRules?.find((r) => r.currency === currency);

  return currencyRule?.rule || defaultRule;
}
