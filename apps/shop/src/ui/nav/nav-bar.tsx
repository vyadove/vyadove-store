"use client";

import type { PropsWithChildren } from "react";
import React from "react";



import Link from "next/link";



import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Item } from "@ui/shadcn/item";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@ui/shadcn/navigation-menu";
import { TypographyP } from "@ui/shadcn/typography";
import { ChevronDownIcon } from "lucide-react";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";



import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";





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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props} className="">
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium ">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

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

function NavBar() {

  const pathName = usePathname();

  return (
    <NavigationMenu className="hidden md:block " viewport={false}>
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem>
          <NavMenuTrigger>Shop</NavMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                    href="/apps/shop/public"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavMenuTrigger>Collections</NavMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  href={component.href}
                  key={component.title}
                  title={component.title}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
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
          <div className={
            cn(
              "hover:text-accent hover:bg-accent-foreground flex items-center overflow-hidden rounded-md border-none px-3 py-1 shadow-none",
              pathName === Routes.support && "text-accent bg-accent-foreground"
            )
          }>
            <AnimateOnHoverText className="group-hover/item:-translate-y-full">
              <Link href={Routes.support}>Support {}</Link>
            </AnimateOnHoverText>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBar;
