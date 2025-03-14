import { notFound } from "next/navigation";
import { Suspense } from "react";

import type { SortOptions } from "../_util/sort-options";
import Link from "next/link";
import PaginatedProducts from "./paginated-product";
import RefinementList from "../_components/refinement-list";
import InteractiveLink from "../_components/interactive-link";
import SkeletonProductGrid from "../_components/skeleton-product-grid";

export default function CategoryTemplate({
	category,
	sortBy,
	page,
	countryCode,
}: {
	category: any;
	sortBy?: SortOptions;
	page?: string;
	countryCode: string;
}) {
	const pageNumber = page ? Number.parseInt(page) : 1;
	const sort = sortBy || "created_at";

	if (!category || !countryCode) notFound();

	const parents = [] as any[];

	const getParents = (category: any) => {
		if (category.parent_category) {
			parents.push(category.parent_category);
			getParents(category.parent_category);
		}
	};

	getParents(category);

	return (
		<div
			className="flex flex-col small:flex-row small:items-start py-6 content-container"
			data-testid="category-container"
		>
			<RefinementList sortBy={sort} data-testid="sort-by-container" />
			<div className="w-full">
				<div className="flex flex-row mb-8 text-2xl-semi gap-4">
					{parents.map((parent) => (
						<span key={parent.id} className="text-ui-fg-subtle">
							<Link
								className="mr-4 hover:text-black"
								href={`/categories/${parent.handle}`}
								data-testid="sort-by-link"
							>
								{parent.name}
							</Link>
							/
						</span>
					))}
					<h1 data-testid="category-page-title">{category.name}</h1>
				</div>
				{category.description && (
					<div className="mb-8 text-base-regular">
						<p>{category.description}</p>
					</div>
				)}
				{category.category_children && (
					<div className="mb-8 text-base-large">
						<ul className="grid grid-cols-1 gap-2">
							{category.category_children?.map((c: any) => (
								<li key={c.id}>
									<InteractiveLink href={`/categories/${c.handle}`}>
										{c.name}
									</InteractiveLink>
								</li>
							))}
						</ul>
					</div>
				)}
				<Suspense
					fallback={
						<SkeletonProductGrid
							numberOfProducts={category.products?.length ?? 8}
						/>
					}
				>
					<PaginatedProducts sortBy={sort} page={pageNumber} />
				</Suspense>
			</div>
		</div>
	);
}
