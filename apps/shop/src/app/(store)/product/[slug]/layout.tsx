import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyP } from "@ui/shadcn/typography";

import { cn } from "@/lib/utils";

import { payloadSdk } from "@/utils/payload-sdk";

const Layout = async ({
  children,
  params,
}: React.PropsWithChildren<{
  params: Promise<{ slug: string }>;
}>) => {
  const { slug } = await params;

  const product = await payloadSdk
    .find({
      collection: "products",
      limit: 1,
      select: {
        title: true,
        description: true,
      },
      where: {
        handle: {
          equals: slug,
        },
      },
    })
    .then((res) => res.docs[0]);

  return (
    <div>
      <AppHeroScaffold>
        <div
          className={cn(
            "mx-auto flex h-full w-full flex-col items-start",
            "gap-3 px-8 py-36 pb-20 lg:px-16 lg:pt-26 lg:pb-16 ",
          )}
        >
          <TypographyH1 className="!text-3xl font-bold text-balance text-primary">
            {product?.title}
          </TypographyH1>
          <TypographyP className="font-light text-balance text-muted-foreground">
            {product?.description}
          </TypographyP>
        </div>
      </AppHeroScaffold>

      {children}
    </div>
  );
};

export default Layout;
