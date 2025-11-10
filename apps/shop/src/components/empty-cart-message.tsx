import { Routes } from "@/store.routes";
import { TypographyH3, TypographyP } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-start justify-center px-2 py-48"
      data-testid="empty-cart-message"
    >
      <TypographyH3 className="text-3xl-regular flex flex-row items-baseline gap-x-2">
        Cart
      </TypographyH3>
      <TypographyP className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </TypographyP>
      <div>
        <VyaLink href={Routes.shop}>Explore products</VyaLink>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
