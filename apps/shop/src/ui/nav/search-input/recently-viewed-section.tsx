"use client";

import { Button } from "@/ui/shadcn/button";
import { TypographyH6, TypographyMuted } from "@/ui/shadcn/typography";

import { useRecentlyViewed } from "@/lib/use-recently-viewed";

import { SearchResultCard } from "./search-result-card";

const MAX_DISPLAY = 4;

type RecentlyViewedSectionProps = {
  onItemClick?: () => void;
};

export function RecentlyViewedSection({
  onItemClick,
}: RecentlyViewedSectionProps) {
  const { items, clearAll, isLoaded } = useRecentlyViewed();

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div>
        <TypographyH6 className="mb-2">Recently Viewed</TypographyH6>
        <TypographyMuted>
          Your recently viewed gifts will appear here
        </TypographyMuted>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <TypographyH6>Recently Viewed</TypographyH6>
        <Button
          className="h-auto p-0 text-xs text-muted-foreground"
          onClick={clearAll}
          variant="link"
        >
          Clear
        </Button>
      </div>

      <div className="flex flex-col gap-1" onClick={onItemClick}>
        {items.slice(0, MAX_DISPLAY).map((item) => (
          <SearchResultCard
            categoryTitle={item.categoryTitle}
            handle={item.handle}
            id={item.id}
            key={item.id}
            thumbnailUrl={item.thumbnailUrl}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}
