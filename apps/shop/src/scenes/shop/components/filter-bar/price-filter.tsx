"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Field, FieldLabel } from "@ui/shadcn/field";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/shadcn/popover";
import { TypographyP } from "@ui/shadcn/typography";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { filterKeys, useUpdateMultiFilterParam } from "../util";

// Menu Component
interface PriceFilterMenuProps {
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
}

export const PriceFilterMenu = ({
  selectedValues: controlledSelectedValues,
  onChange,
}: PriceFilterMenuProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(
    filterKeys.price,
  );

  const isControlled = controlledSelectedValues !== undefined;
  const selectedItems = isControlled
    ? controlledSelectedValues
    : searchParams.get(filterKeys.price)?.split(",") || [];

  const isSelected = (value: string) => selectedItems.includes(value);

  const handlePriceChange = (value: string) => {
    if (isControlled && onChange) {
      let newValues: string[];

      if (selectedItems.includes(value)) {
        newValues = selectedItems.filter((v) => v !== value);
      } else {
        newValues = [...selectedItems, value];
      }
      onChange(newValues);
    } else {
      const updatedQuery = updateSearchParam(value);

      router.push(`?${updatedQuery}`, { scroll: false });
    }
  };

  const handleReset = () => {
    if (isControlled && onChange) {
      onChange([]);
    } else {
      reset();
    }
  };

  const ranges = [
    [100, 1000],
    [1000, 2000],
    [2000, 5000],
    [5000, 10000],
    [10000, 20000],
    [20000],
  ];

  return (
    <div className="relative flex flex-col gap-6 p-1">
      <ul className="flex list-inside list-disc flex-col gap-[0.2rem] ">
        {ranges.map(([start, end], idx) => {
          const value = `${start}-${end || "plus"}`;
          const selected = isSelected(value);

          return (
            <li
              // asChild
              className={cn(
                "hover:bg-primary/10 flex items-center gap-3 p-1 rounded-md w-full cursor-pointer",
                selected &&
                  "text-primary bg-primary-background text-bold font-sofia-soft",
              )}
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                handlePriceChange(value);
              }}
            >
              <Field className="cursor-pointer" orientation="horizontal">
                <Checkbox checked={selected} id={`checkbox-${value}`} />
                <FieldLabel
                  className="cursor-pointer font-normal"
                  htmlFor={`checkbox-${value}`}
                >
                  <TypographyP>
                    <span className="text-xs text-gray-500">Br</span>
                    {start}{" "}
                    {end ? (
                      <>
                        to <span className="text-xs text-gray-500">Br</span>
                        {end}
                      </>
                    ) : (
                      "+"
                    )}
                  </TypographyP>
                </FieldLabel>
              </Field>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Button Component
const PriceFilterButton = () => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get("price")?.split(",") || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "",
            selectedItems?.length > 0 && "bg-primary-background",
          )}
          outlined
          size="md"
          variant={selectedItems?.length > 0 ? "default" : "secondary"}
        >
          Pricing
          {selectedItems?.length > 0 && (
            <Badge className="rounded-full">{selectedItems?.length}</Badge>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="">
        <PriceFilterMenu />
      </PopoverContent>
    </Popover>
  );
};

export default PriceFilterButton;
