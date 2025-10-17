import { clx, Text } from "@medusajs/ui";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import React from "react";

type AccordionItemProps = {
    active?: boolean;
    children: React.ReactNode;
    complete?: boolean;
    customTrigger?: React.ReactNode;
    description?: string;
    forceMountContent?: true;
    headingSize?: "large" | "medium" | "small";
    required?: boolean;
    subtitle?: string;
    title: string;
    tooltip?: string;
    triggerable?: boolean;
} & AccordionPrimitive.AccordionItemProps;

type AccordionProps =
    | (AccordionPrimitive.AccordionMultipleProps &
          React.RefAttributes<HTMLDivElement>)
    | (AccordionPrimitive.AccordionSingleProps &
          React.RefAttributes<HTMLDivElement>);

const Accordion: {
    Item: React.FC<AccordionItemProps>;
} & React.FC<AccordionProps> = ({ children, ...props }) => {
    return (
        <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
    );
};

const Item: React.FC<AccordionItemProps> = ({
    children,
    className,
    customTrigger = undefined,
    description,
    forceMountContent = undefined,
    headingSize = "large",
    subtitle,
    title,
    triggerable,
    ...props
}) => {
    return (
        <AccordionPrimitive.Item
            {...props}
            className={clx(
                "border-grey-20 group border-t last:mb-0 last:border-b",
                "py-3",
                className
            )}
        >
            <AccordionPrimitive.Header className="px-1">
                <div className="flex flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Text className="text-ui-fg-subtle text-sm">
                                {title}
                            </Text>
                        </div>
                        <AccordionPrimitive.Trigger>
                            {customTrigger || <MorphingTrigger />}
                        </AccordionPrimitive.Trigger>
                    </div>
                    {subtitle && (
                        <Text as="span" className="mt-1" size="small">
                            {subtitle}
                        </Text>
                    )}
                </div>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content
                className={clx(
                    "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none px-1"
                )}
                forceMount={forceMountContent}
            >
                <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
                    {description && <Text>{description}</Text>}
                    <div className="w-full">{children}</div>
                </div>
            </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
    );
};

Accordion.Item = Item;

const MorphingTrigger = () => {
    return (
        <div className="text-grey-90 hover:bg-grey-5 active:bg-grey-5 active:text-violet-60 focus:border-violet-60 disabled:text-grey-30 bg-transparent disabled:bg-transparent rounded-rounded group relative p-[6px]">
            <div className="h-5 w-5">
                <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 absolute inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] duration-300" />
                <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 absolute inset-x-[31.75%] top-[48%] bottom-1/2 h-[1.5px] duration-300" />
            </div>
        </div>
    );
};

export default Accordion;
