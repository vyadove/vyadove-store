"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "react-use";

import type { CurrencyConfigResponse } from "@/app/api/currency-config/route";

import type {
  ExchangeRates,
  PriceRoundingRule,
  RoundingRule,
} from "@/services/currency";
import { applyRounding, getRoundingRule } from "@/services/currency";

type CurrencyContextType = {
  /** Currently selected currency */
  currency: string;
  /** List of available currencies (from CMS StoreSettings) */
  supportedCurrencies: string[];
  /** Base currency (products are priced in this) */
  baseCurrency: string;
  /** Current exchange rates */
  rates: ExchangeRates;
  /** Whether currency config is loading from CMS */
  isLoading: boolean;
  /** Detected currency from GeoIP (if available) */
  detectedCurrency?: string;
  /** Default rounding rule */
  defaultRoundingRule: RoundingRule;
  /** Per-currency rounding rules */
  priceRoundingRules: PriceRoundingRule[];
  /** Change the selected currency */
  setCurrency: (currency: string) => void;
  /** Convert amount from base currency to selected currency (with rounding) */
  convert: (amount: number, fromCurrency?: string) => number;
  /** Format amount in selected currency (with rounding) */
  formatPrice: (amount: number, fromCurrency?: string) => string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = "vyadove-currency";

type CurrencyProviderProps = {
  children: ReactNode;
  /** Currency detected from GeoIP via Vercel headers (passed from server) */
  detectedCurrency?: string;
};

export function CurrencyProvider({
  children,
  detectedCurrency,
}: CurrencyProviderProps) {
  const [storedCurrency, setStoredCurrency] =
    useLocalStorage<string>(STORAGE_KEY);
  const [currency, setCurrencyState] = useState<string>(
    storedCurrency || "USD",
  );
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([
    "USD",
  ]);

  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [rates, setRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [defaultRoundingRule, setDefaultRoundingRule] =
    useState<RoundingRule>("charm");
  const [priceRoundingRules, setPriceRoundingRules] = useState<
    PriceRoundingRule[]
  >([]);

  // Fetch currency config from CMS on mount
  useEffect(() => {
    const fetchCurrencyConfig = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/currency-config");

        if (response.ok) {
          const data = (await response.json()) as CurrencyConfigResponse;

          // Update state with CMS data
          const supported = data.supportedCurrencies || ["USD"];
          const base = data.baseCurrency || "USD";

          setSupportedCurrencies(supported);
          setBaseCurrency(base);
          setRates(data.rates || {});
          setDefaultRoundingRule(data.defaultRoundingRule || "charm");
          setPriceRoundingRules(data.priceRoundingRules || []);

          // Currency priority: localStorage > GeoIP detected > base currency
          if (storedCurrency && supported.includes(storedCurrency)) {
            // User has a saved preference and it's valid - keep it
            setCurrencyState(storedCurrency);
          } else if (detectedCurrency && supported.includes(detectedCurrency)) {
            // No saved preference, but GeoIP detected a supported currency
            setCurrencyState(detectedCurrency);
            setStoredCurrency(detectedCurrency);
          } else {
            // Fallback to base currency
            setCurrencyState(base);

            if (storedCurrency && !supported.includes(storedCurrency)) {
              // Clear invalid stored currency
              setStoredCurrency(base);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch currency config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyConfig();
  }, [detectedCurrency]);

  const setCurrency = useCallback(
    (newCurrency: string) => {
      if (supportedCurrencies.includes(newCurrency)) {
        setCurrencyState(newCurrency);
        setStoredCurrency(newCurrency);
      }
    },
    [supportedCurrencies, setStoredCurrency],
  );

  const convert = useCallback(
    (amount: number, fromCurrency: string = baseCurrency): number => {
      if (fromCurrency === currency) {
        // No conversion needed, but still apply rounding for display consistency
        const rule = getRoundingRule(
          currency,
          defaultRoundingRule,
          priceRoundingRules,
        );

        return applyRounding(amount, rule);
      }

      const fromRate = rates[fromCurrency] || 1;
      const toRate = rates[currency] || 1;

      // Convert: amount in base → target
      const converted = (amount / fromRate) * toRate;

      // Apply rounding based on target currency rule
      const rule = getRoundingRule(
        currency,
        defaultRoundingRule,
        priceRoundingRules,
      );

      return applyRounding(converted, rule);
    },
    [currency, baseCurrency, rates, defaultRoundingRule, priceRoundingRules],
  );

  const formatPrice = useCallback(
    (amount: number, fromCurrency: string = baseCurrency): string => {
      const converted = convert(amount, fromCurrency);

      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(converted);
      } catch {
        // Fallback for invalid currency codes
        return `${currency} ${converted.toFixed(2)}`;
      }
    },
    [convert, currency, baseCurrency],
  );

  const value = useMemo<CurrencyContextType>(
    () => ({
      currency,
      supportedCurrencies,
      baseCurrency,
      rates,
      isLoading,
      detectedCurrency,
      defaultRoundingRule,
      priceRoundingRules,
      setCurrency,
      convert,
      formatPrice,
    }),
    [
      currency,
      supportedCurrencies,
      baseCurrency,
      rates,
      isLoading,
      detectedCurrency,
      defaultRoundingRule,
      priceRoundingRules,
      setCurrency,
      convert,
      formatPrice,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}

/**
 * Safe hook that returns null if outside provider (for optional currency support)
 */
export function useCurrencyOptional() {
  return useContext(CurrencyContext);
}
