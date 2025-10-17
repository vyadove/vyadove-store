import { TypographyP } from "@ui/shadcn/typography";
import { clsx } from "clsx";

export default function PreviewPrice({ price }: { price: {
        currency?: string | null, originalPrice?: any
        price?: any, calculated_price?: any, price_type?: string,
        original_price?: any
    } }) {

    if (!price) {
        return null;
    }

    return (
        <>
            {price.price_type === "sale" && (
                <TypographyP
                    className="text-ui-fg-muted line-through"
                    data-testid="original-price"
                >
                    {price.original_price}
                </TypographyP>
            )}
            <TypographyP
                className={clsx("text-ui-fg-muted", {
                    "text-ui-fg-interactive": price.price_type === "sale",
                })}
                data-testid="price"
            >
                {price.calculated_price}
            </TypographyP>
        </>
    );
}
