import { MdExplore } from "react-icons/md";

import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { TypographyH2, TypographyLarge } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-start justify-center p-2 ">
      <TypographyH2 className="flex flex-row ">Basket</TypographyH2>
      <TypographyLarge className=" text-muted-foreground mt-4 mb-6 max-w-[32rem] leading-7 font-light">
        You <span className="text-accent">don&apos;t have anything</span> in
        your cart. Let&apos;s change that, use the link below to start browsing
        our products.
      </TypographyLarge>

      <VyaLink href={Routes.shop}>
        <Button size="lg">
          <MdExplore />
          Explore Gifts
        </Button>
      </VyaLink>
    </div>
  );
};

export default EmptyCartMessage;
