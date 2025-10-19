import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { VyaLink } from "@ui/vya-link";
import { UserIcon } from "lucide-react";

import { CartIcon } from "@/components/cart-icon";

export const Nav = async () => {
  return (
    <header className="nav-border-reveal sticky top-0 z-50 bg-white/90 py-4 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl flex-row items-center gap-2 px-4 sm:px-6 lg:px-8">
        <VyaLink href="/">
          <SeoH1 className="-mt-0.5 text-xl font-bold whitespace-nowrap">
            Your Next Store
          </SeoH1>
        </VyaLink>

        <div className="flex w-auto max-w-full shrink overflow-auto max-sm:order-2 sm:mr-auto">
          <NavMenu />
        </div>
        <div className="mr-3 ml-auto sm:ml-0">
          <SearchNav />
        </div>
        <CartIcon />
        <VyaLink href="/login">
          <UserIcon className="hover:text-neutral-500" />
        </VyaLink>
      </div>
    </header>
  );
};
