"use client";

import React from "react";

type PaymentWrapperProps = {
    cart: any;
    children: React.ReactNode;
};

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
    const paymentSession = cart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending"
    );

    if (
        // isStripe(paymentSession?.provider_id) &&
        paymentSession
        // stripePromise
    ) {
        return null;
        // return (
        //     <StripeWrapper
        //         paymentSession={paymentSession}
        //         stripeKey={stripeKey}
        //         stripePromise={stripePromise}
        //     >
        //         {children}
        //     </StripeWrapper>
        // );
    }

    return <div>{children}</div>;
};

export default PaymentWrapper;
