"use client";

import { setAddresses } from "@/services/cart";
import { CheckCircleSolid, Spinner } from "@medusajs/icons";
import { Divider, Heading, Text, useToggleState } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";

import compareAddresses from "@/utils/compare-addresses";
import { SubmitButton } from "../submit-button";
import BillingAddress from "./billing-address";
import ErrorMessage from "./error-message";

const Addresses = ({
    cart,
    customer,
}: {
    cart: any | null;
    customer: any | null;
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "address";

    const { state: sameAsBilling, toggle: toggleSameAsBilling } =
        useToggleState(
            cart?.shipping_address && cart?.billing_address
                ? compareAddresses(
                      cart?.shipping_address,
                      cart?.billing_address
                  )
                : true
        );

    const handleEdit = () => {
        router.push(pathname + "?step=address");
    };

    const [message, formAction] = useActionState(setAddresses as any, null);

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <h2 className="flex flex-row text-3xl-regular gap-x-2 items-baseline font-medium">
                    Shipping Address
                    {!isOpen && <CheckCircleSolid />}
                </h2>
                {!isOpen && cart?.shipping_address && (
                    <Text>
                        <button
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            data-testid="edit-address-button"
                            onClick={handleEdit}
                            type="button"
                        >
                            Edit
                        </button>
                    </Text>
                )}
            </div>
            {isOpen ? (
                <form action={formAction}>
                    <div className="pb-8">
                        {/* <ShippingAddress
                            cart={cart}
                            checked={sameAsBilling}
                            customer={customer}
                            onChange={toggleSameAsBilling}
                        /> */}

                        {!sameAsBilling && (
                            <div>
                                <Heading
                                    className="text-3xl-regular gap-x-4 pb-6 pt-8"
                                    level="h2"
                                >
                                    Billing address
                                </Heading>

                                <BillingAddress cart={cart} />
                            </div>
                        )}
                        <SubmitButton
                            className="mt-6"
                            data-testid="submit-address-button"
                        >
                            Continue to delivery
                        </SubmitButton>
                        <ErrorMessage
                            data-testid="address-error-message"
                            error={message}
                        />
                    </div>
                </form>
            ) : (
                <div>
                    <div className="text-small-regular">
                        {cart && cart.shipping_address ? (
                            <div className="flex items-start gap-x-8">
                                <div className="flex items-start gap-x-1 w-full">
                                    <div
                                        className="flex flex-col w-1/3"
                                        data-testid="shipping-address-summary"
                                    >
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Shipping Address
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.first_name}{" "}
                                            {cart.shipping_address.last_name}
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.address_1}{" "}
                                            {cart.shipping_address.address_2}
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.postal_code},{" "}
                                            {cart.shipping_address.city}
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.country_code?.toUpperCase()}
                                        </Text>
                                    </div>

                                    <div
                                        className="flex flex-col w-1/3 "
                                        data-testid="shipping-contact-summary"
                                    >
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Contact
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.phone}
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.email}
                                        </Text>
                                    </div>

                                    <div
                                        className="flex flex-col w-1/3"
                                        data-testid="billing-address-summary"
                                    >
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Billing Address
                                        </Text>

                                        {sameAsBilling ? (
                                            <Text className="txt-medium text-ui-fg-subtle">
                                                Billing- and delivery address
                                                are the same.
                                            </Text>
                                        ) : (
                                            <>
                                                <Text className="txt-medium text-ui-fg-subtle">
                                                    {
                                                        cart.billing_address
                                                            ?.first_name
                                                    }{" "}
                                                    {
                                                        cart.billing_address
                                                            ?.last_name
                                                    }
                                                </Text>
                                                <Text className="txt-medium text-ui-fg-subtle">
                                                    {
                                                        cart.billing_address
                                                            ?.address_1
                                                    }{" "}
                                                    {
                                                        cart.billing_address
                                                            ?.address_2
                                                    }
                                                </Text>
                                                <Text className="txt-medium text-ui-fg-subtle">
                                                    {
                                                        cart.billing_address
                                                            ?.postal_code
                                                    }
                                                    ,{" "}
                                                    {cart.billing_address?.city}
                                                </Text>
                                                <Text className="txt-medium text-ui-fg-subtle">
                                                    {cart.billing_address?.country_code?.toUpperCase()}
                                                </Text>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Divider className="mt-8" />
        </div>
    );
};

export default Addresses;
