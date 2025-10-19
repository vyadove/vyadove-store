import type { Config } from "@/payload-types";

import { PayloadSDK } from "@shopnex/payload-sdk";

const isBrowser = typeof window !== "undefined";

export const payloadSdk = new PayloadSDK<Config>({
    baseInit: {
        credentials: "include", // Add this line to include cookies
    },
    // baseURL: `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/api`,
    baseURL: `http://localhost:3000/api`,
    fetch: isBrowser ? (...args) => window.fetch(...args) : undefined,
});
