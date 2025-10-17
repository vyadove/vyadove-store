import { PayloadSDK } from "@shopnex/payload-sdk";

// Browser environment check
export const isBrowser = typeof window !== "undefined";

/**
 * Creates a configured PayloadSDK instance
 * @param token - Authentication token
 * @returns Configured PayloadSDK instance
 */
export const createPayloadSDK = (token: string): PayloadSDK => {
    return new PayloadSDK({
        baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
        baseInit: {
            credentials: "include",
            headers: {
                "x-payload-sdk-token": token,
            },
        },
        fetch: isBrowser ? (...args) => window.fetch(...args) : undefined,
    });
};