import { Suspense } from "react";
import SideMenu from "./side-menu";
import Link from "next/link";
import CartButton from "../_components/cart-button";
import type { StoreSetting } from "@/payload-types";

export default async function Nav({
	storeSettings,
}: { storeSettings: StoreSetting }) {
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
							href="/"
							className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
							data-testid="nav-store-link"
						>
							{storeSettings?.name}
						</Link>
					</div>

					<div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
						<div className="hidden small:flex items-center gap-x-6 h-full">
							<Link
								className="hover:text-ui-fg-base"
								href="/account"
								data-testid="nav-account-link"
							>
								Account
							</Link>
						</div>
						<Suspense
							fallback={
								<Link
									className="hover:text-ui-fg-base flex gap-2"
									href="/cart"
									data-testid="nav-cart-link"
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
