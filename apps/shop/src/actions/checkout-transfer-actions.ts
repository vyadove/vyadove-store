"use server";

import { cookies } from "next/headers";

type TransferResult = {
  transferred: boolean;
  checkoutId?: number;
  action?: "transferred" | "merged" | "cookie_updated";
  reason?: string;
  itemsMerged?: number;
  error?: string;
};

/**
 * Transfer guest checkout to authenticated user.
 * Call this after login/signup to link guest checkout with user account.
 */
export async function transferCheckoutToUser(): Promise<TransferResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/checkout/transfer-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        credentials: "include",
      },
    );

    // Forward Set-Cookie header from CMS response
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      // Parse and set the cookie
      const cookieParts = setCookieHeader.split(";")[0];

      if (cookieParts) {
        const [name, value] = cookieParts.split("=");

        if (name && value) {
          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }
      }
    }

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };

      return {
        transferred: false,
        error: errorData.error || "Transfer failed",
      };
    }

    return (await response.json()) as TransferResult;
  } catch (err) {
    console.error("Failed to transfer checkout:", err);

    return {
      transferred: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
