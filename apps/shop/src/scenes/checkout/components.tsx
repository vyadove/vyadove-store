import React from "react";
import { PiInfoFill } from "react-icons/pi";

import { TypographyP } from "@ui/shadcn/typography";

export function GiftBoxComingSoon() {
  return (
    <div className="relative">
      <button
        className="w-full p-5 rounded-2xl border-2 border-border bg-muted text-left opacity-60 cursor-not-allowed"
        disabled
        type="button"
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/50 flex-shrink-0 mt-0.5"></div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-muted-foreground">
                Eco-friendly Gift Box
              </p>
            </div>
            <TypographyP className="text-xs text-muted-foreground leading-relaxed">
              Delivered in 1—2 business days. You&#39;ll also receive an
              e-voucher as a backup.
            </TypographyP>
            {/* <span className="text-xs text-muted-foreground">
              Preview Gift Box
            </span>*/}
          </div>
        </div>
      </button>
      <div className="absolute top-2 right-2 bg-muted-foreground text-white text-[10px] px-2 py-0.5 rounded-full">
        Coming Soon
      </div>
    </div>
  );
}

export function StripePaymentPlaceholder() {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-[#635bff]/5 to-[#0a2540]/5 rounded-xl border border-[#635bff]/10">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <PiInfoFill className="text-[#635bff]" />
        </div>
        <div className="flex-1">
          <div className="flex w-full items-center  gap-4">
            <p className="text-sm text-foreground font-medium mb-1">
              Stripe Checkout
            </p>

            {/* Stripe Badge */}
            <div className="flex items-center gap-2 px-2 py-1 bg-[#635bff]/10 rounded-lg border border-[#635bff]/20">
              <svg
                className="w-10 h-4"
                fill="none"
                viewBox="0 0 60 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 01-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 013.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 01-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 01-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 00-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
                  fill="#635BFF"
                />
              </svg>
              <span className="text-xs font-light text-[#635bff]">
                Secure Payment
              </span>
            </div>
          </div>

          <TypographyP className="text-xs text-muted-foreground leading-relaxed mt-2">
            After placing your order, you&#39;ll be redirected to Stripe&#39;s
            secure payment page to complete your transaction.
          </TypographyP>
        </div>
      </div>
    </div>
  );
}
