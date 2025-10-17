"use client";

import { Heading, Table } from "@medusajs/ui";
import { useCart } from "react-use-cart";

import Item from "@/components/item";

const ItemsTemplate = () => {
    const { items } = useCart();
    return (
        <div>
            <div className="pb-3 flex items-center">
                <Heading className="text-[2rem] leading-[2.75rem]">
                    Cart
                </Heading>
            </div>
            <Table>
                <Table.Header className="border-t-0">
                    <Table.Row className="text-ui-fg-subtle txt-medium-plus">
                        <Table.HeaderCell className="!pl-0">
                            Item
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell className="hidden small:table-cell">
                            Price
                        </Table.HeaderCell>
                        <Table.HeaderCell className="!pr-0 text-right">
                            Total
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map((item: any) => {
                        return (
                            <Item
                                currencyCode={item.currency}
                                item={item}
                                key={item.id}
                            />
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ItemsTemplate;
