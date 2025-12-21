import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyP } from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col justify-items-startd px-8 py-32 pb-20 lg:px-16 lg:pt-32 lg:pb-20 gap-2">
          <TypographyH1 className="!text-3xl font-bold text-balance text-primary">
            Secure Checkout. Final Step.
          </TypographyH1>
          <TypographyP className="font-light text-balance text-muted-foreground">
            Your gift details are safe with us. Review your order and confirm
            your purchase below.
          </TypographyP>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
