import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Badge } from "@ui/shadcn/badge";
import { TypographyH3, TypographyH4 } from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { convertToLocale } from "@/utils/money";

type ProductPriceProps = {
  variant?: Product["variants"];
};

export default function ProductPrice({ variant }: ProductPriceProps) {
  const { product, selectedVariant } = useProductDetailContext();

  if (!product || !selectedVariant) {
    return null;
  }

  const { price, originalPrice } = selectedVariant;

  const isOnSale = originalPrice && originalPrice > price;
  const percentageDiff = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3">
      <TypographyH3
        className="font-sofia-soft font-normal"
        data-testid="product-price"
        data-value={price}
      >
        {convertToLocale({
          amount: price,
        })}
      </TypographyH3>

      {isOnSale && (
        <>
          <TypographyH4
            className="font-normal text-gray-400 line-through"
            data-testid="original-product-price"
            data-value={originalPrice}
          >
            {convertToLocale({
              amount: price,
            })}
          </TypographyH4>

          <Badge className="" variant="secondary">
            -{percentageDiff}%
          </Badge>
        </>
      )}
    </div>
  );
}
