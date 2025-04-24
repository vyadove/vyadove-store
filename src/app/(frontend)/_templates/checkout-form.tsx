import { listCartShippingMethods } from "@/app/api/services/fulfillment";
import { listCartPaymentMethods } from "@/app/api/services/payment";

import Addresses from "../_components/checkout/addresses";
import Payment from "../_components/checkout/payment";
import Review from "../_components/checkout/review";
import Shipping from "../_components/checkout/shipping";

export default async function CheckoutForm({
    cart,
    customer,
}: {
    cart: any | null;
    customer: any | null;
}) {
    if (!cart) {
        return null;
    }

    const shippingMethods = await listCartShippingMethods(cart.id);
    const paymentMethods = await listCartPaymentMethods();

    if (!shippingMethods || !paymentMethods) {
        return null;
    }

    return (
        <div className="w-full grid grid-cols-1 gap-y-8">
            <Addresses cart={cart} customer={customer} />

            <Shipping availableShippingMethods={shippingMethods} cart={cart} />

            <Payment availablePaymentMethods={paymentMethods} cart={cart} />

            <Review cart={cart} />
        </div>
    );
}
