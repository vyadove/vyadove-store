import { useEffect, useState } from "react";

import Item from "@/scenes/cart/item";
import { Table, TableBody } from "@ui/shadcn/table";
import type { Order, Product } from "@vyadove/types";
import type { Cart } from "@vyadove/types";
import { toast } from "sonner";

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

  useEffect(() => {
    if(cart?.cartItems)
      return;

    payloadSdk
      .find({
        collection: "carts",
        limit: 1,
        where: {
          id: {
            equals: order.cart as any,
          },
        },
      })
      .then((res) => {


        if (res.totalDocs > 0) {
          setCartItems(res.docs[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        toast.error("There was an error fetching the cart details.");
      });
  }, []);

  console.log('cart --- : ', cart);

  if (!cart) {
    return null;
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
