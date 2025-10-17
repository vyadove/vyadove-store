"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button, Label } from "@medusajs/ui";
import { useCheckoutSession } from "@/hooks/use-checkout-session";
import {
    createCheckoutSession,
    updateCheckoutSession,
} from "@/services/checkout-session";

interface AddressFormData {
    firstName: string;
    lastName: string;
    address: string;
    company?: string;
    postalCode: string;
    city: string;
    country: string;
    state?: string;
    email: string;
    phone?: string;
    billingAddressSame: boolean;
}

export default function Address() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {} = useCheckoutSession();

    const defaultValues =
        process.env.NODE_ENV === "development"
            ? {
                  firstName: "John",
                  lastName: "Doe",
                  address: "123 Testing Lane",
                  company: "Test Corp",
                  postalCode: "12345",
                  city: "Testville",
                  country: "us",
                  state: "Test State",
                  email: "john.doe@example.com",
                  phone: "1234567890",
                  billingAddressSame: true,
              }
            : {
                  billingAddressSame: true,
              };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AddressFormData>({
        defaultValues,
    });

    const billingAddressSame = watch("billingAddressSame");

    const onSubmit = async (data: AddressFormData) => {
        setIsLoading(true);
        try {
            const shippingAddress = {
                first_name: data.firstName,
                last_name: data.lastName,
                address_1: data.address,
                company: data.company,
                postal_code: data.postalCode,
                city: data.city,
                country_code: data.country,
                province: data.state,
                phone: data.phone,
            };

            const updateData = {
                shippingAddress,
                billingAddress: data.billingAddressSame
                    ? shippingAddress
                    : undefined,
            };

            await createCheckoutSession(updateData);

            router.push("/checkout/shipping");
        } catch (error) {
            console.error("Error updating address:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-6">
                    Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Input
                            autoComplete="given-name"
                            data-testid="shipping-first-name-input"
                            label="First name"
                            {...register("firstName", {
                                required: "First name is required",
                            })}
                            error={errors.firstName?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Last name*"
                            {...register("lastName", {
                                required: "Last name is required",
                            })}
                            error={errors.lastName?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Address*"
                            {...register("address", {
                                required: "Address is required",
                            })}
                            error={errors.address?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input label="Company" {...register("company")} />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Postal code*"
                            {...register("postalCode", {
                                required: "Postal code is required",
                            })}
                            error={errors.postalCode?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="City*"
                            {...register("city", {
                                required: "City is required",
                            })}
                            error={errors.city?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Select
                            onValueChange={(value) =>
                                setValue("country", value)
                            }
                            defaultValue="us"
                        >
                            <SelectTrigger className="bg-gray-50">
                                <SelectValue placeholder="Country*" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">
                                    United States
                                </SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="uk">
                                    United Kingdom
                                </SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.country && (
                            <p className="text-red-500 text-sm">
                                {errors.country.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="State / Province"
                            {...register("state")}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={billingAddressSame}
                                onChange={(checked: any) => {
                                    setValue(
                                        "billingAddressSame",
                                        checked.target.value
                                    );
                                }}
                                id="billingAddressSame"
                                label="Billing address same as shipping address"
                            />
                            <Label htmlFor="billingAddressSame">
                                Billing address same as shipping address
                            </Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input
                            label="Email*"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            autoComplete="tel"
                            data-testid="shipping-phone-input"
                            label="Phone"
                            {...register("phone")}
                        />
                    </div>
                </div>
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue to delivery"}
            </Button>
        </form>
    );
}
