import { NextResponse } from "next/server";

import type {
  ExchangeRates,
  PriceRoundingRule,
  RoundingRule,
} from "@/services/currency";
import { getExchangeRates } from "@/services/currency";
import {
  fetchStoreSettings,
  getCurrencyConfig,
} from "@/services/store-settings";

export type CurrencyConfigResponse = {
  baseCurrency: string;
  supportedCurrencies: string[];
  rates: ExchangeRates;
  defaultRoundingRule: RoundingRule;
  priceRoundingRules: PriceRoundingRule[];
  timestamp: number;
  error?: string;
};

export async function GET() {
  try {
    const settings = await fetchStoreSettings();
    const config = getCurrencyConfig(settings);
    const rates = await getExchangeRates(config);

    console.log("settings  --- : ", settings);

    return NextResponse.json<CurrencyConfigResponse>({
      baseCurrency: config.baseCurrency,
      supportedCurrencies: config.supportedCurrencies,
      rates,
      defaultRoundingRule: config.defaultRoundingRule || "charm",
      priceRoundingRules: config.priceRoundingRules || [],
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Return minimal fallback (USD only)
    return NextResponse.json<CurrencyConfigResponse>(
      {
        baseCurrency: "USD",
        supportedCurrencies: ["USD"],
        rates: { USD: 1 },
        defaultRoundingRule: "charm",
        priceRoundingRules: [],
        timestamp: Date.now(),
        error: "Failed to fetch from CMS",
      },
      { status: 200 },
    );
  }
}
