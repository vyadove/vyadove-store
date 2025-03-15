import { Text, clx } from "@medusajs/ui";
import { convertToLocale } from "../_util/money";

export default async function PreviewPrice({
    price,
    originalPrice,
	currency,
}: {
    price: any;
    originalPrice?: any;
	currency?: string;
}) {
    return (
        <>
            {originalPrice && (
                <Text
                    className="line-through text-ui-fg-muted"
                    data-testid="original-price"
                >
                    {convertToLocale({
                        amount: originalPrice,
                        currency_code: currency || "USD",
                    })}
                </Text>
            )}
            <Text
                className={clx("text-ui-fg-muted", {
                    "text-ui-fg-interactive": originalPrice,
                })}
                data-testid="price"
            >
                {convertToLocale({
                    amount: price,
                    currency_code: currency || "USD",
                })}
            </Text>
        </>
    );
}
