"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@ui/shadcn/button";
import { Field, FieldLabel } from "@ui/shadcn/field";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/shadcn/popover";
import { RadioGroup, RadioGroupItem } from "@ui/shadcn/radio-group";
import { ChevronDownIcon, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";

import { filterKeys, useUpdateMultiFilterParam } from "../util";

const sortingOptions = [
  {
    label: "Most Popular (default)",
    value: "default",
  },
  {
    label: "Price (low to high)",
    value: "low-high",
  },
  {
    label: "Price (high to low)",
    value: "high-low",
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

const FilterMenuContent = () => {
  // const [sliderValue, setSliderValue] = useState([2000, 5000]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const filterName = filterKeys.sortBy;

  const selectedPrices = searchParams.get(filterName);
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterName);

  const isSelected = (value: string) => selectedPrices?.includes(value);

  const handleValueChange = (value: string) => {
    if (value === "default") {
      reset();

      return;
    }

    const updatedQuery = updateSearchParam(value, filterName, true);

    router.push(`?${updatedQuery}`, { scroll: false });
  };

  return (
    <RadioGroup
      className="relative flex w-56 flex-col gap-6 p-1"
      defaultValue={sortingOptions[0]?.value}
      onValueChange={handleValueChange}
      value={selectedPrices || sortingOptions[0]?.value}
    >
      <ul className="flex flex-col gap-1">
        {sortingOptions.map((option, idx) => {
          const selected = isSelected(option.value);

          return (
            <li
              className={cn(
                "hover:bg-accent/10 flex items-center gap-3 p-1 rounded-md w-full cursor-pointer",
              )}
              key={idx}
            >
              <Field className="cursor-pointer" orientation="horizontal">
                <RadioGroupItem
                  id={`checkbox-${option.value}`}
                  value={option.value}
                />
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
    </RadioGroup>
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
            "",
            // selectedItems?.length > 0 && "bg-primary-background",
          )}
          outlined
          size="md"
          variant={selectedItems?.length > 0 ? "default" : "secondary"}
        >
          <SortDesc />
          Sort By
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
