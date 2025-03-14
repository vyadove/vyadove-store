"use client";

import { Table, Text, clx } from "@medusajs/ui";
import { useState } from "react";
import Thumbnail from "./thumbnail";
import Link from "next/link";
import LineItemPrice from "./line-item-price";
import LineItemUnitPrice from "./line-item-unit-price";
import LineItemOptions from "./line-item-options";
import DeleteButton from "./delete-button";
import CartItemSelect from "./cart-item-select";
import ErrorMessage from "./error-message";
import Spinner from "./icons/spinner";
import { useCart } from "react-use-cart";

type ItemProps = {
	item: any;
	type?: "full" | "preview";
	currencyCode: string;
};

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
	const [updating, setUpdating] = useState(false);
	const { updateItemQuantity, cartTotal } = useCart();
	const [error, setError] = useState<string | null>(null);

	const changeQuantity = async (quantity: number) => {
		setError(null);
		setUpdating(true);

		setTimeout(() => {
			updateItemQuantity(item.id, quantity);
			setUpdating(false);
		}, 200);
	};

	const maxQuantity = item?.manage_inventory ? 10 : 10;

	return (
		<Table.Row className="w-full" data-testid="product-row">
			<Table.Cell className="!pl-0 p-4 w-24">
				<Link
					href={`/products/${item.handle}`}
					className={clx("flex", {
						"w-16": type === "preview",
						"small:w-24 w-12": type === "full",
					})}
				>
					<Thumbnail thumbnail={item.imageUrl} size="square" />
				</Link>
			</Table.Cell>

			<Table.Cell className="text-left">
				<Text
					className="txt-medium-plus text-ui-fg-base"
					data-testid="product-title"
				>
					{item.productName}
				</Text>
				<LineItemOptions
					variant={item}
					data-testid="product-variant"
				/>
			</Table.Cell>

			{type === "full" && (
				<Table.Cell>
					<div className="flex gap-2 items-center w-28">
						<DeleteButton id={item.id} data-testid="product-delete-button" />
						<CartItemSelect
							value={item.quantity}
							onChange={(value: any) =>
								changeQuantity(Number.parseInt(value.target.value))
							}
							className="w-14 h-10 p-4"
							data-testid="product-select-button"
						>
							{/* TODO: Update this with the v2 way of managing inventory */}
							{Array.from(
								{
									length: Math.min(maxQuantity, 10),
								},
								(_, i) => (
									<option value={i + 1} key={i}>
										{i + 1}
									</option>
								),
							)}

							<option value={1} key={1}>
								1
							</option>
						</CartItemSelect>
						{updating && <Spinner />}
					</div>
					<ErrorMessage error={error} data-testid="product-error-message" />
				</Table.Cell>
			)}

			{type === "full" && (
				<Table.Cell className="hidden small:table-cell">
					<LineItemUnitPrice
						item={item}
						style="tight"
						currencyCode={currencyCode}
					/>
				</Table.Cell>
			)}

			<Table.Cell className="!pr-0">
				<span
					className={clx("!pr-0", {
						"flex flex-col items-end h-full justify-center": type === "preview",
					})}
				>
					<LineItemPrice
						cartTotal={item.price * item.quantity}
						originalPrice={item.originalPrice}
						style="tight"
						currencyCode={currencyCode}
					/>
				</span>
			</Table.Cell>
		</Table.Row>
	);
};

export default Item;
