import { useState } from "react";

import { useCheckout } from "@/providers/checkout";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import { Trash } from "lucide-react";

import { toast } from "@/components/ui/hot-toast";

import { cn } from "@/lib/utils";

const DeleteItemButton = ({
  variantId,
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  variantId: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeItem } = useCheckout();

  const handleDelete = async (variantId: string) => {
    setIsDeleting(true);

    try {
      const result = await removeItem(variantId);

      if (result.id) {
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item from cart");
      }
    } catch (error: any) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between text-small-regular",
        className,
      )}
    >
      <Button
        className="hover:text-destructive hover:bg-destructive/10 cursor-pointer items-center"
        onClick={() => handleDelete(variantId)}
        size="icon-sm"
        variant="secondary"
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash size={2} />}

        {children && <span>{children}</span>}
      </Button>
    </div>
  );
};

export default DeleteItemButton;
