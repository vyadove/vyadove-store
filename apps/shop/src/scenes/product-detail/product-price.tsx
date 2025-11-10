import { Badge } from "@ui/shadcn/badge";
import { TypographyH4 } from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { convertToLocale } from "@/utils/money";

type ProductPriceProps = {
  variant?: Product["variants"][0];
};

export default function ProductPrice({ variant }: ProductPriceProps) {
  if (!variant) {
    return null;
  }

  const { originalPrice, price } = variant;
  const isOnSale = originalPrice && originalPrice > price;
  const percentageDiff = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3">
      <TypographyH4 className="" data-testid="product-price" data-value={price}>
        {convertToLocale({
          amount: price,
        })}
      </TypographyH4>

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
