"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

import Link from "next/link";

import { Routes } from "@/store.routes";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { Spinner } from "@/ui/shadcn/spinner";
import { TypographyH6, TypographyMuted } from "@/ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { ProductPreview } from "@/components/products/product-card";

import { RecentlyViewedSection } from "./recently-viewed-section";

const RESULTS_LIMIT = 6;

export function SearchSheet() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        setError(null);

        try {
          const { searchWithPlugin } = await import("@/actions/search-actions");
          const searchResults = await searchWithPlugin(query);

          setResults(searchResults);
        } catch (err) {
          console.error("Search error:", err);
          setError(err instanceof Error ? err.message : "Search failed");
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (!newOpen) {
      setQuery("");
      setResults([]);
      setError(null);
    }
  };

  const displayedResults = results.slice(0, RESULTS_LIMIT);
  const hasMoreResults = results.length > RESULTS_LIMIT;

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetTrigger asChild>
        <Button size="icon" variant="link">
          <FiSearch stroke="#000" strokeWidth={2} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="h-[100vh] gap-0 overflow-y-auto p-0 sm:h-auto sm:max-h-[80vh]"
        side="top"
      >
        <SheetHeader className="bg-background sticky top-0 z-10 border-b p-4">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-4">
            <div className="relative flex-1">
              <FiSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
              <Input
                autoFocus
                className="border-none pl-10 text-lg shadow-none focus-visible:ring-0"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences..."
                value={query}
              />
            </div>
            <SheetClose asChild>
              <Button
                className="text-muted-foreground hover:text-foreground"
                variant="ghost"
              >
                Cancel
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mx-auto w-full max-w-7xl p-8">
          {!query ? (
            <div className="grid gap-12 md:grid-cols-2">
              <RecentlyViewedSection onItemClick={() => setOpen(false)} />
            </div>
          ) : (
            <div>
              {error ? (
                <div className="rounded-lg p-4 text-center">
                  <TypographyMuted>Error: {error}</TypographyMuted>
                  <TypographyMuted className="mt-2 text-xs">
                    Please try again or check the console for details
                  </TypographyMuted>
                </div>
              ) : isSearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner />
                  <TypographyMuted className="mt-4">
                    Searching...
                  </TypographyMuted>
                </div>
              ) : displayedResults.length > 0 ? (
                <div className="space-y-4">
                  {/* Results header */}
                  <TypographyH6>
                    Popular products matching your search
                  </TypographyH6>

                  {/* Results grid */}
                  <div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    onClick={() => setOpen(false)}
                  >
                    {displayedResults.map((product) => (
                      <ProductPreview
                        key={product.id}
                        product={product}
                        size="sm"
                      />
                    ))}
                  </div>

                  {/* See all results button */}
                  {(hasMoreResults || results.length > 0) && (
                    <div className="mt-10 mx-auto flex justify-center">
                      <Link
                        href={`${Routes.shop}?q=${encodeURIComponent(query)}`}
                      >
                        <Button
                          // asChild
                          className="w-full"
                          onClick={() => setOpen(false)}
                          size="md"
                        >
                          See all results
                          {hasMoreResults && ` (${results.length})`}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 py-12">
                  <FiSearch className="mb-4 h-12 w-12 text-muted-foreground/40" />
                  <TypographyMuted className="font-medium text-foreground">
                    No results found for &quot;{query}&quot;
                  </TypographyMuted>
                  <TypographyMuted className="mt-1 text-xs">
                    Try adjusting your search terms
                  </TypographyMuted>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
