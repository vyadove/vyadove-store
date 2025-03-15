"use client";

import { Button, Divider, Heading } from "@medusajs/ui";
import { useTransition } from "react";
import { handleCheckout } from "@/app/actions/handle-checkout"; // Import the Server Action
import CartTotals from "../_components/cart-totals";
import { useCart } from "react-use-cart";

const Summary = () => {
    const [isPending, startTransition] = useTransition();
    const { items } = useCart();

    const handleClick = () => {
        startTransition(async () => {
            const variants = items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            }));
            const result = await handleCheckout(variants); // Call the Server Action
            if (result?.url) {
                window.location.href = result.url; // Redirect to Stripe Checkout
            }
        });
    };

    return (
        <div className="flex flex-col gap-y-4">
            <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
                Summary
            </Heading>
            <Divider />
            <CartTotals
                currencyCode={items[0].currency}
                order={{
                    totalAmount: items.reduce(
                        (acc, item: any) => acc + item.price * item.quantity,
                        0
                    ),
                }}
            />
            <Button
                className="w-full h-10"
                onClick={handleClick}
                disabled={isPending}
            >
                {isPending ? "Processing..." : "Go to checkout"}
            </Button>
        </div>
    );
};

export default Summary;
