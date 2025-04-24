"use client";

import type { GiftCard } from "@/payload-types";

import { Button, Divider, Heading } from "@medusajs/ui";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "react-use-cart";

import CartTotals from "../_components/cart-totals";
import { DiscountCode } from "../_components/discount-code";

function getCheckoutStep(cart: any) {
    if (!cart?.shipping_address?.address_1 || !cart.email) {
        return "address";
    } else if (cart?.shipping_methods?.length === 0) {
        return "delivery";
    } else {
        return "payment";
    }
}

const Summary = () => {
    const [promotions, setPromotions] = useState<GiftCard[]>([]);
    const { items } = useCart();
    const step = getCheckoutStep(items);

    const applyPromotion = async (code: string) => {
        try {
            const response = await fetch(
                `/api/gift-cards/verify?code=${code}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to verify gift card code.");
            }

            const data = await response.json();
            setPromotions((prev) => [...prev, data]);
        } catch (error) {
            console.error("Error verifying gift card code:", error);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <Heading className="text-[2rem] leading-[2.75rem]" level="h2">
                Summary
            </Heading>
            <DiscountCode
                applyPromotion={applyPromotion}
                promotions={promotions}
                setPromotions={setPromotions}
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
            <Link data-testid="checkout-button" href={"/checkout?step=" + step}>
                <Button className="w-full h-10">Go to checkout</Button>
            </Link>
        </div>
    );
};

export default Summary;
