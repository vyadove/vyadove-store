import type { Metadata } from "next";

import "@/app/globals.css";
import { publicUrl } from "@/env.mjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/sonner";

import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";
import localFont from 'next/font/local';

const sofiaPro = localFont({
  src: [
    {path: './fonts/sofia-pro/SofiaProSemiBold.woff2', weight: '600', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProRegular.woff2', weight: 'normal', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProRegular-Italic.woff2', weight: 'normal', style: 'italic'},
    {path: './fonts/sofia-pro/SofiaProLight.woff2', weight: '300', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProExtraLight.woff2', weight: '200', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProMedium.woff2', weight: '500', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProMedium-Italic.woff2', weight: '500', style: 'italic'},
    {path: './fonts/sofia-pro/SofiaProBold-Italic.woff2', weight: 'bold', style: 'italic'},
    {path: './fonts/sofia-pro/SofiaProBold.woff2', weight: 'bold', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProBlack.woff2', weight: '900', style: 'normal'},
    {path: './fonts/sofia-pro/SofiaProBlack-Italic.woff2', weight: '900', style: 'italic'},
  ],
  variable: '--sofia-pro',
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
      className={`h-full antialiased ${sofiaPro.variable}  `}
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
