"use client";

import { Button } from "@medusajs/ui";
// import { useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

import ErrorMessage from "./error-message";

type PaymentButtonProps = {
    cart: any;
    "data-testid": string;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({
    cart,
    "data-testid": dataTestId,
}) => {
    const notReady =
        !cart ||
        !cart.shipping_address ||
        !cart.billing_address ||
        !cart.email ||
        (cart.shipping_methods?.length ?? 0) < 1;

    const paymentSession = cart.payment_collection?.payment_sessions?.[0];

    switch (true) {
        case paymentSession?.provider_id:
            return (
                <StripePaymentButton
                    cart={cart}
                    data-testid={dataTestId}
                    notReady={notReady}
                />
            );
        default:
            return <Button disabled>Select a payment method</Button>;
    }
};

const StripePaymentButton = ({
    cart,
    "data-testid": dataTestId,
    notReady,
}: {
    cart: any;
    "data-testid"?: string;
    notReady: boolean;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);

    const onPaymentCompleted = async () => {
        // await placeOrder()
        //     .catch((err) => {
        //         setErrorMessage(err.message);
        //     })
        //     .finally(() => {
        //         setSubmitting(false);
        //     });
    };

    // const stripe = useStripe();
    // const elements = useElements();
    // const card = elements?.getElement("card");

    const session = cart.payment_collection?.payment_sessions?.find(
        (s: any) => s.status === "pending"
    );

    // const disabled = !stripe || !elements ? true : false;

    const handlePayment = () => {
        setSubmitting(true);

        // if (!stripe || !elements || !card || !cart) {
        //     setSubmitting(false);
        //     return;
        // }

        // await stripe
        //     .confirmCardPayment(session?.data.client_secret as string, {
        //         payment_method: {
        //             billing_details: {
        //                 name:
        //                     cart.billing_address?.first_name +
        //                     " " +
        //                     cart.billing_address?.last_name,
        //                 address: {
        //                     city: cart.billing_address?.city ?? undefined,
        //                     country:
        //                         cart.billing_address?.country_code ?? undefined,
        //                     line1: cart.billing_address?.address_1 ?? undefined,
        //                     line2: cart.billing_address?.address_2 ?? undefined,
        //                     postal_code:
        //                         cart.billing_address?.postal_code ?? undefined,
        //                     state: cart.billing_address?.province ?? undefined,
        //                 },
        //                 email: cart.email,
        //                 phone: cart.billing_address?.phone ?? undefined,
        //             },
        //             card,
        //         },
        //     })
        //     .then(({ error, paymentIntent }) => {
        //         if (error) {
        //             const pi = error.payment_intent;

        //             if (
        //                 (pi && pi.status === "requires_capture") ||
        //                 (pi && pi.status === "succeeded")
        //             ) {
        //                 onPaymentCompleted();
        //             }

        //             setErrorMessage(error.message || null);
        //             return;
        //         }

        //         if (
        //             (paymentIntent &&
        //                 paymentIntent.status === "requires_capture") ||
        //             paymentIntent.status === "succeeded"
        //         ) {
        //             return onPaymentCompleted();
        //         }

        //         return;
        //     });
    };

    return (
        <>
            <Button
                data-testid={dataTestId}
                // disabled={disabled || notReady}
                isLoading={submitting}
                onClick={handlePayment}
                size="large"
            >
                Place order
            </Button>
            <ErrorMessage
                data-testid="stripe-payment-error-message"
                error={errorMessage}
            />
        </>
    );
};

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<null | string>(null);

    const onPaymentCompleted = async () => {
        // await placeOrder()
        //     .catch((err) => {
        //         setErrorMessage(err.message);
        //     })
        //     .finally(() => {
        //         setSubmitting(false);
        //     });
    };

    const handlePayment = () => {
        setSubmitting(true);

        // onPaymentCompleted();
    };

    return (
        <>
            <Button
                data-testid="submit-order-button"
                disabled={notReady}
                isLoading={submitting}
                onClick={handlePayment}
                size="large"
            >
                Place order
            </Button>
            <ErrorMessage
                data-testid="manual-payment-error-message"
                error={errorMessage}
            />
        </>
    );
};

export default PaymentButton;
