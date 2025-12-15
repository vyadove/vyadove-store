"use server";

import { cookies } from "next/headers";

export async function clearCheckoutSession() {
  const cookieStore = await cookies();

  cookieStore.delete("checkout-session");
}
