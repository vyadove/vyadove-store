"use client";

import { RadioGroup } from "@headlessui/react";
import { CheckCircleSolid, CreditCard } from "@medusajs/icons";
import { Button, clx, Container, Divider, Heading, Text } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import ErrorMessage from "../error-message";
import PaymentContainer from "./payment-container";

const Payment = ({
    availablePaymentMethods,
    cart,
}: {
    availablePaymentMethods: any[];
    cart: any;
}) => {
    const activeSession = cart.payment_collection?.payment_sessions?.find(
        (paymentSession: any) => paymentSession.status === "pending"
    );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const [cardBrand, setCardBrand] = useState<null | string>(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
        activeSession?.provider_id ?? ""
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "payment";

    // const isStripe = isStripeFunc(selectedPaymentMethod);

    const setPaymentMethod = (method: string) => {
        setError(null);
        setSelectedPaymentMethod(method);
        // if (isStripeFunc(method)) {
        //     await initiatePaymentSession(cart, {
        //         provider_id: method,
        //     });
        // }
    };

    const paidByGiftCard =
        cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0;

    const paymentReady =
        (activeSession && cart?.shipping_methods.length !== 0) ||
        paidByGiftCard;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const handleEdit = () => {
        router.push(pathname + "?" + createQueryString("step", "payment"), {
            scroll: false,
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        try {
            const shouldInputCard = !activeSession;

            if (!shouldInputCard) {
                return router.push(
                    pathname + "?" + createQueryString("step", "review"),
                    {
                        scroll: false,
                    }
                );
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setError(null);
    }, [isOpen]);

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    className={clx(
                        "flex flex-row text-3xl-regular gap-x-2 items-baseline",
                        {
                            "opacity-50 pointer-events-none select-none":
                                !isOpen && !paymentReady,
                        }
                    )}
                    level="h2"
                >
                    Payment
                    {!isOpen && paymentReady && <CheckCircleSolid />}
                </Heading>
                {!isOpen && paymentReady && (
                    <Text>
                        <button
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            data-testid="edit-payment-button"
                            onClick={handleEdit}
                            type="button"
                        >
                            Edit
                        </button>
                    </Text>
                )}
            </div>
            <div>
                <div className={isOpen ? "block" : "hidden"}>
                    {!paidByGiftCard && availablePaymentMethods?.length && (
                        <>
                            <RadioGroup
                                onChange={(value: string) =>
                                    setPaymentMethod(value)
                                }
                                value={selectedPaymentMethod}
                            >
                                {availablePaymentMethods.map(
                                    (paymentMethod) => (
                                        <div key={paymentMethod.id}>
                                            <PaymentContainer
                                                paymentInfoMap={{}}
                                                paymentProviderId={
                                                    paymentMethod.id
                                                }
                                                selectedPaymentOptionId={
                                                    selectedPaymentMethod
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        </>
                    )}

                    {paidByGiftCard && (
                        <div className="flex flex-col w-1/3">
                            <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                Payment method
                            </Text>
                            <Text
                                className="txt-medium text-ui-fg-subtle"
                                data-testid="payment-method-summary"
                            >
                                Gift card
                            </Text>
                        </div>
                    )}

                    <ErrorMessage
                        data-testid="payment-method-error-message"
                        error={error}
                    />

                    <Button
                        className="mt-6"
                        data-testid="submit-payment-button"
                        // disabled={
                        //     (isStripe && !cardComplete) ||
                        //     (!selectedPaymentMethod && !paidByGiftCard)
                        // }
                        isLoading={isLoading}
                        onClick={handleSubmit}
                        size="large"
                    >
                        {/* {!activeSession && isStripeFunc(selectedPaymentMethod)
                            ? " Enter card details"
                            : "Continue to review"} */}
                    </Button>
                </div>

                <div className={isOpen ? "hidden" : "block"}>
                    {cart && paymentReady && activeSession ? (
                        <div className="flex items-start gap-x-1 w-full">
                            <div className="flex flex-col w-1/3">
                                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                    Payment method
                                </Text>
                                <Text
                                    className="txt-medium text-ui-fg-subtle"
                                    data-testid="payment-method-summary"
                                >
                                    {/* {paymentInfoMap[activeSession?.provider_id]
                                        ?.title || activeSession?.provider_id} */}
                                </Text>
                            </div>
                            <div className="flex flex-col w-1/3">
                                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                    Payment details
                                </Text>
                                <div
                                    className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                                    data-testid="payment-details-summary"
                                >
                                    {/* <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                                        {paymentInfoMap[selectedPaymentMethod]
                                            ?.icon || <CreditCard />}
                                    </Container> */}
                                    <Text>
                                        {/* {isStripeFunc(selectedPaymentMethod) &&
                                        cardBrand
                                            ? cardBrand
                                            : "Another step will appear"} */}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    ) : paidByGiftCard ? (
                        <div className="flex flex-col w-1/3">
                            <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                Payment method
                            </Text>
                            <Text
                                className="txt-medium text-ui-fg-subtle"
                                data-testid="payment-method-summary"
                            >
                                Gift card
                            </Text>
                        </div>
                    ) : null}
                </div>
            </div>
            <Divider className="mt-8" />
        </div>
    );
};

export default Payment;
