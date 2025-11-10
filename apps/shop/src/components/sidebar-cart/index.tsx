"use client";

import { useEffect, useRef, useState } from "react";
import { BiCross } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useCart } from "react-use-cart";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import DeleteButton from "@/scenes/cart/delete-button";
import LineItemPrice from "@/scenes/cart/line-item-price";
import { Routes } from "@/store.routes";
import { getSessionId } from "@/utils";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { ButtonGroup } from "@ui/shadcn/button-group";
import {
  TypographyH3,
  TypographyH5,
  TypographyH6,
  TypographyP,
} from "@ui/shadcn/typography";
import { Cross, MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "vaul";

import Thumbnail from "@/components/products/product-card/thumbnail";
import useSidebarCartStore from "@/components/sidebar-cart/sidebar-cart.store";

import { syncCartWithBackend } from "@/services/cart";

import { convertToLocale } from "@/utils/money";

function SidebarCart() {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined,
  );
  const { toggleCart, isCartOpen } = useSidebarCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const {
    cartTotal,
    items,
    totalItems,
    totalUniqueItems,
    addItem,
    removeItem,
    updateItemQuantity,
  } = useCart();
  const itemRef = useRef<number>(totalItems || 0);
  const subtotal = cartTotal ?? 0;

  const open = () => toggleCart(true);
  const close = () => toggleCart(false);

  const timedOpen = () => {
    open();

    const timer = setTimeout(close, 5000);

    setActiveTimer(timer);
  };

  const modifyQuantity = async (itemId: string, delta: number) => {
    const newItem = items.find((item) => item.id === itemId);

    if (!newItem) return;

    try {
      updateItemQuantity(newItem.id, delta + (newItem.quantity as number));
      const sessionId = getSessionId();

      await syncCartWithBackend(
        {
          id: newItem.id,
          product: newItem.productId,
          variantId: newItem.id,
          quantity: delta,
        },
        sessionId,
      );
      toast.success("Added to cart");
    } catch (error) {
      updateItemQuantity(newItem.id, newItem.quantity as number);
      toast.error("Failed to sync cart");
      console.error("Failed to sync cart:", error);
    } finally {
      // setIsAdding(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer as any);
      }
    };
  }, [activeTimer]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isCartOpen) return;

    const currentItems = itemRef.current;

    itemRef.current = totalItems;

    if (
      totalItems > 0 &&
      currentItems !== totalItems &&
      !pathname.includes("/cart")
    ) {
      timedOpen();
    }
  }, [totalItems, pathname]);

  // hide side bar when esc pressed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Drawer.Root direction="right" open={isCartOpen}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-90 bg-black/40"
          onClick={() => toggleCart(false)}
        />
        <Drawer.Content
          className="fixed top-3 right-3 bottom-3 z-95 flex w-lg outline-none "
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col overflow-hidden rounded-[16px] bg-zinc-50">
            <div className="mx-auto flex h-full w-full flex-col">
              {/* --- HEADER --- */}
              <div className="flex items-center gap-2 border-b p-5 ">
                <TypographyH3 className="font-semibold">Your Cart</TypographyH3>

                <Badge className="bg-accent-foreground text-accent rounded-full">
                  {isMounted ? `${totalUniqueItems}` : "0"}
                </Badge>

                <Button
                  className="ml-auto aspect-square"
                  onClick={close}
                  size="icon-lg"
                  variant="outline"
                >
                  <IoClose />
                </Button>
              </div>

              <div className="grid w-full place-items-center p-4 pt-6">
                {items.length ? (
                  <div className="flex w-full flex-col gap-4">
                    {items.map((item) => (
                      <div
                        className="flex gap-x-4 "
                        data-testid="cart-item"
                        key={item.id}
                      >
                        <Link className="" href={`/products/${item.handle}`}>
                          <div className="relative flex size-[70px] items-start">
                            <Image
                              alt={"product image"}
                              className="w-full rounded-xl object-cover"
                              fill
                              src={item.gallery?.[0]?.url}
                            />
                          </div>
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between">
                              <div className="mr-4 flex w-[180px] flex-col text-ellipsis whitespace-nowrap">
                                <TypographyP className="overflow-hidden  text-ellipsis">
                                  <Link
                                    data-testid="product-link"
                                    href={`/products/${item.handle}`}
                                  >
                                    {item.productName}
                                  </Link>
                                </TypographyP>

                                {/*       <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Quantity: {item.quantity}
                                </span>*/}
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  cartTotal={item.price}
                                  currencyCode={item.currency}
                                  originalPrice={item.originalPrice}
                                  style="tight"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full items-center justify-between">
                            <ButtonGroup
                              aria-label="Media controls"
                              className="h-fit"
                            >
                              <Button
                                className="cursor-pointer"
                                disabled={(item.quantity as number) >= 10}
                                onClick={() => {
                                  modifyQuantity(item.id, 1);
                                }}
                                size="icon-sm"
                                variant="outline"
                              >
                                <PlusIcon />
                              </Button>
                              <Button
                                className="pointer-events-none"
                                size="icon-sm"
                                variant="outline"
                              >
                                {item.quantity}
                              </Button>
                              <Button
                                className="cursor-pointer"
                                disabled={(item.quantity as number) <= 1}
                                onClick={() => {
                                  modifyQuantity(item.id, -1);
                                }}
                                size="icon-sm"
                                variant="outline"
                              >
                                <MinusIcon />
                              </Button>
                            </ButtonGroup>

                            <DeleteButton
                              className="mt-1"
                              data-testid="cart-item-remove-button"
                              id={item.id}
                              productId={item.productId}
                            ></DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col items-center justify-center gap-y-4 py-16">
                      <div className="text-small-regular flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white">
                        <span>0</span>
                      </div>
                      <span>Your shopping bag is empty.</span>
                      <div>
                        <Link href={Routes.shop}>
                          <>
                            <span className="sr-only">
                              Go to all products page
                            </span>
                            <Button onClick={close}>Explore products</Button>
                          </>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SUBTOTAL CALCULATION --- */}
              <div className="mt-auto flex flex-col gap-y-4 border-t p-4">
                <div className="flex items-center justify-between">
                  <span className="text-ui-fg-base font-semibold">
                    Subtotal{" "}
                  </span>
                  <span
                    className="text-large-semi"
                    data-testid="cart-subtotal"
                    data-value={subtotal}
                  >
                    {convertToLocale({
                      amount: subtotal,
                    })}
                  </span>
                </div>
                <Link href="/cart" passHref>
                  <Button
                    className="w-full "
                    data-testid="go-to-cart-button"
                    size="lg"
                  >
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default SidebarCart;
