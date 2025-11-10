"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  filterKeys,
  useUpdateMultiFilterParam,
} from "@/app/(store)/shop/components/util";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Field, FieldLabel } from "@ui/shadcn/field";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/shadcn/popover";
import { ChevronDownIcon, SortAsc, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";

const FilterMenuContent = () => {
  // const [sliderValue, setSliderValue] = useState([2000, 5000]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const filterName = filterKeys.sortBy;

  const selectedPrices = searchParams.get(filterName)?.split(",") || [];
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterName);

  const isSelected = (value: string) => selectedPrices.includes(value);

  const handleValueChange = (value: string) => {
    const updatedQuery = updateSearchParam(value);

    router.push(`?${updatedQuery}`, { scroll: false });
  };

  const sortingOptions = [
    {
      label: "Most Popular",
      value: "popular",
    },
    {
      label: "Price (low to high)",
      value: "low",
    },
    {
      label: "Price (high to high)",
      value: "high",
    },
    {
      label: "Newest",
      value: "newest",
    },
    {
      label: "Rating",
      value: "rating",
    },
    {
      label: "Most Reviewed",
      value: "reviewed",
    },
  ];

  return (
    <div className="relative flex w-56 flex-col gap-6 p-1">
      <ul className="flex flex-col gap-1">
        {sortingOptions.map((option, idx) => {
          const selected = isSelected(option.value);

          return (
            <li
              // a<option value=""></option>
              className={cn(
                "hover:bg-accent/10 flex items-center gap-3 p-1 rounded-md w-full cursor-pointer",
                selected && "bg-accent/10",
              )}
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                handleValueChange(option.value);
              }}
            >
              <Field className="cursor-pointer" orientation="horizontal">
                <Checkbox checked={selected} id={`checkbox-${option.value}`} />
                <FieldLabel
                  className="cursor-pointer font-normal"
                  htmlFor={`checkbox-${option.value}`}
                >
                  {option.label}
                </FieldLabel>
              </Field>
            </li>
          );
        })}
      </ul>

      <hr />

      <div className="w-full ">
        <Button
          className="rounded-xl"
          disabled={!selectedPrices?.length}
          onClick={() => {
            reset();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const SortByFilterButton = () => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get(filterKeys.sortBy)?.split(",") || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "border-accent/50  rounded-md border hover:text-accent hover:bg-accent-foreground ",
            "data-[state=open]:bg-accent-foreground data-[state=open]:text-accent",
            selectedItems?.length > 0 && "bg-accent-foreground text-accent",
          )}
          variant="outline"
        >
          <SortDesc />
          Sort By
          {selectedItems?.length > 0 && (
            <Badge className="rounded-xl">{selectedItems?.length}</Badge>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="border">
        <FilterMenuContent />
      </PopoverContent>
    </Popover>
  );
};

export default SortByFilterButton;
