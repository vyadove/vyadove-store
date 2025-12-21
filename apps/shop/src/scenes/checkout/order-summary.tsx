"use client";

import Image from "next/image";

import { useCheckout } from "@/providers/checkout";
import { Button } from "@/ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import { TypographyH3, TypographyP } from "@ui/shadcn/typography";
import {
  ArrowRight,
  CheckCircle,
  MinusIcon,
  Package,
  PlusIcon,
  ShoppingCart,
} from "lucide-react";

import DeleteItemButton from "@/components/delete-item-button";
import { usePrice } from "@/components/price";

interface OrderSummaryProps {
  /** Show quantity controls for cart items */
  showQuantityControls?: boolean;
  /** Callback when place order is clicked */
  onPlaceOrder?: () => void;
  /** Button text */
  buttonText?: string;
  /** Whether the button is disabled */
  buttonDisabled?: boolean;
}

export function OrderSummary({
  showQuantityControls = true,
  onPlaceOrder,
  buttonText = "Place Order",
  buttonDisabled = false,
}: OrderSummaryProps) {
  const { items, cartTotal, total, checkout, updateItemQuantity, isUpdating } =
    useCheckout();
  const { format } = usePrice();

  return (
    <div className="lg:col-span-1">
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-background to-muted/30 rounded-3xl shadow-2xl border-2 border-border/50 p-8 sticky top-8">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-2xl" />

        {/* Header with Badge */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <TypographyH3 className="text-foreground">
                  Order Summary
                </TypographyH3>
                <TypographyP className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"} in cart
                </TypographyP>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Items with Enhanced Styling */}
        <div className="relative space-y-3 mb-8 max-h-86 overflow-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {items.map((item) => (
            <div
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              key={item.variantId}
            >
              <div className="flex gap-3">
                <div className="relative rounded-lg overflow-hidden flex-shrink-0 w-16 h-16 bg-muted">
                  <Image
                    alt={item.product?.title || "Product"}
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    fill
                    src={item.product?.gallery?.[0]?.url || ""}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-0.5">
                    {item.product?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 font-light">
                    {format(item.unitPrice || 0)} each
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">
                      {format(item.totalPrice || 0)}
                    </p>
                    {showQuantityControls ? (
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1 ml-auto">
                        <Button
                          className="size-6"
                          disabled={item.quantity <= 1 || isUpdating}
                          onClick={() =>
                            updateItemQuantity(
                              item.variantId,
                              item.quantity - 1,
                            )
                          }
                          size="icon-sm"
                          variant="outline"
                        >
                          <MinusIcon className="size-3" />
                        </Button>
                        <span className="text-xs font-medium text-foreground w-4 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          className="size-6"
                          disabled={isUpdating}
                          onClick={() =>
                            updateItemQuantity(
                              item.variantId,
                              item.quantity + 1,
                            )
                          }
                          size="icon-sm"
                          variant="outline"
                        >
                          <PlusIcon className="size-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                    )}

                    <DeleteItemButton
                      className="[&_button]:bg-transparent [&_button]:hover:bg-red-50 size-6"
                      variantId={item.variantId}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown with Premium Styling */}
        <div className="relative bg-gradient-to-br from-primary/5 to-white/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 mb-6 shadow-inner">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2 font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Subtotal
              </span>
              <span className="font-medium text-foreground">
                {format(cartTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2 font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Shipping
              </span>
              <span className="font-semibold text-primary flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Free
              </span>
            </div>
            {checkout?.taxTotal ? (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  Tax
                </span>
                <span className="font-medium text-foreground">
                  {format(checkout.taxTotal)}
                </span>
              </div>
            ) : null}
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-4">
            <span className="font-semibold text-foreground">Total to pay</span>
            <span className="text-2xl font-bold text-primary">
              {format(total)}
            </span>
          </div>
        </div>

        {/* Enhanced Place Order Button */}
        {onPlaceOrder && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-2xl blur-xl opacity-30" />
            <Button
              className="relative w-full bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] rounded-2xl"
              disabled={buttonDisabled || isUpdating}
              onClick={onPlaceOrder}
              size="lg"
            >
              <Package className="w-5 h-5 mr-2" />
              <span className="font-semibold">{buttonText}</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {/* Enhanced Security Badge */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Secure Checkout</p>
              <p className="text-muted-foreground">Powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
