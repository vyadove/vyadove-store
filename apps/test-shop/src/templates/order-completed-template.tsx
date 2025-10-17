"use client";

import type { Order } from "@shopnex/types";

import CartTotals from "@/components/cart-totals";
import Help from "@/components/help";
import Items from "@/components/order/items/items";
import OrderDetails from "@/components/order/order-details/order-details";
import PaymentDetails from "@/components/order/payment-details/payment-details";
import ShippingDetails from "@/components/order/shipping-details/shipping-details";
import { Heading } from "@medusajs/ui";
import { useLayoutEffect } from "react";
import { useCart } from "react-use-cart";
import Cookies from "js-cookie";

type OrderCompletedTemplateProps = {
    order: Order;
};

export default function OrderCompletedTemplate({
    order,
}: OrderCompletedTemplateProps) {
    const { emptyCart } = useCart();

    useLayoutEffect(() => {
        emptyCart();
        Cookies.remove("cart-session");
        Cookies.remove("checkout-session");
    }, [emptyCart]);

    return (
        <div className="py-6 min-h-[calc(100vh-64px)]">
            <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
                <div
                    className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
                    data-testid="order-complete-container"
                >
                    <Heading
                        className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
                        level="h1"
                    >
                        <span>Thank you!</span>
                        <span>Your order was placed successfully.</span>
                    </Heading>
                    <OrderDetails order={order} />
                    <Heading
                        className="flex flex-row text-3xl-regular"
                        level="h2"
                    >
                        Summary
                    </Heading>
                    <Items order={order} />
                    <CartTotals currencyCode="usd" order={order} />
                    <ShippingDetails order={order} />
                    <PaymentDetails order={order} />
                    <Help />
                </div>
            </div>
        </div>
    );
}
