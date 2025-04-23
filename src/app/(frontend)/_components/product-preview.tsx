import { Text } from "@medusajs/ui";
import Link from "next/link";

import PreviewPrice from "./price";
import Thumbnail from "./thumbnail";

export default function ProductPreview({
    isFeatured,
    product,
}: {
    isFeatured?: boolean;
    product: any;
}) {
    const { originalPrice, price } = product.variants?.[0] || {};
    return (
        <Link className="group" href={`/products/${product.handle}`}>
            <div data-testid="product-wrapper">
                <Thumbnail
                    images={product.images}
                    isFeatured={isFeatured}
                    size="full"
                    thumbnail={product.variants[0]?.imageUrl}
                />
                <div className="flex txt-compact-medium mt-4 justify-between">
                    <Text
                        className="text-ui-fg-subtle"
                        data-testid="product-title"
                    >
                        {product.title}
                    </Text>
                    <div className="flex items-center gap-x-2">
                        <PreviewPrice
                            currency={product.currency}
                            originalPrice={originalPrice}
                            price={price}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
