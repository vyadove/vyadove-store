import DesktopNav from "@ui/nav/desktop-nav";
import { NavMenu } from "@ui/nav/mobile/nav-menu";
import { SearchNav } from "@ui/nav/mobile/search-nav";
import TopNavSlider from "@ui/nav/top-nav-slider";
import { UserNav } from "@ui/nav/user-nav";
import { VyaLink } from "@ui/vya-link";

import { CartIconButton } from "@/components/cart-icon-button";
import VyaDoveLogo from "@/components/icons";

import { cn } from "@/lib/utils";

// className="nav-border-reveal sticky top-0 z-50  py-4 backdrop-blur-xs"

export const Nav = async () => {
  return (
    <TopNavSlider className="">
      {/* --- DESKTOP --- */}
      <DesktopNav className="bg-primary-background/70 hidden rounded-xl backdrop-blur-lg md:mt-4 md:flex shadow-sm" />

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

        <UserNav />
      </div>
    </TopNavSlider>
  );
};
