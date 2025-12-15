"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { BsCreditCard, BsHouse, BsPerson } from "react-icons/bs";
import { MdMarkEmailRead } from "react-icons/md";
import { useRouter } from "next/navigation";
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

import { useCheckout } from "@/providers/checkout";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { createOrderFromCheckoutAction } from "@/actions/order-actions";
import { OrderSummery } from "@/scenes/checkout/order-summary";
import { Stepper } from "@/scenes/checkout/stepper";

interface PaymentMethod {
	details?: string;
	paymentId: number;
	id: string;
	instructions?: string;
	label: string;
	type: string;
}

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

const formSchema = z.object({
	firstName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
	lastName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
	email: z.email(),
	phone: z.string().optional(),

	// delivery
	recipientFirstName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
	recipientLastName: z.string().min(2, minCharErrorString).max(20, maxCharErrorString),
	recipientEmail: z.email(),
	recipientPhone: z
		.string("required")
		.min(8, "Too short, min 8 characters")
		.max(15, "Too long, max 15 characters"),

	// payment & shipping
	paymentMethod: z.string(),
	shippingMethod: z.string(),

	billingAddressSame: z.boolean().optional(),
});

const CheckoutNew = () => {
	const router = useRouter();
	const { checkout, isLoading: checkoutLoading, refechCheckout, updateCheckoutForm } = useCheckout();

	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [deliveryMethods, setDeliveryMethods] = useState<Shipping[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [step, setStep] = useState(0);
	const isLastStep = step === steps.length - 1;

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

	// Fill out shipping address if available
	useEffect(() => {
		if (!checkout?.shippingAddress || checkoutLoading) return;

		const shippingAddress = checkout.shippingAddress as any;

		form.reset({
			...form.getValues(),
			recipientPhone: shippingAddress.phone,
			recipientFirstName: shippingAddress.firstName,
			recipientLastName: shippingAddress.lastName,
			recipientEmail: shippingAddress.email || checkout.email,
			billingAddressSame: false,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkout?.shippingAddress]);

	// Fill out billing address if available
	useEffect(() => {
		if (!checkout?.billingAddress || checkoutLoading) return;

		const billingAddress = checkout.billingAddress as any;

		form.reset({
			...form.getValues(),
			firstName: billingAddress?.firstName,
			lastName: billingAddress?.lastName,
			email: billingAddress?.email || checkout.email,
			phone: billingAddress?.phone,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkout?.billingAddress]);

	// Shipping methods
	useEffect(() => {
		if (!shippingQuery.data || shippingQuery.isLoading) {
			return;
		}

		const sortedMethods = (shippingQuery.data?.docs || []).sort((a, b) => {
			return (a?.shippingProvider?.[0]?.baseRate || 0) - (b?.shippingProvider?.[0]?.baseRate || 0);
		});

		setDeliveryMethods(sortedMethods);

		const defaultMethodId = shippingQuery.data?.docs[0]?.id;

		if (defaultMethodId) {
			form.setValue("shippingMethod", `${defaultMethodId}:0`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shippingQuery.data]);

	// Payment methods
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
    }
  }, [])

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);

		const selectedPayment = paymentMethods.find((m) => m.id === data.paymentMethod);

		const [shippingId, blockIndex] = data.shippingMethod.split(":");
		const shipping = deliveryMethods.find((m) => m.id === Number(shippingId));

		try {
			if (isLastStep) {
				// Final step - Create order
				if (!checkout) {
					toast.error("No checkout session found");
					setIsSubmitting(false);

					return;
				}

				const loadingId = toast.loading("Creating your order...");

				// Create order using the new order action
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

				// Redirect to order confirmation
				router.push(result.redirectUrl);

				return;
			}

			// First step - Update checkout with addresses, shipping, and payment

      console.log('is dirty', form.formState.isDirty);

			if (form.formState.isDirty) {
				try {
					await updateCheckoutForm(
						data.paymentMethod, // providerId
						data.shippingMethod, // "${shippingId}:${blockIndex}"
						{
							shippingAddress: {
								firstName: data.recipientFirstName,
								lastName: data.recipientLastName,
								phone: data.recipientPhone,
								email: data.recipientEmail,
							},
							billingAddress: {
								firstName: data.firstName,
								lastName: data.lastName,
								phone: data.phone,
								email: data.email,
							},
							email: data.email,
						},
					);

					form.reset(form.getValues());
					toast.success("Checkout details updated successfully.");
				} catch (err) {
					console.error("Error updating checkout:", err);
					toast.error("Failed to update checkout.");
					setIsSubmitting(false);

					return;
				}
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

	// Delivery options render
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
										<TypographyP className="font-medium capitalize">{method.name}</TypographyP>
										{estimatedDeliveryDays && (
											<div className="text-sm text-gray-500">{estimatedDeliveryDays}</div>
										)}
										{notes && <TypographyMuted className="">{notes}</TypographyMuted>}
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

	if (checkoutLoading) {
		return (
			<div className="mt-10 mb-36 flex h-full min-h-[80vh] flex-1 items-center justify-center">
				<TypographyP>Loading checkout...</TypographyP>
			</div>
		);
	}

	if (!checkout || !checkout.items || checkout.items.length === 0) {
		return (
			<div className="flex h-full min-h-[80vh] flex-1 flex-col items-center justify-center gap-4">
				<TypographyH2>Your checkout is empty</TypographyH2>
				<Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
			</div>
		);
	}

  console.log('is dirty main', form.formState.isDirty);

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
						<form className="flex flex-col gap-16 p-6" onSubmit={form.handleSubmit(onSubmit)}>
							{isLastStep ? (
								<div className="flex flex-col gap-6">
									<div>
										<TypographyH2 className="text-accent">Review Your Order</TypographyH2>
										<TypographyP className="">
											Please review your order details before proceeding to payment.
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
													<TypographyMuted className="text-sm">Name</TypographyMuted>
													<TypographyP>
														{form.getValues("firstName")} {form.getValues("lastName")}
													</TypographyP>
												</div>
												<div>
													<TypographyMuted className="text-sm">Email</TypographyMuted>
													<TypographyP>{form.getValues("email")}</TypographyP>
												</div>
												{form.getValues("phone") && (
													<div>
														<TypographyMuted className="text-sm">Phone</TypographyMuted>
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
													<TypographyMuted className="text-sm">Recipient Name</TypographyMuted>
													<TypographyP>
														{form.getValues("recipientFirstName")}{" "}
														{form.getValues("recipientLastName")}
													</TypographyP>
												</div>
												<div>
													<TypographyMuted className="text-sm">Email</TypographyMuted>
													<TypographyP>{form.getValues("recipientEmail")}</TypographyP>
												</div>
												<div>
													<TypographyMuted className="text-sm">Phone</TypographyMuted>
													<TypographyP>{form.getValues("recipientPhone")}</TypographyP>
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
														<MdMarkEmailRead className="fill-accent" size={24} />
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
												const shipping = deliveryMethods.find((m) => m.id === Number(shippingId));
												const shippingProvider = shipping?.shippingProvider?.[Number(blockIndex)];

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
											<TypographyH2 className="text-accent">Your Details</TypographyH2>
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

									{/* RECIPIENT */}
									<div className="flex flex-col gap-6">
										<div className="flex w-full items-center justify-between">
											<TypographyH2 className="text-accent">Delivery</TypographyH2>
											<span className="border-accent-background rounded-full border p-2">
												<BsHouse className="fill-accent" size={28} />
											</span>
										</div>

										<TypographyLarge>How do you want your experience delivered?</TypographyLarge>

										<Tabs defaultValue="digital">
											<TabsList className="bg-secondary h-max w-full border-2">
												<TabsTrigger className="!bg-primary flex-1 cursor-pointer" value="digital">
													<div className="flex flex-col p-1 text-center">
														<TypographyP className="text-primary-foreground font-semibold">
															Digital
														</TypographyP>
														<TypographyMuted className="text-primary-foreground">
															Free
														</TypographyMuted>
													</div>
												</TabsTrigger>
												<TabsTrigger className="flex-1 cursor-no-drop" disabled value="password">
													Gift Pack
												</TabsTrigger>
												<TabsTrigger className="flex-1 cursor-no-drop" disabled value="pickup">
													Gift Box/Pickup
												</TabsTrigger>
											</TabsList>
											<TabsContent value="digital">
												<Card>
													<CardContent className="mt-7 grid gap-6">
														{/* DELIVERY METHOD */}
														<div>
															<RadioGroup
																onValueChange={(value) => {
																	form.setValue("shippingMethod", value);
																}}
																value={selectedMethod}
															>
																<div className="space-y-4">{renderShippingOptions()}</div>
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
																				<Input placeholder="first name" {...field} />
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

									{/* PAYMENT */}
									<div className="flex flex-col gap-4">
										<div className="flex w-full items-center justify-between">
											<TypographyH2 className="text-accent">Payment Information</TypographyH2>
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
														<div className="space-y-4">{renderPaymentOptions()}</div>
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

								<Button className="ml-auto w-full max-w-[20rem]" loading={isSubmitting} size="lg" type="submit">
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

export default CheckoutNew;
