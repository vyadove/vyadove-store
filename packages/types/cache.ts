/**
 * Centralized cache tags and paths for shop revalidation
 * Shared between CMS and Shop apps
 */

/** Cache tags for revalidateTag() */
export const CacheTags = {
    PRODUCTS: "products",
    COLLECTIONS: "collections",
    CATEGORIES: "categories",
    STORE_SETTINGS: "store-settings",
    EXCHANGE_RATES: "exchange-rates",
    SEARCH: "search",
} as const;

/** Paths for revalidatePath() */
export const CachePaths = {
    HOME: "/",
    SHOP: "/shop",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
    SUPPORT: "/support",
} as const;

export type CacheTag = (typeof CacheTags)[keyof typeof CacheTags];
export type CachePath = (typeof CachePaths)[keyof typeof CachePaths];
