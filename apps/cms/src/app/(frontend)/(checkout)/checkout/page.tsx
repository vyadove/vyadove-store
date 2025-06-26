import type { Metadata } from "next";

import { getCart } from "@/app/api/services/cart";
import { retrieveCustomer } from "@/app/api/services/customers";
import { notFound } from "next/navigation";
import React from "react";

import PaymentWrapper from "../../_components/checkout/payment-wrapper";
import CheckoutForm from "../../_templates/checkout-form";
import CheckoutSummary from "../../_templates/checkout-summary";

export const metadata: Metadata = {
    title: "Checkout",
};

export default async function Checkout() {
    const cart = await getCart();

    if (!cart) {
        return notFound();
    }

    const customer = await retrieveCustomer();

    return (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
            <PaymentWrapper cart={cart} data-testid="payment-wrapper">
                <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
            <CheckoutSummary cart={cart} />
        </div>
    );
}
