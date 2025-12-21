"use client";

import React from "react";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Button } from "@ui/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/shadcn/tooltip";
import {
  TypographyH2,
  TypographyMuted,
  TypographySmall,
} from "@ui/shadcn/typography";
import { Minus, Plus, User } from "lucide-react";
import { motion } from "motion/react";

import { usePrice } from "@/components/price";

export default function PricingSection() {
  const { product, selectedVariant, participants, setParticipants } =
    useProductDetailContext();
  const { format } = usePrice();

  // Participant constraints from variant.participants
  const variant = selectedVariant as any;
  const participantsConfig = variant?.participants;
  const minParticipants = participantsConfig?.min ?? 1;
  const maxParticipants = participantsConfig?.max ?? 20;
  const isFixed = minParticipants === maxParticipants;

  // Use selected variant price or product price as fallback
  const unitPrice =
    selectedVariant?.price.amount || product.variants[0]?.price.amount || 0;

  // Calculate total price (price per person × participants)
  const totalPrice = unitPrice * participants;

  const handleIncrement = () =>
    setParticipants(Math.min(maxParticipants, participants + 1));
  const handleDecrement = () =>
    setParticipants(Math.max(minParticipants, participants - 1));

  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-4 shadow-sm">
      {/* Price Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <TypographyMuted className="text-xs font-light uppercase tracking-wider">
            Total Price
          </TypographyMuted>
          <TypographyH2 className="font-semibold text-primary">
            {format(totalPrice)}
          </TypographyH2>
          <TypographyMuted className="text-sm">
            {participants} participant{participants > 1 ? "s" : ""}
          </TypographyMuted>
        </div>

        {/* Participants Counter */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
            <User className="size-3" />
            <TypographySmall className="font-light text-xs">
              Participants
            </TypographySmall>
            {isFixed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 cursor-help text-xs text-muted-foreground">
                      (fixed)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    This experience requires exactly {minParticipants}{" "}
                    participant{minParticipants > 1 ? "s" : ""}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="size-8 rounded-full border-muted-foreground/30 hover:bg-muted"
              disabled={isFixed || participants <= minParticipants}
              onClick={handleDecrement}
              size="icon"
              variant="outline"
            >
              <Minus className="size-4" />
            </Button>

            <div className="relative flex min-w-16 items-center justify-center overflow-hidden rounded-md border h-10 px-3">
              <div className="flex items-center -space-x-1">
                {participants <= 3 ? (
                  // Show all user icons when there are 3 or fewer participants
                  [...Array(participants)].map((_, i) => (
                    <motion.div
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-primary flex size-5 p-1 rounded-full"
                      exit={{ scale: 0, opacity: 0 }}
                      initial={{ scale: 0, opacity: 0 }}
                      key={i}
                    >
                      <User className="size-full text-white fill-white" />
                    </motion.div>
                  ))
                ) : (
                  // When more than 3 participants, show 3 icons and a "+N" badge
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-primary flex size-5 p-1 rounded-full -space-x-3"
                        exit={{ scale: 0, opacity: 0 }}
                        initial={{ scale: 0, opacity: 0 }}
                        key={i}
                      >
                        <User className="size-full text-white fill-white" />
                      </motion.div>
                    ))}

                    <motion.div
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-sm text-foreground border border-muted-foreground/30 ml-1"
                      exit={{ scale: 0, opacity: 0 }}
                      initial={{ scale: 0, opacity: 0 }}
                      key="more"
                    >
                      <span className="text-xs font-thin">
                        +{participants - 3}
                      </span>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            <Button
              className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isFixed || participants >= maxParticipants}
              onClick={handleIncrement}
              size="icon"
              variant="default"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
