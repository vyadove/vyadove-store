import type { Product } from "@/payload-types";
import { clx } from "@medusajs/ui";

type ProductPriceProps = {
    variant?: Product["variants"][0];
    showFrom: boolean;
};

export default function ProductPrice({ variant, showFrom }: ProductPriceProps) {
    if (!variant) return null;

    const { price, originalPrice } = variant;
    const isOnSale = originalPrice && originalPrice > price;
    const percentageDiff = isOnSale
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <div className="flex flex-col text-ui-fg-base">
            <span
                className={clx("text-xl-semi", {
                    "text-ui-fg-interactive": isOnSale,
                })}
            >
                {showFrom && "From "}
                <span data-testid="product-price" data-value={price}>
                    ${price}
                </span>
            </span>
            {isOnSale && (
                <>
                    <p>
                        <span className="text-ui-fg-subtle">Original: </span>
                        <span
                            className="line-through"
                            data-testid="original-product-price"
                            data-value={originalPrice}
                        >
                            ${originalPrice}
                        </span>
                    </p>
                    <span className="text-ui-fg-interactive">
                        -{percentageDiff}%
                    </span>
                </>
            )}
        </div>
    );
}
