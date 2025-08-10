import type { SortOptions } from "@/utils/sort-options";

import CollectionTemplate from "@/templates/collections";
import { notFound } from "next/navigation";
import { payloadSdk } from "@/utils/payload-sdk";

import type { Metadata } from "next";

type CollectionsPageProps = {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{
        page?: string;
        sortBy?: SortOptions;
    }>;
};

export async function generateMetadata(
    props: CollectionsPageProps
): Promise<Metadata> {
    const params = await props.params;
    const { handle } = params;

    // Fetch the collection metadata
    const result = await payloadSdk.find({
        collection: "collections",
        limit: 1,
        where: {
            handle: {
                equals: handle,
            },
        },
        select: {
            title: true,
            meta: {
                title: true,
                description: true,
            },
        },
    });

    if (!result.docs.length) {
        notFound();
    }

    const collection = result.docs[0];

    return {
        description: collection.meta?.description || `${collection.title}`, // Fallback to title if no meta description
        openGraph: {
            title: collection.meta?.title || `${collection.title} | ShopNex`, // Fallback if no meta title
            description: collection.meta?.description || `${collection.title}`,
            // images: collection.thumbnail ? [collection.thumbnail] : [],
        },
        title: collection.meta?.title || `${collection.title} | ShopNex`,
    };
}

export default async function CollectionPage(props: CollectionsPageProps) {
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
