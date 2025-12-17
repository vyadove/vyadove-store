"use client";

import { useCurrency } from "@/providers/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";

import { cn } from "@/lib/utils";

import {
  getCurrencyFlag,
  getCurrencyName,
  getCurrencySymbol,
} from "@/services/currency";

type CurrencySelectorProps = {
  variant?: "default" | "compact";
  className?: string;
};

export function CurrencySelector({
  variant = "default",
  className,
}: CurrencySelectorProps) {
  const { currency, setCurrency, supportedCurrencies, isLoading } =
    useCurrency();

  if (supportedCurrencies.length <= 1) {
    return null;
  }

  const currentSymbol = getCurrencySymbol(currency);
  const currentFlag = getCurrencyFlag(currency);

  return (
    <Select disabled={isLoading} onValueChange={setCurrency} value={currency}>
      <SelectTrigger
        className={cn(
          "border-none bg-transparent shadow-none focus:ring-0",
          variant === "compact" ? "h-8 w-auto gap-1 px-2" : "w-[140px]",
          className,
        )}
      >
        <SelectValue>
          {variant === "compact" ? (
            <span className="flex items-center gap-1.5">
              <span>{currentFlag}</span>
              <span className="font-medium">{currency}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{currentFlag}</span>
              <span>{currentSymbol}</span>
              <span>{currency}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedCurrencies.map((code) => (
          <SelectItem key={code} value={code}>
            <span className="flex items-center gap-2">
              <span>{getCurrencyFlag(code)}</span>
              <span className="font-medium">{getCurrencySymbol(code)}</span>
              <span>{code}</span>
              {variant !== "compact" && (
                <span className="text-muted-foreground">
                  - {getCurrencyName(code)}
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
