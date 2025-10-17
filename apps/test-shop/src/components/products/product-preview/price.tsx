import { clx, Text } from "@medusajs/ui";

export default function PreviewPrice({ price }: { price: any }) {
    if (!price) {
        return null;
    }

    return (
        <>
            {price.price_type === "sale" && (
                <Text
                    className="line-through text-ui-fg-muted"
                    data-testid="original-price"
                >
                    {price.original_price}
                </Text>
            )}
            <Text
                className={clx("text-ui-fg-muted", {
                    "text-ui-fg-interactive": price.price_type === "sale",
                })}
                data-testid="price"
            >
                {price.calculated_price}
            </Text>
        </>
    );
}
