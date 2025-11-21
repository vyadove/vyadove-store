import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";

import Divider from "@/components/divider";

type ShippingDetailsProps = {
  order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const items: Record<string, any>[] = [];

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2 className="">Delivery</TypographyH2>
      <div className="flex [&>*]:flex-1 gap-x-8">
        <div className="flex flex-col">
          <TypographyP className="text-muted-foreground font-light">
            Recipient Contact
          </TypographyP>
          <TypographyP className="font-semibold capitalize">
            {order.shippingAddress?.recipientEmail as string} <br />
            {order.shippingAddress?.recipientPhone as string}
          </TypographyP>
        </div>

        <div className="flex flex-col">
          <TypographyP className="text-muted-foreground font-light">
            Recipient
          </TypographyP>
          <TypographyP className="font-semibold capitalize">
            {order.shippingAddress?.recipientFirstName as string}{" "}
            {order.shippingAddress?.recipientLastName as string}
          </TypographyP>
        </div>

        <div
          className="flex flex-col"
        >
          <TypographyP className="text-muted-foreground font-light">
            Method
          </TypographyP>
          <TypographyP className="font-semibold capitalize">
            {typeof order.shipping === "number" ? "-" : order.shipping?.name}
          </TypographyP>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
