"use client";

import { useState } from "react";
import { useCart } from "react-use-cart";

import Image from "next/image";
import Link from "next/link";

// import Thumbnail from "./thumbnail";
import { Spinner } from "@ui/shadcn/spinner";
import { TypographyMuted, TypographyP } from "@ui/shadcn/typography";
import Cookies from "js-cookie";

import Thumbnail from "@/components/products/product-card/thumbnail";
import { TableCell, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { syncCartWithBackend, updateCart } from "@/services/cart";

import { convertToLocale } from "@/utils/money";

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
      <TableCell className="">
        <DeleteButton
          data-testid="product-delete-button"
          id={item.id}
          productId={item.productId}
        />
      </TableCell>

      <TableCell className="max-w-[16rem] px-2 py-4" rowSpan={1}>
        <Link className="" href={`/products/${item.handle}`}>
          <div className="flex items-center gap-2">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                alt={"-"}
                className="object-cover"
                fill
                src={item.gallery?.[0]?.url || ""}
              />
            </div>

            <div className="flex flex-col gap-1">
              <TypographyP className="text-md" data-testid="product-title">
                {item.productName}
              </TypographyP>

              <TypographyMuted className="">
                {item.quantity} X{" "}
                {convertToLocale({
                  hiddeCurrency: true,
                  amount: item?.price,
                })}{" "}
              </TypographyMuted>
            </div>
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <TypographyP className="">
          {convertToLocale({
            amount: item?.price,
          })}
        </TypographyP>
      </TableCell>

      {type === "full" && (
        <TableCell>
          <div className="flex items-center gap-2">
            <CartItemSelect
              className="h-10 w-14 p-4 "
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

      <TableCell align="right">
        <TypographyP className="font-semibold">
          {convertToLocale({
            amount: item.price * item.quantity,
          })}
        </TypographyP>
      </TableCell>
    </TableRow>
  );
};

export default Item;
