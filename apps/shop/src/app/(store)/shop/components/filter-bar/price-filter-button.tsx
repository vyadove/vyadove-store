"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { filterKeys, useUpdateMultiFilterParam } from "@/app/(store)/shop/components/util";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Field, FieldLabel } from "@ui/shadcn/field";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/shadcn/popover";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const PricingFilterMenu = () => {
  // const [sliderValue, setSliderValue] = useState([2000, 5000]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPrices = searchParams.get(filterKeys.price)?.split(",") || [];
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterKeys.price);

  const isSelected = (value: string) => selectedPrices.includes(value);

  const handlePriceChange = (value: string) => {
    const updatedQuery = updateSearchParam(value);

    router.push(`?${updatedQuery}`, { scroll: false });
  };

  const ranges = [
    [0, 500],
    [1000, 2000],
    [2000, 5000],
    [5000, 10000],
    [10000, 20000],
  ];

  return (
    <div className="relative flex w-56 flex-col gap-6 p-1">
      <ul className="flex flex-col gap-1">
        {ranges.map(([start, end], idx) => {
          const value = `${start}-${end}`;
          const selected = isSelected(value);

          return (
            <li
              // asChild
              className={cn(
                "hover:bg-accent/10 flex items-center gap-3 p-1 rounded-md w-full cursor-pointer",
                selected && "bg-accent/10",
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
                  Br{start} to Br{end}
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

const PriceFilterButton = () => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get("price")?.split(",") || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "border-accent/50  rounded-md border hover:text-accent hover:bg-accent-foreground ",
            "data-[state=open]:bg-accent-foreground data-[state=open]:text-accent data-[state=open]:[&_svg]:rotate-180",
            selectedItems?.length > 0 && "bg-accent-foreground text-accent",
          )}
          variant="outline"
        >
          Pricing
          {selectedItems?.length > 0 && (
            <Badge className="rounded-full">
              {selectedItems?.length}
            </Badge>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="">
        <PricingFilterMenu />
      </PopoverContent>
    </Popover>
  );
};

export default PriceFilterButton;
