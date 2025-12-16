import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import { Button } from "@ui/shadcn/button";
import { TypographyH1, TypographyP } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import { ProductPreview } from "@/components/products/product-card";

import { payloadSdk } from "@/utils/payload-sdk";

export async function PopularGifts() {
  const featuredCollections = await payloadSdk.find({
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
  });

  return (
    <div className="mt-24 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-8">
        <div>
          <TypographyH1 className="lg:text-4xl">
            Most Popular Gifts
          </TypographyH1>

          <TypographyP className="text-muted-foreground max-w-xl">
            Our top used lists
          </TypographyP>
        </div>

        <Button asChild className="border-none" size="lg" variant="outline">
          <VyaLink href="/apps/shop/public">
            View All
            <AiOutlineArrowRight className="" />
          </VyaLink>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.docs.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
