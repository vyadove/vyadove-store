"use client";

import { AuthProvider } from "@/providers/auth";
import { CheckoutProvider } from "@/providers/checkout";
import { CurrencyProvider } from "@/providers/currency";

import TanStackQueryProvider from "@/lib/tanstack-query-provider";

type ProvidersProps = {
  children: React.ReactNode;
  /** Currency detected from GeoIP via Vercel headers */
  detectedCurrency?: string;
};

export const Providers: React.FC<ProvidersProps> = ({
  children,
  detectedCurrency,
}) => {
  return (
    <AuthProvider>
      <TanStackQueryProvider>
        <CurrencyProvider detectedCurrency={detectedCurrency}>
          <CheckoutProvider>{children}</CheckoutProvider>
        </CurrencyProvider>
      </TanStackQueryProvider>
    </AuthProvider>
  );
};
