"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Checkbox } from "@ui/shadcn/checkbox";
import { Field, FieldLabel } from "@ui/shadcn/field";
import { ScrollArea } from "@ui/shadcn/scroll-area";
import { Spinner } from "@ui/shadcn/spinner";
import type { Category } from "@vyadove/types";
import { ChevronDownIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { filterKeys, useUpdateMultiFilterParam } from "../util";

const CollectionFilterMenu = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();

  const filterName = filterKeys.category;
  const searchParams = useSearchParams();
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterName);
  const selectedItems = searchParams.get(filterName)?.split(",") || [];

  const isSelected = (value: string) => selectedItems.includes(value);

  const handleValueChange = (value: string) => {
    const updatedQuery = updateSearchParam(value);

    router.push(`?${updatedQuery}`, { scroll: false });
  };

  return (
    <div className="grid w-full gap-4 ">
      <ScrollArea className="max-h-80 w-full pr-3" type="always">
        <ul className="flex flex-col gap-1">
          {categories.map((col) => {
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
          className=""
          disabled={!selectedItems?.length}
          onClick={() => {
            reset();
          }}
          outlined={true}
          size="sm"
          variant="secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const CategoryFilterButton = () => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get(filterKeys.category)?.split(",") || [];

  const categoryQuery = usePayloadFindQuery("category", {
    findArgs: {
      limit: 100,
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "",
            selectedItems?.length > 0 && "bg-primary-background",
          )}
          disabled={categoryQuery.isLoading}
          outlined
          size="md"
          variant={selectedItems?.length > 0 ? "default" : "secondary"}
        >
          Experiences
          {selectedItems?.length > 0 && (
            <Badge className="rounded-full">{selectedItems?.length}</Badge>
          )}
          {categoryQuery.isLoading ? (
            <Spinner />
          ) : (
            <ChevronDownIcon
              aria-hidden="true"
              className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="border">
        <CollectionFilterMenu categories={categoryQuery.data?.docs || []} />
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

export default CategoryFilterButton;
