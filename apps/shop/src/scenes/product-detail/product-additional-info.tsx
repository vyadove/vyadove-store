"use client";

import React, { useMemo } from "react";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { RelatedGifts } from "@/scenes/product-detail/related-gifts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadcn/accordion";
import { Calendar, Mail, MapPin, RefreshCcw, User } from "lucide-react";

export default function ProductAdditionalInfo() {
  const { product, selectedVariant } = useProductDetailContext();

  // Cast to any for new fields not yet in types
  const variant = selectedVariant;
  const additionalInfo = variant?.additionalInfo || [];

  // Compute participants display from variant.participants
  const participantsDisplay = useMemo(() => {
    const config = variant?.participants;
    const min = config?.min ?? 1;
    const max = config?.max ?? 20;

    if (min === max) return `For ${min}`;

    return `For ${min}-${max}`;
  }, [variant]);

  // Compute locations count
  const locationsCount = variant?.locations?.length || 1;

  // Compute validity display
  const validityDisplay = useMemo(() => {
    const prod = product as any;

    if (!prod.validity) return "Lifetime";

    const date = new Date(prod.validity);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expired";
    if (diffDays <= 30) return `${diffDays} Days`;
    const months = Math.round(diffDays / 30);

    return `${months} Month${months > 1 ? "s" : ""}`;
  }, [product]);

  return (
    <div className="flex flex-col gap-10 mt-16 ">
      {/* About this experience - from additionalInfo[0] */}
      {additionalInfo[0] && (
        <Accordion className="max-w-5xl" defaultValue="about" type="single">
          <InfoAccordionItem title={additionalInfo[0].name} value="about">
            <div
              className="text-muted-foreground prose max-w-none [&_p]:font-light"
              dangerouslySetInnerHTML={{
                __html: additionalInfo[0].value || "",
              }}
            />
          </InfoAccordionItem>
        </Accordion>
      )}

      {/* Features Grid - wired to CMS data */}
      <div className="flex w-full overflow-x-auto lg:grid lg:grid-cols-5 gap-4 lg:gap-6 scrollbar-hide snap-x max-w-5xl">
        <FeatureCard
          icon={<User className="size-6 text-primary" />}
          subtitle="Participant"
          title={participantsDisplay}
        />
        <FeatureCard
          icon={<Calendar className="size-6 text-primary" />}
          subtitle="Validity"
          title={validityDisplay}
        />
        <FeatureCard
          icon={<MapPin className="size-6 text-primary" />}
          subtitle="Available"
          title={`${locationsCount} Location${locationsCount > 1 ? "s" : ""}`}
        />
        <FeatureCard
          icon={<RefreshCcw className="size-6 text-primary" />}
          subtitle="Exchanges"
          title="Easy"
        />
        <FeatureCard
          icon={<Mail className="size-6 text-primary" />}
          subtitle="Delivery"
          title="Instant"
        />
      </div>

      {/* Remaining accordions - from additionalInfo[1-3] */}
      <Accordion
        className="w-full flex flex-col gap-4 max-w-5xl"
        type="multiple"
      >
        {additionalInfo.slice(1, 4).map((info, idx: number) => (
          <InfoAccordionItem
            key={info.id || idx}
            title={info.name}
            value={`info-${idx}`}
          >
            <div
              className="prose max-w-none [&_p]:font-light"
              dangerouslySetInnerHTML={{ __html: info.value || "" }}
            />
          </InfoAccordionItem>
        ))}
      </Accordion>

      {/* Related gifts */}
      <Accordion type="single" value="related_gifts">
        <AccordionItem
          className="rounded-xl px-6 bg-white shadow-none border-none"
          value="related_gifts"
        >
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <span className="text-lg font-medium">You may also like</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4 pb-6 border-none">
            <RelatedGifts />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-[140px] flex-col items-center justify-center gap-2 text-center snap-center p-4 rounded-xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-100">
      <div className="flex items-center justify-center size-12 rounded-full bg-primary/5 text-primary mb-1">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

function InfoAccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      className="rounded-xl px-6 bg-white shadow-none data-[state=open]:ring-1_ ring-primary/20_ border-none"
      value={value}
    >
      <AccordionTrigger className="hover:no-underline py-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-primary" />
          <span className="text-lg font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4 pb-6 border-none">
        <div className="prose w-full max-w-none [&_p]:font-light">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
