"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth";
import { TypographyP } from "@ui/shadcn/typography";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { create, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setFormError("Passwords do not match");

      return;
    }

    try {
      await create({ email, password, passwordConfirm });
      router.push("/");
    } catch {
      // Error is handled by auth context
    }
  };

  const displayError = formError || error;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {displayError && (
                <TypographyP className="text-sm text-red-500 bg-red-50 p-3 rounded-md max-w-[20rem] text-wrap break-words">
                  {displayError}
                </TypographyP>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  minLength={6}
                  name="password"
                  required
                  type="password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <Input
                  id="passwordConfirm"
                  minLength={6}
                  name="passwordConfirm"
                  required
                  type="password"
                />
              </div>
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link className="underline underline-offset-4" href="/login">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-and-conditions">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
