"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  filterKeys,
  useUpdateMultiFilterParam,
} from "@/app/(store)/shop/components/util";
import { NavMenuTrigger } from "@ui/nav/components";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Field, FieldLabel } from "@ui/shadcn/field";
import {
  NavigationMenuContent,
  NavigationMenuItem,
} from "@ui/shadcn/navigation-menu";
import { ScrollArea } from "@ui/shadcn/scroll-area";
import type { Collection } from "@vyadove/types";
import { ChevronDownIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const CollectionFilterMenu = ({
  collections,
}: {
  collections: Collection[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterName = "category";

  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterName);

  const isSelected = (value: string) => selectedCategories.includes(value);

  const handleValueChange = (value: string) => {
    const updatedQuery = updateSearchParam(value);

    router.push(`?${updatedQuery}`, { scroll: false });
  };

  const selectedCategories = searchParams.get(filterName)?.split(",") || [];

  return (
    <div className="grid w-full gap-4 ">
      <ScrollArea className="max-h-80 w-full pr-3" type="always">
        <ul className="flex flex-col gap-1">
          {collections.map((col) => {
            if (!col.handle) return null;

            return (
              <li
                // asChild
                className={cn(
                  "hover:bg-accent/10 flex items-center gap-3 p-1 rounded-md w-full cursor-pointer",
                  isSelected(col.handle) && "bg-accent/10",
                )}
                key={col.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleValueChange(col.handle as string);
                }}
              >
                <Field className="cursor-pointer" orientation="horizontal">
                  <Checkbox
                    checked={isSelected(col.handle)}
                    id={`checkbox-${col.id}`}
                  />
                  <FieldLabel
                    className="cursor-pointer font-normal"
                    htmlFor={`checkbox-${col.id}`}
                  >
                    {col.title}
                  </FieldLabel>
                </Field>
              </li>
            );
          })}
        </ul>
      </ScrollArea>

      <hr />

      <div className="w-full ">
        <Button
          disabled={!selectedCategories?.length}
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

interface Props {
  collections: Collection[];
}

const PriceFilterButton = ({ collections }: Props) => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get(filterKeys.category)?.split(",") || [];

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
          Collections
          {selectedItems?.length > 0 && (
            <Badge className="rounded-xl">{selectedItems?.length}</Badge>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="border border-red-500">
        <CollectionFilterMenu collections={collections || []} />
      </PopoverContent>
    </Popover>
  );

  /* return (
    <NavigationMenuItem
      className={cn("border-accent/50  rounded-md border", activeCls)}
    >
      <NavMenuTrigger>
        <div className="flex items-center gap-2 py-1">
          Collections
          {selectedItems?.length > 0 && (
            <Badge className="rounded-xl">{selectedItems?.length}</Badge>
          )}
        </div>
      </NavMenuTrigger>

      <NavigationMenuContent className="!rounded-xl">
        <CollectionFilterMenu collections={collections || []} />
      </NavigationMenuContent>
    </NavigationMenuItem>
  ); */
};

export default PriceFilterButton;
