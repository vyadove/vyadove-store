"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth";
import { Routes } from "@/store.routes";

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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
      router.push(Routes.home);
    } catch {
      // Error handled by auth context
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
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
                <Input id="password" name="password" required type="password" />
              </div>
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? "Signing in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  className="underline underline-offset-4"
                  href={Routes.signUp}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href={Routes.termsAndConditions}>Terms of Service</Link> and{" "}
        <Link href={Routes.privacyPolicy}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
