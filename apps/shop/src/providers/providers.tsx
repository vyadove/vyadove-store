"use client";

import { AuthProvider } from "@/providers/auth";
import { CheckoutProvider } from "@/providers/checkout";

import TanStackQueryProvider from "@/lib/tanstack-query-provider";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <AuthProvider>
      <TanStackQueryProvider>
        <CheckoutProvider>{children}</CheckoutProvider>
      </TanStackQueryProvider>
    </AuthProvider>
  );
};
