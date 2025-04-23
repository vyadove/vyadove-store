"use client";

import React from "react";
import { useCart } from "react-use-cart";

import { convertToLocale } from "../_util/money";

const CartTotals = ({ currencyCode, order }: { currencyCode: string; order: { totalAmount: number } }) => {
    const { cartTotal } = useCart();
    const tax_total = 0;
    const shipping_subtotal = 0;

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
                        data-value={shipping_subtotal || 0}
                    >
                        {convertToLocale({
                            amount: shipping_subtotal ?? 0,
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="flex gap-x-1 items-center ">Taxes</span>
                    <span data-testid="cart-taxes" data-value={tax_total || 0}>
                        {convertToLocale({
                            amount: tax_total ?? 0,
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
                    data-value={order.totalAmount || 0}
                >
                    {convertToLocale({
                        amount: order.totalAmount ?? 0,
                        currency_code: currencyCode,
                    })}
                </span>
            </div>
            <div className="h-px w-full border-b border-gray-200 mt-4" />
        </div>
    );
};

export default CartTotals;
