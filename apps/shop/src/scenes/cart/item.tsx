"use client";

import { useState } from "react";
import { useCart } from "react-use-cart";

import Image from "next/image";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadcn/select";
// import Thumbnail from "./thumbnail";
import { Spinner } from "@ui/shadcn/spinner";
import { TypographyMuted, TypographyP } from "@ui/shadcn/typography";
import Cookies from "js-cookie";

import { TableCell, TableRow } from "@/components/ui/table";

import { syncCartWithBackend } from "@/services/cart";

import { convertToLocale } from "@/utils/money";

import DeleteButton from "./delete-button";
import ErrorMessage from "./error-message";

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
            <div className="relative size-16 overflow-hidden rounded-lg">
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
            <Select
              disabled={updating}
              onValueChange={(value) => {
                changeQuantity(Number.parseInt(value));
              }}
              value={item.quantity?.toString()}
            >
              <SelectTrigger className="w-14 cursor-pointer">
                <SelectValue placeholder="Update quantity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.from(
                    {
                      length: 10,
                    },
                    (_, i) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={i}
                        value={`${i + 1}`}
                      >
                        {i}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
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
