import type { Metadata } from "next";

import CartTemplate from "@/scenes/cart";

export const metadata: Metadata = {
  description: "View your cart",
  title: "Cart",
};

export const dynamic = "force-dynamic";

export default function Cart() {
  return <CartTemplate />;
}
