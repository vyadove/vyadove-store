"use client";

import React from "react";
import { AiFillDelete } from "react-icons/ai";

import { useSearchParams } from "next/navigation";

import {
  filterKeys,
  useUpdateMultiFilterParam,
} from "../util";
import { Button } from "@ui/shadcn/button";

const ResetFilterButton = () => {
  const { resetMultiple } = useUpdateMultiFilterParam("");
  const searchParams = useSearchParams();

  return (
    <Button
      className="cursor-pointer bg-transparent disabled:hidden text-black underline-offset-4 hover:underline"
      // size="sm"
      disabled={
        !(
          searchParams.has(filterKeys.sortBy) ||
          searchParams.has(filterKeys.category) ||
          searchParams.has(filterKeys.price)
        )
      }
      onClick={() => resetMultiple(Object.values(filterKeys))}
      variant="link"
    >
      <AiFillDelete />
      Clear All Filters
    </Button>
  );
};

export default ResetFilterButton;
