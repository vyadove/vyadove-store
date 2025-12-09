import { PayloadSDK } from "@shopnex/payload-sdk";
import type { Config } from "@vyadove/types";

const isBrowser = typeof window !== "undefined";

// Client-side SDK - uses window.fetch with credentials
export const payloadSdk = new PayloadSDK<Config>({
  baseInit: {
    credentials: "include",
  },
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
  // baseURL: `http://localhost:3000/api`,
  fetch: isBrowser
    ? (...args) => window.fetch(...args)
    : (undefined as unknown as any),
});
