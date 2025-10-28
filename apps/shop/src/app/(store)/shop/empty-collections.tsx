import { AiOutlineProduct } from "react-icons/ai";



import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";





export function EmptyOutline() {
  return (
    <Empty className="border border-dashed w-full mx-auto">
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
