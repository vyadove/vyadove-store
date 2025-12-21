import Image from "next/image";
import Link from "next/link";

import type { EnrichedCheckoutItem } from "@/providers/checkout/types";
import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import {
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@ui/shadcn/typography";
import {
  ArrowRight,
  MinusIcon,
  PlusIcon,
  ShoppingBag,
  Users,
} from "lucide-react";

import DeleteItemButton from "@/components/delete-item-button";
import Divider from "@/components/divider";
import { Price } from "@/components/price";

interface SidebarCartItemsProps {
  items: EnrichedCheckoutItem[];
  cartTotal: number;
  totalUniqueItems: number;
  onClose: () => void;
  onQuantityChange: (
    variantId: string,
    currentQuantity: number,
    delta: number,
  ) => void;
}

const SidebarCartItems = ({
  items,
  cartTotal,
  onClose,
  onQuantityChange,
}: SidebarCartItemsProps) => {
  return (
    <>
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex w-full flex-col gap-1">
          {items.map((item) => {
            const { product, variant } = item;

            if (!product) return null;

            const variantTitle = product?.title;

            return (
              <div
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-2"
                data-testid="cart-item"
                key={item.variantId}
              >
                <div className="flex gap-4">
                  {/* Product thumbnail */}
                  <Link href={Routes.productLink(product.handle as string)}>
                    <div className="relative size-[90px] shrink-0 overflow-hidden rounded-lg">
                      <Image
                        alt={product.title || "Product image"}
                        className="object-cover"
                        fill
                        src={product.gallery?.[0]?.url || ""}
                      />
                    </div>
                  </Link>

                  {/* Product info */}
                  <div className="flex flex-1 flex-col">
                    {/* Title and variant */}
                    <Link
                      data-testid="product-link"
                      href={Routes.productLink(product.handle as string)}
                    >
                      <TypographyP className="text-[15px] leading-tight line-clamp-2 hover:underline">
                        {product.title}
                        {variantTitle && ` - ${variantTitle}`}
                      </TypographyP>
                    </Link>

                    <div className="flex items-center gap-2">
                      {/* Total price for this item */}
                      <TypographyP
                        className="mt-1 font-semibold text-primary"
                        data-testid="product-price"
                      >
                        <Price amount={item.totalPrice || 0} />
                      </TypographyP>

                      {/* html dot entity */}
                      <span className="text-muted-foreground"> &middot; </span>

                      {/* Participants count */}
                      {item.participants && item.participants > 0 && (
                        <TypographySmall className="mt-1 text-muted-foreground font-light flex items-center gap-1">
                          <Users className="size-3" />
                          {item.participants}{" "}
                          {item.participants === 1 ? "person" : "people"}
                        </TypographySmall>
                      )}
                    </div>

                    {/* Quantity controls and delete */}
                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-0 overflow-hidden">
                        <Button
                          className="size-6"
                          disabled={(item.quantity as number) <= 1}
                          onClick={() => {
                            if (item.variantId) {
                              onQuantityChange(
                                item.variantId,
                                item.quantity,
                                -1,
                              );
                            }
                          }}
                          size="icon-sm"
                          variant="outline"
                        >
                          <MinusIcon className="size-4" />
                        </Button>
                        <TypographySmall className="flex w-10 items-center justify-center font-medium">
                          {item.quantity}
                        </TypographySmall>
                        <Button
                          className="size-6"
                          disabled={(item.quantity as number) >= 10}
                          onClick={() => {
                            if (item.variantId) {
                              onQuantityChange(
                                item.variantId,
                                item.quantity,
                                1,
                              );
                            }
                          }}
                          size="icon-sm"
                          variant="outline"
                        >
                          <PlusIcon className="size-4" />
                        </Button>
                      </div>

                      {/* Delete button */}
                      {item?.isLoading ? (
                        <Spinner />
                      ) : (
                        <DeleteItemButton
                          className="[&_button]:bg-transparent [&_button]:hover:bg-red-50"
                          data-testid="cart-item-remove-button"
                          variantId={item.variantId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Summary & Actions */}
      <div className="mt-auto border-t border-gray-200 bg-gray-50 px-5 py-5">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <TypographyMuted>Subtotal</TypographyMuted>
          <TypographyP>
            <Price amount={cartTotal} />
          </TypographyP>
        </div>

        {/* Shipping */}
        <div className="mt-2 flex items-center justify-between">
          <TypographyMuted>Shipping</TypographyMuted>
          <TypographyP className="text-primary">
            Calculated at checkout
          </TypographyP>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-200" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <TypographyP className="font-semibold">Total</TypographyP>
          <TypographyP
            className="text-xl font-bold"
            data-testid="cart-subtotal"
            data-value={cartTotal}
          >
            <Price amount={cartTotal} />
          </TypographyP>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-col gap-3">
          <Link href={Routes.checkout} passHref>
            <Button
              className="w-full gap-2"
              data-testid="go-to-checkout-button"
              onClick={onClose}
              size="lg"
            >
              Proceed to Checkout
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Button
            className="w-full gap-2"
            data-testid="go-to-cart-button"
            onClick={onClose}
            size="lg"
            variant="outline"
          >
            <ShoppingBag className="size-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
};

export default SidebarCartItems;
