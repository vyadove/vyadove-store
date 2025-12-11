import { PayloadSDK } from "@shopnex/payload-sdk";
import type { Config } from "@vyadove/types";

const isBrowser = typeof window !== "undefined";
const TOKEN_KEY = "payload-token";

// Token storage helpers
export const getStoredToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null): void => {
  if (!isBrowser) return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Custom fetch that adds Authorization header
const authFetch: typeof fetch = ((url, init) => {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `JWT ${token}`);
  }

  return window.fetch(url, { ...init, headers });
}) as typeof fetch;

// Client-side SDK - uses token-based auth
export const payloadSdk = new PayloadSDK<Config>({
  baseInit: {
    credentials: "include",
  },
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
  fetch: isBrowser ? authFetch : (undefined as typeof fetch),
});
