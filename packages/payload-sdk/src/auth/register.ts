import type { PayloadSDK } from "../index";
import type { AuthCollectionSlug, PayloadGeneratedTypes } from "../types";

export type RegisterOptions<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
> = {
    collection: TSlug;
    data: {
        email: string;
        password: string;
    };
};

export type RegisterResult<T extends PayloadGeneratedTypes> = {
    doc: T["collections"][string];
    message: string;
};

/**
 * Register a new user in an auth-enabled collection.
 * This creates a user document - for auto-login after registration,
 * call `login()` separately after successful registration.
 */
export async function register<
    T extends PayloadGeneratedTypes,
    TSlug extends AuthCollectionSlug<T>,
>(
    sdk: PayloadSDK<T>,
    options: RegisterOptions<T, TSlug>,
    init?: RequestInit
): Promise<RegisterResult<T>> {
    const response = await sdk.request({
        init,
        json: options.data,
        method: "POST",
        path: `/${options.collection}`,
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg =
            data?.errors?.[0]?.message ||
            data?.message ||
            "Registration failed";
        throw new Error(errorMsg);
    }

    return data;
}
