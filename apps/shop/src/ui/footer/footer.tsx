import type { SVGAttributes } from "react";

import StoreConfig from "@/store.config";
import { Newsletter } from "@/ui/footer/newsletter.client";
import {
  TypographyH2,
  TypographyH4,
  TypographyMuted,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import VyaDoveLogo from "@/components/icons";
import InvertedCornerMask from "@/components/inverted-corner-mask";

import { getTranslations } from "@/i18n/server";

const sections = [
  {
    header: "Products",
    links: StoreConfig.categories.map(({ name, slug }) => ({
      label: name,
      href: `/category/${slug}`,
    })),
  },
  {
    header: "Support",
    links: [
      {
        label: "Features",
        href: "https://yournextstore.com/#features",
      },
      {
        label: "Pricing",
        href: "https://yournextstore.com/#pricing",
      },
      {
        label: "Contact Us",
        href: "mailto:hi@yournextstore.com",
      },
    ],
  },
];

export async function Footer() {
  const t = await getTranslations("Global.footer");

  return (
    <footer className="mx-auto flex w-full max-w-[var(--app-width)] flex-1 flex-col px-4 pt-4 pb-6 sm:px-6 lg:px-8">
      <InvertedCornerMask
        // className="mx-auto w-full max-w-full"
        className="flex w-full bg-linear-45 from-[rgba(243,224,214,1)] from-20%  to-green-900/50 bg-[length:140%_100%] "
        cornerContent={
          <div className="flex items-center justify-center gap-4 px-8 py-2">
            <VyaDoveLogo />
          </div>
        }
        cornersRadius={20}
        invertedCorners={{
          tl: { inverted: true, corners: [20, 20, 20] },
        }}
      >
        <div className="mx-auto flex w-full flex-col gap-8 p-6 pt-36 md:p-20 ">
          <TypographyH2 className="mx-auto">
            “Vyadove — Gift Joy. Share Peace.”
          </TypographyH2>

          <div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
            <div className="">
              <div className="flex w-full flex-col gap-5">
                <div className="flex flex-col">
                  <TypographyH4 className="font-semibold">
                    {t("newsletterTitle")}
                  </TypographyH4>
                  <TypographyMuted>
                    Be the first to know about new products and exclusive
                    offers.
                  </TypographyMuted>
                </div>

                <Newsletter />

                <div className="item-center flex gap-2">
                  <TypographyMuted>
                    We Care about your date in our{" "}
                    <VyaLink
                      className="underline underline-offset-4"
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </VyaLink>
                    .
                  </TypographyMuted>
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-16">
              {sections.map((section) => (
                <section key={section.header}>
                  <TypographyH4 className="mb-2">{section.header}</TypographyH4>
                  <ul className="grid gap-1" role="list">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <VyaLink
                          className="underline-offset-4 hover:underline"
                          href={link.href}
                        >
                          {link.label}
                        </VyaLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>
          </div>

          <hr />

          <div className="container flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center justify-center gap-4">
              <VyaDoveLogo className="h-max w-24" />

              <TypographyMuted>
                © {new Date().getFullYear()} Vyadove. All right reserved.
              </TypographyMuted>
            </div>
            <div className="flex items-center gap-4">
              <VyaLink
                className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700"
                href="https://x.com/vyadove"
              >
                <TwitterIcon className="h-4 w-4 text-black" /> @vyadove
                <span className="sr-only">Twitter</span>
              </VyaLink>
              <VyaLink
                className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700"
                href="https://x.com/typeofweb"
              >
                <TwitterIcon className="h-4 w-4" /> @vyadove
                <span className="sr-only">Twitter</span>
              </VyaLink>
            </div>
          </div>
        </div>
      </InvertedCornerMask>
    </footer>
  );
}

function TwitterIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 596 596"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m1 19 230 307L0 577h52l203-219 164 219h177L353 252 568 19h-52L329 221 179 19H1Zm77 38h82l359 481h-81L78 57Z"
        fill="#123"
      />
    </svg>
  );
}
