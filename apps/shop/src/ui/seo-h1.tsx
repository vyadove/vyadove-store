"use client";

import type { HTMLAttributes } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const SeoH1 = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const pathname = usePathname();
  const El = pathname === "/" ? "h1" : "span";

  return <El {...props} className={cn("inline-block", className)} />;
};
