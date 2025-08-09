"use client";

import type { Order } from "@shopnex/types";

import { convertToLocale } from "@/utils/money";
import React from "react";

const CartTotals = ({
    currencyCode,
    order,
}: {
    currencyCode: string;
    order: Partial<Order>;
}) => {
    const taxTotal = 0;
    const shippingSubtotal = 0;
    const cartTotal = order.totalAmount;

    return (
        <div>
            <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
                <div className="flex items-center justify-between">
                    <span className="flex gap-x-1 items-center">
                        Subtotal (excl. shipping and taxes)
                    </span>
                    <span
                        data-testid="cart-subtotal"
                        data-value={cartTotal || 0}
                    >
                        {convertToLocale({
                            amount: cartTotal ?? 0,
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span
                        data-testid="cart-shipping"
                        data-value={shippingSubtotal || 0}
                    >
                        {convertToLocale({
                            amount: shippingSubtotal ?? 0,
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="flex gap-x-1 items-center ">Taxes</span>
                    <span data-testid="cart-taxes" data-value={taxTotal || 0}>
                        {convertToLocale({
                            amount: taxTotal ?? 0,
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>
            </div>
            <div className="h-px w-full border-b border-gray-200 my-4" />
            <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
                <span>Total</span>
                <span
                    className="txt-xlarge-plus"
                    data-testid="cart-total"
                    data-value={cartTotal || 0}
                >
                    {convertToLocale({
                        amount: cartTotal ?? 0,
                        currency_code: currencyCode,
                    })}
                </span>
            </div>
            <div className="h-px w-full border-b border-gray-200 mt-4" />
        </div>
    );
};

export default CartTotals;
