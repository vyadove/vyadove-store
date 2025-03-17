import type { SortOptions } from "../_util/sort-options";
import { Pagination } from "../_components/pagination";
import ProductPreview from "../_components/product-preview";
import type { Product } from "@/payload-types";

const PRODUCT_LIMIT = 12;

type PaginatedProductsParams = {
	limit: number;
	collection_id?: string[];
	category_id?: string[];
	id?: string[];
	order?: string;
};

export default async function PaginatedProducts({
	sortBy,
	page,
	collectionId,
	productsIds,
	products,
}: {
	sortBy?: SortOptions;
	page: number;
	collectionId?: string;
	productsIds?: string[];
	products: Product[];
}) {
	const queryParams: PaginatedProductsParams = {
		limit: 12,
	};

	if (collectionId) {
		queryParams["collection_id"] = [collectionId];
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
