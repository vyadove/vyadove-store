"use client";

import { useState } from "react";
import { useCart } from "react-use-cart";

import Link from "next/link";

// import Thumbnail from "./thumbnail";
import { Spinner } from "@ui/shadcn/spinner";
import { TypographyP } from "@ui/shadcn/typography";
import Cookies from "js-cookie";

import Thumbnail from "@/components/products/product-card/thumbnail";
import { TableCell, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { syncCartWithBackend, updateCart } from "@/services/cart";

import CartItemSelect from "./cart-item-select";
import DeleteButton from "./delete-button";
import ErrorMessage from "./error-message";
import LineItemPrice from "./line-item-price";
import LineItemUnitPrice from "./line-item-unit-price";

type ItemProps = {
  currencyCode: string;
  item: any;
  type?: "full" | "preview";
};

const getSessionId = () => {
  return Cookies.get("cart-session") || "";
};

const Item = ({ type = "full", currencyCode, item }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const { updateItemQuantity } = useCart();
  const [error, setError] = useState<null | string>(null);

  const changeQuantity = (quantity: number) => {
    setError(null);
    setUpdating(true);

    setTimeout(async () => {
      updateItemQuantity(item.id, quantity);

      try {
        const sessionId = getSessionId();

        await syncCartWithBackend(
          {
            id: item.id,
            product: item.productId,
            variantId: item.id,
            quantity,
            action: "update",
          },
          sessionId,
        );
      } catch (error: any) {
        setError(error.message);
      }
      setUpdating(false);
    }, 200);
  };

  const maxQuantity = item?.manage_inventory ? 10 : 10;

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="w-24 p-4 !pl-0">
        <Link
          className={cn("flex", {
            "small:w-24 w-12": type === "full",
            "w-16": type === "preview",
          })}
          href={`/products/${item.handle}`}
        >
          <Thumbnail size="square" thumbnail={item.gallery?.[0]?.url} />
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <TypographyP
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.productName}
        </TypographyP>
        Options/variants here
        {/*<LineItemOptions data-testid="product-variant" variant={item} />*/}
      </TableCell>

      {type === "full" && (
        <TableCell>
          <div className="flex w-28 items-center gap-2">
            <DeleteButton
              data-testid="product-delete-button"
              id={item.id}
              productId={item.productId}
            />
            <CartItemSelect
              className="h-10 w-14 p-4"
              data-testid="product-select-button"
              onChange={(value: any) =>
                changeQuantity(Number.parseInt(value.target.value))
              }
              value={item.quantity}
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ),
              )}

              <option key={1} value={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage data-testid="product-error-message" error={error} />
        </TableCell>
      )}

      {type === "full" && (
        <TableCell className="small:table-cell hidden">
          <LineItemUnitPrice
            currencyCode={currencyCode}
            item={item}
            style="tight"
          />
        </TableCell>
      )}

      <TableCell className="!pr-0">
        <span
          className={cn("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          <LineItemPrice
            cartTotal={item.price * item.quantity}
            currencyCode={currencyCode}
            originalPrice={item.originalPrice}
            style="tight"
          />
        </span>
      </TableCell>
    </TableRow>
  );
};

export default Item;
