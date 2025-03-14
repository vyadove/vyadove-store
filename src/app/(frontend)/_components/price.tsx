import { Text, clx } from "@medusajs/ui";

export default async function PreviewPrice({
    price,
    originalPrice,
}: {
    price: any;
    originalPrice?: any;
}) {
    return (
        <>
            {originalPrice && (
                <Text
                    className="line-through text-ui-fg-muted"
                    data-testid="original-price"
                >
                    ${originalPrice}
                </Text>
            )}
            <Text
                className={clx("text-ui-fg-muted", {
                    "text-ui-fg-interactive": originalPrice,
                })}
                data-testid="price"
            >
                ${price}
            </Text>
        </>
    );
}
