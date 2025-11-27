"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { BsCreditCard, BsHouse, BsPerson } from "react-icons/bs";
import { MdMarkEmailRead, MdOutlineShoppingCartCheckout } from "react-icons/md";

import { useRouter } from "next/navigation";

import { useCheckoutSession } from "@/scenes/checkout/hooks";
import { OrderSummery } from "@/scenes/checkout/order-summary";
import { Stepper } from "@/scenes/checkout/stepper";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TypographyH2,
  TypographyH4,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import type { Shipping } from "@vyadove/types";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  createCheckoutSession,
  updateCheckoutSession,
} from "@/services/checkout-session";

interface PaymentMethod {
  details?: string;
  paymentId: number;
  id: string;
  instructions?: string;
  label: string;
  type: string;
}

const minCharErrorString = "Too short, min 2 characters";
const maxCharErrorString = "Too long, min 20 characters";

const steps = [
  {
    name: "step-1",
    title: <TypographyH4>Checkout Info</TypographyH4>,
    // icon: <MdOutlineShoppingCartCheckout className="" size={40} />,
    // children: <div className="py-4">Content step 1</div>,
  },
  {
    name: "step-2",
    title: <TypographyH4>Check and Pay</TypographyH4>,
    // icon: <Info className="h-4 w-4" />,
    // children: <div className="py-4">Content step 2</div>,
  },
];

const formSchema = z.object({
  firstName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
  lastName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
  email: z.email(),
  phone: z.string().optional(),

  // deleviery
  recipientFirstName: z
    .string()
    .min(2, minCharErrorString)
    .max(20, maxCharErrorString),
  recipientLastName: z
    .string()
    .min(2, minCharErrorString)
    .max(20, maxCharErrorString),
  recipientEmail: z.email(),
  recipientPhone: z
    .string("required")
    .min(8, "Too short, min 8 characters")
    .max(15, "Too long, max 15 characters"),

  // payment
  paymentMethod: z.string(),
  shippingMethod: z.string(),

  billingAddressSame: z.boolean().optional(),
});

