"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { createOrderFromCheckoutAction } from "@/actions/order-actions";
import { useCheckout } from "@/providers/checkout";
import {
  GiftBoxComingSoon,
  StripePaymentPlaceholder,
} from "@/scenes/checkout/components";
import { OrderSummary } from "@/scenes/checkout/order-summary";
import { Stepper } from "@/scenes/checkout/stepper";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/shadcn/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyH4, TypographyH5, TypographyP } from "@ui/shadcn/typography";
import type { Payment } from "@vyadove/types";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Gift,
  Info,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Send,
  User,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/hot-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CheckoutLoading from "./checkout-loading";
import { CheckoutReviewStep } from "./checkout-review-step";
import EmptyCheckout from "./empty-checkout";

const minCharErrorString = "Too short, min 2 characters";
const maxCharErrorString = "Too long, max 20 characters";

const steps = [
  {
    name: "step-1",
    title: <TypographyH4>Checkout Info</TypographyH4>,
  },
  {
    name: "step-2",
    title: <TypographyH4>Check and Pay</TypographyH4>,
  },
];

const formSchema = z
  .object({
    firstName: z
      .string({ error: "First name is required" })
      .min(2, minCharErrorString)
      .max(20, maxCharErrorString),
    lastName: z
      .string({ error: "Last name is required" })
      .min(2, minCharErrorString)
      .max(20, maxCharErrorString),
    email: z
      .string({ error: "Email is required" })
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    phone: z
      .string({ error: "Phone number is required" })
      .min(8, "Phone must be at least 8 digits")
      .max(15, "Phone must be at most 15 digits"),

    // recipient type
    recipientType: z.enum(["me", "recipient"]),

    // recipient fields (validated conditionally)
    recipientFirstName: z.string().optional(),
    recipientLastName: z.string().optional(),
    recipientEmail: z
      .string()
      .email("Please enter a valid email")
      .optional()
      .or(z.literal("")),
    recipientPhone: z.string().optional(),

    // gift message
    giftMessageEnabled: z.boolean(),
    giftRecipientName: z.string().max(100, "Name too long").optional(),
    giftSenderName: z.string().max(100, "Name too long").optional(),
    giftMessage: z
      .string()
      .max(300, "Message too long (max 300 chars)")
      .optional(),

    // payment & shipping
    paymentMethod: z
      .string({ error: "Please select a payment method" })
      .min(1, "Please select a payment method"),
    shippingMethod: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recipientType === "recipient") {
      if (!data.recipientFirstName || data.recipientFirstName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: minCharErrorString,
          path: ["recipientFirstName"],
        });
      }

      if (!data.recipientLastName || data.recipientLastName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: minCharErrorString,
          path: ["recipientLastName"],
        });
      }

      if (!data.recipientEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recipient email is required",
          path: ["recipientEmail"],
        });
      }
    }

    // Validate gift message when enabled
    if (data.giftMessageEnabled) {
      if (!data.giftMessage || data.giftMessage.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a personal message",
          path: ["giftMessage"],
        });
      }
    }
  });

