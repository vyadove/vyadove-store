import React from "react";

import { cn } from "@/lib/utils";

export function TypographyH1(props: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: React.ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        props.className,
      )}
    >
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: React.ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className,
      )}
    >
      {props.children}
    </h3>
  );
}

export function TypographyH4(props: React.ComponentProps<"h4">) {
  return (
    <h4
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.className,
      )}
    >
      {props.children}
    </h4>
  );
}

export function TypographyH5(props: React.ComponentProps<"h4">) {
  return (
    <h5
      {...props}
      className={cn(
        "scroll-m-20 text-lg font-bold tracking-tight",
        props.className,
      )}
    >
      {props.children}
    </h5>
  );
}

export function TypographyH6(props: React.ComponentProps<"h4">) {
  return (
    <h6
      {...props}
      className={cn(
        "text-md scroll-m-20 font-semibold tracking-tight",
        props.className,
      )}
    >
      {props.children}
    </h6>
  );
}

export function TypographyP(props: React.ComponentProps<"p">) {
  return (
    <p className={cn("leading-6 text-black", props.className)}>
      {props.children}
    </p>
  );
}

export function TypographyLead(props: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn("text-xl text-muted-foreground", props.className)}
    >
      {props.children}
    </p>
  );
}

export function TypographyLarge(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className={cn("text-lg font-semibold", props.className)}>
      {props.children}
    </div>
  );
}

export function TypographySmall(props: React.ComponentProps<"div">) {
  return (
    <small
      {...props}
      className={cn("text-xs font-medium leading-none", props.className)}
    >
      {props.children}
    </small>
  );
}

export function TypographyMuted(props: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(" text-muted-foreground", props.className)}
    >
      {props.children}
    </p>
  );
}
