import { FaCheckCircle } from "react-icons/fa";

import { Button } from "@ui/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/shadcn/empty";
import { TypographyH2, TypographyLead } from "@ui/shadcn/typography";

export function OrderSuccess() {
  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia
          className="bg-background h-max w-max rounded-full"
          variant="icon"
        >
          <FaCheckCircle className="text-accent size-20" size={20} />
        </EmptyMedia>
        <EmptyTitle>
          <TypographyH2>You order is on its way!</TypographyH2>
        </EmptyTitle>
        <EmptyDescription>
          <TypographyLead>
            Thank you. Your Order has been received.
          </TypographyLead>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
