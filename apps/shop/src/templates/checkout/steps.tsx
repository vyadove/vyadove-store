"use client";

import { usePathname } from "next/navigation";

type StepProps = {
    steps: {
        id: number;
        name: string;
        route: string;
        description: string;
    }[];
};

export const Steps = ({ steps }: StepProps) => {
    const pathname = usePathname();
    const currentStepIndex = steps.findIndex((step) => step.route === pathname);
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div className="flex items-center" key={step.id}>
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                index < currentStepIndex
                                    ? "border-green-500 bg-green-500 text-white"
                                    : index === currentStepIndex
                                      ? "border-blue-500 text-blue-500"
                                      : "border-gray-300 text-gray-300"
                            }`}
                        >
                            <span className="text-sm font-medium">
                                {index < currentStepIndex ? "✓" : step.id}
                            </span>
                        </div>

                        <div className="ml-3">
                            <p
                                className={`text-sm font-medium ${
                                    index === currentStepIndex
                                        ? "text-black"
                                        : "text-gray-500"
                                }`}
                            >
                                {step.name}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="hidden sm:block w-24 h-0.5 ml-2 bg-gray-300" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
