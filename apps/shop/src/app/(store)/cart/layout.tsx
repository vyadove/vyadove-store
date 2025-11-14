import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyH2, TypographyLead } from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col flex-1">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col justify-items-start  px-8 py-32 pb-20 lg:px-16 lg:pt-32 lg:pb-20">
          <TypographyH2 className=" text-balance capitalize">
           The Basket is Almost Yours!
          </TypographyH2>
          <TypographyLead className="font-light text-balance">
            Review your items and proceed to checkout to complete your purchase.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
