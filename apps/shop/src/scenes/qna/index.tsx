import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyMuted,
} from "@ui/shadcn/typography";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function QnAs() {
  return (
    <div className="mx-auto mt-24 mb-36 flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4 text-center">
        <div className="">
          <TypographyH1>Got Questions?</TypographyH1>

          <TypographyH2>We&apos;ve Got Answers!</TypographyH2>
        </div>

        <TypographyMuted>
          Everything you need to know about Vyadove.
        </TypographyMuted>
      </div>

      <Accordion
        className="w-full"
        collapsible
        defaultValue={qnas[0]?.question}
        type="single"
      >
        {qnas.map((qna, idx) => (
          <AccordionItem key={idx} value={qna.question}>
            <AccordionTrigger>
              <TypographyH4>{qna.question}</TypographyH4>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <TypographyMuted>{qna.answer}</TypographyMuted>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
