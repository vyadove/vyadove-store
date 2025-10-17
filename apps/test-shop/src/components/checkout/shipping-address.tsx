import { Container } from "@medusajs/ui";
import { mapKeys } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import CheckboxWithLabel from "../checkbox";
import Input from "../input";
import AddressSelect from "./address-select";
import CountrySelect from "./country-select";

const ShippingAddress = ({
    cart,
    checked,
    customer,
    onChange,
}: {
    cart: any | null;
    checked: boolean;
    customer: any | null;
    onChange: () => void;
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        email: cart?.email || "",
        "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
        "shipping_address.city": cart?.shipping_address?.city || "",
        "shipping_address.company": cart?.shipping_address?.company || "",
        "shipping_address.country_code":
            cart?.shipping_address?.country_code || "",
        "shipping_address.first_name": cart?.shipping_address?.first_name || "",
        "shipping_address.last_name": cart?.shipping_address?.last_name || "",
        "shipping_address.phone": cart?.shipping_address?.phone || "",
        "shipping_address.postal_code":
            cart?.shipping_address?.postal_code || "",
        "shipping_address.province": cart?.shipping_address?.province || "",
    });

    const countriesInRegion = useMemo(
        () => cart?.region?.countries?.map((c: any) => c.iso_2),
        [cart?.region]
    );

    // check if customer has saved addresses that are in the current region
    const addressesInRegion = useMemo(
        () =>
            customer?.addresses?.filter(
                (a: any) =>
                    a.country_code &&
                    countriesInRegion?.includes(a.country_code)
            ),
        [customer?.addresses, countriesInRegion]
    );

    const setFormAddress = (address?: any, email?: string) => {
        address &&
            setFormData((prevState: Record<string, any>) => ({
                ...prevState,
                "shipping_address.address_1": address?.address_1 || "",
                "shipping_address.city": address?.city || "",
                "shipping_address.company": address?.company || "",
                "shipping_address.country_code": address?.country_code || "",
                "shipping_address.first_name": address?.first_name || "",
                "shipping_address.last_name": address?.last_name || "",
                "shipping_address.phone": address?.phone || "",
                "shipping_address.postal_code": address?.postal_code || "",
                "shipping_address.province": address?.province || "",
            }));

        email &&
            setFormData((prevState: Record<string, any>) => ({
                ...prevState,
                email,
            }));
    };

    useEffect(() => {
        // Ensure cart is not null and has a shipping_address before setting form data
        if (cart && cart.shipping_address) {
            setFormAddress(cart?.shipping_address, cart?.email);
        }

        if (cart && !cart.email && customer?.email) {
            setFormAddress(undefined, customer.email);
        }
    }, [cart]); // Add cart as a dependency

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {customer && (addressesInRegion?.length || 0) > 0 && (
                <Container className="mb-6 flex flex-col gap-y-4 p-5">
                    <p className="text-small-regular">
                        {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
                    </p>
                    <AddressSelect
                        addresses={customer.addresses}
                        addressInput={
                            mapKeys(formData, (_, key) =>
                                key.replace("shipping_address.", "")
                            ) as any
                        }
                        onSelect={setFormAddress}
                    />
                </Container>
            )}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    autoComplete="given-name"
                    data-testid="shipping-first-name-input"
                    label="First name"
                    name="shipping_address.first_name"
                    onChange={handleChange}
                    required
                    value={formData["shipping_address.first_name"]}
                />
                <Input
                    autoComplete="family-name"
                    data-testid="shipping-last-name-input"
                    label="Last name"
                    name="shipping_address.last_name"
                    onChange={handleChange}
                    required
                    value={formData["shipping_address.last_name"]}
                />
                <Input
                    autoComplete="address-line1"
                    data-testid="shipping-address-input"
                    label="Address"
                    name="shipping_address.address_1"
                    onChange={handleChange}
                    required
                    value={formData["shipping_address.address_1"]}
                />
                <Input
                    autoComplete="organization"
                    data-testid="shipping-company-input"
                    label="Company"
                    name="shipping_address.company"
                    onChange={handleChange}
                    value={formData["shipping_address.company"]}
                />
                <Input
                    autoComplete="postal-code"
                    data-testid="shipping-postal-code-input"
                    label="Postal code"
                    name="shipping_address.postal_code"
                    onChange={handleChange}
                    required
                    value={formData["shipping_address.postal_code"]}
                />
                <Input
                    autoComplete="address-level2"
                    data-testid="shipping-city-input"
                    label="City"
                    name="shipping_address.city"
                    onChange={handleChange}
                    required
                    value={formData["shipping_address.city"]}
                />
                <CountrySelect
                    autoComplete="country"
                    data-testid="shipping-country-select"
                    defaultValue={"us"}
                    name="shipping_address.country_code"
                    onChange={handleChange}
                    region={{
                        countries: [
                            { label: "United States", value: "us" },
                            { label: "Canada", value: "ca" },
                        ],
                    }}
                    required
                    value={formData["shipping_address.country_code"]}
                />
                <Input
                    autoComplete="address-level1"
                    data-testid="shipping-province-input"
                    label="State / Province"
                    name="shipping_address.province"
                    onChange={handleChange}
                    value={formData["shipping_address.province"]}
                />
            </div>
            <div className="my-8">
                <CheckboxWithLabel
                    checked={checked}
                    data-testid="billing-address-checkbox"
                    id="same-as-billing"
                    label="Billing address same as shipping address"
                    name="same_as_billing"
                    onChange={onChange}
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                    autoComplete="email"
                    data-testid="shipping-email-input"
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    required
                    title="Enter a valid email address."
                    type="email"
                    value={formData.email}
                />
                <Input
                    autoComplete="tel"
                    data-testid="shipping-phone-input"
                    label="Phone"
                    name="shipping_address.phone"
                    onChange={handleChange}
                    value={formData["shipping_address.phone"]}
                />
            </div>
        </>
    );
};

export default ShippingAddress;
