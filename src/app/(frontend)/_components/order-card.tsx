import { Button } from "@medusajs/ui";
import { useMemo } from "react";
import { convertToLocale } from "../_util/money";
import Thumbnail from "./thumbnail";
import Link from "next/link";
import type { Order } from "@/payload-types";

type OrderCardProps = {
    order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
    const numberOfLines = useMemo(() => {
        return (
            order.items?.reduce((acc: any, item: any) => {
                return acc + item.quantity;
            }, 0) ?? 0
        );
    }, [order]);

    const numberOfProducts = useMemo(() => {
        return order.items?.length ?? 0;
    }, [order]);

    return (
        <div className="bg-white flex flex-col" data-testid="order-card">
            <div className="uppercase text-large-semi mb-1">
                #<span data-testid="order-display-id">{order.orderId}</span>
            </div>
            <div className="flex items-center divide-x divide-gray-200 text-small-regular text-ui-fg-base">
                <span className="pr-2" data-testid="order-created-at">
                    {new Date(order.createdAt).toDateString()}
                </span>
                <span className="px-2" data-testid="order-amount">
                    {convertToLocale({
                        amount: order.totalAmount,
                        currency_code: order.currency,
                    })}
                </span>
                <span className="pl-2">{`${numberOfLines} ${numberOfLines > 1 ? "items" : "item"}`}</span>
            </div>
            <div className="grid grid-cols-2 small:grid-cols-4 gap-4 my-4">
                {order.items?.slice(0, 3).map((i: any) => {
                    return (
                        <div
                            key={i.id}
                            className="flex flex-col gap-y-2"
                            data-testid="order-item"
                        >
                            <Thumbnail
                                thumbnail={
                                    i.product.variants[0]?.imageUrl ||
                                    i.product.variants[0]?.gallery?.[0]?.url
                                }
                                images={[]}
                                size="full"
                            />
                            <div className="flex items-center text-small-regular text-ui-fg-base">
                                <span
                                    className="text-ui-fg-base font-semibold"
                                    data-testid="item-title"
                                >
                                    {i.title}
                                </span>
                                <span className="ml-2">x</span>
                                <span data-testid="item-quantity">
                                    {i.quantity}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {numberOfProducts > 4 && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-small-regular text-ui-fg-base">
                            + {numberOfLines - 4}
                        </span>
                        <span className="text-small-regular text-ui-fg-base">
                            more
                        </span>
                    </div>
                )}
            </div>
            <div className="flex justify-end">
                <Link href={`/account/orders/details/${order.id}`}>
                    <Button
                        data-testid="order-details-link"
                        variant="secondary"
                    >
                        See details
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderCard;
