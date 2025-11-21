"use client";

import { CartProvider } from "react-use-cart";

import { AuthProvider } from "@/providers/auth";

import TanStackQueryProvider from "@/lib/tanstack-query-provider";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
      </CartProvider>
    </AuthProvider>
  );
};
