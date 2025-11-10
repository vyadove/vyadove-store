"use client";

import type { SelectHTMLAttributes } from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

import { Button } from "@ui/shadcn/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type NativeSelectProps = {
  errors?: Record<string, unknown>;
  placeholder?: string;
  touched?: Record<string, unknown>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

const CartItemSelect = ({
  children,
  className,
  placeholder = "Select...",
  ref,
  ...props
}: { ref?: React.RefObject<HTMLSelectElement | null> } & NativeSelectProps) => {
  const innerRef = useRef<HTMLSelectElement>(null);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current,
  );

  useEffect(() => {
    if (innerRef.current && innerRef.current.value === "") {
      setIsPlaceholder(true);
    } else {
      setIsPlaceholder(false);
    }
  }, [innerRef.current?.value]);

  return (
    <div>
      <Button
        className={cn(
          "relative flex items-center txt-compact-small border text-ui-fg-base group",
          className,
          {
            "text-ui-fg-subtle": isPlaceholder,
          },
        )}
        onBlur={() => innerRef.current?.blur()}
        onFocus={() => innerRef.current?.focus()}
      >
        <select
          ref={innerRef}
          {...props}
          className="h-16 w-16 appearance-none items-center justify-center border-none bg-transparent px-4 transition-colors duration-150 outline-none focus:border-gray-700"
        >
          <option disabled value="">
            {placeholder}
          </option>
          {children}
        </select>
        <span className="pointer-events-none absolute flex w-8 justify-end group-hover:animate-pulse">
          <ChevronDown />
        </span>
      </Button>
    </div>
  );
};

CartItemSelect.displayName = "CartItemSelect";

export default CartItemSelect;
