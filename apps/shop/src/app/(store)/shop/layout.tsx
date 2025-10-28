import React from "react";



import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/radio-group";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Badge } from "@ui/shadcn/badge";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";



import { payloadSdk } from "@/utils/payload-sdk";
import { Label } from "@ui/shadcn/label";
import CollectionFilterClient from "@/app/(store)/shop/CollectionFilterNav";





// import { payloadSdk } from "@/utils/payload-sdk";
// import { ProductPreview } from "@/components/products/product-card";

/*Explore our curated categories — something for every taste and occasion.
Find gifts by category: for him, for her, for friends, for the home.
Browse by occasion, personality, or price to find the perfect match.
Handpicked collections to inspire thoughtful gifting.
Shop by theme: cozy, luxury, novelty, sustainable.*/

const Layout = async ({ children }: React.PropsWithChildren) => {
  const collections = await payloadSdk.find({
    collection: "collections",
    // limit: 1,
    where: {
      visible: {
        equals: true,
      },
    },
  });

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

      <div className="my-20 flex gap-10">
        <div className="flex max-w-[20rem] flex-col gap-2">
          <div className="flex flex-col gap-1">
            <TypographyH2>Shop</TypographyH2>
            <TypographyLead className='text-muted-foreground font-normal'>
              Find gifts by category: for him, for her, for friends, for the home.
            </TypographyLead>
          </div>

          <CollectionFilterClient collections={collections.docs || []}/>

        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;
