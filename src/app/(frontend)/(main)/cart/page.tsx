import type { Metadata } from "next";
import CartTemplate from "../../_templates/cart";

export const metadata: Metadata = {
	title: "Cart",
	description: "View your cart",
};

export default async function Cart() {
	return <CartTemplate />;
}
