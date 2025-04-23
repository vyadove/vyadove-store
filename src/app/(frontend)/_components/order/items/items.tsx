import type { Order, Product } from "@/payload-types";

import { Table } from "@medusajs/ui";

import Divider from "../../divider";
import Item from "../item/item";

type ItemsProps = {
    order: Order;
};

const Items = ({ order }: ItemsProps) => {
    const items = order.items.map((item) => {
        const { variantId } = item.variant;
        const product = item.product as Product;
        const variant = product.variants.find(
            (variant) => variant.vid === variantId
        );

        return {
            ...variant,
            gallery: product.variants[0].gallery,
            productName: product.title,
            quantity: item.quantity,
        };
    });

    return (
        <div className="flex flex-col">
            <Divider className="!mb-0" />
            <Table>
                <Table.Body data-testid="products-table">
                    {items.map((item) => {
                        return (
                            <Item
                                currencyCode={"usd"}
                                item={item as any}
                                key={item.vid}
                            />
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default Items;
