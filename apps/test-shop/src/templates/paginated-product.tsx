import type { SortOptions } from "@/utils/sort-options";
import type { Product } from "@shopnex/types";

import { Pagination } from "@/components/pagination";
import ProductPreview from "@/components/product-preview";

const PRODUCT_LIMIT = 12;

type PaginatedProductsParams = {
    category_id?: string[];
    collection_id?: string[];
    id?: string[];
    limit: number;
    order?: string;
};

export default function PaginatedProducts({
    collectionId,
    page,
    products,
    productsIds,
    sortBy,
}: {
    collectionId?: number;
    page: number;
    products: Product[];
    productsIds?: string[];
    sortBy?: SortOptions;
}) {
    const queryParams: PaginatedProductsParams = {
        limit: 12,
    };

    if (collectionId) {
        queryParams["collection_id"] = [String(collectionId)];
    }

    if (productsIds) {
        queryParams["id"] = productsIds;
    }

    if (sortBy === "created_at") {
        queryParams["order"] = "created_at";
    }

    const totalPages = Math.ceil(products.length / PRODUCT_LIMIT);

    return (
        <>
            <ul
                className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
                data-testid="products-list"
            >
                {products.map((p: Product) => {
                    return (
                        <li key={p.id}>
                            <ProductPreview product={p} />
                        </li>
                    );
                })}
            </ul>
            {totalPages > 1 && (
                <Pagination
                    data-testid="product-pagination"
                    page={page}
                    totalPages={totalPages}
                />
            )}
        </>
    );
}
