import type { PaginatedDocs, SelectType, Sort, Where } from "payload";

import type { PayloadSDK } from "../index";
import type {
    CollectionSlug,
    JoinQuery,
    PayloadGeneratedTypes,
    PopulateType,
    TransformCollectionWithSelect,
    TypedLocale,
} from "../types";



export type FindOptions<
    T extends PayloadGeneratedTypes,
    TSlug extends CollectionSlug<T>,
    TSelect extends SelectType,
> = {
    collection: TSlug;
    depth?: number;
    draft?: boolean;
    /**
     * Set to `false` to return all documents and avoid querying for document counts which introduces some overhead.
     * You can also combine that property with a specified `limit` to limit documents but avoid the count query.
     */
    pagination?: boolean;
    fallbackLocale?: false | TypedLocale<T>;
    joins?: JoinQuery<T, TSlug>;
    limit?: number;
    locale?: "all" | TypedLocale<T>;
    page?: number;
    populate?: PopulateType<T>;
    select?: TSelect;
    sort?: Sort;
    where?: Where;
};

export async function find<
    T extends PayloadGeneratedTypes,
    TSlug extends CollectionSlug<T>,
    TSelect extends SelectType,
>(
    sdk: PayloadSDK<T>,
    options: FindOptions<T, TSlug, TSelect>,
    init?: RequestInit
): Promise<PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>> {
    const response = await sdk.request({
        args: options,
        init,
        method: "GET",
        path: `/${options.collection}`,
    });

    return response.json();
}
