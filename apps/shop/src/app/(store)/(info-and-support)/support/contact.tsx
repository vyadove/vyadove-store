"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { submitContact } from "@/actions/support-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyP } from "@ui/shadcn/typography";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/hot-toast";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const formSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters."),

  email: z
    .email("Email is required")
    .max(60, "Email must be at most 32 characters."),

  description: z
    .string("Message is required")
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});

export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // construct the form data
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.description);

      const res = await submitContact(formData);

      if (res?.id) {
        const message = (
          <TypographyP>
            Thanks you ${data.name}! <br /> Submitted successfully, we will be
            in touch in short.
          </TypographyP>
        );

        toast(message);

        form.reset();
      } else {
        toast.error("Failed to send your information");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="mx-auto w-full sm:max-w-xl">
      <form
        className="flex flex-col gap-10"
        id="form-rhf-demo"
        // action={submitContact}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-name">Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="bg-accent-foreground/50"
                  id="form-rhf-demo-name"
                  placeholder="Login button not working on mobile"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  // autoComplete="off"
                  className="bg-accent-foreground/50"
                  id="form-rhf-demo-title"
                  placeholder="feleke@abebe.com"
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-description">
                  Message
                </FieldLabel>
                <InputGroup className="bg-accent-foreground/50">
                  <InputGroupTextarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 resize-none"
                    id="form-rhf-demo-description"
                    placeholder="Hey, I need help with..."
                    rows={6}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what
                  actually happened.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          className="flex flex-col gap-10"
          form="form-rhf-demo"
          size="lg"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
