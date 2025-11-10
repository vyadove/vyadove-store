import type { Metadata } from "next";

import "@/app/globals.css";
import { config } from "@/store.config";
import { Footer } from "@/ui/footer/footer";
import { accountToWebsiteJsonLd, JsonLd } from "@/ui/json-ld";
import { Nav } from "@ui/nav/nav";

import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/cart-context";

// todo -> metadata needs to be fixed properly
// export const metadata: Metadata = {
//   title: {
//     absolute: config.store.metadata.title.absolute,
//     default: config.store.metadata.title.default,
//     template: config.store.metadata.title.template,
//   },
//   description: config.store.metadata.description,
//   openGraph: {
//     title: config.store.metadata.title.default,
//     description: config.store.metadata.description,
//     // images: [
//     // 	signOgImageUrl({
//     // 		title: config.store.name,
//     // 	}),
//     // ],
//   },
// };

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TooltipProvider>
        <Nav />

        <main className="mx-auto flex w-full max-w-[var(--app-width)] flex-1 flex-col px-4 pt-4 pb-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </TooltipProvider>
      <JsonLd
        jsonLd={accountToWebsiteJsonLd({
          account: null,
          logoUrl: null,
        })}
      />
    </>
  );
}
