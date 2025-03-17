import config from "@payload-config";
import { getPayload, Sort } from "payload";

export const getVariants = async (variantIds: string[]) => {
    const payload = await getPayload({ config });

    const products = await payload.find({
        collection: "products",
        where: {
            "variants.id": {
                in: variantIds,
            },
        },
    });

    const variantsMap = new Map<string, any>();

    for (const product of products.docs) {
        for (const variant of product.variants) {
            if (variantIds.includes(variant.id || "")) {
                // Ensure gallery exists and defaults to product images if empty
                const variantGallery =
                    variant.gallery?.map((img: any) => img.url) || [];
                const firstVariantGallery =
                    product.variants[0]?.gallery?.map((img: any) => img.url) ||
                    [];

                variantsMap.set(variant.id || "", {
                    ...variant,
                    product: product.id,
                    imageUrl: variant.imageUrl || firstVariantGallery[0],
                    gallery:
                        variantGallery.length > 0
                            ? variantGallery
                            : firstVariantGallery,
                });
            }
        }
    }

    return variantIds.map((id) => variantsMap.get(id)).filter(Boolean);
};

export const getProducts = async (args: { [key: string]: string }) => {
    const key = Object.keys(args)[0];
    const value = args[key];
    const payload = await getPayload({ config });
    const products = await payload.find({
        collection: "products",
        limit: 1,
        where: {
            [key]: {
                equals: value,
            },
        },
    });
    return products.docs;
};

export const getPaginatedProducts = async ({
    limit = 12,
    page = 1,
    collectionId,
    productsIds,
    sortBy,
}: {
    limit?: number;
    page?: number;
    collectionId?: string;
    productsIds?: string[];
    sortBy?: string;
}) => {
    const payload = await getPayload({ config });

    let where = {};

    if (collectionId) {
        where = {
            ...where,
            "collection.id": {
                equals: collectionId,
            },
        };
    }

    if (productsIds && productsIds.length > 0) {
        where = {
            ...where,
            id: {
                in: productsIds,
            },
        };
    }

    const [sortName, sortDirection] = sortBy?.split("_") || [];

    const sort =
        sortDirection === "asc"
            ? `variants.[0].${sortName}`
            : `-variants.[0].${sortName}`;

    const products = await payload.find({
        collection: "products",
        limit,
        page,
        where,
        sort
    });

    return {
        docs: products.docs,
        total: products.totalDocs,
        limit: products.limit,
        page: products.page,
        // pages: products.pages,
    };
};