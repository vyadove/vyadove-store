import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/shadcn/accordion";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyP,
} from "@ui/shadcn/typography";
import { ChevronDown } from "lucide-react";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

const qnas = [
  {
    question: "What is Vyadove?",
    answer:
      "Vyadove is an experience gifting platform that lets you send spa days, dining experiences, " +
      "hotel getaways, adventures, and more to loved ones in Africa. You can purchase from anywhere" +
      " in the world, and your recipient enjoys their gift locally.",
  },
  {
    question: "How does Vyadove work?",
    answer:
      "Simply choose an experience from our curated selection, personalize your gift with a message," +
      " and send it via email or SMS. Your recipient can then redeem their gift at their convenience.",
  },
  {
    question: "What types of experiences can I gift?",
    answer:
      "We offer a wide range of experiences including spa treatments, gourmet dining, hotel stays," +
      " adventure activities, and more. Our selection is constantly updated to provide fresh and exciting options.",
  },
  {
    question: "Is Vyadove available in all African countries?",
    answer:
      "Vyadove is currently available in several African countries, with plans to expand further. Please check our website for the most up-to-date list of supported locations.",
  },
  {
    question: "How do I redeem a Vyadove gift?",
    answer:
      "To redeem your Vyadove gift, simply follow the instructions provided in the gift email or SMS. You will be guided through the booking process to select your preferred date and time for the experience.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unused gifts. If you are not satisfied with your purchase, please contact our customer support team for assistance.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team via email at +251900000" +
      " or through the contact form on our website. We are here to help with any questions or concerns you may have.",
  },
];

export const QnaAccordion = () => {
  return (
    <Accordion
      className="flex w-full flex-col gap-6"
      collapsible
      defaultValue={qnas[0]?.question}
      type="single"
    >
      {qnas.map((qna, idx) => (
        <AccordionItem
          className="group w-full cursor-pointer border-none"
          key={idx}
          value={qna.question}
        >
          <InvertedCornerMask
            className={cn(
              "animate-gradient-xy flex w-full bg-linear-45 ",
              // "from-[rgba(243,224,214,1)] from-20%  to-[#2A4A3A]/30 bg-[length:140%_100%] ",
              "",
            )}
            cornerContent={
              <div
                className={cn(
                  "flex items-center justify-center gap-4 rounded-full p-2",
                  " group-data-[state=open]:rotate-180 ease-in-out duration-250",
                )}
              >
                <ChevronDown className="text-xl sm:text-2xl" />
              </div>
            }
            cornersRadius={15}
            invertedCorners={{
              tr: { inverted: true, corners: [15, 15, 15] },
            }}
            key={idx}
          >
            <div className="w-full">
              <AccordionTrigger className="w-full cursor-pointer p-6" hideIcon>
                <TypographyH4>{qna.question}</TypographyH4>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 px-6 pb-6">
                <TypographyP className="text-muted-foreground leading-6 md:text-[.95rem]">
                  {qna.answer}
                </TypographyP>
              </AccordionContent>
            </div>
          </InvertedCornerMask>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export function QnAs() {
  return (
    <div className="mx-auto mt-24 mb-36 flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4 text-center">
        <div className="">
          <TypographyH1>Got Questions?</TypographyH1>

          <TypographyH2>We&apos;ve Got Answers!</TypographyH2>
        </div>

        <TypographyP className="text-muted-foreground">
          Everything you need to know about Vyadove.
        </TypographyP>
      </div>

      <QnaAccordion />
    </div>
  );
}
