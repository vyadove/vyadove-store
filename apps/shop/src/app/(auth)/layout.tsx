import Link from "next/link";

import { ShirtIcon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="/"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <ShirtIcon className="size-4" />
          </div>
          Vyadove
        </Link>
        {children}
      </div>
    </div>
  );
}
