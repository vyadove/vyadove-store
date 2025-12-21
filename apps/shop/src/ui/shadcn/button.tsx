import * as React from "react";
import { CgSpinner } from "react-icons/cg";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer" +
    "",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",

        warning:
          "border-warning/50 bg-warning text-warning hover:bg-warning/80 dark:border-warning [&>svg]:text-warning",

        success:
          "bg-success text-success-foreground hover:bg-success/80 border-transparent shadow",

        accentOutline:
          "bg-accent-background text-accent hover:bg-accent/90 hover:text-accent-foreground",
        destructive:
          "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
        outline:
          "bg-background hover:bg-primary-background dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/60 border",
        ghost:
          "hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/50",
        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-7.5 gap-1 px-3 has-[>svg]:px-2.5 text-xs",
        md: "h-10 py-2 px-4.5 has-[>svg]:px-3.5",
        lg: "text-md h-12 px-6 has-[>svg]:px-4",
        xl: "h-14 px-7 text-lg has-[>svg]:px-7",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },

      outlined: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        variant: "default",
        outlined: true,
        className:
          "border-primary/80 bg-primary/10 text-primary hover:bg-primary/20 border ",
      },
      {
        variant: "secondary",
        outlined: true,
        className:
          "border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary border",
        // "border border-black bg-transparent text-secondary-foreground hover:bg-secondary",
      },
      {
        variant: "destructive",
        outlined: true,
        className:
          "border-destructive/10 bg-destructive/5 text-destructive/70 hover:bg-destructive/20 border  ",
      },
      {
        variant: "accent",
        outlined: true,
        className:
          "border-accent bg-accent/10 text-accent-600 hover:bg-accent/20 border",
      },

      {
        variant: "success",
        outlined: true,
        className:
          "border-success/10 bg-success/5 hover:bg-success/20 text-success border",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  outlined,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    outlined?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, outlined, className }))}
      data-slot="button"
      {...props}
      disabled={props?.disabled || props?.loading}
      type={props?.type || "button"}
    >
      {props?.loading ? (
        <>
          <CgSpinner className="animate-spin" />{" "}
          {size === "icon" ? "" : "Please Wait"}
        </>
      ) : (
        <>{props.children}</>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
