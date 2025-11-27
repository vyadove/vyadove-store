"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/auth";
import { Spinner } from "@ui/shadcn/spinner";

import Divider from "@/components/divider";
import EmptyCartMessage from "@/components/empty-cart-message";
import SignInPrompt from "@/components/sign-in-prompt";

import { useCart } from "@/providers/cart";


import ItemsTemplate from "./items";
import Summary from "./summary";

const CartTemplate = () => {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="content-container" data-testid="cart-container">
        {items?.length ? (
          <div className="grid grid-cols-1 gap-x-40 sm:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-y-6 bg-white py-6">
              {!user && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}

              <ItemsTemplate />
            </div>

            <div className="relative">
              <div className="sticky top-12 flex flex-col gap-y-8">
                <Summary />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
