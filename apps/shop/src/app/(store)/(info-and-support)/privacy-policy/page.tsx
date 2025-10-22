import React from "react";

import AppHero from "@ui/nav/app-hero";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";

import { payloadSdk } from "@/utils/payload-sdk";

const Page = async () => {
  const privacyPolicy = await payloadSdk
    .find({
      collection: "privacy-policy-page",
    })
    .then((res) => res.docs[0]);

  return (
    <div>
      <AppHero>
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 lg:px-16 lg:pt-36 lg:pb-24">
          <TypographyH1 className="!text-6xl font-medium">
            {privacyPolicy?.title || "-"}
          </TypographyH1>
          {privacyPolicy?.updatedAt && (
            <TypographyLead>
              Last Updated :{" "}
              {new Date(privacyPolicy?.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                // day: "numeric",
              })}
            </TypographyLead>
          )}
        </div>
      </AppHero>

      <div
        className="prose prose-lg dark:prose-invert mx-auto my-20 max-w-3xl [&_p]:text-lg [&_p]:text-black"
        dangerouslySetInnerHTML={{
          __html: privacyPolicy?.description || "-",
        }}
      />
    </div>
  );
};

export default Page;
