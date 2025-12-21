"use client";

import * as React from "react";

import { TypographyP } from "@ui/shadcn/typography";
import { Check } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

export interface StepItem {
  name: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

interface StepperProps {
  steps: StepItem[];
  step: number;
  onStepChange?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const StepperItem = ({
  isHorizontal,
  isCompleted,
  isCurrent,
  steps,
  idx,
  step,
}: {
  isHorizontal: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  steps: StepItem[];
  idx: number;
  step: StepItem;
}) => {
  return (
    <React.Fragment>
      <div
        className={cn(
          "flex items-center gap-2",
          !isHorizontal && "flex-col items-start",
        )}
      >
        {/* Circle */}
        <div
          className={cn(
            "flex size-14_ p-3  aspect-square overflow-hidden items-center justify-center rounded-full border text-lg font-medium transition-all",
            isCompleted && "bg-primary text-primary-foreground border-primary",
            isCurrent &&
              "border-primary text-primary size-16_ p-4 bg-primary-background",
            !isCompleted && !isCurrent && "border-muted text-muted-foreground",
          )}
        >
          {isCompleted ? (
            <Check className="" />
          ) : step.icon ? (
            step.icon
          ) : (
            idx + 1
          )}
        </div>

        {/* Title */}
        <TypographyP
          className={cn(
            "text-sm transition-opacity font-light",
            isCurrent
              ? "text-primary"
              : isCompleted
                ? "text-muted-foreground"
                : "text-muted-foreground",
          )}
        >
          {step.title}
        </TypographyP>
      </div>

      {/* Line */}
      {idx < steps.length - 1 && (
        <div
          className={cn(
            isCompleted ? "border-primary" : "bg-border",

            isHorizontal ? "flex-1" : "h-10 ml-4 border-l border-border",
          )}
        >
          {isHorizontal && (
            <Separator
              className={cn("bg-border", isCompleted && "bg-primary")}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export function Stepper({
  steps,
  step,
  onStepChange,
  orientation = "horizontal",
  className,
}: StepperProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex",
          isHorizontal ? "flex-row items-center gap-4 pb-6" : "flex-col gap-6",
        )}
      >
        {steps.map((s, idx) => {
          const isCompleted = idx < step;
          const isCurrent = idx === step;

          return (
            <StepperItem
              idx={idx}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isHorizontal={isHorizontal}
              key={idx}
              step={s}
              steps={steps}
            />
          );
        })}
      </div>

      {/* Content */}

      {steps[step]?.children && <>{steps[step]?.children}</>}
    </div>
  );
}
