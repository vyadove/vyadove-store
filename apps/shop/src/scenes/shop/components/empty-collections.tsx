import { AiOutlineProduct } from "react-icons/ai";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/shadcn/empty";

export function EmptyOutline() {
  return (
    <Empty className="mx-auto w-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AiOutlineProduct />
        </EmptyMedia>
        <EmptyTitle>No Gifts Found</EmptyTitle>
        <EmptyDescription>
          No gift found matching the current filter selection. Please try
          adjusting your filters.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
