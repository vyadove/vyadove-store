"use client";

import { useEffect, useState } from "react";
import { BiArrowBack, BiListUl } from "react-icons/bi";

import { useRouter } from "next/navigation";

import { useCheckoutSession } from "@/scenes/checkout/hooks";
import { Button } from "@ui/shadcn/button";
import { TypographyH2 } from "@ui/shadcn/typography";
import { toast } from "@/components/ui/hot-toast";

export default function ReviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { session } = useCheckoutSession();

  const checkoutSession = session as any;

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      // Here you would typically create an order
      console.log("Placing order with:", checkoutSession);

      const fetchResult = await fetch(`/api/orders/checkout`, {
        body: JSON.stringify({}),
        credentials: "include",
        method: "POST",
      });

      if (!fetchResult.ok) {
        toast.error("Failed to place order. Please try again.");
        throw new Error("Failed to create order");
      }

      toast.success("Order successful!");

      const result: any = await fetchResult.json();
      const redirectUrl = result.redirectUrl.startsWith("http")
        ? result.redirectUrl
        : new URL(result.redirectUrl, window.location.origin).href;

      window.location.href = redirectUrl;
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing order:", error);
      setIsLoading(false);
    } finally {
    }
  };

  if (!checkoutSession) {
    return <div>Loading checkout session...</div>;
  }

  return (
    <div className="mx-auto my-20 min-h-[60vh] w-full max-w-2xl space-y-6">
      <TypographyH2 className="mb-6 ">Review Order</TypographyH2>

      <div className="space-y-4">
        {checkoutSession?.shippingAddress && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Personal Info</h3>
            <div className="text-sm text-gray-600">
              <p>
                {checkoutSession.shippingAddress?.first_name}{" "}
                {checkoutSession.shippingAddress?.last_name}
              </p>
              <p>{checkoutSession.shippingAddress?.phone}</p>
              <p>
                {checkoutSession.shippingAddress?.city},{" "}
                {checkoutSession.shippingAddress?.province}{" "}
                {checkoutSession.shippingAddress?.postal_code}
              </p>
            </div>
          </div>
        )}

        {checkoutSession?.shipping && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Shipping Method</h3>
            <div className="text-sm text-gray-600">
              <p>{checkoutSession.shipping?.name}</p>
            </div>
          </div>
        )}

        {checkoutSession?.payment && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Payment Method</h3>
            <div className="text-sm text-gray-600">
              <p>{checkoutSession.payment?.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <Button
          className="border-accent border"
          onClick={() => router.push("/checkout")}
          size="lg"
          type="button"
          variant="secondary"
        >
          <BiArrowBack />
          Back to payment
        </Button>
        <Button disabled={isLoading} onClick={handlePlaceOrder} size="lg">
          <BiListUl />
          {isLoading ? "Placing order..." : "Place order"}
        </Button>
      </div>
    </div>
  );
}
