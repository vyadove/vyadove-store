import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Badge } from "@ui/shadcn/badge";
import {
  TypographyH1,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";

// import { payloadSdk } from "@/utils/payload-sdk";
// import { ProductPreview } from "@/components/products/product-card";

const Page = async () => {

 /* const featuredCollections = await payloadSdk.find({
    collection: "collections",
    limit: 1,
    where: {
      handle: {
        equals: "popular",
      },
    },
  });

  const products = await payloadSdk.find({
    collection: "products",
    // limit: 3,
    sort: "createdAt",
    where: {
      collections: {
        equals: featuredCollections?.docs[0]?.id,
      },
    },
  }); */

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



      <div>

        {/*<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.docs.map((product) => (
            <ProductPreview key={product.id} product={product} />
          ))}
        </div>*/}


      </div>


    </div>
  );
};

export default Page;
