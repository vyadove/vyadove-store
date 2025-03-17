"use client";

import { Button, Divider, Heading } from "@medusajs/ui";
import { useState, useTransition } from "react";
import { handleCheckout } from "@/app/actions/handle-checkout"; // Import the Server Action
import CartTotals from "../_components/cart-totals";
import { useCart } from "react-use-cart";
import { DiscountCode } from "../_components/discount-code";
import type { GiftCard } from "@/payload-types";


const Summary = () => {
    const [isPending, startTransition] = useTransition();
    const [ promotions, setPromotions ] = useState<GiftCard[]>([]);
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

    const applyPromotion = async (code: string) => {
        try {
            const response = await fetch(
                `/api/gift-cards/verify?code=${code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to verify gift card code.");
            }

            const data = await response.json();
            setPromotions(prev => [...prev, data]);
        } catch (error) {
            console.error("Error verifying gift card code:", error);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
                Summary
            </Heading>
            <DiscountCode
                promotions={promotions}
                setPromotions={setPromotions}
                applyPromotion={applyPromotion}
            />
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
