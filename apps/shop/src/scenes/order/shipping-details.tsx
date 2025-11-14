import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";

import Divider from "@/components/divider";

type ShippingDetailsProps = {
  order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <TypographyH2 className="text-3xl-regular my-6 flex flex-row">
        Delivery
      </TypographyH2>
      <div className="flex items-start gap-x-8">
        <div
          className="flex w-1/3 flex-col"
          data-testid="shipping-address-summary"
        >
          <TypographyP className="txt-medium-plus text-ui-fg-base mb-1">
            Shipping Address
          </TypographyP>
          <TypographyP className="txt-medium text-ui-fg-subtle">
            {order.shippingAddress?.name} {order.shippingAddress?.phone}
            {(order.shippingAddress as any)?.email}
          </TypographyP>

          <TypographyP className="txt-medium text-ui-fg-subtle">
            {order.shippingAddress?.address?.country?.toUpperCase()}
          </TypographyP>
        </div>

        <div
          className="flex w-1/3 flex-col "
          data-testid="shipping-contact-summary"
        >
          <TypographyP className="txt-medium-plus text-ui-fg-base mb-1">
            Contact
          </TypographyP>
          <TypographyP className="txt-medium text-ui-fg-subtle">
            {order.shippingAddress?.phone}
          </TypographyP>
          <TypographyP className="txt-medium text-ui-fg-subtle">
            {typeof order?.user === "object" && order.user?.email}
          </TypographyP>
        </div>

        <div
          className="flex w-1/3 flex-col"
          data-testid="shipping-method-summary"
        >
          <TypographyP className="txt-medium-plus text-ui-fg-base mb-1">
            Method
          </TypographyP>
          <TypographyP className="txt-medium text-ui-fg-subtle">
            Link ( digital )
          </TypographyP>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
