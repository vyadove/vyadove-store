import React from "react";

import { Routes } from "@/store.routes";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import {
  TypographyH1,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import { getTranslations } from "@/i18n/server";

export default async function NotFound() {
  const t = await getTranslations("Global.notFound");

  return (
    <main className="mx-auto flex w-full max-w-[var(--app-width)] flex-1 flex-col px-4 pt-4 pb-6 sm:px-6 lg:px-8">
      <AppHeroScaffold
        containerProps={
          {
            containerProps: {
              className: "h-full",
              style: {
                flex: "1 0 0",
              },
            },
          } as any
        }
      >
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 text-center lg:px-16 lg:pt-36 lg:pb-24">
          <Badge className="bg-accent-foreground text-accent rounded-full p-4 py-1">
            <TypographyP className="text-[1rem] font-light">
              Page Not Found
            </TypographyP>
          </Badge>

          <TypographyH1 className="!text-6xl font-medium text-balance capitalize">
            You look a little lost?
          </TypographyH1>
          <TypographyLead className="font-light text-balance">
            Don&#39;t worry, let&#39;s go home.
          </TypographyLead>

          <Button>
            <VyaLink href={Routes.home}>Go Home</VyaLink>
          </Button>
        </div>
      </AppHeroScaffold>
    </main>
  );
}
