import Overview from "../../_components/overview";
import { getOrders } from "@/features/order/orders";

export default async function AccountPage() {
    const orders = await getOrders();
    return <Overview orders={orders} />;
}
