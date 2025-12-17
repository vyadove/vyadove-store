import type { Metadata } from "next";

import localFont from "next/font/local";
import { headers } from "next/headers";

import "@/app/globals.css";
import { publicUrl } from "@/env.mjs";
import { Providers } from "@/providers/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/hot-toast";

import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";

const sofiaPro = localFont({
  src: [
    {
      path: "./fonts/sofia-pro-az/SofiaProSemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProRegular.woff",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProRegularItalic.woff",
      weight: "normal",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProLight.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProExtraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProMedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProMediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProBoldItalic.woff",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProBold.woff",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProBlack.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProBlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--sofia-pro",
});

const sofiaProSoft = localFont({
  src: [
    {
      path: "./fonts/sofia-pro-az/SofiaProSoft-Regular.woff",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProSoft-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro-az/SofiaProSoft-Bold.woff",
      weight: "bold",
      style: "normal",
    },
  ],
  variable: "--sofia-pro-soft",
});

const generateMeta = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const siteUrl = publicUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Vyadove - ",
      template: `%s | Vyadove`,
    },
    description: "Gift Joy, Share Peace,  Celebrate Life - Vyadove",
    openGraph: {
      title: "Vyadove - ",
      description: "Gift Joy, Share Peace,  Celebrate Life - Vyadove",
      url: siteUrl,
      siteName: "Vyadove",
      images: [
        {
          url: `${siteUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: "Vyadove - Gift Joy, Share Peace,  Celebrate Life - Vyadove",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Vyadove - Gift Joy, Share Peace,  Celebrate Life - Vyadove",
      description: "Gift Joy, Share Peace,  Celebrate Life - Vyadove",
      images: [`${siteUrl}/opengraph-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    // manifest: `${siteUrl}/site.webmanifest`,
    // manifest: `${siteUrl}/webmanifest.ts`,
  } satisfies Metadata;
};

export const generateMetadata = async (): Promise<Metadata> => {
  // todo use this for i8n
  const t = await getTranslations("Global.metadata");

  return generateMeta({});
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Get detected currency from middleware (Vercel GeoIP)
  const headersList = await headers();
  const detectedCurrency = headersList.get("x-detected-currency") || undefined;

  return (
    <html
      className={`h-full antialiased ${sofiaProSoft.variable} ${sofiaPro.variable}  `}
      // className={`h-full antialiased `}
      lang={locale}
    >
      <body className="flex min-h-full flex-col">
        <Providers detectedCurrency={detectedCurrency}>
          <IntlClientProvider locale={locale} messages={messages}>
            <div
              className="flex min-h-full flex-1 flex-col"
              vaul-drawer-wrapper=""
            >
              {children}
            </div>
            <Toaster gutter={8} position="top-right" />
          </IntlClientProvider>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
