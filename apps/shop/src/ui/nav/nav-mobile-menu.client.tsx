"use client";

import { type ReactNode, useState } from "react";

import { MenuIcon } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const NavMobileMenu = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Navigation menu
          </DrawerDescription>
        </DrawerHeader>
        <div
          onClick={(e) => {
            if (e.target instanceof HTMLElement && e.target.closest("a")) {
              setIsOpen(false);
            }
          }}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
