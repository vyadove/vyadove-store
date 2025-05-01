import { Divider } from "@medusajs/ui";

import CartTotals from "../_components/cart-totals";
import { DiscountCode } from "../_components/discount-code";
import ItemsPreviewTemplate from "./preview";

const CheckoutSummary = ({ cart }: { cart: any }) => {
    return (
        <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
            <div className="w-full bg-white flex flex-col">
                <Divider className="my-6 small:hidden" />
                <h2 className="flex flex-row text-3xl-regular items-baseline font-medium">
                    In your Cart
                </h2>
                <Divider className="my-6" />
                <CartTotals />
                <ItemsPreviewTemplate cart={cart} />
                <div className="my-6">{/* <DiscountCode cart={cart} /> */}</div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
