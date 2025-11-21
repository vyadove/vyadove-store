"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  ClipboardCheck,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";

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
    <Card className="w-full p-6 rounded-2xl border shadow-sm">
      <div className="flex items-start justify-between relative">
        {/* Steps */}
        {steps.map((step, i) => {
          const isCompleted = i <= currentStep;
          const isUpcoming = i > currentStep;

          return (
            <div key={i} className="flex flex-col items-center text-center w-full">
              {/* Icon */}
              <div
                className={cn(
                  "p-3 rounded-full border-2 bg-white",
                  isCompleted
                    ? "border-green-700 text-green-700"
                    : "border-gray-300 text-gray-400"
                )}
              >
                {step.icon}
              </div>

              {/* Label */}
              <div
                className={cn(
                  "mt-2 text-sm font-medium",
                  isCompleted ? "text-green-800" : "text-gray-500"
                )}
              >
                {step.label}
              </div>

              {/* Date */}
              <div className="mt-3 text-xs text-gray-500">
                {step.expected ? (
                  <>
                    <div className="text-gray-400">Expected</div>
                    <div>{step.date}</div>
                  </>
                ) : (
                  <>
                    <div>{step.date}</div>
                    {step.time && <div>{step.time}</div>}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Connecting line */}
        <div className="absolute top-[34px] left-0 w-full h-[2px]">
          {/* Background line */}
          <div className="w-full h-full bg-gray-200"></div>

          {/* Progress line */}
          <div
            className="h-full bg-green-700 transition-all"
            style={{
              width:
                currentStep === 0
                  ? "0%"
                  : `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
