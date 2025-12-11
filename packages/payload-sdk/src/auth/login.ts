import type { PayloadSDK } from "../index";
import type {
    AuthCollectionSlug,
    DataFromCollectionSlug,
    PayloadGeneratedTypes,
    TypedAuth,
} from "../types";

export type LoginOptions<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
> = {
    collection: TSlug;
    data: TypedAuth<T>[TSlug]["login"];
};

export type LoginResult<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
> = {
    exp?: number;
    message: string;
    token?: string;
    // @ts-expect-error auth collection and user collection
    user: DataFromCollectionSlug<T, TSlug>;
};

export async function login<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
>(
    sdk: PayloadSDK<T>,
    options: LoginOptions<T, TSlug>,
    init?: RequestInit
): Promise<LoginResult<T, TSlug>> {
    const response = await sdk.request({
        init,
        json: options.data,
        method: "POST",
        path: `/${options.collection}/login`,
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg =
            data?.errors?.[0]?.message || data?.message || "Login failed";
        throw new Error(errorMsg);
    }

    return data;
}
