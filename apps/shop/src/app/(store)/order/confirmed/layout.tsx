import React from "react";
import { FaCheckCircle } from "react-icons/fa";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col justify-center gap-4 px-8 py-32 pb-20 text-center lg:px-16 lg:pt-32 lg:pb-20">
          <TypographyH1 className="mx-auto inline-flex items-center gap-2 font-medium text-balance capitalize">
            <FaCheckCircle className="text-accent size-16" />
            Thank you!
          </TypographyH1>

          <TypographyLead className="font-light text-balance">
            Your order was placed successfully.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
