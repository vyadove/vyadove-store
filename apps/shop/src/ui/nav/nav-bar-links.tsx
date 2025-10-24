"use client";

import type { PropsWithChildren } from "react";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Routes } from "@/store.routes";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@ui/shadcn/navigation-menu";
import { TypographyP } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import { ChevronDownIcon } from "lucide-react";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import Img1 from "./img.png";
import Img2 from "./img_1.png";

const transition: Transition = {
  duration: 0.6,
  ease: [0.6, 0.01, 0, 0.9], // times: [0, 0.45, 0.48, 0.5, 1],
};

const linkVariants: Variants = {
  initial: {
    opacity: 0,
    y: 0,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  hover: {
    // opacity: [null, 1, 0, 0, 1],
    // y: [null, '-100%', '-100%', '100%', '0%'],
    y: "-100%",
  },
};

const AnimateOnHoverText = ({
  children,
  ...rest
}: PropsWithChildren & React.ComponentPropsWithoutRef<typeof motion.div>) => {
  return (
    <motion.div
      animate="animate"
      initial="initial"
      transition={transition}
      // variants={linkVariants}
      whileHover="hover"
      {...rest}
      className={cn(
        "h-full relative inline-block cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.6,0.01,0,0.9)] group-hover/trigger:-translate-y-full",
        rest?.className,
      )}
    >
      <TypographyP className="">{children}</TypographyP>

      <TypographyP className="absolute hidden font-light md:block">
        {children}
      </TypographyP>
    </motion.div>
  );
};

const NavMenuTrigger = ({
  children,
  ...props
}: React.PropsWithChildren & {
  hideIcon?: boolean;
}) => {
  return (
    <NavigationMenuTrigger className="group/trigger" hideIcon>
      <div className="hover:text-accent hover:bg-accent-foreground flex items-center overflow-hidden rounded-md border-none px-3 py-1 shadow-none">
        <AnimateOnHoverText className="">{children}</AnimateOnHoverText>

        {!props?.hideIcon && (
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        )}
      </div>
    </NavigationMenuTrigger>
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

const ShopMenuContent = () => {
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
        {[Img1, Img2].map((img, idx) => (
          <div
            className="relative h-[20rem] w-[14rem] overflow-hidden rounded-xl"
            key={idx}
          >
            <Image alt="img" className="object-cover" fill src={img} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CollectionMenuContent = () => {
  return (
    <div className="hidden gap-22 p-2 md:flex">
      <div className="flex gap-4">
        {[Img1, Img2, Img2].map((img, idx) => (
          <div className="relative z-0 overflow-hidden rounded-xl" key={idx}>
            <div className="relative h-[10rem] w-[18rem] overflow-hidden rounded-tl-xl rounded-tr-xl">
              <Image alt="img" className="object-cover" fill src={img} />
            </div>

            <TypographyP className="abolute bg-accent-foreground/50 right-0 bottom-0 left-0 z-10 p-4 leading-snug">
              Product title
            </TypographyP>
          </div>
        ))}
      </div>
    </div>
  );
};

function NavBarLinks() {
  const pathName = usePathname();

  return (
    <NavigationMenu className="hidden md:block " viewport={false}>
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem>
          <NavMenuTrigger>Shop</NavMenuTrigger>

          <NavigationMenuContent className="!rounded-xl">
            <ShopMenuContent />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavMenuTrigger>Collections</NavMenuTrigger>

          <NavigationMenuContent className="!rounded-xl">
            <CollectionMenuContent />
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
              pathName === Routes.support && "text-accent bg-accent-foreground",
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
