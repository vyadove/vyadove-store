import { cn } from "@/lib/utils";

import { convertToLocale } from "@/utils/money";

type LineItemUnitPriceProps = {
  currencyCode: string;
  item: any;
  style?: "default" | "tight";
};

const LineItemUnitPrice = ({ currencyCode, item }: LineItemUnitPriceProps) => {
  return (
    <div className="text-ui-fg-muted flex h-full flex-col justify-center">
      <span
        className={cn("text-base-regular")}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: item.variant?.price || 0,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  );
};

export default LineItemUnitPrice;
