import { AiOutlineProduct } from "react-icons/ai";

import { Button } from "@ui/shadcn/button";
import {
  Empty,
  EmptyContent,
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
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  );
}
