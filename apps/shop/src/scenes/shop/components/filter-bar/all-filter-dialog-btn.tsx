"use client";

import React from "react";
import { FiFilter } from "react-icons/fi";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { filterKeys } from "../util";

const AllFilterDialogBtn = () => {
  const searchParams = useSearchParams();
  const selectedItems = searchParams.get(filterKeys.sortBy)?.split(",") || [];

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button outlined size="md" variant="secondary">
            <FiFilter />
            All Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input defaultValue="Pedro Duarte" id="name-1" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input defaultValue="@peduarte" id="username-1" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AllFilterDialogBtn;
