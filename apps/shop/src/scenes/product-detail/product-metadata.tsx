"use client";

import React, { useMemo } from "react";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { TypographySmall } from "@ui/shadcn/typography";
import { Clock, MapPin, Users } from "lucide-react";

import { cn } from "@/lib/utils";

type MetadataItemProps = {
  icon: React.ReactNode;
  label: string;
};

const MetadataItem = ({ icon, label }: MetadataItemProps) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    {icon}
    <TypographySmall className="font-light">{label}</TypographySmall>
  </div>
);

export const ProductMetadata = ({ className }: { className?: string }) => {
  const { product, selectedVariant } = useProductDetailContext();

  // Cast to any for new fields not yet in types
  const variant = selectedVariant as any;

  // Compute participants text from variant.participants
  const participantsText = useMemo(() => {
    const config = variant?.participants;
    const min = config?.min ?? 1;
    const max = config?.max ?? 20;

    if (min === max) return `${min} ${min === 1 ? "person" : "people"}`;

    return `${min}-${max} people`;
  }, [variant]);

  // Compute locations count
  const locationsCount = variant?.locations?.length || 1;
  const locationsText = `${locationsCount} location${locationsCount > 1 ? "s" : ""}`;

  // Compute validity text
  const validityText = useMemo(() => {
    const prod = product as any;

    if (!prod.validity) return "Lifetime validity";

    const date = new Date(prod.validity);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expired";
    if (diffDays <= 30) return `${diffDays} days validity`;
    const months = Math.round(diffDays / 30);

    return `${months} month${months > 1 ? "s" : ""} validity`;
  }, [product]);

  const metadata = [
    { icon: <Users className="size-4" />, label: participantsText },
    { icon: <MapPin className="size-4" />, label: locationsText },
    { icon: <Clock className="size-4" />, label: validityText },
  ];

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}
    >
      {metadata.map((item, index) => (
        <MetadataItem icon={item.icon} key={index} label={item.label} />
      ))}
    </div>
  );
};
