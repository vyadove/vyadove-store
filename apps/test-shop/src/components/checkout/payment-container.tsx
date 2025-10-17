import { Radio as RadioGroupOption } from "@headlessui/react";
import { clx, Text } from "@medusajs/ui";
import React, { type JSX, use, useMemo } from "react";

import Radio from "../radio";
import PaymentTest from "./payment-test";

const isManual = (paymentProviderId: string) => {
    return paymentProviderId === "manual";
};

type PaymentContainerProps = {
    children?: React.ReactNode;
    disabled?: boolean;
    paymentInfoMap: Record<string, { icon: JSX.Element; title: string }>;
    paymentProviderId: string;
    selectedPaymentOptionId: null | string;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
    children,
    disabled = false,
    paymentInfoMap,
    paymentProviderId,
    selectedPaymentOptionId,
}) => {
    const isDevelopment = process.env.NODE_ENV === "development";

    return (
        <RadioGroupOption
            className={clx(
                "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                {
                    "border-ui-border-interactive":
                        selectedPaymentOptionId === paymentProviderId,
                }
            )}
            disabled={disabled}
            key={paymentProviderId}
            value={paymentProviderId}
        >
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-x-4">
                    <Radio
                        checked={selectedPaymentOptionId === paymentProviderId}
                    />
                    <Text className="text-base-regular">
                        {paymentInfoMap[paymentProviderId]?.title ||
                            paymentProviderId}
                    </Text>
                    {isManual(paymentProviderId) && isDevelopment && (
                        <PaymentTest className="hidden small:block" />
                    )}
                </div>
                <span className="justify-self-end text-ui-fg-base">
                    {paymentInfoMap[paymentProviderId]?.icon}
                </span>
            </div>
            {isManual(paymentProviderId) && isDevelopment && (
                <PaymentTest className="small:hidden text-[10px]" />
            )}
            {children}
        </RadioGroupOption>
    );
};

export default PaymentContainer;

export const StripeCardContainer = ({
    disabled = false,
    paymentInfoMap,
    paymentProviderId,
    selectedPaymentOptionId,
    setCardBrand,
    setCardComplete,
    setError,
}: {
    setCardBrand: (brand: string) => void;
    setCardComplete: (complete: boolean) => void;
    setError: (error: null | string) => void;
} & Omit<PaymentContainerProps, "children">) => {
    // const stripeReady = use(StripeContext);

    const useOptions: any = useMemo(() => {
        return {
            classes: {
                base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
            },
            style: {
                base: {
                    "::placeholder": {
                        color: "rgb(107 114 128)",
                    },
                    color: "#424270",
                    fontFamily: "Inter, sans-serif",
                },
            },
        };
    }, []);

    return (
        <PaymentContainer
            disabled={disabled}
            paymentInfoMap={paymentInfoMap}
            paymentProviderId={paymentProviderId}
            selectedPaymentOptionId={selectedPaymentOptionId}
        >
            {/* {selectedPaymentOptionId === paymentProviderId &&
                (stripeReady ? (
                    <div className="my-4 transition-all duration-150 ease-in-out">
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                            Enter your card details:
                        </Text>
                        <CardElement
                            onChange={(e) => {
                                setCardBrand(
                                    e.brand &&
                                        e.brand.charAt(0).toUpperCase() +
                                            e.brand.slice(1)
                                );
                                setError(e.error?.message || null);
                                setCardComplete(e.complete);
                            }}
                            options={useOptions}
                        />
                    </div>
                ) : (
                    <SkeletonCardDetails />
                ))} */}
        </PaymentContainer>
    );
};
