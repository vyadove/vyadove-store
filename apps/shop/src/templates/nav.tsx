import CartButton from "@/components/cart-button";
import Link from "next/link";
import { Suspense } from "react";

import SideMenu from "./side-menu";

export default function Nav({ storeSettings }: { storeSettings: any }) {
    return (
        <div className="sticky top-0 inset-x-0 z-50 group">
            <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
                <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
                    <div className="flex-1 basis-0 h-full flex items-center">
                        <div className="h-full">
                            <SideMenu storeSettings={storeSettings} />
                        </div>
                    </div>

                    <div className="flex items-center h-full">
                        <Link
                            className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
                            data-testid="nav-store-link"
                            href="/"
                        >
                            {storeSettings?.name}
                        </Link>
                    </div>

                    <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
                        <div className="hidden small:flex items-center gap-x-6 h-full">
                            <Link
                                className="hover:text-ui-fg-base"
                                data-testid="nav-account-link"
                                href="/account"
                            >
                                Account
                            </Link>
                        </div>
                        <Suspense
                            fallback={
                                <Link
                                    className="hover:text-ui-fg-base flex gap-2"
                                    data-testid="nav-cart-link"
                                    href="/cart"
                                >
                                    Cart (0)
                                </Link>
                            }
                        >
                            <CartButton />
                        </Suspense>
                    </div>
                </nav>
            </header>
        </div>
    );
}
