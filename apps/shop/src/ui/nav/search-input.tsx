"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SearchSheet() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
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
          // Import dynamically to avoid server-side issues if needed, or just use the action
          const { searchWithPlugin } = await import("@/actions/search-actions");
          const searchResults = await searchWithPlugin(query);

          console.log("Search results received:", searchResults);
          setResults(searchResults);
        } catch (error) {
          console.error("Search error:", error);
          setError(error instanceof Error ? error.message : "Search failed");
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

        <div className="mx-auto w-full max-w-5xl p-8">
          {!query ? (
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-4 font-medium text-red-500">
                  Popular Searches
                </h3>
                <ul className="space-y-3">
                  {[
                    "Spa Days",
                    "Days Out in London",
                    "Afternoon Tea",
                    "Trains",
                  ].map((term) => (
                    <li
                      className="cursor-pointer font-medium hover:underline"
                      key={term}
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-medium text-red-500">
                  Recently Viewed
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your recently viewed products will appear here
                </p>
              </div>
            </div>
          ) : (
            <div>
              {error ? (
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <p className="text-sm text-red-600">Error: {error}</p>
                  <p className="mt-2 text-xs text-red-500">
                    Please try again or check the console for details
                  </p>
                </div>
              ) : isSearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Searching...
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((product: any) => {
                    const thumbnailUrl = (product.gallery?.[0] as any)?.url;
                    const categoryName = Array.isArray(product.category)
                      ? product.category[0]?.title
                      : product.category?.title;

                    return (
                      <a
                        className="group hover:bg-muted flex items-center gap-4 rounded-lg p-3 transition-colors"
                        href={`/products/${product.handle || product.id}`}
                        key={product.id}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {thumbnailUrl ? (
                            <img
                              alt={product.title}
                              className="h-full w-full object-cover"
                              src={thumbnailUrl}
                            />
                          ) : (
                            <div className="bg-muted flex h-full w-full items-center justify-center">
                              <FiSearch className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-medium group-hover:underline">
                            {product.title}
                          </h4>
                          {categoryName && (
                            <p className="text-muted-foreground flex items-center gap-1 text-sm">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {categoryName}
                            </p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg py-12">
                  <FiSearch className="text-muted-foreground/40 mb-4 h-12 w-12" />
                  <p className="text-foreground text-sm font-medium">
                    No results found for &quot;{query}&quot;
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
