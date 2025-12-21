import React, { Suspense } from "react";

import FilterBar from "@/scenes/shop/components/filter-bar";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Badge } from "@ui/shadcn/badge";
import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";

const Layout = async ({ children }: React.PropsWithChildren) => {
  return (
    <div>
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col items-start gap-2 px-8 py-36 pb-20 text-center_ lg:px-16 lg:pt-36 lg:pb-24">
          <Badge className="rounded-full p-4 py-1 hidden">
            <TypographyP className="text-accent text-[1rem] font-light">
              Shop
            </TypographyP>
          </Badge>

          <TypographyH2 className="!text-5xl font-medium text-balance capitalize text-green-950">
            Curated Gifts for Every <br /> Occasion and Personality.
          </TypographyH2>
          <TypographyP className="font-light text-balance text-muted-foreground">
            Explore our curated categories — something for every taste and
            occasion.
          </TypographyP>
        </div>
      </AppHeroScaffold>

      <div className="my-20 flex flex-col">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>

        {children}
      </div>
    </div>
  );
};

export default Layout;
