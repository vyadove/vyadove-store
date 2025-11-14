import { convertToLocale } from "@/utils/money";
import { cn } from "@/lib/utils";

export const getPercentageDiff = (original: number, calculated: number) => {
  const diff = original - calculated;
  const decrease = (diff / original) * 100;

  return decrease.toFixed();
};

type LineItemPriceProps = {
  cartTotal: number;
  currencyCode: string;
  originalPrice?: number;
  style?: "default" | "tight";
};

const LineItemPrice = ({
  cartTotal,
  currencyCode,
  originalPrice,
  style,
}: LineItemPriceProps) => {
  const hasReducedPrice = cartTotal < (originalPrice || cartTotal);

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-x-2">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span
                className="text-ui-fg-muted line-through "
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice || cartTotal,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && originalPrice && (
              <span className="text-muted-foreground">
                -{getPercentageDiff(originalPrice, cartTotal || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={cn("text-base-regular ", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: cartTotal,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  );
};

export default LineItemPrice;
