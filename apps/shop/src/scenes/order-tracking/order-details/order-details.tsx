import { TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";

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
      <TypographyP>
        We have sent the order confirmation details to{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          : {typeof order.user !== "number" && order.user?.email || '-'}
        </span>
        .
      </TypographyP>
      <TypographyP className="mt-2">
        Order date:{" "}
        <span data-testid="order-date">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </TypographyP>
      <TypographyP className="text-ui-fg-interactive mt-2">
        Order number: <span data-testid="order-id">{order.orderId}</span>
      </TypographyP>

      <div className="text-compact-small mt-4 flex items-center gap-x-4">
        {showStatus && (
          <>
            <TypographyP>
              Order status:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.orderStatus)}
              </span>
            </TypographyP>
            <TypographyP>
              Payment status:{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.paymentStatus)}
              </span>
            </TypographyP>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
