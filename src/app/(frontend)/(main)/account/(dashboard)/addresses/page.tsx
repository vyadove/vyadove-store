import AddressBook from "@/app/(frontend)/_components/address-book";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Addresses",
	description: "View your addresses",
};

export default async function Addresses(props: {
	params: Promise<{ countryCode: string }>;
}) {
	const customer = {
		id: "1",
		first_name: "John",
		last_name: "Doe",
		email: "john.doe@example.com",
		phone: "555-555-5555",
		addresses: [
			{
				id: "1",
				first_name: "John",
				last_name: "Doe",
				email: "john.doe@example.com",
				phone: "555-555-5555",
				address1: "123 Main St",
				address2: "Suite 100",
				city: "New York",
				state: "NY",
				zip: "10001",
				country: "US",
				country_code: "US",
			},
		],
	};

	if (!customer) {
		notFound();
	}

	return (
		<div className="w-full" data-testid="addresses-page-wrapper">
			<div className="mb-8 flex flex-col gap-y-4">
				<h1 className="text-2xl-semi">Shipping Addresses</h1>
				<p className="text-base-regular">
					View and update your shipping addresses, you can add as many as you
					like. Saving your addresses will make them available during checkout.
				</p>
			</div>
			<AddressBook customer={customer as any} />
		</div>
	);
}
