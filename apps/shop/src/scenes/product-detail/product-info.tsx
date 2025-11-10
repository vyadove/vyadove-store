import { useProductDetailContext } from "@/scenes/product-detail/index";
import {
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  return (
    <Accordion
      className="w-full"
      collapsible
      defaultValue="item-1"
      type="single"
    >
      {/*{product.customFields.length > 0 ? (*/}
      {infoList.length > 0 ? (
        <>
          {/*{product.customFields.map(({name, id, value}, idx) => (*/}
          {infoList.map(({ title: name, description: value }, idx) => (
            <AccordionItem key={idx} value={`item-${idx + 1}`}>
              <AccordionTrigger>
                <TypographyH5>{name}</TypographyH5>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="prose text-balance"
                  dangerouslySetInnerHTML={{
                    __html: value,
                  }}
                />
              </AccordionContent>
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
  );
}

export default ProductInfo;
