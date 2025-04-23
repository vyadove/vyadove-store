import type { Metadata } from "next";

import type { SortOptions } from "../../_util/sort-options";
import StoreTemplate from "../../_templates/store";
import { getPaginatedProducts } from "@/app/api/services/products";
import decimal from "decimal.js";

export const metadata: Metadata = {
    title: "Store",
    description: "Explore all of our products.",
};

type Params = {
    searchParams: Promise<{
        sortBy?: SortOptions;
        page?: string;
        collectionId?: string;
        productsIds?: string[];
    }>;
    params: Promise<{
        countryCode: string;
    }>;
};

export default async function StorePage(props: Params) {
    const searchParams = await props.searchParams;
    const { sortBy, page, collectionId, productsIds } = searchParams;

    const { docs: products, total } = await getPaginatedProducts({
        limit: 12,
        page: Number(page || 1),
        collectionId,
        productsIds,
    });

    const sortedProducts = products.sort((a, b) => {
        const [sortName, sortDirection] = sortBy?.split("_") || [];
        if (sortName === "createdAt") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }
        if (sortName === "price") {
            return (
                new decimal(b.variants[0].price)
                    .sub(new decimal(a.variants[0].price))
                    .toNumber() * (sortDirection === "asc" ? 1 : -1)
            );
        }
        return 0;
    });

    return (
        <StoreTemplate
            sortBy={sortBy}
            page={page}
            collectionId={collectionId}
            productsIds={productsIds}
            products={sortedProducts}
            totalPages={total}
        />
    );
}
