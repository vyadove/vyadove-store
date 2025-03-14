import type { Metadata } from "next";

import type { SortOptions } from "../../_util/sort-options";
import StoreTemplate from "../../_templates/store";

export const metadata: Metadata = {
	title: "Store",
	description: "Explore all of our products.",
};

type Params = {
	searchParams: Promise<{
		sortBy?: SortOptions;
		page?: string;
	}>;
	params: Promise<{
		countryCode: string;
	}>;
};

export default async function StorePage(props: Params) {
	const searchParams = await props.searchParams;
	const { sortBy, page } = searchParams;

	return <StoreTemplate sortBy={sortBy} page={page} />;
}
