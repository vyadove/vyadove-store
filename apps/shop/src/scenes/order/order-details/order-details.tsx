import { Button } from "@ui/shadcn/button";
import { TypographyLead, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";

import Divider from "@/components/divider";

import { cn } from "@/lib/utils";

type OrderDetailsProps = {
  order: Order;
  showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ");

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  return (
    <div>
      <div className={cn("bg-primary flex w-full rounded-xl p-6 items-center")}>
        <div className="border-primary-600 flex flex-1 flex-col gap-2 border-r px-6 py-4">
          <TypographyP className="flelx-col text-muted-200 flex flex-1 gap-2">
            Order ID
          </TypographyP>

          <TypographyLead className="text-primary-foreground flex flex-1 flex-col gap-2">
            {order.orderId}
          </TypographyLead>
        </div>

        <div className="border-primary-600 flex flex-1 flex-col gap-2 border-r px-6 py-4">
          <TypographyP className="flelx-col text-muted-200 flex flex-1 gap-2">
            Payment Method
          </TypographyP>

          <TypographyLead className="flelx-col text-primary-foreground flex flex-1 gap-2">
            TeleBirr
          </TypographyLead>
        </div>

        <div className="border-primary-600 flex flex-1 flex-col gap-2 border-r px-6 py-4">
          <TypographyP className="flelx-col text-muted-200 flex flex-1 gap-2">
            Transaction ID
          </TypographyP>

          <TypographyLead className="flelx-col text-primary-foreground flex flex-1 gap-2">
            TRX523HSD
          </TypographyLead>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-6 py-4">
          <TypographyP className="flelx-col text-muted-200 flex flex-1 gap-2">
            Created At
          </TypographyP>

          <TypographyLead className="flelx-col text-primary-foreground flex flex-1 gap-2">
            {new Date(order.createdAt).toDateString()}
          </TypographyLead>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-6 py-4">
          <Button size="lg" variant='accent'>Download Invoice</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
