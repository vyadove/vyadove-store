import type { ComponentProps } from "react";

import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({
  errorMessages,
  ...props
}: ComponentProps<typeof Alert> & { errorMessages: string[] }) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertCircleIcon />
      <AlertTitle className="text-md">Something Wrong!</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errorMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
