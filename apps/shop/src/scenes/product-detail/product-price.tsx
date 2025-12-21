"use client";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { TypographyH3 } from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { usePrice } from "@/components/price";

type ProductPriceProps = {
  variant?: Product["variants"];
};

export default function ProductPrice({ variant }: ProductPriceProps) {
  const { product, selectedVariant } = useProductDetailContext();
  const { format } = usePrice();

  if (!product || !selectedVariant) {
    return null;
  }

  const price = selectedVariant.price?.amount ?? 0;

  return (
    <div className="flex items-center gap-3">
      <TypographyH3
        className="font-sofia-soft font-normal"
        data-testid="product-price"
        data-value={price}
      >
        {format(price)}
      </TypographyH3>
    </div>
  );
}
