import { Table, Text } from "@medusajs/ui";
import LineItemOptions from "../../line-item-options";
import LineItemUnitPrice from "../../line-item-unit-price";
import Thumbnail from "../../thumbnail";
import LineItemPrice from "../../line-item-price";

type ItemProps = {
    item: {
        imageUrl: string;
        productName: string;
        quantity: number;
        price: number;
        options?: { option: string; value: string }[];
        id?: string | null;
    };
    currencyCode: string;
};

const Item = ({ item, currencyCode }: ItemProps) => {
    return (
        <Table.Row className="w-full" data-testid="product-row">
            <Table.Cell className="!pl-0 p-4 w-24">
                <div className="flex w-16">
                    <Thumbnail thumbnail={item.imageUrl} size="square" />
                </div>
            </Table.Cell>

            <Table.Cell className="text-left">
                <Text
                    className="txt-medium-plus text-ui-fg-base"
                    data-testid="product-name"
                >
                    {item.productName}
                </Text>
                <LineItemOptions
                    variant={{
                        options: item.options,
                        title: item.productName,
                    }}
                    data-testid="product-variant"
                />
            </Table.Cell>

            <Table.Cell className="!pr-0">
                <span className="!pr-0 flex flex-col items-end h-full justify-center">
                    <span className="flex gap-x-1 items-center">
                        <Text className="text-ui-fg-muted">
                            <span data-testid="product-quantity">
                                {item.quantity}
                            </span>
                            x{" "}
                        </Text>
                        <LineItemUnitPrice
                            item={item}
                            style="tight"
                            currencyCode={currencyCode}
                        />
                    </span>

                    <LineItemPrice
                        cartTotal={item.price * item.quantity}
                        style="tight"
                        currencyCode={currencyCode}
                    />
                </span>
            </Table.Cell>
        </Table.Row>
    );
};

export default Item;
