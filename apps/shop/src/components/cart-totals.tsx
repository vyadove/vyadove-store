"use client";

import React from "react";

import { useCheckout } from "@/providers/checkout";
import { TypographyP } from "@ui/shadcn/typography";

import { usePrice } from "@/components/price";

const CartTotals = ({ totalLabel }: { totalLabel?: string }) => {
    const { totalUniqueItems, cartTotal, total, checkout } = useCheckout();
    const { format } = usePrice();
    const taxTotal = checkout?.taxTotal || 0;
    const shippingSubtotal = checkout?.shippingTotal || 0;

    return (
        <div className="flex flex-col gap-6 py-6">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <TypographyP className="text-muted-foreground">
                        Items
                    </TypographyP>
                    <TypographyP
                        data-testid="cart-subtotal"
                        data-value={cartTotal || 0}
                    >
                        {totalUniqueItems}
                    </TypographyP>
                </div>

                <div className="flex items-center justify-between">
                    <TypographyP className="text-muted-foreground">
                        Sub total
                    </TypographyP>

                    <TypographyP
                        data-testid="cart-subtotal"
                        data-value={cartTotal || 0}
                    >
                        {format(cartTotal ?? 0)}
                    </TypographyP>
                </div>

                <div className="flex items-center justify-between">
                    <TypographyP className="text-muted-foreground">
                        Shipping (digital){" "}
                    </TypographyP>

                    <TypographyP
                        data-testid="cart-shipping"
                        data-value={shippingSubtotal || 0}
                    >
                        {format(shippingSubtotal || 0)}
                    </TypographyP>
                </div>

                <div className="flex justify-between">
                    <TypographyP className="text-muted-foreground">
                        Taxes
                    </TypographyP>
                    <TypographyP
                        data-testid="cart-taxes"
                        data-value={taxTotal || 0}
                    >
                        {format(taxTotal ?? 0)}
                    </TypographyP>
                </div>
            </div>

            <div className=" flex justify-between border-t pt-6">
                <TypographyP className="text-muted-foreground">
                    {" "}
                    {totalLabel || "Total"}
                </TypographyP>
                <TypographyP data-testid="cart-taxes" data-value={taxTotal || 0}>
                    {format(total ?? 0)}
                </TypographyP>
            </div>
        </div>
    );
};

export default CartTotals;
