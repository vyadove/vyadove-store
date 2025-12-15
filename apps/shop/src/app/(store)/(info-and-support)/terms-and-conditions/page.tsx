import React from "react";

import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";

import { payloadSdk } from "@/utils/payload-sdk";

const Page = async () => {
  const termsAndConditions = await payloadSdk
    .find({
      collection: "terms-and-conditions-page",
      // limit: 1,
    })
    .then((res) => res.docs[0]);

  // find the latest terms
  // const latest = termsAndConditions.docs

  return (
    <div>
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 lg:px-16 lg:pt-36 lg:pb-24">
          <TypographyH1 className="!text-6xl font-medium">
            {termsAndConditions?.title || "-"}
          </TypographyH1>
          {termsAndConditions?.updatedAt && (
            <TypographyLead>
              Last Updated :{" "}
              {new Date(termsAndConditions?.updatedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  // day: "numeric",
                },
              )}
            </TypographyLead>
          )}
        </div>
      </AppHeroScaffold>

      <div
        className="prose prose-lg dark:prose-invert mx-auto my-20 max-w-3xl [&_p]:text-lg [&_p]:text-black"
        dangerouslySetInnerHTML={{
          __html: termsAndConditions?.description || "-",
        }}
      />
    </div>
  );
};

export default Page;
