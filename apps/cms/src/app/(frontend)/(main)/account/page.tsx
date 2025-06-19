import { getOrders } from "@/app/api/services/orders";

import Overview from "../../_components/overview";

export default async function AccountPage() {
    const orders = await getOrders();
    return <Overview orders={orders} />;
}
