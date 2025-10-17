"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { payloadSdk } from "@/utils/payload-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, Label } from "@medusajs/ui";
import { updateCheckoutSession } from "@/services/checkout-session";
import { useCheckoutSession } from "@/hooks/use-checkout-session";

interface PaymentMethod {
    details?: string;
    paymentId: number;
    id: string;
    instructions?: string;
    label: string;
    type: string;
}

interface PaymentFormData {
    paymentMethod: string;
}

export default function PaymentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const {} = useCheckoutSession();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormData>();

    const selectedPaymentMethod = watch("paymentMethod");

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
                        })) || []
                );

                setPaymentMethods(methods);
                if (methods.length > 0) {
                    setValue("paymentMethod", methods[0].id);
                }
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            }
        };

        fetchPaymentMethods();
    }, [setValue]);

    const onSubmit = async (data: PaymentFormData) => {
        setIsLoading(true);
        try {
            const selectedMethod = paymentMethods.find(
                (m) => m.id === data.paymentMethod
            );

            await updateCheckoutSession({
                payment: selectedMethod?.paymentId,
            });

            router.push("/checkout/review");
        } catch (error) {
            console.error("Error updating payment method:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectedMethodDetails = () => {
        return paymentMethods.find(
            (method) => method.id === selectedPaymentMethod
        );
    };

    const renderPaymentOptions = () => {
        return paymentMethods.map((method) => (
            <div
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                key={method.id}
            >
                <RadioGroupItem id={method.id} value={method.id} />
                <Label className="flex-1 cursor-pointer" htmlFor={method.id}>
                    <div className="text-sm text-gray-600 mt-2 pt-2">
                        {method.label}
                    </div>
                </Label>
            </div>
        ));
    };

    const selectedMethodDetails = getSelectedMethodDetails();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Payment</h2>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            onValueChange={(value) =>
                                setValue("paymentMethod", value)
                            }
                            value={selectedPaymentMethod}
                        >
                            <div className="space-y-4">
                                {renderPaymentOptions()}
                            </div>
                        </RadioGroup>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-sm mt-2">
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
                                <div className="text-sm text-gray-700 whitespace-pre-line">
                                    {selectedMethodDetails.instructions}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex space-x-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/checkout/shipping")}
                >
                    Back to delivery
                </Button>
                <Button
                    type="submit"
                    disabled={!selectedPaymentMethod || isLoading}
                >
                    {isLoading ? "Saving..." : "Review order"}
                </Button>
            </div>
        </form>
    );
}
