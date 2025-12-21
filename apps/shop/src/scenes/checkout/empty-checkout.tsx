"use client";

import { useMemo } from "react";
import { BiArrowBack } from "react-icons/bi";

import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { Routes } from "@/store.routes";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { TypographyH3, TypographyMuted } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import type { Category } from "@vyadove/types";

import CartIcon from "@/components/icons/cart-icon";

const EmptyCheckout = () => {
  const categoryQuery = usePayloadFindQuery("category", {
    findArgs: {
      where: {
        parent: { exists: false },
      },
      limit: 6,
    },
  });

  const categories = useMemo(() => {
    if (!categoryQuery.data?.docs?.length) return [];

    return categoryQuery.data.docs as Category[];
  }, [categoryQuery.data]);

  return (
    <div className="mt-10 mb-36 h-full min-h-[60vh] flex-1">
      <div className="flex justify-center p-4">
        <div className="flex flex-col items-center justify-center py-12">
          {/* Icon with decorative background */}
          <div className="relative mb-8">
            {/* Background blob */}
            <div className="bg-primary/5 absolute -inset-4 rounded-full" />
            <div className="bg-primary/10 absolute -inset-2 rounded-full" />

            {/* Decorative circles */}
            <div className="bg-primary/20 absolute -top-2 -right-3 size-4 rounded-full" />
            <div className="bg-primary/15 absolute -bottom-1 -left-4 size-3 rounded-full" />
            <div className="bg-primary/10 absolute top-1/2 -right-6 size-2 rounded-full" />

            {/* Main icon */}
            <div className="bg-primary/5 relative flex size-28 items-center justify-center rounded-full">
              <CartIcon className="fill-muted-foreground size-14" />
            </div>
          </div>

          {/* Text content */}
          <div className="mb-8 max-w-md text-center">
            <TypographyH3 className="mb-3">Your checkout is empty</TypographyH3>
            <TypographyMuted className="text-base leading-relaxed">
              Looks like you haven&apos;t added any items to checkout yet. Start
              exploring our collection of unique gifts and experiences.
            </TypographyMuted>
          </div>

          {/* CTA Button */}
          <VyaLink href={Routes.shop}>
            <Button size="lg">
              <BiArrowBack />
              Continue Shopping
            </Button>
          </VyaLink>

          {/* Popular Categories */}
          {categories.length > 0 && (
            <div className="mt-12 w-full max-w-lg">
              <div className="border-border/50 border-t pt-8">
                <TypographyMuted className="mb-4 text-center text-sm font-medium">
                  Popular Categories
                </TypographyMuted>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <VyaLink
                      href={Routes.categoryLink(category.handle || "")}
                      key={category.id}
                    >
                      <Badge
                        className="cursor-pointer px-4 py-1.5 text-sm transition-colors"
                        variant="outline"
                      >
                        {category.title}
                      </Badge>
                    </VyaLink>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyCheckout;
