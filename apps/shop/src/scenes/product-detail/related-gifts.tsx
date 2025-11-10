import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@ui/shadcn/button";
import {
  TypographyH1,
  TypographyH3,
  TypographyH4,
  TypographyH6,
  TypographyLead,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import type { Product } from "@vyadove/types";

import InvertedCornerMask from "@/components/inverted-corner-mask";
import { ProductPreview } from "@/components/products/product-card";

import { getVariantImage } from "@/utils/get-variant-image";
import { payloadSdk } from "@/utils/payload-sdk";

export function RelatedGifts({ products }: { products: Product[] }) {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-8">
        <div>
          <TypographyH1 className="lg:text-4xl">
            Related Experiences
          </TypographyH1>

          <TypographyP className="text-muted-foreground max-w-xl">
            explore more related experiences
          </TypographyP>
        </div>

        <Button asChild className="border-none" size="lg" variant="outline">
          <VyaLink href="/">
            View All
            <AiOutlineArrowRight className="" />
          </VyaLink>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
