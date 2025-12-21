import Link from "next/link";

import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { TypographyH3, TypographyMuted } from "@ui/shadcn/typography";

import CartIcon from "@/components/icons/cart-icon";

interface SidebarCartEmptyProps {
  onClose: () => void;
}

const SidebarCartEmpty = ({ onClose }: SidebarCartEmptyProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Icon with circular background */}
      <div className="bg-primary/10 mb-6 flex size-24 items-center justify-center rounded-full">
        <CartIcon className="fill-primary/60 size-10" />
      </div>

      <TypographyH3 className="mb-2 text-center">
        Your cart is empty
      </TypographyH3>
      <TypographyMuted className="mb-6 text-center">
        Add some items to get started
      </TypographyMuted>

      <Link href={Routes.shop}>
        <Button onClick={onClose} size="lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default SidebarCartEmpty;
