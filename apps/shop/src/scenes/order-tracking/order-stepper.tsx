"use client";

import { TypographyP, TypographySmall } from "@/ui/shadcn/typography";
import { Check } from "lucide-react";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type Step = {
  label: string;
  icon: React.ReactNode;
  date: string;
  time?: string;
  expected?: boolean;
};

interface OrderStatusStepperProps {
  currentStep: number; // index of the last completed step
  steps: Step[];
}

export function OrderStatusStepper({
  currentStep,
  steps,
}: OrderStatusStepperProps) {
  return (
    <Card className="bg-card w-full rounded-2xl border p-6 shadow-sm md:p-8">
      <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between md:gap-0">
        {steps.map((step, i) => {
          const isCompleted = i <= currentStep;
          const isLastStep = i === steps.length - 1;
          const isLineCompleted = i < currentStep;

          return (
            <div className="relative flex min-w-0 flex-1" key={i}>
              {/* ==================== MOBILE LAYOUT ==================== */}
              <div className="flex flex-1 flex-row items-start gap-4 md:hidden">
                {/* Connector Line (Left side) */}
                {!isLastStep && (
                  <div
                    className={cn(
                      "absolute left-4 top-8 bottom-[-32px] w-[4px] -translate-x-1/2 transition-colors duration-500",
                      isLineCompleted ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}

                {/* Status Indicator (Checkmark) */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-colors duration-300",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-muted text-muted-foreground",
                    )}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                </div>

                {/* Content (Right of indicator) */}
                <div className="flex flex-1 flex-col pt-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="text-accent origin-left scale-75">
                      {step.icon}
                    </div>
                    <TypographyP className="text-foreground font-medium">
                      {step.label}
                    </TypographyP>
                  </div>
                  <div className="pl-8">
                    {step.expected ? (
                      <div className="flex flex-col">
                        <TypographySmall className="text-muted-foreground text-xs tracking-wide uppercase">
                          PENDING
                        </TypographySmall>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <TypographySmall className="text-muted-foreground">
                          {step.date} {step.time && `• ${step.time}`}
                        </TypographySmall>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================== DESKTOP LAYOUT ==================== */}
              <div className="hidden flex-1 flex-col items-center md:flex">
                {/* Top Icon & Label */}
                <div className="mb-4 flex h-16 w-full flex-col items-center justify-end">
                  <div className="text-accent mb-2">{step.icon}</div>
                  <TypographyP className="text-foreground text-center leading-tight font-medium">
                    {step.label}
                  </TypographyP>
                </div>

                {/* Middle: Status Indicator & Connector Line */}
                <div className="relative flex w-full items-center justify-center">
                  {/* Connector Line (Right side) */}
                  {!isLastStep && (
                    <div className="absolute top-1/2 left-1/2 h-[4px] w-full -translate-y-1/2">
                      <div
                        className={cn(
                          "h-full w-full transition-colors duration-500",
                          isLineCompleted ? "bg-primary" : "bg-muted",
                        )}
                      />
                    </div>
                  )}

                  {/* Status Indicator (Checkmark) */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-colors duration-300",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-muted text-muted-foreground",
                      )}
                    >
                      <Check size={16} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Bottom Date & Time */}
                <div className="mt-4 flex h-12 flex-col items-center text-center">
                  {step.expected ? (
                    <>
                      <TypographySmall className="text-muted-foreground tracking-wide uppercase">
                        PENDING
                      </TypographySmall>
                      <TypographySmall className="text-muted-foreground">
                        -
                      </TypographySmall>
                    </>
                  ) : (
                    <>
                      <TypographyP className="text-foreground font-medium">
                        {step.date}
                      </TypographyP>
                      {step.time && (
                        <TypographySmall className="text-muted-foreground">
                          {step.time}
                        </TypographySmall>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
