"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { BiSend } from "react-icons/bi";
import { CgTrack } from "react-icons/cg";

import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/shadcn/button";
import { Input } from "@ui/shadcn/input";
import { TypographyLead } from "@ui/shadcn/typography";
import { toast } from "@/components/ui/hot-toast";
import { z } from "zod";

const formSchema = z.object({
  orderId: z.string(),
  billingEmail: z.string().optional(),
});
const OrderTrackingInputs = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: "",
      billingEmail: "",
    },
  });

  return (
    <div className="mx-auto mt-32 flex min-h-[60vh] w-full max-w-3xl flex-col gap-6">
      <TypographyLead>
        To track your order please enter your Order ID in the box bellow and
        press the &#34;Track Order&#34; button. This was given to you on your
        receipt and int the confirmation email you should have received.
      </TypographyLead>

      <Form {...form}>
        <form
          className="flex flex-col gap-16"
          onSubmit={form.handleSubmit((data) => {
            if (!data.orderId) {
              toast.error("Please enter a valid Order ID");

              return;
            }

            router.push(`/order/track/${data.orderId.trim()}`);
          })}
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel aria-required={true}>Order ID</FormLabel>
                  <FormControl>
                    <Input placeholder="your order ID" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="billing email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="mx-auto mt-6 w-full max-w-[15rem]"
              size="lg"
              type="submit"
            >
              <CgTrack />
              Track Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderTrackingInputs;
