// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.
"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { RadioGroup, RadioGroupItem } from "@/ui/shadcn/radio-group";
import type { Collection } from "@shopnex/types";
import { Item } from "@ui/shadcn/item";
import { Label } from "@ui/shadcn/label";

import { cn } from "@/lib/utils";

// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.

// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.

// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.

// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.

// This component must be marked with 'use client' to use hooks like useRouter and useSearchParams.

/**
 * Renders the collection filters and manages the selected state via URL search parameters.
 * @param collections The list of featured collections to display.
 */
interface CollectionFilterClientProps {
  collections: Collection[];
}

export const CollectionFilterClient: React.FC<CollectionFilterClientProps> = ({
  collections,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current collection ID from the URL. Defaults to 'all'.
  const currentCollectionId = searchParams.get("collectionId") || "all";

  /**
   * Handles the change event for the RadioGroup.
   * Updates the URL search parameter 'collectionId' to reflect the new selection.
   * @param value The ID of the selected collection (or 'all').
   */
  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      // Remove the parameter if 'all' is selected
      newSearchParams.delete("collectionId");
    } else {
      newSearchParams.set("collectionId", value);
    }

    // Use router.push to update the URL without triggering a full page reload
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex max-w-lg flex-col">
      <RadioGroup className='gap-0' onValueChange={handleValueChange} value={currentCollectionId}>
        <Item
          asChild
          className={cn(
            "[a]:hover:bg-accent/10 flex items-center gap-3 rounded-md border-0 border-b py-5",
            // if active
            currentCollectionId === 'all' && "bg-accent/10",
          )}
          size="sm"
          variant="outline"
        >
          <a
            className="block border"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleValueChange("all");
            }}
          >
            <RadioGroupItem id="r-all" value="all" />
            <Label htmlFor="r-all">All</Label>
          </a>
        </Item>

        {collections.map((col) => (
          <Item
            asChild
            className={cn(
              "[a]:hover:bg-accent/10 flex items-center gap-3 rounded-md border-0 border-b py-5 mb-1",
              // if active
              currentCollectionId === col.id?.toString() && "bg-accent/10",
            )}
            key={col.id}
            size="sm"
            variant="outline"
          >
            <a
              className="block border"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleValueChange(col.id.toString());
              }}
            >
              <RadioGroupItem
                id={`r-${col.id.toString()}`}
                value={col.id.toString()}
              />
              <Label htmlFor={`r-${col.id.toString()}`}>{col.title}</Label>
            </a>
          </Item>
        ))}

        {/* Dynamic Collection Options */}
        {/*{collections.map((col) => (
          <div className="flex items-center gap-3 border-b py-4" key={col.id}>
            <RadioGroupItem id={`r-${col.id.toString()}`} value={col.id.toString()} />
            <Label htmlFor={`r-${col.id.toString()}`}>{col.title}</Label>
          </div>
        ))}*/}
      </RadioGroup>
    </div>
  );
};

// Export the component as the default export for simplicity, as it's the only functional part of this file.
export default CollectionFilterClient;
