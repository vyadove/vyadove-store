import type { PayloadRequest } from "payload";
import type { CachePath, CacheTag } from "@vyadove/types/cache";

type RevalidateOptions = {
    /** Specific path to revalidate */
    path?: CachePath | string;
    /** Cache tag to revalidate */
    tag?: CacheTag | string;
};

type RevalidateShopParams = {
    req?: PayloadRequest;
    options?: RevalidateOptions;
};

/**
 * Revalidate shop cache via POST request to storefront API
 * Supports both path-based and tag-based revalidation
 */
export async function revalidateShop({
    req,
    options = {},
}: RevalidateShopParams = {}): Promise<boolean> {
    const shopUrl =
        process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3020";
    const secret = process.env.REVALIDATION_SECRET_TOKEN;

    // Skip on local dev if configured
    // if (process.env.IS_LOCAL_SERVER) {
    // 	req?.payload?.logger?.info("Skipping revalidation on local server");
    // 	return true;
    // }

    if (!secret) {
        const msg =
            "REVALIDATION_SECRET_TOKEN not set, skipping shop cache invalidation";
        req?.payload?.logger?.warn(msg) ?? console.warn(msg);
        return false;
    }

    const { path, tag } = options;

    if (!path && !tag) {
        const msg =
            "revalidateShop: no path or tag provided, nothing to revalidate";
        req?.payload?.logger?.warn(msg) ?? console.warn(msg);
        return false;
    }

    try {
        const response = await fetch(`${shopUrl}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, tag, secret }),
        });

        if (response.ok) {
            const msg = `Shop cache invalidated: ${tag ? `tag=${tag}` : ""}${path ? ` path=${path}` : ""}`;
            req?.payload?.logger?.info(msg) ?? console.log(`✓ ${msg}`);
            return true;
        }

        const msg = `Failed to revalidate shop cache. Status: ${response.status}`;
        req?.payload?.logger?.error(msg) ?? console.error(msg);
        return false;
    } catch (error) {
        const msg = `Error during shop revalidation: ${error instanceof Error ? error.message : error}`;
        req?.payload?.logger?.error(msg) ?? console.error(msg);
        return false;
    }
}

/**
 * Create a Payload afterChange hook for shop revalidation
 */
export function createRevalidateHook(options: RevalidateOptions) {
    return async ({ req }: { req: PayloadRequest }) => {
        await revalidateShop({ req, options });
    };
}
