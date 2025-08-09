"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrderSummery } from "@/templates/checkout/order-summary";
import { ShopNexIcon } from "@/components/icons/shopnex-icon";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const steps = [
    {
        id: 1,
        name: "Shipping Address",
        route: "/checkout/address",
        description: "Enter your shipping details",
    },
    {
        id: 2,
        name: "Delivery",
        route: "/checkout/shipping",
        description: "Choose delivery method",
    },
    {
        id: 3,
        name: "Payment",
        route: "/checkout/payment",
        description: "Enter payment details",
    },
    {
        id: 4,
        name: "Review",
        route: "/checkout/review",
        description: "Review your order",
    },
];

export default function CheckoutLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: any;
}) {
    const pathname = usePathname();

    const currentStepIndex = steps.findIndex((step) => step.route === pathname);

    return (
        <div className="w-full bg-white relative small:min-h-screen">
            <div className="h-16 bg-white border-b ">
                <nav className="flex h-full items-center content-container justify-between">
                    <Link
                        className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
                        data-testid="back-to-cart-link"
                        href="/cart"
                    >
                        <ChevronDown className="rotate-90" size={16} />
                        <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                            Back to shopping cart
                        </span>
                        <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                            Back
                        </span>
                    </Link>
                    <Link
                        className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
                        data-testid="store-link"
                        href="/"
                    >
                        ShopNex Store
                    </Link>
                    <div className="flex-1 basis-0" />
                </nav>
            </div>
            <div className="relative" data-testid="checkout-container">
                <div className="min-h-screen py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                {/* Step UI could be reused via context */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between">
                                        {steps.map((step, index) => (
                                            <div
                                                className="flex items-center"
                                                key={step.id}
                                            >
                                                <div
                                                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                                        index < currentStepIndex
                                                            ? "border-green-500 bg-green-500 text-white"
                                                            : index ===
                                                                currentStepIndex
                                                              ? "border-blue-500 text-blue-500"
                                                              : "border-gray-300 text-gray-300"
                                                    }`}
                                                >
                                                    <span className="text-sm font-medium">
                                                        {index <
                                                        currentStepIndex
                                                            ? "✓"
                                                            : step.id}
                                                    </span>
                                                </div>

                                                <div className="ml-3">
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            index ===
                                                            currentStepIndex
                                                                ? "text-black"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {step.name}
                                                    </p>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className="hidden sm:block w-16 h-0.5 ml-4 bg-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Step Content */}
                                <Card>
                                    <CardContent className="p-6">
                                        {children}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <OrderSummery />
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 w-full flex items-center justify-center">
                <ShopNexIcon />
            </div>
        </div>
    );
}
