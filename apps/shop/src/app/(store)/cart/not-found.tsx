import type { Metadata } from "next";

import { VyaLink } from "@ui/vya-link";

export const metadata: Metadata = {
  description: "Something went wrong",
  title: "404",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center">
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="text-small-regular text-ui-fg-base">
        The cart you tried to access does not exist. Clear your cookies and try
        again.
      </p>
      <VyaLink href="/">Go to frontpage</VyaLink>
    </div>
  );
}
