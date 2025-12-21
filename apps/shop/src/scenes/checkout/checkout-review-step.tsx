"use client";

import { StripePaymentPlaceholder } from "@/scenes/checkout/components";
import {
  TypographyH2,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { CreditCard, Mail, Send, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckoutReviewStepProps {
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  recipientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  recipientType: "me" | "recipient";
  packagingType: "evoucher" | "giftbox";
}

export function CheckoutReviewStep({
  billingInfo,
  recipientInfo,
  recipientType,
  packagingType,
}: CheckoutReviewStepProps) {
  const displayRecipient = recipientType === "me" ? billingInfo : recipientInfo;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <TypographyH2 className="text-primary">Review Your Order</TypographyH2>
        <TypographyP>
          Please review your order details before proceeding to payment.
        </TypographyP>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="border-primary-background rounded-full border p-2">
                <User className="text-primary" size={24} />
              </span>
              <CardTitle>Billing Information</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TypographyMuted className="text-sm">Name</TypographyMuted>
              <TypographyP>
                {billingInfo.firstName} {billingInfo.lastName}
              </TypographyP>
            </div>
            <div>
              <TypographyMuted className="text-sm">Email</TypographyMuted>
              <TypographyP>{billingInfo.email}</TypographyP>
            </div>
            {billingInfo.phone && (
              <div>
                <TypographyMuted className="text-sm">Phone</TypographyMuted>
                <TypographyP>{billingInfo.phone}</TypographyP>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="border-primary-background rounded-full border p-2">
                <Send className="text-primary" size={24} />
              </span>
              <CardTitle>Delivery Information</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {recipientType === "me"
                ? "Sending to myself"
                : "Sending to recipient"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TypographyMuted className="text-sm">
                {recipientType === "me" ? "Name" : "Recipient Name"}
              </TypographyMuted>
              <TypographyP>
                {displayRecipient.firstName} {displayRecipient.lastName}
              </TypographyP>
            </div>
            <div>
              <TypographyMuted className="text-sm">Email</TypographyMuted>
              <TypographyP>{displayRecipient.email}</TypographyP>
            </div>
            {displayRecipient.phone && (
              <div>
                <TypographyMuted className="text-sm">Phone</TypographyMuted>
                <TypographyP>{displayRecipient.phone}</TypographyP>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="border-primary-background rounded-full border p-2">
                <Mail className="text-primary" size={24} />
              </span>
              <CardTitle>Delivery Method</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <TypographyP className="font-medium">
                {packagingType === "evoucher"
                  ? "eVoucher (Email Delivery)"
                  : "Gift Box"}
              </TypographyP>
              <TypographyMuted className="text-sm">
                {packagingType === "evoucher"
                  ? "Instant delivery after payment"
                  : "Physical delivery"}
              </TypographyMuted>
            </div>
            <TypographyP className="font-medium text-primary">Free</TypographyP>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="border-primary-background rounded-full border p-2">
                <CreditCard className="text-primary" size={24} />
              </span>
              <CardTitle>Payment Method</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StripePaymentPlaceholder />
        </CardContent>
      </Card>
    </div>
  );
}
