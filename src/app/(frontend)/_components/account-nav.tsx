"use client";

import { clx } from "@medusajs/ui";
import { ArrowRightOnRectangle } from "@medusajs/icons";
import { useParams, usePathname } from "next/navigation";

import Link from "next/link";
import ChevronDown from "./icons/chevron-down";
import User from "./icons/user";
import MapPin from "./icons/map-pin";
import Package from "./icons/package";
import { useAuth } from "../_providers/auth";

const AccountNav = () => {
	const route = usePathname();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	if (!user) return null;

	return (
		<div>
			<div className="small:hidden" data-testid="mobile-account-nav">
				{route !== '/account' ? (
					<Link
						href="/account"
						className="flex items-center gap-x-2 text-small-regular py-2"
						data-testid="account-main-link"
					>
						<>
							<ChevronDown className="transform rotate-90" />
							<span>Account</span>
						</>
					</Link>
				) : (
					<>
						<div className="text-xl-semi mb-4 px-8">Hello {user?.email}</div>
						<div className="text-base-regular">
							<ul>
								<li>
									<Link
										href="/account/profile"
										className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
										data-testid="profile-link"
									>
										<>
											<div className="flex items-center gap-x-2">
												<User size={20} />
												<span>Profile</span>
											</div>
											<ChevronDown className="transform -rotate-90" />
										</>
									</Link>
								</li>
								<li>
									<Link
										href="/account/addresses"
										className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
										data-testid="addresses-link"
									>
										<>
											<div className="flex items-center gap-x-2">
												<MapPin size={20} />
												<span>Addresses</span>
											</div>
											<ChevronDown className="transform -rotate-90" />
										</>
									</Link>
								</li>
								<li>
									<Link
										href="/account/orders"
										className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
										data-testid="orders-link"
									>
										<div className="flex items-center gap-x-2">
											<Package size={20} />
											<span>Orders</span>
										</div>
										<ChevronDown className="transform -rotate-90" />
									</Link>
								</li>
								<li>
									<button
										type="button"
										className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
										onClick={handleLogout}
										data-testid="logout-button"
									>
										<div className="flex items-center gap-x-2">
											<ArrowRightOnRectangle />
											<span>Log out</span>
										</div>
										<ChevronDown className="transform -rotate-90" />
									</button>
								</li>
							</ul>
						</div>
					</>
				)}
			</div>
			<div className="hidden small:block" data-testid="account-nav">
				<div>
					<div className="pb-4">
						<h3 className="text-base-semi">Account</h3>
					</div>
					<div className="text-base-regular">
						<ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
							<li>
								<AccountNavLink
									href="/account"
									route={route}
									data-testid="overview-link"
								>
									Overview
								</AccountNavLink>
							</li>
							<li>
								<AccountNavLink
									href="/account/profile"
									route={route}
									data-testid="profile-link"
								>
									Profile
								</AccountNavLink>
							</li>
							<li>
								<AccountNavLink
									href="/account/addresses"
									route={route}
									data-testid="addresses-link"
								>
									Addresses
								</AccountNavLink>
							</li>
							<li>
								<AccountNavLink
									href="/account/orders"
									route={route}
									data-testid="orders-link"
								>
									Orders
								</AccountNavLink>
							</li>
							<li className="text-grey-700">
								<button
									type="button"
									onClick={handleLogout}
									data-testid="logout-button"
								>
									Log out
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

type AccountNavLinkProps = {
	href: string;
	route: string;
	children: React.ReactNode;
	"data-testid"?: string;
};

const AccountNavLink = ({
	href,
	route,
	children,
	"data-testid": dataTestId,
}: AccountNavLinkProps) => {
	const active = route === href;
	return (
		<Link
			href={href}
			className={clx("text-ui-fg-subtle hover:text-ui-fg-base", {
				"text-ui-fg-base font-semibold": active,
			})}
			data-testid={dataTestId}
		>
			{children}
		</Link>
	);
};

export default AccountNav;