const Checkout = () => {
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<Shipping[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const isLastStep = step === steps.length - 1;

  const { session, loading, error } = useCheckoutSession();
  const shippingQuery = usePayloadFindQuery("shipping", {
    findArgs: {
      where: {
        enabled: {
          equals: true,
        },
      },
    },
  });
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
  });
  const selectedMethod = form.watch("shippingMethod");
  const selectedPaymentMethod = form.watch("paymentMethod");

  // fill out shipping address if available
  useEffect(() => {
    if (!session?.shippingAddress || loading) return;

    const shippingAddress = session?.shippingAddress || ({} as any);

    form.reset({
      ...form.getValues(),
      recipientPhone: shippingAddress.recipientPhone,
      recipientFirstName: shippingAddress.recipientFirstName,
      recipientLastName: shippingAddress.recipientLastName,
      recipientEmail: shippingAddress.recipientEmail,
      billingAddressSame: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.shippingAddress]);

  // fill out billing address if available
  useEffect(() => {
    if (!session?.billingAddress || loading) return;

    const billingAddress = session?.billingAddress || ({} as any);

    form.reset({
      ...form.getValues(),
      firstName: billingAddress?.firstName,
      lastName: billingAddress?.lastName,
      email: billingAddress?.email,
      phone: billingAddress?.phone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.billingAddress]);

  // shipping methods
  useEffect(() => {
    if (!shippingQuery.data || shippingQuery.isLoading) {
      return;
    }

    const sortedMethods = (shippingQuery.data?.docs || []).sort((a, b) => {
      return (
        (a?.shippingProvider?.[0]?.baseRate || 0) -
        (b?.shippingProvider?.[0]?.baseRate || 0)
      );
    });

    setDeliveryMethods(sortedMethods);

    const defaultMethodId = shippingQuery.data?.docs[0]?.id;

    if (defaultMethodId) {
      form.setValue("shippingMethod", `${defaultMethodId}:0`);
    }
  }, [form.setValue, shippingQuery.data]);

  // payment methods
  useEffect(() => {
    if (!paymentMethodsQuery.data || paymentMethodsQuery.isLoading) {
      return;
    }

    const methods = paymentMethodsQuery.data?.docs.flatMap(
      (doc) =>
        doc?.providers?.map((provider) => ({
          label: doc.name,
          id: provider.id as string,
          paymentId: doc.id,
          type: provider.blockType,
          details: (provider as any)?.details,
          instructions: (provider as any)?.instructions,
        })) || [],
    );

    setPaymentMethods(methods);

    if (methods.length > 0) {
      form.setValue("paymentMethod", methods[0]?.id || "");
    }
  }, [form.setValue, paymentMethodsQuery.data]);

  useEffect(() => {
    // smooth scroll to top on step change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [step]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const selectedMethod = paymentMethods.find(
      (m) => m.id === data.paymentMethod,
    );

    const [shippingId, blockIndex] = data.shippingMethod.split(":");
    const shipping = deliveryMethods.find((m) => m.id === Number(shippingId));

    try {
      if (isLastStep) {
        const loadingId = toast.loading("creating an order .... ");
        const checkoutResult = await fetch(`/api/orders/checkout`, {
          body: JSON.stringify({}),
          credentials: "include",
          method: "POST",
        });

        console.log("checkoutResult : ", checkoutResult);

        if (!checkoutResult.ok) {
          setIsSubmitting(false);
          throw new Error("Failed to create order");
        }

        toast.dismiss(loadingId);
        toast.success("Order successful!");
        toast.loading("Redirecting...");
        const result = (await checkoutResult.json()) as { redirectUrl: string };

        console.log("result : ", result);

        const redirectUrl = result.redirectUrl.startsWith("http")
          ? result.redirectUrl
          : new URL(result.redirectUrl, window.location.origin).href;

        window.location.href = redirectUrl;

        return;
      }

      const shippingAddress = {
        recipientFirstName: data.recipientFirstName,
        recipientLastName: data.recipientLastName,
        recipientPhone: data.recipientPhone,
        recipientEmail: data.recipientEmail,
      };

      const billingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
      };

      const updateSessionData = {
        shippingAddress,
        billingAddress,
        payment: selectedMethod?.paymentId,
        shipping: shipping?.id,
      };

      if (form.formState.isDirty) {
        try {
          if (session) {
            const res = await updateCheckoutSession(updateSessionData);

            form.reset(form.getValues());
            toast.success("Checkout details updated successfully.");

            console.log("update chekcout session res", res);
          } else {
            const res = await createCheckoutSession(updateSessionData);

            form.reset(form.getValues());
            toast.success("Checkout created successfully.");

            console.log("create chekcout session res", res);
          }

          // router.push("/checkout/review");
          setStep(step + 1);
        } catch (err) {
          console.log("Error updating/creating checkout session:", err);
          toast.error("Failed to update checkout session.");
        }
      }else{
        setStep(step + 1);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating orders:", error);
      toast.error("There was an error processing your checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // payment options render
  const renderPaymentOptions = () => {
    return paymentMethods.map((method) => (
      <div
        className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
        key={method.id}
      >
        <RadioGroupItem id={method.id} value={method.id} />
        <Label className="flex-1 cursor-pointer" htmlFor={method.id}>
          <div className="text-sm text-gray-600 capitalize">{method.label}</div>
        </Label>
      </div>
    ));
  };
  const getSelectedMethodDetails = () => {
    return paymentMethods.find((method) => method.id === selectedPaymentMethod);
  };
  const selectedMethodDetails = getSelectedMethodDetails();

  // delevery options render
  const renderShippingOptions = () => {
    return deliveryMethods.flatMap((method) => {
      if (!method.shippingProvider) {
        return [];
      }

      return method.shippingProvider.map((providerBlock, idx: number) => {
        const { baseRate, estimatedDeliveryDays, notes } = providerBlock;

        const value = `${method.id}:${idx}`;

        return (
          <div
            className="border-primary flex items-center space-x-3 rounded-lg border p-3"
            key={value}
          >
            <RadioGroupItem id={value} value={value} />
            <div className="flex-1">
              <Label
                className="flex cursor-pointer items-center justify-between"
                htmlFor={value}
              >
                <div className="flex items-center space-x-3">
                  <MdMarkEmailRead className="" size={20} />
                  <div>
                    <TypographyP className="font-medium capitalize">
                      {method.name}
                    </TypographyP>
                    {estimatedDeliveryDays && (
                      <div className="text-sm text-gray-500">
                        {estimatedDeliveryDays}
                      </div>
                    )}
                    {notes && (
                      <TypographyMuted className="">{notes}</TypographyMuted>
                    )}
                  </div>
                </div>
                <TypographyP className="">
                  {baseRate === 0 ? "Free" : `$${baseRate.toFixed(2)}`}
                </TypographyP>
              </Label>
            </div>
          </div>
        );
      });
    });
  };

  return (
    <div className="mt-10 mb-36 h-full min-h-[80vh] flex-1 ">
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
              className="flex flex-col gap-16 p-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {isLastStep ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <TypographyH2 className="text-accent">
                      Review Your Order
                    </TypographyH2>
                    <TypographyP className="">
                      Please review your order details before proceeding to
                      payment.
                    </TypographyP>
                  </div>

                  {/* Billing Information */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="border-accent-background rounded-full border p-2">
                            <BsPerson className="fill-accent" size={24} />
                          </span>
                          <CardTitle>Billing Information</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <TypographyMuted className="text-sm">
                            Name
                          </TypographyMuted>
                          <TypographyP>
                            {form.getValues("firstName")}{" "}
                            {form.getValues("lastName")}
                          </TypographyP>
                        </div>
                        <div>
                          <TypographyMuted className="text-sm">
                            Email
                          </TypographyMuted>
                          <TypographyP>{form.getValues("email")}</TypographyP>
                        </div>
                        {form.getValues("phone") && (
                          <div>
                            <TypographyMuted className="text-sm">
                              Phone
                            </TypographyMuted>
                            <TypographyP>{form.getValues("phone")}</TypographyP>
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
                          <span className="border-accent-background rounded-full border p-2">
                            <BsHouse className="fill-accent" size={24} />
                          </span>
                          <CardTitle>Delivery Information</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <TypographyMuted className="text-sm">
                            Recipient Name
                          </TypographyMuted>
                          <TypographyP>
                            {form.getValues("recipientFirstName")}{" "}
                            {form.getValues("recipientLastName")}
                          </TypographyP>
                        </div>
                        <div>
                          <TypographyMuted className="text-sm">
                            Email
                          </TypographyMuted>
                          <TypographyP>
                            {form.getValues("recipientEmail")}
                          </TypographyP>
                        </div>
                        <div>
                          <TypographyMuted className="text-sm">
                            Phone
                          </TypographyMuted>
                          <TypographyP>
                            {form.getValues("recipientPhone")}
                          </TypographyP>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Method */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="border-accent-background rounded-full border p-2">
                            <MdMarkEmailRead
                              className="fill-accent"
                              size={24}
                            />
                          </span>
                          <CardTitle>Shipping Method</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const [shippingId, blockIndex] = (
                          form.getValues("shippingMethod") || ":"
                        ).split(":");
                        const shipping = deliveryMethods.find(
                          (m) => m.id === Number(shippingId),
                        );
                        const shippingProvider =
                          shipping?.shippingProvider?.[Number(blockIndex)];

                        return (
                          <div className="flex items-center justify-between">
                            <div>
                              <TypographyP className="font-medium capitalize">
                                {shipping?.name || "Not selected"}
                              </TypographyP>
                              {shippingProvider?.estimatedDeliveryDays && (
                                <TypographyMuted className="text-sm">
                                  {shippingProvider.estimatedDeliveryDays}
                                </TypographyMuted>
                              )}
                            </div>
                            <TypographyP className="font-medium">
                              {shippingProvider?.baseRate === 0
                                ? "Free"
                                : `$${shippingProvider?.baseRate?.toFixed(2) || "0.00"}`}
                            </TypographyP>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="border-accent-background rounded-full border p-2">
                            <BsCreditCard className="fill-accent" size={24} />
                          </span>
                          <CardTitle>Payment Method</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TypographyP className="font-medium capitalize">
                        {selectedMethodDetails?.label || "Not selected"}
                      </TypographyP>
                      {selectedMethodDetails?.details && (
                        <TypographyMuted className="mt-2 text-sm">
                          {selectedMethodDetails.details}
                        </TypographyMuted>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full items-center justify-between">
                      <TypographyH2 className="text-accent">
                        Your Details
                      </TypographyH2>
                      <span className="border-accent-background rounded-full border p-2">
                        <BsPerson className="fill-accent" size={30} />
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email"
                                type="email"
                                {...field}
                              />
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
                              <Input placeholder="first name" {...field} />
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
                            <FormLabel>Surname</FormLabel>
                            <FormControl>
                              <Input placeholder="surname" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/*-------------------------------- RECIPIENT ----------- */}
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-between">
                      <TypographyH2 className="text-accent">
                        Delivery
                      </TypographyH2>
                      <span className="border-accent-background rounded-full border p-2">
                        <BsHouse className="fill-accent" size={28} />
                      </span>
                    </div>

                    <TypographyLarge>
                      How do you want your experience delivered?
                    </TypographyLarge>

                    <Tabs defaultValue="digital">
                      <TabsList className="bg-secondary h-max w-full border-2">
                        <TabsTrigger
                          className="!bg-primary flex-1 cursor-pointer "
                          value="digital"
                        >
                          <div className=" flex flex-col p-1 text-center">
                            <TypographyP className="text-primary-foreground font-semibold">
                              Digital
                            </TypographyP>
                            <TypographyMuted className="text-primary-foreground">
                              Free
                            </TypographyMuted>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          className="flex-1 cursor-no-drop"
                          disabled
                          value="password"
                        >
                          Gift Pack
                        </TabsTrigger>
                        <TabsTrigger
                          className="flex-1 cursor-no-drop"
                          disabled
                          value="pickup"
                        >
                          Gift Box/Pickup
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="digital">
                        <Card>
                          <CardContent className="mt-7 grid gap-6">
                            {/* --- DELEVERY METHOD ---*/}
                            <div>
                              <RadioGroup
                                onValueChange={(value) => {
                                  form.setValue("shippingMethod", value);
                                }}
                                value={selectedMethod}
                              >
                                <div className="space-y-4">
                                  {renderShippingOptions()}
                                </div>
                              </RadioGroup>

                              {form.formState.errors.shippingMethod && (
                                <p className="mt-2 text-sm text-red-500">
                                  Please select a shipping method
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-6">
                              <div>
                                <TypographyLarge>
                                  Delivery Address
                                </TypographyLarge>
                                <TypographyMuted className="">
                                  We&#39;ll send you experience to this address
                                </TypographyMuted>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="recipientFirstName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Recipient First Name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="first name"
                                          {...field}
                                        />
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
                                      <FormLabel>Recipient Last name</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="surname"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="recipientEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Recipient Email Address
                                      </FormLabel>
                                      <FormControl>
                                        <Input placeholder="email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="recipientPhone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Recipient Phone</FormLabel>
                                      <FormControl>
                                        <Input placeholder="phone" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* ----------------------------- PAYMENT ---------------- */}
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full items-center justify-between">
                      <TypographyH2 className="text-accent">
                        Payment Information
                      </TypographyH2>
                      <span className="border-accent-background rounded-full border p-2">
                        <BsCreditCard className="fill-accent" size={28} />
                      </span>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Select Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            onValueChange={(value) => {
                              console.log("selected payment method", value);

                              form.setValue("paymentMethod", value, {
                                shouldDirty: true,
                              });
                            }}
                            value={selectedPaymentMethod}
                          >
                            <div className="space-y-4">
                              {renderPaymentOptions()}
                            </div>
                          </RadioGroup>
                          {form.formState.errors.paymentMethod && (
                            <p className="mt-2 text-sm text-red-500">
                              Please select a payment method
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {selectedMethodDetails?.instructions && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Payment Instructions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="prose prose-sm max-w-none">
                              <div className="text-sm whitespace-pre-line text-gray-700">
                                {selectedMethodDetails.instructions}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex w-full items-center justify-between px-8">
                {step !== 0 && (
                  <Button
                    disabled={step === 0}
                    onClick={() => {
                      if (step === 0) {
                        return;
                      }

                      setStep(step - 1);
                    }}
                    outlined
                    size="lg"
                    variant="secondary"
                  >
                    <BiArrowBack />
                    Back
                  </Button>
                )}

                <Button
                  className="ml-auto_ w-full max-w-[20rem]"
                  loading={isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {isLastStep ? (
                    <>
                      <BiSend />
                      Checkout and Pay
                    </>
                  ) : (
                    "Next Step"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <OrderSummery />
      </div>
    </div>
  );
};

export default Checkout;
