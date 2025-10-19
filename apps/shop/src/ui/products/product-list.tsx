import Image from "next/image";

import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { VyaLink } from "@ui/vya-link";
import type { Product } from "commerce-kit";

import { getLocale } from "@/i18n/server";

import { formatMoney } from "@/lib/utils";

export const ProductList = async ({ products }: { products: Product[] }) => {
  const locale = await getLocale();

  return (
    <>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, idx) => {
          return (
            <li className="group" key={product.id}>
              <VyaLink href={`/product/${product.slug}`}>
                <article className="overflow-hidden bg-white">
                  {product.images[0] && (
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        alt=""
                        className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
                        height={768}
                        loading={idx < 3 ? "eager" : "lazy"}
                        priority={idx < 3}
                        sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
                        src={product.images[0]}
                        width={768}
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <h2 className="text-xl font-medium text-neutral-700">
                      {product.name}
                    </h2>
                    <footer className="text-base font-normal text-neutral-900">
                      {product.price && (
                        <p>
                          {formatMoney({
                            amount: product.price,
                            currency: product.currency,
                            locale,
                          })}
                        </p>
                      )}
                    </footer>
                  </div>
                </article>
              </VyaLink>
            </li>
          );
        })}
      </ul>
      <JsonLd jsonLd={mappedProductsToJsonLd(products)} />
    </>
  );
};
