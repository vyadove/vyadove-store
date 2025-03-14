import { clx } from "@medusajs/ui";
import { convertToLocale } from "../_util/money";

type LineItemPriceProps = {
	cartTotal: number;
	style?: "default" | "tight";
	currencyCode: string;
};

const LineItemPrice = ({ cartTotal, currencyCode }: LineItemPriceProps) => {
	return (
		<div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
			<div className="text-left">
				<span className={clx("text-base-regular")} data-testid="product-price">
					{convertToLocale({
						amount: cartTotal,
						currency_code: currencyCode,
					})}
				</span>
			</div>
		</div>
	);
};

export default LineItemPrice;
