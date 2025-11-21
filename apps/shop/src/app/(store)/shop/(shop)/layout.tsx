import React from "react";

import FilterBar from "@/scenes/shop/components/filter-bar";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Badge } from "@ui/shadcn/badge";
import {
  TypographyH1,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 text-center lg:px-16 lg:pt-36 lg:pb-24">
          <Badge className="bg-accent-foreground text-accent rounded-full p-4 py-1">
            <TypographyP className="text-accent text-[1rem] font-light">
              Shop
            </TypographyP>
          </Badge>

          <TypographyH1 className="!text-6xl font-medium text-balance capitalize">
            Curated Gifts for Every Occasion and Personality.
          </TypographyH1>
          <TypographyLead className="font-light text-balance">
            Browse our selection designed to surprise, delight, and impress, and
            easily find the item that creates that unforgettable moment for your
            loved one.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      <div className="my-20 flex flex-col">
        <FilterBar />

        {children}
      </div>
    </div>
  );
};

export default Layout;
