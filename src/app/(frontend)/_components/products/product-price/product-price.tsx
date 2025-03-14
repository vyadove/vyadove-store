import type { Product } from "@/payload-types";
import { clx } from "@medusajs/ui";

export default function ProductPrice({ variant, showFrom }: { variant: Product["variants"][0], showFrom: boolean }) {
	return (
		<div className="flex flex-col text-ui-fg-base">
			<span className={clx("text-xl-semi")}>
				<span data-testid="product-price">
					{showFrom && "From "}${variant.price}
				</span>
			</span>
		</div>
	);
}
