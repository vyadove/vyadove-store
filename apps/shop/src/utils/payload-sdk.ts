import { PayloadSDK } from "@shopnex/payload-sdk";
import type { Config } from "@shopnex/types";

const isBrowser = typeof window !== "undefined";

export const payloadSdk = new PayloadSDK<Config>({
  baseInit: {
    credentials: "include", // Add this line to include cookies
  },
  baseURL: `${process.env.NEXT_PUBLIC_URL}/api`,
  // baseURL: `http://localhost:3000/api`,
  fetch: isBrowser
    ? (...args) => window.fetch(...args)
    : (undefined as unknown as any),
});
