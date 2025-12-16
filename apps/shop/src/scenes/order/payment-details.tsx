import Link from "next/link";

import { Badge } from "@ui/shadcn/badge";
import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import { CreditCard } from "lucide-react";

import Divider from "@/components/divider";

import { cn } from "@/lib/utils";

import { convertToLocale } from "@/utils/money";

type PaymentDetailsProps = {
  order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <TypographyH2 className="">Payment</TypographyH2>

      <div className="flex gap-x-8 [&>*]:flex-1">
        <div className="flex flex-col">
          <TypographyP className="text-muted-foreground font-light">
            Payment method
          </TypographyP>
          <TypographyP className="font-semibold capitalize">
            {((order.payment as any)?.name as string) || "-"}
          </TypographyP>
        </div>

        <div className="flex flex-col items-start">
          <TypographyP className="text-muted-foreground font-light">
            Payment Status
          </TypographyP>
          <Badge className="bg-primary-background text-primary border-primary/30 mt-2 p-2 px-3 text-sm capitalize">
            {order.paymentStatus}
          </Badge>
        </div>

        <div className="flex flex-col items-start">
          <TypographyP className="text-muted-foreground font-light">
            Receipt URL
          </TypographyP>
          <Link
            className={cn(
              "line-clamp-2",
              order.receiptUrl
                ? "text-blue-600 underline"
                : "text-muted-foreground pointer-events-none",
            )}
            href={order.receiptUrl || "#"}
            target="_blank"
          >
            {order.receiptUrl || "-"}
          </Link>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  );
};

export default PaymentDetails;
