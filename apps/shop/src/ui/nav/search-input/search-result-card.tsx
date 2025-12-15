"use client";

import { AiOutlineArrowRight } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

import { Routes } from "@/store.routes";
import { Badge } from "@/ui/shadcn/badge";
import { TypographyMuted, TypographySmall } from "@/ui/shadcn/typography";

import { convertToLocale } from "@/utils/money";

type SearchResultCardProps = {
  id: number;
  handle: string;
  title: string;
  thumbnailUrl: string | null;
  categoryTitle?: string | null;
  price?: number;
};

export function SearchResultCard({
  id,
  handle,
  title,
  thumbnailUrl,
  categoryTitle,
  price,
}: SearchResultCardProps) {
  return (
    <Link
      className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
      href={Routes.productLink(handle)}
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {thumbnailUrl ? (
          <Image
            alt={title}
            className="object-cover"
            fill
            sizes="64px"
            src={thumbnailUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiMapPin className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <TypographySmall className="line-clamp-1 font-medium group-hover:underline">
          {title}
        </TypographySmall>

        {categoryTitle && (
          <Badge className="w-fit" variant="secondary">
            {categoryTitle}
          </Badge>
        )}

        {price !== undefined && (
          <TypographyMuted className="text-sm">
            {convertToLocale({ amount: price })}
          </TypographyMuted>
        )}
      </div>

      {/* Arrow */}
      <AiOutlineArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  );
}
