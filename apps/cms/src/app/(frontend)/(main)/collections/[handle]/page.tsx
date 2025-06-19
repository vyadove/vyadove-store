import type { SortOptions } from "@/app/(frontend)/_util/sort-options";

import CollectionTemplate from "@/app/(frontend)/_templates/collections";
import { mapProducts } from "@/utils/map-products";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{
        page?: string;
        sortBy?: SortOptions;
    }>;
};

export default async function CollectionPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { page, sortBy } = searchParams;
    const payload = await getPayload({ config });

    const collectionData = await payload.find({
        collection: "collections",
        sort: "createdAt",
        where: {
            handle: {
                equals: params.handle,
            },
        },
    });

    const collection = collectionData.docs[0];

    const products = await payload.find({
        collection: "products",
        sort: "createdAt",
        where: {
            collections: {
                equals: collection.id,
            },
        },
    });

    collection.products = mapProducts(products.docs) as any;

    if (!collection) {
        notFound();
    }

    return (
        <CollectionTemplate
            collection={collection}
            page={page}
            sortBy={sortBy}
        />
    );
}