const CheckoutNew = () => {
  const router = useRouter();
  const {
    checkout,
    isLoading: checkoutLoading,
    refechCheckout,
    updateCheckoutForm,
  } = useCheckout();

  const [paymentMethods, setPaymentMethods] = useState<Payment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const isLastStep = step === steps.length - 1;

  const [packagingType, setPackagingType] = useState<"evoucher" | "giftbox">(
    "evoucher",
  );

  const paymentMethodsQuery = usePayloadFindQuery("payments", {
    findArgs: {
      where: {
        enabled: {
          equals: true,
        },
      },
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      recipientType: "recipient",
      recipientFirstName: "",
      recipientLastName: "",
      recipientEmail: "",
      recipientPhone: "",
      giftMessageEnabled: false,
      giftRecipientName: "",
      giftSenderName: "",
      giftMessage: "",
      paymentMethod: "",
      shippingMethod: "",
    },
  });

  const selectedPaymentMethod = form.watch("paymentMethod");
  const recipientType = form.watch("recipientType");
  const giftMessageEnabled = form.watch("giftMessageEnabled");
  const giftMessageText = form.watch("giftMessage") || "";

  // Fill out shipping address if available (only if fields are empty)
  useEffect(() => {
    if (!checkout?.shippingAddress || checkoutLoading) return;

    const addr = checkout.shippingAddress;
    const currentValues = form.getValues();

    // Only set values if the field is currently empty (don't overwrite user input)
    const updates: Partial<typeof currentValues> = {};

    if (!currentValues.recipientPhone && addr.phone) {
      updates.recipientPhone = addr.phone;
    }
    if (!currentValues.recipientFirstName && addr.firstName) {
      updates.recipientFirstName = addr.firstName;
    }
    if (!currentValues.recipientLastName && addr.lastName) {
      updates.recipientLastName = addr.lastName;
    }
    const addrEmail = (addr as { email?: string }).email;
    if (!currentValues.recipientEmail && addrEmail) {
      updates.recipientEmail = addrEmail;
    }

    if (Object.keys(updates).length > 0) {
      form.reset({ ...currentValues, ...updates });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout?.shippingAddress]);

  // Fill out billing address if available (only if fields are empty)
  useEffect(() => {
    if (!checkout?.billingAddress || checkoutLoading) return;

    const addr = checkout.billingAddress;
    const currentValues = form.getValues();

    // Only set values if the field is currently empty (don't overwrite user input)
    const updates: Partial<typeof currentValues> = {};

    if (!currentValues.firstName && addr.firstName) {
      updates.firstName = addr.firstName;
    }
    if (!currentValues.lastName && addr.lastName) {
      updates.lastName = addr.lastName;
    }
    const addrEmail = (addr as { email?: string }).email || checkout.email;
    if (!currentValues.email && addrEmail) {
      updates.email = addrEmail;
    }
    if (!currentValues.phone && addr.phone) {
      updates.phone = addr.phone;
    }

    if (Object.keys(updates).length > 0) {
      form.reset({ ...currentValues, ...updates });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout?.billingAddress]);

  // Pre-fill gift message from existing checkout (only if fields are empty)
  useEffect(() => {
    if (!checkout?.giftMessage || checkoutLoading) return;

    const gm = checkout.giftMessage as {
      enabled?: boolean;
      recipientName?: string;
      senderName?: string;
      message?: string;
    };

    const currentValues = form.getValues();

    // Only set values if the field is currently empty (don't overwrite user input)
    if (gm.enabled !== undefined && !currentValues.giftMessageEnabled) {
      form.setValue("giftMessageEnabled", gm.enabled);
    }
    if (gm.recipientName && !currentValues.giftRecipientName) {
      form.setValue("giftRecipientName", gm.recipientName);
    }
    if (gm.senderName && !currentValues.giftSenderName) {
      form.setValue("giftSenderName", gm.senderName);
    }
    if (gm.message && !currentValues.giftMessage) {
      form.setValue("giftMessage", gm.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout?.giftMessage]);

  // Payment methods
  useEffect(() => {
    if (!paymentMethodsQuery.data || paymentMethodsQuery.isLoading) {
      return;
    }

    setPaymentMethods(paymentMethodsQuery.data?.docs || []);

    form.setValue(
      "paymentMethod",
      paymentMethodsQuery.data?.docs[0]?.id?.toString() || "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethodsQuery.data]);

  useEffect(() => {
    // Smooth scroll to top on step change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  useEffect(() => {
    return () => {
      toast.dismissAll();
    };
  }, []);

  // Auto-fill gift message names when enabled
  useEffect(() => {
    if (!giftMessageEnabled) return;

    const currentRecipientName = form.getValues("giftRecipientName");
    const currentSenderName = form.getValues("giftSenderName");

    // Auto-fill "To" from recipient or buyer name
    if (!currentRecipientName) {
      const toName =
        recipientType === "recipient"
          ? form.getValues("recipientFirstName")
          : form.getValues("firstName");

      if (toName) {
        form.setValue("giftRecipientName", toName);
      }
    }

    // Auto-fill "From" from buyer name
    if (!currentSenderName) {
      const fromName = form.getValues("firstName");

      if (fromName) {
        form.setValue("giftSenderName", fromName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giftMessageEnabled]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      if (isLastStep) {
        // Final step - Create order
        if (!checkout) {
          toast.error("No checkout session found");
          setIsSubmitting(false);

          return;
        }

        const loadingId = toast.loading("Creating your order...");

        const result = await createOrderFromCheckoutAction({
          checkoutId: checkout.id,
        });

        toast.dismiss(loadingId);

        if (!result.success || !result.redirectUrl) {
          toast.error(result.error || "Failed to create order");
          setIsSubmitting(false);

          return;
        }

        toast.success("Order created successfully!");
        toast.loading("Redirecting...");
        await refechCheckout();

        // Redirect - use window.location for external URLs (Stripe)
        if (result.redirectUrl.startsWith("http")) {
          window.location.href = result.redirectUrl;
        } else {
          router.push(result.redirectUrl);
        }

        return;
      }

      // First step - Update checkout with addresses, shipping, and payment
      const shippingAddress =
        data.recipientType === "me"
          ? {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              email: data.email,
            }
          : {
              firstName: data.recipientFirstName || "",
              lastName: data.recipientLastName || "",
              phone: data.recipientPhone || "",
              email: data.recipientEmail || "",
            };

      try {
        await updateCheckoutForm({
          providerId: data.paymentMethod,
          shippingMethodString: data.shippingMethod || "",
          addresses: {
            shippingAddress,
            billingAddress: {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              email: data.email,
            },
            email: data.email,
          },
          giftMessage: {
            enabled: data.giftMessageEnabled,
            recipientName: data.giftRecipientName || "",
            senderName: data.giftSenderName || "",
            message: data.giftMessage || "",
          },
        });

        form.reset(form.getValues());
      } catch (err) {
        console.error("Error updating checkout:", err);
        toast.error("Failed to update checkout.");
        setIsSubmitting(false);

        return;
      }

      setStep(step + 1);
    } catch (error) {
      toast.dismiss();
      console.error("Error during checkout:", error);
      toast.error("There was an error processing your checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment options render
  const renderPaymentOptions = () => {
    return paymentMethods.map((method) => {
      if (method?.name === "stripe") {
        return <StripePaymentPlaceholder key={method.id} />;
      }

      return (
        <div
          className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
          key={method.id}
        >
          <RadioGroupItem
            id={method.id?.toString()}
            value={method.id?.toString()}
          />
          <Label
            className="flex-1 cursor-pointer"
            htmlFor={method.id?.toString()}
          >
            <div className="text-sm text-gray-600 capitalize">
              {method.name}
            </div>
          </Label>
        </div>
      );
    });
  };

  if (checkoutLoading) {
    return <CheckoutLoading />;
  }

  if (!checkout || !checkout.items || checkout.items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <div className="mt-10 mb-36 h-full min-h-[80vh] flex-1">
      <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-3">
        <div className="lg:col-span-2 xl:max-w-3xl">
          <div className="bg-white/30 backdrop-blur-sm">
            <Stepper
              className="max-w-lg"
              onStepChange={setStep}
              orientation="horizontal"
              step={step}
              steps={steps}
            />
          </div>

          <Form {...form}>
            <form
              className="flex flex-col gap-10 p-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {isLastStep ? (
                <CheckoutReviewStep
                  billingInfo={{
                    firstName: form.getValues("firstName"),
                    lastName: form.getValues("lastName"),
                    email: form.getValues("email"),
                    phone: form.getValues("phone"),
                  }}
                  packagingType={packagingType}
                  recipientInfo={{
                    firstName: form.getValues("recipientFirstName") || "",
                    lastName: form.getValues("recipientLastName") || "",
                    email: form.getValues("recipientEmail") || "",
                    phone: form.getValues("recipientPhone"),
                  }}
                  recipientType={recipientType}
                />
              ) : (
                <>
                  <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-border p-6">
                    {/* Contact Information */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <TypographyH5 className="font-semibold">
                          Your Information
                        </TypographyH5>
                        <TypographyP className="text-sm font-light text-muted-foreground ">
                          We&#39;ll use this to send order updates
                        </TypographyP>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Mail className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  placeholder="you@example.com"
                                  type="email"
                                  {...field}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Phone className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  placeholder="+1 (555) 123-4567"
                                  type="tel"
                                  {...field}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <User className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput
                                  placeholder="John"
                                  {...field}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <User className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput placeholder="Doe" {...field} />
                              </InputGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Gift Packaging & Delivery */}
                  <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <TypographyH5 className="font-semibold">
                          Gift Packaging & Delivery
                        </TypographyH5>
                        <TypographyP className="text-sm font-light text-muted-foreground ">
                          Choose how you&#39;d like to send your gift
                        </TypographyP>
                      </div>
                    </div>

                    {/* 1. Select Packaging */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-4">
                        1. Select packaging
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* eVoucher Option */}
                        <button
                          className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${packagingType === "evoucher" ? "border-primary bg-gradient-to-br from-primary/10 to-white shadow-md" : "border-border bg-white hover:border-accent"}`}
                          onClick={() => setPackagingType("evoucher")}
                          type="button"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${packagingType === "evoucher" ? "border-primary" : "border-muted-foreground/50"}`}
                            >
                              {packagingType === "evoucher" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <p className="font-semibold text-foreground">
                                  eVoucher
                                </p>
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="size-3.5 text-primary" />
                                  <TypographyP className="text-xs font-semibold text-primary ">
                                    Free
                                  </TypographyP>
                                </span>
                              </div>
                              <TypographyP className="text-xs text-muted-foreground leading-relaxed">
                                Delivered instantly after the purchase, perfect
                                for last-minute gifts.
                              </TypographyP>
                              <span className="text-xs text-primary hover:underline cursor-pointer">
                                Preview eVoucher
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Gift Box Option (Disabled) */}
                        <GiftBoxComingSoon />
                      </div>
                    </div>

                    {/* 2. Where are we sending it? */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-4">
                        2. Where are we sending it?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Send to Recipient */}
                        <button
                          className={`cursor-pointer relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${recipientType === "recipient" ? "border-primary bg-gradient-to-br from-primary/10 to-white shadow-md" : "border-border bg-white hover:border-accent"}`}
                          onClick={() =>
                            form.setValue("recipientType", "recipient")
                          }
                          type="button"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${recipientType === "recipient" ? "border-primary" : "border-muted-foreground/50"}`}
                            >
                              {recipientType === "recipient" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">
                                Send to gift recipient
                              </p>
                              <TypographyP className="text-xs text-muted-foreground">
                                Type their email and we&#39;ll send this
                                eVoucher straight to them.
                              </TypographyP>
                            </div>
                          </div>
                        </button>

                        {/* Send to Me */}
                        <button
                          className={`cursor-pointer relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${recipientType === "me" ? "border-primary bg-gradient-to-br from-primary/10 to-white shadow-md" : "border-border bg-white hover:border-accent"}`}
                          onClick={() => form.setValue("recipientType", "me")}
                          type="button"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${recipientType === "me" ? "border-primary" : "border-muted-foreground/50"}`}
                            >
                              {recipientType === "me" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">
                                Send the email to me
                              </p>
                              <TypographyP className="text-xs text-muted-foreground">
                                We&#39;ll send this eVoucher to your email
                                address.
                              </TypographyP>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Recipient Details (Conditional) */}
                      {recipientType === "recipient" && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl mt-4">
                          <FormField
                            control={form.control}
                            name="recipientFirstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Their First Name</FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <User className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      placeholder="Jane"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="recipientLastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Their Last Name</FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <User className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      placeholder="Doe"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="recipientEmail"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Their Email Address</FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <Send className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      placeholder="recipient@example.com"
                                      type="email"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="recipientPhone"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Their Phone (optional)</FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <Phone className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      placeholder="+1 (555) 123-4567"
                                      type="tel"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FormField
                          control={form.control}
                          name="giftMessageEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="flex items-center gap-2">
                                <FormLabel className="font-semibold text-foreground cursor-pointer mb-0">
                                  Add a personal message (FREE)
                                </FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">
                                        Include a personal message with your
                                        gift that will appear in the delivery
                                        email
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {giftMessageEnabled && (
                      <div className="mt-6 space-y-4 p-4 bg-muted/30 rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="giftRecipientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  To (will appear in greeting):
                                </FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <User className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      maxLength={100}
                                      placeholder="Recipient's name"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="giftSenderName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From:</FormLabel>
                                <FormControl>
                                  <InputGroup>
                                    <InputGroupAddon>
                                      <User className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                      maxLength={100}
                                      placeholder="Your name"
                                      {...field}
                                    />
                                  </InputGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="giftMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message:</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-[100px] resize-y"
                                  maxLength={300}
                                  placeholder="I would like to gift you an opportunity to choose this year's gift yourself..."
                                  {...field}
                                />
                              </FormControl>
                              <div className="flex justify-between">
                                <FormMessage />

                                <span
                                  className={`ml-auto text-xs ${giftMessageText.length >= 300 ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                  {giftMessageText.length}/300
                                </span>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* PAYMENT */}
                  {/* Payment Information */}
                  <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <TypographyH5 className="font-semibold">
                            Payment Information
                          </TypographyH5>
                          <TypographyP className="text-sm font-light text-muted-foreground ">
                            You will be redirected to a secure payment page to
                            enter your payment details
                          </TypographyP>
                        </div>
                      </div>
                    </div>

                    <RadioGroup
                      onValueChange={(value) => {
                        form.setValue("paymentMethod", value, {
                          shouldDirty: true,
                        });
                      }}
                      value={selectedPaymentMethod}
                    >
                      {renderPaymentOptions()}
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="flex w-full items-center justify-between">
                {step !== 0 && (
                  <Button
                    className="font-normal"
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    outlined
                    size="lg"
                    variant="secondary"
                  >
                    <ChevronLeft className="size-4" />
                    Back
                  </Button>
                )}

                <Button
                  className="ml-auto w-full max-w-[20rem] "
                  loading={isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {isLastStep ? (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <ArrowRight />
                      Continue to Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <OrderSummary />
      </div>
    </div>
  );
};

export default CheckoutNew;
