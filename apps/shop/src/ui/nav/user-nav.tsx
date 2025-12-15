"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, UserCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/providers/auth";

export function UserNav() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Loading state - show placeholder
  if (isLoading) {
    return (
      <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-200" />
    );
  }

  // Not logged in - show sign in link
  if (!user) {
    return (
      <Link className="hover:text-neutral-500" href="/login">
        <User className="h-6 w-6" />
      </Link>
    );
  }

  // Logged in - show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 rounded-full" size="icon" variant="ghost">
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {(user.firstName || user.lastName) && (
              <p className="text-sm font-medium leading-none">
                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/account">
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
