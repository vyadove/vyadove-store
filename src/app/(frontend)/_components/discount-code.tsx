"use client";

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui";
import type React from "react";
import { useState } from "react";

import ErrorMessage from "./error-message";
import { SubmitButton } from "./submit-button";
import Trash from "./icons/trash";
import type { GiftCard } from "@/payload-types";

type DiscountCodeProps = {
    promotions: GiftCard[];
    applyPromotion: (code: string) => Promise<void>;
	setPromotions: (promotions: GiftCard[]) => void;
};

export const DiscountCode: React.FC<DiscountCodeProps> = ({
    promotions,
    applyPromotion,
	setPromotions
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const removePromotionCode = async (code: string) => {
        try {
            const updatedPromotions = promotions.filter((promo) => promo.code !== code);
			setPromotions(updatedPromotions);
        } catch (error) {
            setErrorMessage("Failed to remove promotion code.");
            console.error("Error:", error);
        }
    };

    const addPromotionCode = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const code = formData.get("code") as string;

        if (!code.trim()) return;

        try {
            await applyPromotion(code);
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage("Failed to add promotion code.");
        }
    };

    return (
        <div className="w-full bg-white flex flex-col">
            <div className="txt-medium">
                <form onSubmit={addPromotionCode} className="w-full mb-5">
                    <Label className="flex gap-x-1 my-2 items-center">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            data-testid="add-discount-button"
                        >
                            Add Promotion Code(s)
                        </button>
                    </Label>

                    {isOpen && (
                        <div className="flex w-full gap-x-2">
                            <Input
                                className="size-full"
                                id="promotion-input"
                                name="code"
                                type="text"
                                data-testid="discount-input"
                            />
                            <SubmitButton
                                variant="secondary"
                                data-testid="discount-apply-button"
                            >
                                Apply
                            </SubmitButton>
                        </div>
                    )}

                    {errorMessage && (
                        <ErrorMessage
                            error={errorMessage}
                            data-testid="discount-error-message"
                        />
                    )}
                </form>

                {promotions.length > 0 && (
                    <div className="w-full flex flex-col">
                        <Heading className="txt-medium mb-2">
                            Promotion(s) applied:
                        </Heading>

                        {promotions.map((promo) => (
                            <div
                                key={promo.id}
                                className="flex items-center justify-between w-full max-w-full mb-2"
                                data-testid="discount-row"
                            >
                                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                                    <Badge color={"grey"} size="small">
                                        {promo.code}
                                    </Badge>
                                    ({promo.value})
                                </Text>

                                <button
                                    type="button"
                                    className="flex items-center"
                                    onClick={() =>
                                        removePromotionCode(promo.code)
                                    }
                                    data-testid="remove-discount-button"
                                >
                                    <Trash size={14} />
                                    <span className="sr-only">
                                        Remove discount code
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
