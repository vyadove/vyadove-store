"use client";

import { convertToLocale } from "@/utils/money";
import { Badge, Heading, Input, Label, Text } from "@medusajs/ui";
import React, { useActionState } from "react";

import Trash from "../icons/trash";
import ErrorMessage from "./error-message";
import { SubmitButton } from "./submit-button";

type DiscountCodeProps = {
    cart: {
        promotions: any[];
    } & any;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const { items = [], promotions = [] } = cart;
    const removePromotionCode = async (code: string) => {
        // const validPromotions = promotions.filter(
        //     (promotion) => promotion.code !== code
        // );
        // await applyPromotions(
        //     validPromotions
        //         .filter((p) => p.code === undefined)
        //         .map((p) => p.code!)
        // );
    };

    const addPromotionCode = async (formData: FormData) => {
        const code = formData.get("code");
        if (!code) {
            return;
        }
        const input = document.getElementById(
            "promotion-input"
        ) as HTMLInputElement;
        const codes = promotions
            .filter((p: any) => p.code === undefined)
            .map((p: any) => p.code!);
        codes.push(code.toString());

        // await applyPromotions(codes);

        if (input) {
            input.value = "";
        }
    };

    // const [message] = useActionState(submitPromotionForm as any, null);

    return (
        <div className="w-full bg-white flex flex-col">
            <div className="txt-medium">
                <form
                    action={(a) => addPromotionCode(a)}
                    className="w-full mb-5"
                >
                    <Label className="flex gap-x-1 my-2 items-center">
                        <button
                            className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            data-testid="add-discount-button"
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                        >
                            Add Promotion Code(s)
                        </button>

                        {/* <Tooltip content="You can add multiple promotion codes">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip> */}
                    </Label>

                    {isOpen && (
                        <>
                            <div className="flex w-full gap-x-2">
                                <Input
                                    autoFocus={false}
                                    className="size-full"
                                    data-testid="discount-input"
                                    id="promotion-input"
                                    name="code"
                                    type="text"
                                />
                                <SubmitButton
                                    data-testid="discount-apply-button"
                                    variant="secondary"
                                >
                                    Apply
                                </SubmitButton>
                            </div>

                            {/* <ErrorMessage
                                data-testid="discount-error-message"
                                error={message}
                            /> */}
                        </>
                    )}
                </form>

                {promotions.length > 0 && (
                    <div className="w-full flex items-center">
                        <div className="flex flex-col w-full">
                            <Heading className="txt-medium mb-2">
                                Promotion(s) applied:
                            </Heading>

                            {promotions.map((promotion: any) => {
                                return (
                                    <div
                                        className="flex items-center justify-between w-full max-w-full mb-2"
                                        data-testid="discount-row"
                                        key={promotion.id}
                                    >
                                        <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                                            <span
                                                className="truncate"
                                                data-testid="discount-code"
                                            >
                                                <Badge
                                                    color={
                                                        promotion.is_automatic
                                                            ? "green"
                                                            : "grey"
                                                    }
                                                    size="small"
                                                >
                                                    {promotion.code}
                                                </Badge>{" "}
                                                (
                                                {promotion.application_method
                                                    ?.value !== undefined &&
                                                    promotion.application_method
                                                        .currency_code !==
                                                        undefined && (
                                                        <>
                                                            {promotion
                                                                .application_method
                                                                .type ===
                                                            "percentage"
                                                                ? `${promotion.application_method.value}%`
                                                                : convertToLocale(
                                                                      {
                                                                          amount: +promotion
                                                                              .application_method
                                                                              .value,
                                                                          currency_code:
                                                                              promotion
                                                                                  .application_method
                                                                                  .currency_code,
                                                                      }
                                                                  )}
                                                        </>
                                                    )}
                                                )
                                                {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                                            </span>
                                        </Text>
                                        {!promotion.is_automatic && (
                                            <button
                                                className="flex items-center"
                                                data-testid="remove-discount-button"
                                                onClick={() => {
                                                    if (!promotion.code) {
                                                        return;
                                                    }

                                                    removePromotionCode(
                                                        promotion.code
                                                    );
                                                }}
                                            >
                                                <Trash size={14} />
                                                <span className="sr-only">
                                                    Remove discount code from
                                                    order
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountCode;
