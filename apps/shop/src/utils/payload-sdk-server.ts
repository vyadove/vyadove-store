"use server";

import { cookies } from "next/headers";

import { PayloadSDK } from "@shopnex/payload-sdk";
import type { Config } from "@vyadove/types";

// Server-side SDK factory - creates SDK with cookies forwarded
export async function getServerSdk() {
  const cookieStore = await cookies();

  return new PayloadSDK<Config>({
    baseInit: {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
  });
}
