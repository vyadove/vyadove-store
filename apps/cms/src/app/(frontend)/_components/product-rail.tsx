import { mapProducts } from "@/utils/map-products";
import { Text } from "@medusajs/ui";
import config from "@payload-config";
import { getPayload } from "payload";

import InteractiveLink from "./interactive-link";
import ProductPreview from "./product-preview";

export default async function ProductRail({ collection }: { collection: any }) {
    const payload = await getPayload({ config });
    const products = await payload.find({
        collection: "products",
        limit: 3,
        sort: "createdAt",
        where: {
            collections: {
                equals: collection.id,
            },
        },
    });

    const pricedProducts = mapProducts(products.docs);

    return (
        <div className="content-container py-12 small:py-24">
            <div className="flex justify-between mb-8">
                <Text className="txt-xlarge">{collection.title}</Text>
                <InteractiveLink href={`/collections/${collection.handle}`}>
                    View all
                </InteractiveLink>
            </div>
            <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
                {pricedProducts.map((product) => (
                    <li key={product.id}>
                        <ProductPreview isFeatured product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
