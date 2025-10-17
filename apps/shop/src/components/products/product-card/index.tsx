import Link from "next/link";

import PreviewPrice from "./price";
import Thumbnail from "./thumbnail";
import type { Product } from "@shopnex/types";
import { getVariantImage } from "@/utils/get-variant-image";
import { TypographyH4 } from "@ui/shadcn/typography";

export default function ProductPreview({
    isFeatured,
    product,
}: {
    isFeatured?: boolean;
    product: Product;
}) {
    const { originalPrice, price } = product.variants?.[0] || {};
    const variantWithImage = product.variants?.find((v) => {
        return getVariantImage(v);
    });
    const thumbnail = getVariantImage(
        variantWithImage as Product["variants"][0]
    );

    return (
        <Link className="group" href={`/products/${product.handle}`}>

            <div data-testid="product-wrapper">
                <Thumbnail
                    isFeatured={isFeatured}
                    size="full"
                    thumbnail={thumbnail}
                />
                <div className="txt-compact-medium mt-4 flex justify-between">
                    <TypographyH4
                        className="text-ui-fg-subtle"
                        data-testid="product-title"
                    >
                        {product.title}
                    </TypographyH4>
                    <div className="flex items-center gap-x-2">
                        <PreviewPrice
                            price={{
                                currency: product.currency,
                                original_price: originalPrice,
                                calculated_price: price,
                                // price_type: price.
                            }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
