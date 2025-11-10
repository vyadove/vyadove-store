"use client";

import { useCart } from "react-use-cart";

import Item from "./item";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ItemsTemplate = () => {
  const { items } = useCart();

  return (
    <div>
      <div className="flex items-center pb-3">
        <header className="text-[2rem] leading-[2.75rem]">Cart</header>
      </div>
      <Table>
        <TableHeader className="border-t-0">
          <TableRow className="text-ui-fg-subtle txt-medium-plus">
            <TableCell className="!pl-0">Item</TableCell>
            <TableCell />
            <TableCell>Quantity</TableCell>
            <TableCell className="small:table-cell hidden">Price</TableCell>
            <TableCell className="!pr-0 text-right">Total</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => {
            return (
              <Item currencyCode={item.currency} item={item} key={item.id} />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTemplate;
