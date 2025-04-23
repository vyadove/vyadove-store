import type { Metadata } from "next";

import ProductTemplate from "@/app/(frontend)/_templates/product";
import { mapProducts } from "@/utils/map-products";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type ProductPageProps = {
    params: Promise<{ handle: string }>;
};

export async function generateMetadata(
    props: ProductPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { handle } = params;

    const product = {
        handle,
        thumbnail:
            "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
        title: "Product 1",
    };

    if (!product) {
        notFound();
    }

    return {
        description: `${product.title}`,
        openGraph: {
            description: `${product.title}`,
            images: product.thumbnail ? [product.thumbnail] : [],
            title: `${product.title} | Medusa Store`,
        },
        title: `${product.title} | Medusa Store`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;

    const payload = await getPayload({ config });
    const product = await payload.find({
        collection: "products",
        limit: 1,
        where: {
            handle: {
                equals: params.handle,
            },
        },
    });

    const mappedProducts = mapProducts(product.docs);

    const pricedProduct = mappedProducts[0];

    if (!pricedProduct) {
        notFound();
    }

    return <ProductTemplate product={pricedProduct} />;
}
