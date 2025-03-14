import { Suspense } from "react";
import PaginatedProducts from "./paginated-product";
import type { SortOptions } from "../_util/sort-options";
import RefinementList from "../_components/refinement-list";
import SkeletonProductGrid from "../_components/skeleton-product-grid";

export default function CollectionTemplate({
	sortBy,
	collection,
	page,
	countryCode,
}: {
	sortBy?: SortOptions;
	collection: any;
	page?: string;
	countryCode: string;
}) {
	const pageNumber = page ? Number.parseInt(page) : 1;
	const sort = sortBy || "created_at";

	return (
		<div className="flex flex-col small:flex-row small:items-start py-6 content-container">
			<RefinementList sortBy={sort} />
			<div className="w-full">
				<div className="mb-8 text-2xl-semi">
					<h1>{collection.title}</h1>
				</div>
				<Suspense
					fallback={
						<SkeletonProductGrid
							numberOfProducts={collection.products?.length}
						/>
					}
				>
					<PaginatedProducts
						sortBy={sort}
						page={pageNumber}
						collectionId={collection.id}
						collection={collection}
					/>
				</Suspense>
			</div>
		</div>
	);
}
