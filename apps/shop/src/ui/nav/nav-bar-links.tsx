import type { ComponentPropsWithoutRef } from "react";
import React from "react";
import { FiSearch } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

// import { usePathname } from "next/navigation";
import { Routes } from "@/store.routes";
import type { Collection, Product } from "@shopnex/types";
import { AnimateOnHoverText, NavMenuTrigger } from "@ui/nav/components";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@ui/shadcn/navigation-menu";
import { Separator } from "@ui/shadcn/separator";
import { TypographyMuted, TypographyP } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import { CartIconButton } from "@/components/cart-icon-button";
import VyaDoveLogo from "@/components/icons";

import { cn } from "@/lib/utils";

import { getVariantImage } from "@/utils/get-variant-image";
import { payloadSdk } from "@/utils/payload-sdk";

export const NavItems = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center gap-6 p-3",
        props?.className,
      )}
    >
      <VyaLink href="/">
        <VyaDoveLogo className="w-36" />
      </VyaLink>

      <NavBarLinks />

      <div className="hidden lg:flex">
        <Separator className="h-full" orientation="vertical" />

        <div className="flex items-center">
          <Button size="icon" variant="link">
            <FiSearch stroke="#000" strokeWidth={2} />
          </Button>

          <CartIconButton />
        </div>
      </div>
    </div>
  );
};

const shopLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Collections",
    href: "/shop",
  },
];

const ShopMenuContent = ({ products }: { products: Product[] }) => {
  return (
    <div className="hidden gap-22 p-2 md:flex">
      <div className="flex flex-col gap-4 p-8 pt-0">
        <TypographyP className="font-italic">Links</TypographyP>

        <ul className="grid gap-4" role="list">
          {shopLinks.map((link) => (
            <li key={link.label}>
              <VyaLink
                className="font-light underline-offset-4 hover:underline"
                href={link.href}
              >
                {link.label}
              </VyaLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        {products?.map((product, idx) => {
          const { originalPrice, price } = product.variants?.[0] || {};
          const variantWithImage = product.variants?.find((v) => {
            return getVariantImage(v);
          });
          const thumbnail = getVariantImage(
            variantWithImage as Product["variants"][0],
          );
          const thumbnailUrl = thumbnail
            ? thumbnail
            : variantWithImage?.imageUrl;

          return (
            <div
              className="relative z-0 h-[20rem] w-[14rem] overflow-hidden rounded-xl"
              key={idx}
            >
              <Badge
                className="bg-accent-foreground border-accent/30 absolute top-2 right-2 z-10 border "
                variant="secondary"
              >
                50% OFF
              </Badge>

              <div className="relative  size-full overflow-hidden rounded-xl">
                <Image
                  alt="img"
                  className="object-cover"
                  fill
                  src={thumbnailUrl as string}
                />
              </div>

              <div
                className={cn(
                  "absolute bottom-0 right-0  left-0  z-10  p-4 pt-16 leading-snug",
                  "flex flex-col items-center justify-center text -center",
                  "bg-gradient-to-t from-accent-foreground via-accent-foreground/80 to-transparent",
                )}
              >
                <TypographyP className="line-clamp-1" title={product.title}>
                  {product.title}
                </TypographyP>
                <div className="flex items-center gap-2">
                  <TypographyMuted className="text-[.85rem] font-normal">
                    {price?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "ETB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      trailingZeroDisplay: "stripIfInteger",
                    })}
                  </TypographyMuted>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CollectionMenuContent = ({ cols }: { cols: Collection[] }) => {
  return (
    <div className="hidden gap-22 p-2 md:flex">
      <div className="flex gap-4">
        {cols?.map((col, idx) => (
          <div className="relative z-0 overflow-hidden rounded-xl" key={idx}>
            <div className="relative h-[10rem] w-[18rem] overflow-hidden rounded-tl-xl rounded-tr-xl">
              <Image
                alt="img"
                className="object-cover"
                fill
                src={(col.thumbnail as any)?.url}
              />
            </div>

            <TypographyP
              className={cn(
                "absolute_ bottom-0 right-0  left-0  z-10  p-3 leading-snug",
                "flex flex-col items-center justify-center text -center bg-accent-foreground",
              )}
            >
              {col.title}
            </TypographyP>
          </div>
        ))}
      </div>
    </div>
  );
};

async function NavBarLinks() {
  const pinnedProdCol = await payloadSdk.find({
    collection: "collections",
    limit: 2,
    sort: "createdAt",
    where: {
      handle: {
        equals: "nav-pinned",
      },
    },
  });

  const products = await payloadSdk.find({
    collection: "products",
    limit: 2,
    sort: "createdAt",

    where: {
      collections: {
        in: [pinnedProdCol.docs?.map((p) => p.id)],
      },
    },
  });

  const navCols = await payloadSdk
    .find({
      collection: "collections",
      limit: 3,
      sort: "createdAt",
      where: {
        visible: {
          equals: true,
        },
      },
    })
    .then((res) => res.docs);

  return (
    <NavigationMenu className="hidden md:block " viewport={false}>
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem>
          <NavMenuTrigger>Shop</NavMenuTrigger>

          <NavigationMenuContent className="!rounded-xl">
            <ShopMenuContent products={products.docs || []} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavMenuTrigger>Collections</NavMenuTrigger>

          <NavigationMenuContent className="!rounded-xl">
            <CollectionMenuContent cols={navCols || []} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="group/item">
          <div className="hover:text-accent hover:bg-accent-foreground flex items-center overflow-hidden rounded-md border-none px-3 py-1 shadow-none">
            <AnimateOnHoverText className="group-hover/item:-translate-y-full">
              <Link href="/apps/shop/public">About</Link>
            </AnimateOnHoverText>
          </div>
        </NavigationMenuItem>

        <NavigationMenuItem className="group/item">
          <div
            className={cn(
              "hover:text-accent hover:bg-accent-foreground flex items-center overflow-hidden rounded-md border-none px-3 py-1 shadow-none",
              // pathName === Routes.support && "text-accent bg-accent-foreground",
            )}
          >
            <AnimateOnHoverText className="group-hover/item:-translate-y-full">
              <Link href={Routes.support}>Support {}</Link>
            </AnimateOnHoverText>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBarLinks;
