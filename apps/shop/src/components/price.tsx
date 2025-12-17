"use client";

import { useCurrencyOptional } from "@/providers/currency";
import { convertToLocale } from "@/utils/money";
import { cn } from "@/lib/utils";

type PriceProps = {
    /** Amount in base currency */
    amount: number;
    /** Original currency of the amount (defaults to base currency from context) */
    fromCurrency?: string;
    /** Show original price strikethrough */
    originalAmount?: number;
    /** Additional class names */
    className?: string;
    /** Class for original price */
    originalClassName?: string;
    /** Show approximate indicator (~) for converted prices */
    showApproximate?: boolean;
};

/**
 * Price display component that automatically converts to user's selected currency
 * Falls back to default formatting if outside CurrencyProvider
 */
export function Price({
    amount,
    fromCurrency,
    originalAmount,
    className,
    originalClassName,
    showApproximate = false,
}: PriceProps) {
    const currencyContext = useCurrencyOptional();

    // If no currency context, use basic formatting
    if (!currencyContext) {
        return (
            <span className={className}>
                {convertToLocale({ amount, minimumFractionDigits: 2 })}
            </span>
        );
    }

    const { formatPrice, currency, baseCurrency } = currencyContext;
    const sourceCurrency = fromCurrency || baseCurrency;
    const isConverted = sourceCurrency !== currency;

    const formattedPrice = formatPrice(amount, sourceCurrency as any);
    const formattedOriginal = originalAmount
        ? formatPrice(originalAmount, sourceCurrency as any)
        : null;

    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            {formattedOriginal && (
                <span
                    className={cn(
                        "text-muted-foreground line-through",
                        originalClassName
                    )}
                >
                    {formattedOriginal}
                </span>
            )}
            <span>
                {showApproximate && isConverted && "~"}
                {formattedPrice}
            </span>
        </span>
    );
}

/**
 * Hook for formatting prices with currency conversion
 * Use this when you need more control over price display
 */
export function usePrice() {
    const currencyContext = useCurrencyOptional();

    const format = (amount: number, fromCurrency?: string): string => {
        if (!currencyContext) {
            return convertToLocale({ amount, minimumFractionDigits: 2 });
        }

        return currencyContext.formatPrice(
            amount,
            (fromCurrency || currencyContext.baseCurrency) as any
        );
    };

    const convert = (amount: number, fromCurrency?: string): number => {
        if (!currencyContext) {
            return amount;
        }

        return currencyContext.convert(
            amount,
            (fromCurrency || currencyContext.baseCurrency) as any
        );
    };

    return {
        format,
        convert,
        currency: currencyContext?.currency || "USD",
        baseCurrency: currencyContext?.baseCurrency || "USD",
        isConverted:
            currencyContext?.currency !== currencyContext?.baseCurrency,
    };
}
