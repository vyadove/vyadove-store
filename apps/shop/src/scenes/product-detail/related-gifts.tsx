import React from "react";

import { TypographyH1, TypographyP } from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { ProductPreview } from "@/components/products/product-card";

export function RelatedGifts({ products }: { products: Product[] }) {
  return (
    <div className="my-20 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-8">
        <div>
          <TypographyH1 className="lg:text-4xl">
            Related Experiences
          </TypographyH1>

          <TypographyP className="text-muted-foreground max-w-xl">
            explore more related experiences
          </TypographyP>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
