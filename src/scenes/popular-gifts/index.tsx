import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import Image from "next/image";

import { TypographyH1, TypographyH3, TypographyH4, TypographyMuted } from "@ui/shadcn/typography";

import { ItemDescription } from "@/components/ui/item";

import ProductImg2 from "./img_1.png";
import ProductImg3 from "./img_2.png";
import ProductImg4 from "./img_2.png";
import ProductImg5 from "./img_4.png";

const models = [
	{
		name: "Staying overnight in your own country",
		description: "1 or 2 comfortable nights in a B&B or hotel with a delicious breakfast for 2 people",
		location: "74 comfortable accommodations throughout Addis Abeba to choose from",
		image: ProductImg5,
		price: 400,
	},
	{
		name: "Delicious Dinner in Addis",
		description: "A luxurious 3-course dinner for 2 people, enjoy local or international flavors",
		location: "Taste surprising flavors at 121 top restaurants in your own country",
		image: ProductImg2,
		price: 1200,
	},
	{
		name: "Weekend in Kuriftu",
		description: "Explore a new city and stay 1 night in a hotel with breakfast for 2 people",
		location: "Choose from 83 charming accommodations throughout Belgium",
		image: ProductImg3,
		price: 5000,
	},
	{
		name: "Cozy overnight stay in Belgium: enjoy this Christmas together",
		description:
			"Overnight stay in a cozy hotel in Belgium, perfect for completely relaxing together this Christmas",
		location: "83 locations to enjoy in your own country",
		image: ProductImg4,
		price: 10000,
	},
];

export function PopularGifts() {
	return (
		<div className="mt-24 flex flex-col gap-8">
			<div>
				<TypographyH1 className="lg:text-4xl">Most Popular Gifts</TypographyH1>
				<TypographyMuted>Our top used lists</TypographyMuted>
			</div>

			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{models.map((model) => (
					<div className="flex flex-col rounded-xl p-0 shadow-md" key={model.name}>
						<div className="">
							<Image
								alt={model.name}
								className="w-full rounded-xl"
								// height={128}
								src={model.image}
								// width={128}
							/>
						</div>

						<div className="flex flex-1 flex-col gap-4 p-4">
							<TypographyH3 className="line-clamp-2">{model.name}</TypographyH3>

							<div className="itmes-center mt-auto flex gap-2">
								<FaInfoCircle className="mt-1" />
								<ItemDescription className="flex-1 text-wrap">{model.description}</ItemDescription>
							</div>

							<div className="itmes-center flex gap-2">
								<FaLocationDot className="mt-1" />
								<ItemDescription className="flex-1 text-wrap">{model.location}</ItemDescription>
							</div>

							<TypographyH4 className="mt-auto">ETB {model.price.toLocaleString("en-US")}</TypographyH4>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
