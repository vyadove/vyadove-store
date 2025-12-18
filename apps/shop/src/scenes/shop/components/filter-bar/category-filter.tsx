"use client";

import React, { useMemo } from "react";

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

import type { filterKeys } from "../util";
import { useUpdateMultiFilterParam } from "../util";

// Menu Component
interface CategoryFilterMenuProps {
  categories: Category[];
  filterName: (typeof filterKeys)[keyof typeof filterKeys];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
}

export const CategoryFilterMenu = ({
  categories,
  filterName,
  selectedValues: controlledSelectedValues,
  onChange,
}: CategoryFilterMenuProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const { updateSearchParam, reset } = useUpdateMultiFilterParam(filterName);

  // Use controlled values if provided, otherwise fallback to URL params
  const isControlled = controlledSelectedValues !== undefined;
  const selectedItems = isControlled
    ? controlledSelectedValues
    : searchParams.get(filterName)?.split(",") || [];

  const isSelected = (value: string) => selectedItems.includes(value);

  const handleValueChange = (value: string) => {
    if (isControlled && onChange) {
      // Calculate new values for controlled mode
      let newValues: string[];

      if (selectedItems.includes(value)) {
        newValues = selectedItems.filter((v) => v !== value);
      } else {
        newValues = [...selectedItems, value];
      }
      onChange(newValues);
    } else {
      // Default behavior: update URL
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
    </div>
  );
};

// Button Component
interface CategoryFilterButtonProps {
  filterName: (typeof filterKeys)[keyof typeof filterKeys];
  handlePath: string[];
  buttonLabel: string;
}

const CategoryFilterButton = ({
  filterName,
  buttonLabel,
  handlePath,
}: CategoryFilterButtonProps) => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get(filterName)?.split(",") || [];

  const categoryQuery = usePayloadFindQuery("category", {
    findArgs: {
      where: {
        // parent: { equals: null },
        handle: {
          // equals: "experiences",
          // equals: handlePath,
          in: handlePath,
        },
      },
      limit: 1,
    },
  });

  const experiences = useMemo(() => {
    if (!categoryQuery.data?.docs?.length) return [];

    return (
      (categoryQuery.data.docs[0]?.subcategories?.docs as Category[]) || []
    );
  }, [categoryQuery.data]);

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
          variant={
            selectedItems?.length > 0
              ? "default"
              : categoryQuery.isError
                ? "destructive"
                : "secondary"
          }
        >
          {buttonLabel}
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
        <CategoryFilterMenu categories={experiences} filterName={filterName} />
      </PopoverContent>
    </Popover>
  );
};

export default CategoryFilterButton;
