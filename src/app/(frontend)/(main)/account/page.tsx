"use client";

import LoginTemplate from "@/app/(frontend)/_templates/login-template";
import { useAuth } from "../../_providers/auth";
import Overview from "../../_components/overview";

export default function AccountPage() {
	const { user } = useAuth();
	const orders = [
		{
			id: "1",
			order_number: "123456",
			status: "Shipped",
			date: "2023-01-01",
			total: "100.00",
		},
	];
	return user ? (
		<Overview customer={user} orders={orders} />
	) : (
		<LoginTemplate />
	);
}
