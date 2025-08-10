import type { Metadata } from "next";

import ProductTemplate from "@/templates/product";
import { notFound } from "next/navigation";
import { payloadSdk } from "@/utils/payload-sdk";

type ProductPageProps = {
    params: Promise<{ productHandle: string }>;
};

export async function generateMetadata(
    props: ProductPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { productHandle } = params;

    const result = await payloadSdk.find({
        collection: "products",
        limit: 1,
        where: {
            handle: {
                equals: productHandle,
            },
        },
        select: {
            title: true,
            meta: {
                title: true,
                description: true,
            },
        },
    });

    if (!result.docs.length) {
        notFound();
    }

    const product = result.docs[0];

    return {
        description: product.meta?.title || `${product.title}`, // Fallback to title if no meta description
        openGraph: {
            title: product.meta?.title || `${product.title} | ShopNex`, // Fallback if no meta title
            description: product.meta?.description || `${product.title}`,
            // images: product.thumbnail ? [product.thumbnail] : [],
        },
        title: product.meta?.title || `${product.title} | ShopNex`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;

    const product = await payloadSdk.find({
        collection: "products",
        limit: 1,
        where: {
            handle: {
                equals: params.productHandle,
            },
        },
    });

    if (!product.docs.length) {
        notFound();
    }

    return <ProductTemplate product={product.docs[0]} />;
}
