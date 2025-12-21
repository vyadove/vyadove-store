import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH2, TypographyLead } from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col justify-items-startd px-8 py-32 pb-20 lg:px-16 lg:pt-32 lg:pb-20">
          <TypographyH2 className="font-medium text-balance capitalize">
            Secure Checkout. Final Step.
          </TypographyH2>
          <TypographyLead className="font-light text-balance">
            Your gift details are safe with us. Review your order and confirm
            your purchase below.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
