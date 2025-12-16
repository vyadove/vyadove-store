"use client";

import type React from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Input } from "@ui/shadcn/input";
import { TypographyH3, TypographyH5 } from "@ui/shadcn/typography";
import type { GiftCard } from "@vyadove/types";
import { Loader2Icon, Trash } from "lucide-react";

import ErrorMessage from "./error-message";

type DiscountCodeProps = {
  applyPromotion: (code: string) => Promise<void>;
  cart?: any;
  promotions: GiftCard[];
  setPromotions: (promotions: GiftCard[]) => void;
};

export const DiscountCode: React.FC<DiscountCodeProps> = ({
  applyPromotion,
  cart,
  promotions,
  setPromotions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const removePromotionCode = (code: string) => {
    try {
      const updatedPromotions = promotions.filter(
        (promo) => promo.code !== code,
      );

      setPromotions(updatedPromotions);
    } catch (error) {
      setErrorMessage("Failed to remove promotion code.");
      console.error("Error:", error);
    }
  };

  const addPromotionCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = formData.get("code") as string;

    if (!code.trim()) {
      return;
    }

    try {
      await applyPromotion(code);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("Failed to add promotion code.");
    }
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <div className="">
        <form className="mb-6 w-full" onSubmit={addPromotionCode}>
          <Button
            data-testid="add-discount-button"
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            variant="link"
          >
            <FaPlus />
            Add Promotion Code(s)
          </Button>

          {isOpen && (
            <div className="flex w-full gap-x-2">
              <Input
                className="max-w-2xl flex-1 bg-white"
                name="code"
                placeholder="code"
                required
                type="text"
              />

              <Button data-testid="discount-apply-button" variant="secondary">
                Apply
              </Button>
            </div>
          )}

          {errorMessage && (
            <ErrorMessage
              data-testid="discount-error-message"
              error={errorMessage}
            />
          )}
        </form>

        {promotions?.length > 0 && (
          <div className="flex w-full flex-col">
            <TypographyH3 className="mb-2">Promotion(s) applied:</TypographyH3>

            {promotions.map((promo) => (
              <div
                className="mb-2 flex w-full max-w-full items-center justify-between"
                data-testid="discount-row"
                key={promo.id}
              >
                <TypographyH5 className="txt-small-plus flex w-4/5 items-baseline gap-x-1 pr-1">
                  <Badge color={"grey"}>{promo.code}</Badge>(
                  {promo.value || "-"})
                </TypographyH5>

                <button
                  className="flex items-center"
                  data-testid="remove-discount-button"
                  onClick={() => removePromotionCode(promo.code)}
                  type="button"
                >
                  <Trash size={14} />
                  <span className="sr-only">Remove discount code</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
