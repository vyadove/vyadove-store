import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SortOptions } from "@/app/(frontend)/_util/sort-options";
import CategoryTemplate from "@/app/(frontend)/_templates/category";

type Props = {
	params: Promise<{ category: string[]; countryCode: string }>;
	searchParams: Promise<{
		sortBy?: SortOptions;
		page?: string;
	}>;
};

export async function generateStaticParams() {
	const product_categories = [
		{
			handle: "mens-clothing",
			name: "Men's Clothing",
			description: "All men's clothing",
		},
		{
			handle: "womens-clothing",
			name: "Women's Clothing",
			description: "All women's clothing",
		},
		{
			handle: "accessories",
			name: "Accessories",
			description: "All accessories",
		},
	];

	if (!product_categories) {
		return [];
	}

	const categoryHandles = product_categories.map(
		(category: any) => category.handle,
	);

	return categoryHandles.map((category: string) => ({
		category: [category],
	}));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	try {
		const productCategory = {
			name: params.category[0],
			handle: params.category[0],
			description: null,
		};

		const title = productCategory.name + " | Medusa Store";

		const description = productCategory.description ?? `${title} category.`;

		return {
			title: `${title} | Medusa Store`,
			description,
			alternates: {
				canonical: `${params.category.join("/")}`,
			},
		};
	} catch (error) {
		notFound();
	}
}

export default async function CategoryPage(props: Props) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const { sortBy, page } = searchParams;

	const productCategory = {
		name: params.category[0],
		handle: params.category[0],
		description: null,
	};

	if (!productCategory) {
		notFound();
	}

	return (
		<CategoryTemplate
			category={productCategory}
			sortBy={sortBy}
			page={page}
			countryCode={params.countryCode}
		/>
	);
}
