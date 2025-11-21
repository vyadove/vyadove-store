import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";

import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import { Trash } from "lucide-react";
import { toast } from "@/components/ui/hot-toast";

import { cn } from "@/lib/utils";

import { updateCart } from "@/services/cart";
import { getProduct } from "@/services/products";

const DeleteButton = ({
  id,
  productId,
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  id: string;
  productId: number;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeItem } = useCart();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const removedCart = await updateCart({
        id,
        productId,
        quantity: 0,
      });

      console.log("removed cart", removedCart);

      if (!removedCart?.id) {
        toast.error("Failed to remove item from cart");
        setIsDeleting(false);

        return;
      }

      if (!(removedCart as any).errors) {
        removeItem(id);
        toast.success("Item removed from cart");
      }
    } catch (error: any) {
      setIsDeleting(false);
      console.log("error : ", error);
      toast.error("Failed to remove item from cart");
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
        onClick={() => handleDelete(id)}
        size="icon"
        variant="secondary"
      >
        {isDeleting ? (
          <Spinner className="animate-spin" />
        ) : (
          <Trash size={15} />
        )}

        {children && <span>{children}</span>}
      </Button>
    </div>
  );
};

export default DeleteButton;
