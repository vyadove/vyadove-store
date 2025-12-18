"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Routes } from "@/store.routes";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/shadcn/input-group";
import { SearchIcon } from "lucide-react";

import { useDebouncedValue } from "@/lib/hooks";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isPending, debouncedQuery] = useDebouncedValue(query, 500);

  const handleSearch = useCallback(
    (searchTerm: string = debouncedQuery) => {
      if (searchTerm.trim()) {
        // Preserve existing URL params while updating search query
        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("q", searchTerm);
        router.push(`${Routes.shop}?${newParams.toString()}`);
      }
    },
    [debouncedQuery, router, searchParams],
  );

  // Auto-search when debounced value changes (optional)
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 3) {
      // Only auto-search if query is 3+ characters
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  return (
    <InputGroup className="border-primary/70 bg-primary/10 focus-within:border-primary focus-within:bg-primary/20 h-11 max-w-md rounded-full transition-all focus-within:max-w-lg">
      <InputGroupInput
        className="placeholder:text-primary/70 placeholder:font-light"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(query); // Use current query on Enter, not debounced
          }
        }}
        placeholder="Search for a gift or experience ..."
        value={query}
      />
      <InputGroupAddon
        className="cursor-pointer"
        onClick={() => handleSearch(query)}
      >
        <SearchIcon className={isPending ? "animate-pulse" : ""} />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end"></InputGroupAddon>
    </InputGroup>
  );
};
