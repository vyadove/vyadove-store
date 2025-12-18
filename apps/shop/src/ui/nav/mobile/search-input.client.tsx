"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Routes } from "@/store.routes";
import { Input } from "@ui/shadcn/input";

import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const inputClasses = cn(
  "appearance-none rounded-md absolute border bg-white py-2 pl-4 pr-10 w-9 opacity-0 transition-opacity ease-linear",
  "max-smb:focus:w-[calc(100vw-2rem)] max-smb:cursor-default max-smb:focus:left-4 max-smb:focus:z-20 max-smb:focus:opacity-100",
  "smb:opacity-100 smb:w-full smb:pl-4 smb:pr-10 smb:inline-block smb:static",
  "md:pl-2 md:pr-8 md:max-w-72",
  "lg:pl-4 lg:pr-10",
);

export const SearchInputPlaceholder = ({
  placeholder,
}: {
  placeholder: string;
}) => {
  return (
    <Input
      aria-busy
      aria-disabled
      className={cn("pointer-events-none", inputClasses)}
      placeholder={placeholder}
      type="search"
    />
  );
};

export const SearchInput = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchParamQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(searchParamQuery);
  const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100);

  // Track if user is actively typing (vs URL sync)
  const isUserTyping = useRef(false);

  useEffect(() => {
    if (!query) return;

    // Preserve existing URL params while updating search query
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("q", query);
    router.prefetch(`${Routes.shop}?${newParams.toString()}`);
  }, [query, router, searchParams]);

  useEffect(() => {
    // Only push if user is typing and query differs from URL
    if (
      isUserTyping.current &&
      debouncedQuery &&
      debouncedQuery !== searchParamQuery
    ) {
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set("q", debouncedQuery);
      router.push(`${Routes.shop}?${newParams.toString()}`, {
        scroll: false,
      });
    }
    // Reset typing flag after debounce completes
    isUserTyping.current = false;
  }, [debouncedQuery, router, searchParams, searchParamQuery]);

  // Sync query state with URL when navigating or when URL changes externally
  useEffect(() => {
    if (pathname !== Routes.shop) {
      setQuery("");
    } else {
      // Sync with URL query param when on shop page
      setQuery(searchParamQuery);
    }
  }, [pathname, searchParamQuery]);

  return (
    <Input
      className={inputClasses}
      enterKeyHint="search"
      name="search"
      onChange={(e) => {
        isUserTyping.current = true;
        setQuery(e.target.value);
      }}
      placeholder={placeholder}
      type="search"
      value={query}
    />
  );
};
