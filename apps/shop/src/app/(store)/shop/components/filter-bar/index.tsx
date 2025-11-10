import React from "react";

import CategoryFilterButton from "@/app/(store)/shop/components/filter-bar/category-filter-button";
import PriceFilterButton from "@/app/(store)/shop/components/filter-bar/price-filter-button";
import ResetFilterButton from "@/app/(store)/shop/components/filter-bar/reset-filter-button";
import SortByFilterButton from "@/app/(store)/shop/components/filter-bar/sort-by-filter-button";
import type { Collection } from "@vyadove/types";

interface CollectionFilterClientProps {
  collections: Collection[];
}

export const FilterBar: React.FC<CollectionFilterClientProps> = ({
  collections,
}) => {
  return (
    <div className="z-10 flex w-full flex-col">
      <div className="flex w-full max-w-full items-center justify-stretch gap-2">
        <CategoryFilterButton collections={collections} />

        <PriceFilterButton />

        <SortByFilterButton />

        <ResetFilterButton />
      </div>
    </div>
  );
};

// Export the component as the default export for simplicity, as it's the only functional part of this file.
export default FilterBar;
