import type { Metadata } from "next";

import localFont from "next/font/local";

import "@/app/globals.css";
import { publicUrl } from "@/env.mjs";
import { Providers } from "@/providers/providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from "@/components/ui/sonner";

import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";

const sofiaPro = localFont({
  src: [
    {
      path: "./fonts/sofia-pro/SofiaProSemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProRegular.woff2",
      weight: "normal",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProRegular-Italic.woff2",
      weight: "normal",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro/SofiaProLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProMedium-Italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro/SofiaProBold-Italic.woff2",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./fonts/sofia-pro/SofiaProBold.woff2",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProBlack.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/sofia-pro/SofiaProBlack-Italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--sofia-pro",
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
    manifest: `${siteUrl}/site.webmanifest`,
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

  return (
    <html
      className={`h-full antialiased ${sofiaPro.className}  `}
      lang={locale}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <IntlClientProvider locale={locale} messages={messages}>
            <div
              className="flex min-h-full flex-1 flex-col"
              vaul-drawer-wrapper=""
            >
              {children}
            </div>
            <Toaster offset={10} position="top-center" />
          </IntlClientProvider>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
