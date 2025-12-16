import React from "react";

import { BugReportForm } from "@/app/(store)/(info-and-support)/support/contact";
import { QnaAccordion } from "@/scenes/home/qna";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLead,
} from "@ui/shadcn/typography";

import { payloadSdk } from "@/utils/payload-sdk";

const Page = async () => {
  /*const contactForm = await payloadSdk
      .find({
        collection: "forms",
        where: {
          id: {
            equals: 12,
          }
        }
      })
      .then((res) => res.docs[0]?.fields);*/

  return (
    <div className="flex flex-col gap-32">
      <AppHeroScaffold>
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-4 px-8 py-36 pb-20 lg:px-16 lg:pt-36 lg:pb-24">
          <TypographyH1 className="!text-6xl font-medium">
            {"Find Your Answer Now."}
          </TypographyH1>
          <TypographyLead className="max-w-2xl text-center text-balance">
            Get instant support, troubleshoot issues, or connect with our team.
            We&#39;re here to help you get back to business, fast.
          </TypographyLead>
        </div>
      </AppHeroScaffold>

      <div className="mx-auto  flex w-full max-w-2xl flex-col gap-10 px-4">
        <div className="text center mx-auto">
          <TypographyH2 className="font-black">Got Questions?</TypographyH2>
          <TypographyLead className="font-light">
            We&apos;ve Got Answers!
          </TypographyLead>
        </div>

        <QnaAccordion />
      </div>

      <div className="mx-auto  mb-44 flex max-w-2xl flex-col gap-10 px-4">
        <div className="mx-auto grid place-items-center text-center">
          <TypographyH2 className="font-black">
            Still got questions?
          </TypographyH2>
          <TypographyLead className="font-light">
            Send us a message below and we&#39;ll get back to you in 1 business
            day.
          </TypographyLead>
        </div>

        <BugReportForm />
      </div>
    </div>
  );
};

export default Page;
