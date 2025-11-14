"use client";

import { useCart } from "react-use-cart";

import { Button } from "@ui/shadcn/button";
import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { clearCart, updateCart } from "@/services/cart";

import Item from "./item";

const ItemsTemplate = () => {
  const { items, totalUniqueItems, emptyCart, id } = useCart();

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
        <TableHeader className="bg-accent  ">
          <TableRow>
            <TableCell className="rounded-l-lg "></TableCell>
            <TableCell className="p-6">Product</TableCell>
            <TableCell className="">Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell align="right" className="rounded-r-lg  p-6">
              Total
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {items.map((item: any) => {
            return (
              <Item currencyCode={item.currency} item={item} key={item.id} />
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-10">
        <Button
          className="hover:text-destructive underline"
          onClick={() => {
            clearCart({
              id: id,
            })
              .then((res) => {
                if (res.id) {
                  toast.success("Cleared basket");
                  emptyCart();

                  return;
                }
                toast.error("Failed to clear basket");
                toast.error("Failed to clear basket", res);
              })
              .catch((err) => {
                toast.error("Failed to clear basket");
                toast.error("Failed to clear basket");
                console.error("Failed to clear basket:", err);
              });
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

export default ItemsTemplate;
