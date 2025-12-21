import React from "react";

import { TypographySmall } from "@ui/shadcn/typography";
import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";

export const ProductReviews = ({
  rating = 4.5,
  reviews = 455,
  className,
}: {
  rating?: number;
  reviews?: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">
        {[...Array(4)].map((_, i) => (
          <Star className="fill-yellow-400 text-yellow-400 size-4" key={i} />
        ))}
        <StarHalf className="fill-yellow-400 text-yellow-400 size-4" />
      </div>
      <TypographySmall className="font-normal text-muted-foreground pt-0.5">
        {rating} ({reviews} reviews)
      </TypographySmall>
    </div>
  );
};
