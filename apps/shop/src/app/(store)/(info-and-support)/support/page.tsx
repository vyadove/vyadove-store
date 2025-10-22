import React from "react";

import AppHero from "@ui/nav/app-hero";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";

import { payloadSdk } from "@/utils/payload-sdk";
import { QnaAccordion } from "@/scenes/qna";

const Page = async () => {
  // const termsAndConditions = await payloadSdk
  //   .find({
  //     collection: "terms-and-conditions-page",
  //     // limit: 1,
  //   })
  //   .then((res) => res.docs[0]);

  // find the latest terms
  // const latest = termsAndConditions.docs

  return (
    <div>
      <AppHero>
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 lg:px-16 lg:pt-36 lg:pb-24">
          <TypographyH1 className="!text-6xl font-medium">
            {"Find Your Answer Now."}
          </TypographyH1>
          <TypographyLead className='text-balance max-w-2xl text-center'>
            Get instant support, troubleshoot issues, or connect with our
            team. We&#39;re here to help you get back to business, fast.
          </TypographyLead>
        </div>
      </AppHero>


      <div className='max-w-2xl mx-auto my-16 px-4'>

        <div>

        </div>

        <QnaAccordion/>
      </div>

    </div>
  );
};

export default Page;
