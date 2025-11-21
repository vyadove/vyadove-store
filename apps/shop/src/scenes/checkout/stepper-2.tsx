"use client";

import * as React from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// -----------------------------
// Context
// -----------------------------
interface StepperContextType {
  step: number;
  completed: boolean;
  orientation: "horizontal" | "vertical";
  stepsCount: number;
}

const StepperContext = React.createContext<StepperContextType | null>(null);

function useStepper() {
  const ctx = React.useContext(StepperContext);

  if (!ctx) {
    throw new Error("Stepper components must be used inside <Stepper>");
  }

  return ctx;
}

// -----------------------------
// Root Provider
// -----------------------------
const Stepper = ({
  step,
  completed = false,
  orientation = "horizontal",
  children,
  className,
}: {
  step: number;
  completed?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}) => {
  const stepsCount = React.Children.toArray(children).filter(
    (c: any) => c.type?.displayName === "StepperItem",
  ).length;

  return (
    <StepperContext.Provider
      value={{ step, completed, orientation, stepsCount }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </StepperContext.Provider>
  );
};

// -----------------------------
// Indicator
// -----------------------------
const StepperIndicator = ({
  index,
  icon,
  className,
}: {
  index: number;
  icon?: React.ReactNode;
  className?: string;
}) => {
  const { step, completed } = useStepper();

  const isCompleted = completed || index < step;
  const isCurrent = !completed && index === step;

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-all",
        isCompleted && "bg-primary border-primary text-primary-foreground",
        isCurrent && "border-primary text-primary",
        !isCompleted && !isCurrent && "border-muted text-muted-foreground",
        className,
      )}
    >
      {isCompleted ? <Check className="h-4 w-4" /> : icon ? icon : index + 1}
    </div>
  );
};

StepperIndicator.displayName = "StepperIndicator";

// -----------------------------
// Separator
// -----------------------------
const StepperSeparator = ({
  index,
  className,
}: {
  index: number;
  className?: string;
}) => {
  const { stepsCount, orientation } = useStepper();

  const isLast = index === stepsCount - 1;

  if (isLast) return null;

  // Horizontal or vertical line
  return orientation === "horizontal" ? (
    <div className={cn("flex-1 h-px bg-border", className)} />
  ) : (
    <div className={cn("ml-4 h-8 border-l border-border", className)} />
  );
};

StepperSeparator.displayName = "StepperSeparator";

// -----------------------------
// Stepper Item
// -----------------------------
const StepperItem = ({
  index,
  title,
  icon,
  children,
  className,
}: {
  index: number;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => {
  const { orientation } = useStepper();

  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-center gap-3"
          : "flex-col items-start gap-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <StepperIndicator icon={icon} index={index} />

        <span className="text-muted-foreground text-sm">{title}</span>
      </div>

      <StepperSeparator index={index} />

      {children}
    </div>
  );
};

StepperItem.displayName = "StepperItem";

// -----------------------------
// Stepper Content
// -----------------------------
const StepperContent = ({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const { step, completed } = useStepper();

  if (completed && index !== 0) return null;
  if (index !== step) return null;

  return <div className={cn("py-4", className)}>{children}</div>;
};

StepperContent.displayName = "StepperContent";

// -----------------------------
// Exports (same structure as Tooltip)
// -----------------------------
export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperSeparator,
  StepperContent,
};
