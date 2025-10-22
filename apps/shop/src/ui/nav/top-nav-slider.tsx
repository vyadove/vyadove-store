"use client";

import type { ComponentPropsWithoutRef } from "react";
import React, { type PropsWithChildren, useState } from "react";

import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

const TopNavSlider = ({
  children,
  ...rest
}: PropsWithChildren<ComponentPropsWithoutRef<typeof motion.div>>) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Listen for scroll position changes
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 60) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.nav
      // animate={{ y: visible ? 0 : "-100%" }}
      className={cn(
        "fixed  z-50 sm:mx-6 lg:mx-6",
        `w-full md:inset-x-[max((100vw_-_var(--app-width))/2,16px)]`,
        // "bg-white/70 shadow-md border-b border-gray-200 backdrop-blur-md  ",
        "flex ",
        rest?.className || "",
      )}
      // initial={{ y: "-100%" }}
      // transition={{ type: "spring", stiffness: 120, damping: 18 }}

      animate={{
        y: visible ? 0 : "-50%",
        opacity: visible ? 1 : 0,
      }}
      initial={{ y: "-100%", opacity: 0 }}
      transition={
        visible
          ? {
              type: "spring",
              stiffness: 120,
              damping: 20,
              mass: 0.8,
            } // smooth entrance
          : {
              duration: 0.15,
              ease: "easeInOut",
            } // fast exit
      }
    >
      {children}
    </motion.nav>
  );
};

export default TopNavSlider;
