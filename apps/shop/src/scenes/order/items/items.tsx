import { useEffect, useState } from "react";

import Item from "@/scenes/cart/item";
import { Table, TableBody } from "@ui/shadcn/table";
import type { Order, Product } from "@vyadove/types";
import type { Cart } from "@vyadove/types";

import Divider from "@/components/divider";

import { isExpandedDoc } from "@/utils/is-expanded-doc";
import { payloadSdk } from "@/utils/payload-sdk";

type ItemsProps = {
  order: Order;
};

const Items = ({ order }: ItemsProps) => {
  const [cart, setCartItems] = useState<Cart>();

  // const { cartItems } = order.cart;
  const items = cart?.cartItems?.map((item) => {
    const { variantId } = item;
    const product = item.product as Product;
    const variant = product.variants.find(
      (variant) => variant.id === variantId,
    );

    return {
      ...variant,
      gallery: product.variants[0]?.gallery,
      productName: product.title,
      quantity: item.quantity,
    };
  });


  if (!cart) {
    return 'no cart';
  }

  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      <Table>
        <TableBody data-testid="products-table">
          {items?.map((item) => {
            return (
              <Item currencyCode={"usd"} item={item as any} key={item.id} />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Items;
