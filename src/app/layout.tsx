import type { Metadata } from "next";

import { Funnel_Sans } from "next/font/google";

import "@/app/globals.css";
import { publicUrl } from "@/env.mjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/sonner";

import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";

const fontFunnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
});

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Global.metadata");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(publicUrl),
  };
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      className={`h-full antialiased ${fontFunnelSans.className}`}
      lang={locale}
    >
      <body className="flex min-h-full flex-col">
        <IntlClientProvider locale={locale} messages={messages}>
          <div
            className="flex min-h-full flex-1 flex-col bg-white"
            vaul-drawer-wrapper=""
          >
            {children}
          </div>
          <Toaster offset={10} position="top-center" />
        </IntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
