"use client";

import React from "react";

import { ActiveFilterChips } from "@/scenes/shop/components/filter-bar/active-filter-chips";
import AllFilterDialogBtn from "@/scenes/shop/components/filter-bar/all-filter-dialog-btn";
import CategoryFilterButton from "@/scenes/shop/components/filter-bar/category-filter";
import PriceFilterButton from "@/scenes/shop/components/filter-bar/price-filter";
import ResetFilterButton from "@/scenes/shop/components/filter-bar/reset-filter-button";
import SortByFilterButton from "@/scenes/shop/components/filter-bar/sort-by-filter-button";
import { TypographyH2, TypographyMuted } from "@ui/shadcn/typography";

export const FilterBar: React.FC<any> = () => {
  return (
    <div className="z-10 flex w-full flex-col gap-4">
      <div className="flex flex-col">
        <TypographyH2>Shop</TypographyH2>
        <TypographyMuted>
          Explore our curated categories — something for every taste and
          occasion.
        </TypographyMuted>
      </div>

      <div className="flex w-full max-w-full items-center justify-stretch gap-2">
        <CategoryFilterButton
          buttonLabel="Experiences"
          filterName="experiences"
          handlePath="experiences"
        />

        <CategoryFilterButton
          buttonLabel="Occasions"
          filterName="occasions"
          handlePath="occasions"
        />

        <PriceFilterButton />

        <ResetFilterButton />

        <div className="ml-auto flex items-center gap-2">
          <AllFilterDialogBtn />

          <SortByFilterButton />
        </div>
      </div>

      <ActiveFilterChips />
    </div>
  );
};

// Export the component as the default export for simplicity, as it's the only functional part of this file.
export default FilterBar;
