"use client";

import { Heading } from "@medusajs/ui";
import Help from "../_components/help";
import PaymentDetails from "../_components/order/payment-details/payment-details";
import OrderDetails from "../_components/order/order-details/order-details";
import Items from "../_components/order/items/items";
import CartTotals from "../_components/cart-totals";
import type { Order } from "@/payload-types";
import ShippingDetails from "../_components/order/shipping-details/shipping-details";
import { useCart } from "react-use-cart";
import { useLayoutEffect } from "react";

type OrderCompletedTemplateProps = {
    order: Order;
};

export default function OrderCompletedTemplate({
    order,
}: OrderCompletedTemplateProps) {
    const { emptyCart } = useCart();

    useLayoutEffect(() => {
        emptyCart();
    }, [emptyCart]);
    
    return (
        <div className="py-6 min-h-[calc(100vh-64px)]">
            <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
                <div
                    className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
                    data-testid="order-complete-container"
                >
                    <Heading
                        level="h1"
                        className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
                    >
                        <span>Thank you!</span>
                        <span>Your order was placed successfully.</span>
                    </Heading>
                    <OrderDetails order={order} />
                    <Heading
                        level="h2"
                        className="flex flex-row text-3xl-regular"
                    >
                        Summary
                    </Heading>
                    <Items order={order} />
                    <CartTotals order={order} />
                    <ShippingDetails order={order} />
                    <PaymentDetails order={order} />
                    <Help />
                </div>
            </div>
        </div>
    );
}
