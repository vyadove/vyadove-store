import type { ComponentPropsWithoutRef } from "react";
import React from "react";
import { FiSearch } from "react-icons/fi";

import { NavMenu } from "@ui/nav/mobile/nav-menu";
import { SearchNav } from "@ui/nav/mobile/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import NavBarLinks from "@ui/nav/nav-bar-links";
import TopNavSlider from "@ui/nav/top-nav-slider";
import { Button } from "@ui/shadcn/button";
import { Separator } from "@ui/shadcn/separator";
import { VyaLink } from "@ui/vya-link";
import { UserIcon } from "lucide-react";

import { CartIconButton } from "@/components/cart-icon-button";
import VyaDoveLogo from "@/components/icons";

import { cn } from "@/lib/utils";

// className="nav-border-reveal sticky top-0 z-50  py-4 backdrop-blur-xs"

export const NavItems = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center gap-6 p-3",
        props?.className,
      )}
    >
      <VyaLink href="/">
        <VyaDoveLogo className="w-36" />
      </VyaLink>

      <NavBarLinks />

      <div className="hidden lg:flex">
        <Separator className="h-full" orientation="vertical" />

        <div className="flex items-center">
          <Button size="icon" variant="link">
            <FiSearch stroke="#000" strokeWidth={2} />
          </Button>

          <CartIconButton />
        </div>
      </div>
    </div>
  );
};

export const Nav = async () => {
  return (
    <TopNavSlider className="">
      <NavItems className="bg-accent-foreground/70 hidden rounded-xl backdrop-blur-lg md:mt-4 md:flex" />

      {/* --- MOBILE --- */}
      <div
        className={cn(
          "z-50 mx-auto flex max-w-7xl flex-row md:hidden",
          "items-center gap-2 w-full border-2 bg-white/70 backdrop-blur-xs p-2",
        )}
      >
        <VyaLink href="/">
          <VyaDoveLogo className="w-[120px]" />
        </VyaLink>

        <div className="flex w-auto max-w-full shrink  overflow-auto max-sm:order-2 sm:mr-auto">
          <NavMenu />
        </div>
        <div className="mr-3 ml-auto sm:ml-0">
          <SearchNav />
        </div>

        <CartIconButton />

        <VyaLink href="/login">
          <UserIcon className="hover:text-neutral-500" />
        </VyaLink>
      </div>
    </TopNavSlider>
  );
};
