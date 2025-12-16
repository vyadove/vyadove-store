import type { PayloadSDK } from "../index";
import type { AuthCollectionSlug, PayloadGeneratedTypes } from "../types";

export type LogoutOptions<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
> = {
    collection: TSlug;
};

export type LogoutResult = {
    message: string;
};

export async function logout<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
>(
    sdk: PayloadSDK<T>,
    options: LogoutOptions<T, TSlug>,
    init?: RequestInit
): Promise<LogoutResult> {
    const response = await sdk.request({
        init,
        method: "POST",
        path: `/${options.collection}/logout`,
    });

    return response.json();
}
