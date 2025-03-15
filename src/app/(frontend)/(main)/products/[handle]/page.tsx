import ProductTemplate from "@/app/(frontend)/_templates/product";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { mapProducts } from "@/utilities/map-products";

type ProductPageProps = {
    params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
    try {
        const products = [
            {
                handle: "product-1",
                title: "Product 1",
                description: "Product 1 description",
                thumbnail:
                    "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
            },
        ];

        return products.map((product: any) => ({
            handle: product.handle,
        }));
    } catch (error) {
        console.error(
            `Failed to generate static paths for product pages: ${
                error instanceof Error ? error.message : "Unknown error"
            }.`
        );
        return [];
    }
}

export async function generateMetadata(
    props: ProductPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { handle } = params;

    const product = {
        title: "Product 1",
        handle,
        thumbnail:
            "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
    };

    if (!product) {
        notFound();
    }

    return {
        title: `${product.title} | Medusa Store`,
        description: `${product.title}`,
        openGraph: {
            title: `${product.title} | Medusa Store`,
            description: `${product.title}`,
            images: product.thumbnail ? [product.thumbnail] : [],
        },
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
