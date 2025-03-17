import type { Metadata } from "next";

import { notFound } from "next/navigation";
import OrderOverview from "@/app/(frontend)/_components/order-overview";
import Divider from "@/app/(frontend)/_components/divider";
import { getPayload } from "payload";
import config from "@payload-config";

export const metadata: Metadata = {
	title: "Orders",
	description: "Overview of your previous orders.",
};

export default async function Orders() {
	const payload = await getPayload({ config: config })
	const ordersResult = await payload.find({
		collection: "orders",
		limit: 10,
		sort: "createdAt",
	})
	const orders = ordersResult.docs

	if (!orders) {
		notFound();
	}

	return (
		<div className="w-full" data-testid="orders-page-wrapper">
			<div className="mb-8 flex flex-col gap-y-4">
				<h1 className="text-2xl-semi">Orders</h1>
				<p className="text-base-regular">
					View your previous orders and their status. You can also create
					returns or exchanges for your orders if needed.
				</p>
			</div>
			<div>
				<OrderOverview orders={orders} />
				<Divider className="my-16" />
			</div>
		</div>
	);
}
