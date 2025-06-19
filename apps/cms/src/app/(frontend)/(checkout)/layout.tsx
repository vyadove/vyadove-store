import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

import ChevronDown from "../_components/icons/chevron-down";
import { ShopNexIcon } from "../_components/icons/shopnex-icon";

export const metadata: Metadata = {
    title: "Secure Checkout | ShopNex",
    description: "Complete your purchase safely and securely",
    robots: "noindex, nofollow",
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                {children}
            </div>
            <div className="py-4 w-full flex items-center justify-center">
                <ShopNexIcon />
            </div>
        </div>
    );
}
