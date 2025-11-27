"use client";

import { useState } from "react";

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

import { TableCell, TableRow } from "@/components/ui/table";

import { useCart } from "@/providers/cart";


import type { StoreCartItem } from "@/providers/cart/store-cart";

import { convertToLocale } from "@/utils/money";

import DeleteButton from "./delete-button";
import ErrorMessage from "./error-message";

type ItemProps = {
  item: StoreCartItem;
  type?: "full" | "preview";
};

const Item = ({ type = "full", item }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const { updateItemQuantity } = useCart();
  const [error, setError] = useState<null | string>(null);

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    try {
      await updateItemQuantity(item.variantId, quantity);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="">
        <DeleteButton
          data-testid="product-delete-button"
          variantId={item.variantId}
        />
      </TableCell>

      <TableCell className="max-w-[16rem] px-2 py-4" rowSpan={1}>
        <Link className="" href={`/products/${item.product?.handle}`}>
          <div className="flex items-center gap-2">
            <div className="relative size-16 overflow-hidden rounded-lg">
              <Image
                alt={item.product?.title || "Product image"}
                className="object-cover"
                fill
                src={item.product?.gallery?.[0]?.url || ""}
              />
            </div>

            <div className="flex flex-col gap-1">
              <TypographyP className="text-md" data-testid="product-title">
                {item.product?.title}
              </TypographyP>

              <TypographyMuted className="">
                {item.quantity} X{" "}
                {convertToLocale({
                  hiddeCurrency: true,
                  amount: item.variant?.price || 0,
                })}{" "}
              </TypographyMuted>
            </div>
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <TypographyP className="">
          {convertToLocale({
            amount: item.variant?.price || 0,
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
                        {i + 1}
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
            amount: (item.variant?.price || 0) * item.quantity,
          })}
        </TypographyP>
      </TableCell>
    </TableRow>
  );
};

export default Item;
