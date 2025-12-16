"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useCheckout } from "@/providers/checkout";
import type { EnrichedCheckoutItem } from "@/providers/checkout/types";
import ErrorMessage from "@/scenes/cart/error-message";
import { Button } from "@ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/shadcn/select";
import { Spinner } from "@ui/shadcn/spinner";
import {
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { Trash } from "lucide-react";

import DeleteItemButton from "@/components/delete-item-button";
import { toast } from "@/components/ui/hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { convertToLocale } from "@/utils/money";

type ItemProps = {
  item: EnrichedCheckoutItem;
  type?: "full" | "preview";
};

const Item = ({ type = "full", item }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const { updateItemQuantity } = useCheckout();
  const [error, setError] = useState<null | string>(null);

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="">
        <DeleteItemButton
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
              <TypographyP
                className="relative text-md flex items-center gap-2 pr-2"
                data-testid="product-title"
              >
                {item.product?.title}

                {item?.isLoading && <Spinner className="absolute -right-4" />}
              </TypographyP>

              <TypographyMuted className="">
                {item.quantity} X{" "}
                {convertToLocale({
                  hiddeCurrency: true,
                  amount: item.unitPrice || 0,
                })}{" "}
              </TypographyMuted>
            </div>
          </div>
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <TypographyP className="">
          {convertToLocale({
            amount: item.unitPrice || 0,
          })}
        </TypographyP>
      </TableCell>

      {type === "full" && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Select
              disabled={updating}
              onValueChange={(value) => {
                void updateItemQuantity(item.variantId, Number.parseInt(value));
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
            // amount: (item.unitPrice || 0) * item.quantity,
            amount: item.totalPrice || 0,
          })}
        </TypographyP>
      </TableCell>
    </TableRow>
  );
};

const CartItems = () => {
  const { items, totalUniqueItems, emptyCart } = useCheckout();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <TypographyH2 className="">Basket</TypographyH2>
        <TypographyP className="">
          You have <span className="">{totalUniqueItems} Items</span> in your
          basket
        </TypographyP>
      </div>
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableCell className="rounded-l-lg font-semibold "></TableCell>
            <TableCell className="p-6 font-bold">Product</TableCell>
            <TableCell className="font-semibold ">Price</TableCell>
            <TableCell className="font-semibold">Quantity</TableCell>
            <TableCell align="right" className="rounded-r-lg p-6 font-semibold">
              Total
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {items.map((item) => {
            return <Item item={item} key={item.variantId} />;
          })}
        </TableBody>
      </Table>

      <div className="mt-10">
        <Button
          className="hover:text-destructive underline"
          onClick={async () => {
            try {
              const result = await emptyCart();

              if (result.id) {
                toast.success("Cleared basket");
              } else {
                toast.error("Failed to clear basket");
              }
            } catch (_) {
              toast.error("Failed to clear basket");
            }
          }}
          size="lg"
          variant="link"
        >
          <Trash className="" /> Clear Basket ({totalUniqueItems} Items)
        </Button>
      </div>
    </div>
  );
};

export default CartItems;
