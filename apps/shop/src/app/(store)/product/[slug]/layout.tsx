import React from "react";

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
      {/*<AppHeroScaffold>
        <div
          className={cn(
            "mx-auto flex h-full w-full flex-col items-start",
            "gap-3 px-8 py-36 pb-20 lg:px-16 lg:pt-26 lg:pb-16 ",
          )}
        >
          <Badge className="bg-accent-foreground text-accent rounded-full p-4 py-1">
            <TypographyP className="text-accent text-[1rem] font-light">
              Shop
            </TypographyP>
          </Badge>

          <TypographyH1 className="!text-5l font-medium text-balance capitalize">
            {product?.title}
          </TypographyH1>
          <TypographyLead className="font-light text-balance">
            {product?.description}
          </TypographyLead>
        </div>
      </AppHeroScaffold>*/}

      {children}
    </div>
  );
};

export default Layout;
