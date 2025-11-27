"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import DeleteButton from "@/scenes/cart/delete-button";
import LineItemPrice from "@/scenes/cart/line-item-price";
import { Routes } from "@/store.routes";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { ButtonGroup } from "@ui/shadcn/button-group";
import { TypographyH3, TypographyP } from "@ui/shadcn/typography";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Drawer } from "vaul";

import { useCart } from "@/providers/cart";


import { convertToLocale } from "@/utils/money";

function SidebarCart() {
  const {
    toggleCart,
    isCartOpen,
    cartTotal,
    items,
    totalItems,
    totalUniqueItems,
    updateItemQuantity,
    openCart,
    closeCart,
  } = useCart();

  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const itemRef = useRef<number>(totalItems || 0);
  const subtotal = cartTotal ?? 0;

  const modifyQuantity = async (
    variantId: string,
    currentQuantity: number,
    delta: number,
  ) => {
    await updateItemQuantity(variantId, currentQuantity + delta);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    };
  }, [activeTimer]);

  // Auto-open cart when items change
  useEffect(() => {
    // Don't auto-open if already open or on cart/checkout pages
    if (
      isCartOpen ||
      pathname.includes("/cart") ||
      pathname.includes("/checkout")
    ) {
      return;
    }

    const timedOpen = () => {
      openCart();

      const timer = setTimeout(closeCart, 5000);

      setActiveTimer(timer);
    };

    const currentItems = itemRef.current;

    itemRef.current = totalItems;

    // Only open if items increased (not decreased or stayed same)
    if (totalItems > 0 && currentItems < totalItems) {
      timedOpen();
    }
  }, [totalItems, pathname, isCartOpen, openCart, closeCart]);

  // hide sidebar when esc pressed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCart]);

  return (
    <Drawer.Root direction="right" onOpenChange={toggleCart} open={isCartOpen}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-90 bg-black/40"
          onClick={() => toggleCart(false)}
        />
        <Drawer.Content
          className="fixed top-3 right-3 bottom-3 z-95 flex w-lg outline-none "
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div
            className="flex h-full w-full grow flex-col overflow-hidden rounded-[16px] bg-zinc-50"
            onClick={() => {
              if (activeTimer) {
                clearTimeout(activeTimer);
              }
            }}
          >
            <div className="mx-auto flex h-full w-full flex-col">
              {/* --- HEADER --- */}
              <div className="flex items-center gap-2 border-b p-5 ">
                <TypographyH3 className="font-semibold">
                  Your Basket
                </TypographyH3>

                <Badge className="">
                  {isMounted ? `${totalUniqueItems}` : "0"}
                </Badge>

                <Button
                  className="ml-auto aspect-square"
                  onClick={closeCart}
                  size="icon-lg"
                  variant="outline"
                >
                  <IoClose />
                </Button>
              </div>

              <div className="grid w-full place-items-center p-4 pt-6">
                {items?.length ? (
                  <div className="flex w-full flex-col gap-4">
                    {items?.map((item) => {
                      const { product } = item;

                      if (!product) return null;

                      return (
                        <div
                          className="flex gap-x-4 "
                          data-testid="cart-item"
                          key={item.id || item.variantId}
                        >
                          <Link
                            className=""
                            href={`/products/${product.handle}`}
                          >
                            <div className="relative flex size-[70px] items-start">
                              <Image
                                alt={product.title || "Product image"}
                                className="w-full rounded-xl object-cover"
                                fill
                                src={product.gallery?.[0]?.url || ""}
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
                                      href={`/products/${product.handle}`}
                                    >
                                      {product.title}
                                    </Link>
                                  </TypographyP>
                                </div>
                                <div className="flex justify-end">
                                  <LineItemPrice
                                    cartTotal={
                                      (item.variant?.price || 0) * item.quantity
                                    }
                                    currencyCode={product.currency || "USD"}
                                    originalPrice={item.variant?.price || 0}
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
                                    if (item.variantId) {
                                      modifyQuantity(
                                        item.variantId,
                                        item.quantity,
                                        1,
                                      );
                                    }
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
                                    if (item.variantId) {
                                      modifyQuantity(
                                        item.variantId,
                                        item.quantity,
                                        -1,
                                      );
                                    }
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
                                variantId={item.variantId}
                              ></DeleteButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                            <Button onClick={closeCart}>
                              Explore products
                            </Button>
                          </>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SUBTOTAL CALCULATION --- */}
              <div className="mt-auto flex flex-col gap-10 border-t p-4 py-6">
                <div className="flex items-center justify-between">
                  <TypographyP className="text-lg">
                    Subtotal ({totalUniqueItems} Item
                    {totalUniqueItems > 1 ? "s" : ""})
                  </TypographyP>

                  <TypographyP
                    className="text-lg font-bold"
                    data-testid="cart-subtotal"
                    data-value={subtotal}
                  >
                    {convertToLocale({
                      amount: subtotal,
                    })}
                  </TypographyP>
                </div>

                <div className="flex w-full items-center gap-2">
                  <Link className="flex-1" href={Routes.cart} passHref>
                    <Button
                      className="w-full "
                      data-testid="go-to-cart-button"
                      onClick={closeCart}
                      size="lg"
                      variant="secondary"
                    >
                      View cart ({totalUniqueItems})
                    </Button>
                  </Link>

                  <Link className="flex-1" href={Routes.checkout} passHref>
                    <Button
                      className="w-full "
                      data-testid="go-to-cart-button"
                      onClick={closeCart}
                      size="lg"
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default SidebarCart;
