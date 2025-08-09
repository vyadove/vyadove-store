import type { SortOptions } from "@/utils/sort-options";

import CollectionTemplate from "@/templates/collections";
import { notFound } from "next/navigation";
import { payloadSdk } from "@/utils/payload-sdk";

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

    const collectionData = await payloadSdk.find({
        collection: "collections",
        sort: "createdAt",
        where: {
            handle: {
                equals: params.handle,
            },
        },
        depth: 10,
    });

    const collection = collectionData.docs[0];

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
