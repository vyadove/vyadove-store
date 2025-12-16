"use client";

import React, { type PropsWithChildren } from "react";

import { NavigationMenuTrigger } from "@ui/shadcn/navigation-menu";
import { TypographyP } from "@ui/shadcn/typography";
import { ChevronDownIcon } from "lucide-react";
import type { Transition, Variants } from "motion";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

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

export const NavMenuTrigger = ({
  children,
  ...props
}: React.PropsWithChildren & {
  hideIcon?: boolean;
}) => {
  return (
    <NavigationMenuTrigger className="group/trigger" hideIcon>
      <div className="hover:text-accent hover:bg-primary-background flex items-center overflow-hidden rounded-md border-none px-3 py-1 shadow-none">
        {children}

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

export const AnimateOnHoverText = ({
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

      <TypographyP className="absolute hidden  md:block">
        {children}
      </TypographyP>
    </motion.div>
  );
};
