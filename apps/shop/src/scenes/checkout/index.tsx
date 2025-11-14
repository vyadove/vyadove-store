"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSend } from "react-icons/bi";
import { BsCreditCard, BsHouse, BsPerson } from "react-icons/bs";
import { MdMarkEmailRead } from "react-icons/md";

import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/scenes/checkout/hooks";
import { OrderSummery } from "@/scenes/checkout/order-summary";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/shadcn/tooltip";
import {
  TypographyH2,
  TypographyH3,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import type { CheckoutSession, Shipping } from "@vyadove/types";
import Cookies from "js-cookie";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import Divider from "@/components/divider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  createCheckoutSession,
  updateCheckoutSession,
} from "@/services/checkout-session";

import { payloadSdk } from "@/utils/payload-sdk";

interface PaymentMethod {
  details?: string;
  paymentId: number;
  id: string;
  instructions?: string;
  label: string;
  type: string;
}

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),

  // deleviery
  recipientFirstName: z.string(),
  recipientLastName: z.string(),
  recipientEmail: z.string(),
  recipientPhone: z.string(),

  // payment
  paymentMethod: z.string(),
  shippingMethod: z.string(),

  billingAddressSame: z.boolean().optional(),
});

const Checkout = () => {
  const { session, loading, setIsLoading, error } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<Shipping[]>([]);

  console.log("session  :", session);

  const router = useRouter();

  const defaultBillingAddress = session?.billingAddress || ({} as any);
  const defaultShippingAddress = session?.shippingAddress || ({} as any);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultBillingAddress?.firstname || "Henok",
      lastName: defaultBillingAddress?.lastName || "Getachew",
      email: defaultBillingAddress?.email || "henokgetachew500@gmail.com",
      phone: defaultBillingAddress?.phone || "0923365539",

      recipientPhone: defaultShippingAddress.recipientPhone,
      recipientFirstName: defaultShippingAddress.recipientFirstName || "",
      recipientLastName: defaultShippingAddress.recipientLastName || "",
      recipientEmail: defaultShippingAddress.recipientEmail || "",
      billingAddressSame: false,
    },
  });

  const selectedMethod = form.watch("shippingMethod");
  const selectedPaymentMethod = form.watch("paymentMethod");

  useEffect(() => {
    if (!session?.billingAddress || !session?.shippingAddress || loading)
      return;

    const defaultBillingAddress = session?.billingAddress || ({} as any);
    const defaultShippingAddress = session?.shippingAddress || ({} as any);

    form.reset({

      ...form.getValues(),

      firstName: defaultBillingAddress?.firstname || "Henok",
      lastName: defaultBillingAddress?.lastName || "Getachew",
      email: defaultBillingAddress?.email || "henokgetachew500@gmail.com",
      phone: defaultBillingAddress?.phone || "0923365539",

      recipientPhone: defaultShippingAddress.recipientPhone,
      recipientFirstName: defaultShippingAddress.recipientFirstName || "",
      recipientLastName: defaultShippingAddress.recipientLastName || "",
      recipientEmail: defaultShippingAddress.recipientEmail || "",
      billingAddressSame: false,

      // selectedMethod: (session?.payment?.id as any),
      // shipping: (session.shipping?.id as any),
    });
  }, [session?.billingAddress, session?.shippingAddress]);

  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const data = await payloadSdk.find({
          collection: "shipping",
          where: {
            enabled: {
              equals: true,
            },
          },
        });

        console.log("shipping data -- : ", data);

        const sortedMethods = (data.docs || []).sort((a: any, b: any) => {
          return (
            a.shippingProvider[0].baseRate - b.shippingProvider[0].baseRate
          );
        });

        setDeliveryMethods(sortedMethods);

        if (
          data.docs?.length > 0 &&
          (data.docs[0] as any)?.shippingProvider?.length > 0
        ) {
          const defaultMethod = `${data.docs[0]?.id}:0`;

          form.setValue("shippingMethod", defaultMethod);
        }
      } catch (error) {
        console.error("Error fetching delivery methods:", error);
      }
    };

    fetchDeliveryMethods();
  }, [form.setValue]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await payloadSdk.find({
          collection: "payments",
          where: { enabled: { equals: true } },
        });

        const methods: PaymentMethod[] = data.docs.flatMap(
          (doc) =>
            doc.providers?.map((provider: any) => ({
              id: provider.id,
              paymentId: doc.id,
              type: provider.blockType,
              details: provider.details,
              instructions: provider.instructions,
              label: doc.name,
            })) || [],
        );

        setPaymentMethods(methods);

        if (methods.length > 0) {
          form.setValue("paymentMethod", methods[0]?.id || "");
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, [form.setValue]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    console.log("form data -- : ", data);

    const selectedMethod = paymentMethods.find(
      (m) => m.id === data.paymentMethod,
    );

    const [shippingId, blockIndex] = data.shippingMethod.split(":");
    const shipping = deliveryMethods.find((m) => m.id === Number(shippingId));

    try {
      const shippingAddress = {
        recipientFirstName: data.recipientFirstName,
        recipientLastName: data.recipientLastName,
        recipientPhone: data.recipientPhone,
        recipientEmail: data.recipientEmail,
        country: "us",
        state: "Test State",
      };

      const billingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        country: "us",
        state: "Test State",
      };

      const updateData = {
        shippingAddress,
        billingAddress,
        payment: selectedMethod?.paymentId,
        shipping: shipping?.id,
      };

      console.log("update data", updateData);

      if (session) {
        await updateCheckoutSession(updateData);
      } else {
        await createCheckoutSession(updateData);
      }

      router.push("/checkout/review");
      toast.success("Checkout details updated successfully.");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("There was an error processing your checkout.");
    } finally {
      setIsLoading(false);
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
        const { baseRate, estimatedDeliveryDays, notes, id } = providerBlock;

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
                <TypographyLarge className="">
                  {baseRate === 0 ? "Free" : `$${baseRate.toFixed(2)}`}
                </TypographyLarge>
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
        <div className="lg:col-span-2 xl:max-w-2xl">
          <Form {...form}>
            <form
              className="flex flex-col gap-16"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                  <TypographyH2 className="text-accent">
                    Your Details
                  </TypographyH2>
                  <span className="border-accent-background rounded-full border p-2">
                    <BsPerson className="fill-accent" size={30} />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="email" type="email" {...field} />
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

              <Divider className="md:w-[calc(108%)] md:-translate-x-[4%]" />

              {/*-------------------------------- RECIPIENT ----------- */}
              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                  <TypographyH2 className="text-accent">Delivery</TypographyH2>
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
                      className="!bg-accent flex-1 cursor-pointer "
                      value="digital"
                    >
                      <div className=" flex flex-col p-1 text-center">
                        <TypographyP className="text-accent-foreground font-semibold">
                          Digital
                        </TypographyP>
                        <TypographyMuted className="text-accent-foreground">
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
                            <TypographyLarge>Delivery Address</TypographyLarge>
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
                                  <FormLabel>Recipient First Name</FormLabel>
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
                                    <Input placeholder="surname" {...field} />
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
                                  <FormLabel>Recipient Email Address</FormLabel>
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

              <Divider className="md:w-[calc(108%)] md:-translate-x-[4%]" />

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
                        onValueChange={(value) =>
                          form.setValue("paymentMethod", value)
                        }
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

              <div className="w-full px-8">
                <Button className="w-full xl:invisible" size="lg" type="submit">
                  <BiSend />
                  FINISH AND PAY
                </Button>

                <Button
                  className="w-full invisible xl:visible"
                  size="xl"
                  type="submit"
                >
                  <BiSend />
                  Proceed to Confirmation
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
