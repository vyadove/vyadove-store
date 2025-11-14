import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col flex-1">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col justify-items-start gap-4 px-8 py-32 pb-20 lg:px-16 lg:pt-32 lg:pb-20">
          <TypographyH1 className="font-medium text-balance capitalize">
            Track You Order
          </TypographyH1>

          <TypographyLead className="font-light text-balance">
            Stay updated with real-time tracking of your order.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
