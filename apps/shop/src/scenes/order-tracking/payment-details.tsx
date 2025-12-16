import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import { CreditCard } from "lucide-react";

import Divider from "@/components/divider";

import { convertToLocale } from "@/utils/money";

type PaymentDetailsProps = {
  order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  return (
    <div>
      <TypographyH2 className="my-6 flex  flex-row">Payment</TypographyH2>
      <div>
        <div className="flex w-full items-start gap-x-1">
          <div className="flex w-1/3 flex-col">
            <TypographyP className="txt-medium-plus text-ui-fg-base mb-1">
              Payment method
            </TypographyP>
            <TypographyP
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method"
            >
              {order.paymentMethod === "card"
                ? "Credit Card"
                : order.paymentMethod}
            </TypographyP>
          </div>
          <div className="flex w-2/3 flex-col">
            <TypographyP className="txt-medium-plus text-ui-fg-base mb-1">
              Payment details
            </TypographyP>
            <div className="txt-medium text-ui-fg-subtle mt-2 flex items-center gap-2">
              <div className="bg-ui-button-neutral-hover flex h-7 w-fit items-center p-2">
                <CreditCard />
              </div>
              <TypographyP data-testid="payment-amount">
                {convertToLocale({
                  amount: order.totalAmount,
                  currency_code: order.currency,
                })}{" "}
                paid at {new Date(order.createdAt ?? "").toLocaleString()}
              </TypographyP>
            </div>
          </div>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  );
};

export default PaymentDetails;
