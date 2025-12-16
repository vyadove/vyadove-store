import React from "react";
import { FaAngleDown, FaChevronDown } from "react-icons/fa";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import {
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { ChevronDown } from "lucide-react";

import InvertedCornerMask from "@/components/inverted-corner-mask";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";

const infoList = [
  {
    title: "Product Information",
    description: ` <p>
            Our flagship product combines cutting-edge technology with sleek
            design. Built with premium materials, it offers unparalleled
            performance and reliability.
          </p>
          <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </p>`,
  },
  {
    title: "Shipping Details",
    description: `<p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>`,
  },
  {
    title: "Return Policy",
    description: ` <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>`,
  },
];

function ProductInfo() {
  const { product } = useProductDetailContext();
  const { customFields } = product;

  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      <div className="flex items-center gap-2 ">
        <span className="bg-accent h-full w-1" />
        <TypographyH4>Additional information&#39;s :</TypographyH4>
      </div>

      <Accordion
        className="flex w-full flex-col gap-2"
        // collapsible
        defaultValue={[customFields[0]?.id || ""]}
        type="multiple"
      >
        {/*{product.customFields.length > 0 ? (*/}
        {customFields.length > 0 ? (
          <>
            {/*{product.customFields.map(({name, id, value}, idx) => (*/}
            {customFields.map(({ name, value, id }, idx) => (
              <AccordionItem
                className="group w-full cursor-pointer border-none"
                key={idx}
                value={id || ""}
              >
                <InvertedCornerMask
                  className={cn("flex w-full bg-primary-50")}
                  cornerContent={
                    <div
                      className={cn(
                        "flex items-center justify-center gap-4 rounded-full p-3",
                        " group-data-[state=open]:rotate-180 ease-in-out duration-250",
                      )}
                    >
                      <FaChevronDown className="fill-primary" />
                    </div>
                  }
                  cornersRadius={15}
                  invertedCorners={{
                    tr: { inverted: true, corners: [15, 15, 15] },
                  }}
                  key={idx}
                >
                  <div className="w-full">
                    <AccordionTrigger
                      className="w-full cursor-pointer p-6"
                      hideIcon
                    >
                      <TypographyH4 className="text-muted-400 font-normal">
                        {name}
                      </TypographyH4>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 px-6 pb-6">
                      <div
                        className="prose !text-muted-foreground leading-6 font-light"
                        dangerouslySetInnerHTML={{
                          __html: value,
                        }}
                      />
                    </AccordionContent>
                  </div>
                </InvertedCornerMask>
              </AccordionItem>
            ))}
          </>
        ) : (
          <div>
            <TypographyMuted>
              No additional product information available.
            </TypographyMuted>
          </div>
        )}
      </Accordion>
    </div>
  );
}

export default ProductInfo;
