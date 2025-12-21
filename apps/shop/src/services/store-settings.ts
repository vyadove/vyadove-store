import { unstable_cache } from "next/cache";

import { CacheTags } from "@vyadove/types/cache";

import { payloadSdk } from "@/utils/payload-sdk";

import type {
  CurrencyConfig,
  PriceRoundingRule,
  RoundingRule,
} from "./currency";
import { getCurrencySymbol } from "./currency";

export type StoreSettings = {
  name: string;
  /** Base currency code (from CMS StoreSettings) */
  baseCurrency: string;
  /** Supported currency codes (from CMS StoreSettings) */
  supportedCurrencies: string[];
  exchangeRateSource: "api" | "manual";
  exchangeRateOverrides?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }[];
  /** Default rounding rule for all currencies */
  defaultRoundingRule: RoundingRule;
  /** Per-currency rounding overrides */
  priceRoundingRules: PriceRoundingRule[];
  // Legacy fields
  currency: string;
  currencyFormat: string;
  currencySymbol: string;
  dateFormat: string;
  locale: string;
  timeFormat: string;
  timezone: string;
};

// Minimal fallback (only used if CMS fetch fails completely)
const DEFAULT_SETTINGS: StoreSettings = {
  name: "Store",
  baseCurrency: "USD",
  supportedCurrencies: ["USD"], // Single currency fallback
  exchangeRateSource: "api",
  exchangeRateOverrides: [],
  defaultRoundingRule: "charm",
  priceRoundingRules: [],
  // Legacy defaults
  currency: "USD",
  currencyFormat: "symbol",
  currencySymbol: "$",
  dateFormat: "MMMM d, yyyy",
  locale: "en-US",
  timeFormat: "H:mm",
  timezone: "America/Los_Angeles",
};

/**
 * Fetch store settings from CMS (cached for 1 hour)
 */
export const fetchStoreSettings = unstable_cache(
  async (): Promise<StoreSettings> => {
    try {
      const settings = await payloadSdk.findGlobal({
        slug: "store-settings",
      });

      const baseCurrency =
        (settings.baseCurrency as string) || DEFAULT_SETTINGS.baseCurrency;

      return {
        name: settings.name || DEFAULT_SETTINGS.name,
        baseCurrency,
        supportedCurrencies:
          (settings.supportedCurrencies as string[]) ||
          DEFAULT_SETTINGS.supportedCurrencies,
        exchangeRateSource:
          (settings.exchangeRateSource as "api" | "manual") ||
          DEFAULT_SETTINGS.exchangeRateSource,
        exchangeRateOverrides:
          settings.exchangeRateOverrides?.map(
            (override: {
              fromCurrency: string;
              toCurrency: string;
              rate: number;
            }) => ({
              fromCurrency: override.fromCurrency,
              toCurrency: override.toCurrency,
              rate: override.rate,
            }),
          ) || [],
        defaultRoundingRule:
          (settings.defaultRoundingRule as RoundingRule) ||
          DEFAULT_SETTINGS.defaultRoundingRule,
        priceRoundingRules:
          settings.priceRoundingRules?.map(
            (rule: { currency: string; rule: RoundingRule }) => ({
              currency: rule.currency,
              rule: rule.rule,
            }),
          ) || [],
        // Legacy fields
        currency: baseCurrency,
        currencyFormat: DEFAULT_SETTINGS.currencyFormat,
        currencySymbol: getCurrencySymbol(baseCurrency),
        dateFormat: DEFAULT_SETTINGS.dateFormat,
        locale: DEFAULT_SETTINGS.locale,
        timeFormat: DEFAULT_SETTINGS.timeFormat,
        timezone: DEFAULT_SETTINGS.timezone,
      };
    } catch (error) {
      console.error("Failed to fetch store settings:", error);

      return DEFAULT_SETTINGS;
    }
  },
  [CacheTags.STORE_SETTINGS],
  { revalidate: 3600, tags: [CacheTags.STORE_SETTINGS] }, // 1 min cache (increase in prod)
);

/**
 * Synchronous getter for store settings (returns defaults, use fetchStoreSettings for CMS data)
 * @deprecated Use fetchStoreSettings() instead for CMS data
 */
export const getStoreSettings = (): StoreSettings => {
  return DEFAULT_SETTINGS;
};

/**
 * Extract currency config from store settings
 */
export function getCurrencyConfig(settings: StoreSettings): CurrencyConfig {
  return {
    baseCurrency: settings.baseCurrency,
    supportedCurrencies: settings.supportedCurrencies,
    exchangeRateSource: settings.exchangeRateSource,
    exchangeRateOverrides: settings.exchangeRateOverrides,
    defaultRoundingRule: settings.defaultRoundingRule,
    priceRoundingRules: settings.priceRoundingRules,
  };
}
