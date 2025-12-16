"use client";

import React, { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";

import { useRouter, useSearchParams } from "next/navigation";

import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { TypographyH4 } from "@ui/shadcn/typography";
import type { Category } from "@vyadove/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { filterKeys } from "../util";
import { CategoryFilterMenu } from "./category-filter";
import { PriceFilterMenu } from "./price-filter";

const AllFilterDialogBtn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Local state for filters to allow "Apply" action
  // We initialize with current URL params when dialog opens
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Sync state with URL when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedExperiences(
        searchParams.get(filterKeys.experiences)?.split(",") || [],
      );
      setSelectedOccasions(
        searchParams.get(filterKeys.occasions)?.split(",") || [],
      );
      setSelectedPrices(searchParams.get(filterKeys.price)?.split(",") || []);
    }
  }, [open, searchParams]);

  // Fetch Experiences
  const experiencesQuery = usePayloadFindQuery("category", {
    findArgs: {
      where: {
        handle: {
          equals: "experiences",
        },
      },
      limit: 1,
    },
  });

  const experiences = useMemo(() => {
    if (!experiencesQuery.data?.docs?.length) return [];

    return (
      (experiencesQuery.data.docs[0]?.subcategories?.docs as Category[]) || []
    );
  }, [experiencesQuery.data]);

  // Fetch Occasions
  const occasionsQuery = usePayloadFindQuery("category", {
    findArgs: {
      where: {
        handle: {
          equals: "occasions",
        },
      },
      limit: 1,
    },
  });

  const occasions = useMemo(() => {
    if (!occasionsQuery.data?.docs?.length) return [];

    return (
      (occasionsQuery.data.docs[0]?.subcategories?.docs as Category[]) || []
    );
  }, [occasionsQuery.data]);

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update Experiences
    if (selectedExperiences.length > 0) {
      newParams.set(filterKeys.experiences, selectedExperiences.join(","));
    } else {
      newParams.delete(filterKeys.experiences);
    }

    // Update Occasions
    if (selectedOccasions.length > 0) {
      newParams.set(filterKeys.occasions, selectedOccasions.join(","));
    } else {
      newParams.delete(filterKeys.occasions);
    }

    // Update Price
    if (selectedPrices.length > 0) {
      newParams.set(filterKeys.price, selectedPrices.join(","));
    } else {
      newParams.delete(filterKeys.price);
    }

    router.push(`?${newParams.toString()}`, { scroll: false });
    setOpen(false);
  };

  const handleResetAll = () => {
    setSelectedExperiences([]);
    setSelectedOccasions([]);
    setSelectedPrices([]);
  };

  const totalFilters =
    selectedExperiences.length +
    selectedOccasions.length +
    selectedPrices.length;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button outlined size="md" variant="secondary">
          <FiFilter />
          All Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader className="">
          <DialogTitle>All Filters</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Category: Experiences */}
          <div className="flex flex-col gap-2">
            <TypographyH4>Category</TypographyH4>
            <CategoryFilterMenu
              categories={experiences}
              filterName={filterKeys.experiences}
              onChange={setSelectedExperiences}
              selectedValues={selectedExperiences}
            />
          </div>

          <hr />

          {/* Price */}
          <div className="flex flex-col gap-2">
            <TypographyH4>Price</TypographyH4>
            <PriceFilterMenu
              onChange={setSelectedPrices}
              selectedValues={selectedPrices}
            />
          </div>

          <hr />

          {/* Occasion */}
          <div className="flex flex-col gap-2">
            <TypographyH4>Occasion</TypographyH4>
            <CategoryFilterMenu
              categories={occasions}
              filterName={filterKeys.occasions}
              onChange={setSelectedOccasions}
              selectedValues={selectedOccasions}
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 flex w-full items-center justify-between bg-white pt-4 sm:justify-between">
          <Button className="" onClick={handleResetAll} variant="outline">
            Reset All
          </Button>
          <Button className="" onClick={handleApply} type="submit">
            Apply Filter ({totalFilters} results)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllFilterDialogBtn;
