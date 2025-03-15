import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionTemplate from "@/app/(frontend)/_templates/collections";
import type { SortOptions } from "@/app/(frontend)/_util/sort-options";
import { getPayload } from "payload";
import config from "@payload-config";
import { mapProducts } from "@/utilities/map-products";

type Props = {
    params: Promise<{ handle: string; countryCode: string }>;
    searchParams: Promise<{
        page?: string;
        sortBy?: SortOptions;
    }>;
};

export async function generateStaticParams() {
    const collections = [
        {
            id: 1,
            handle: "collection-1",
            title: "Collection 1",
        },
        {
            id: 2,
            handle: "collection-2",
            title: "Collection 2",
        },
    ];

    if (!collections) {
        return [];
    }

    const collectionHandles = collections.map(
        (collection: any) => collection.handle
    );

    return collectionHandles.map((handle: string | undefined) => ({
        handle,
    }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const collection = {
        id: 1,
        handle: "collection-1",
        title: "Collection 1",
    };

    if (!collection) {
        notFound();
    }

    const metadata = {
        title: `${collection.title} | Medusa Store`,
        description: `${collection.title} collection`,
    } as Metadata;

    return metadata;
}

export default async function CollectionPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const { sortBy, page } = searchParams;
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
		where: {
			collections: {
				equals: collection.id,
			},
		},
		sort: "createdAt",
	});

    collection.products = mapProducts(products.docs);

    if (!collection) {
        notFound();
    }

    return (
        <CollectionTemplate
            collection={collection}
            page={page}
            sortBy={sortBy}
            countryCode={params.countryCode}
        />
    );
}
