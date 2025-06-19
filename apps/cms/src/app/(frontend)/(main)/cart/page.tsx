import type { Metadata } from "next";

import CartTemplate from "../../_templates/cart";

export const metadata: Metadata = {
    description: "View your cart",
    title: "Cart",
};

export default function Cart() {
    return <CartTemplate />;
}
