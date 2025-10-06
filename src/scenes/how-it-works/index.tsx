import React from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaGift } from "react-icons/fa";
import { PiConfettiBold } from "react-icons/pi";

import { TypographyH1, TypographyH3, TypographyMuted, TypographyP } from "@ui/shadcn/typography";

import InvertedCornerMask from "@/components/inverted-corner-mask";

const steps = [
	{
		title: "Choose an Experience",
		description: "Browse curated experiences from wellness and dining to adventures and escapes.",
		icon: BiSolidCategoryAlt,
	},
	{
		title: "Send a Gift Voucher",
		description: "Browse curated experiences from wellness and dining to adventures and escapes.",
		icon: FaGift,
	},
	{
		title: "Celebrate Together",
		description:
			"Your loved one redeems the experience at partnered locations in Ethiopia (and soon across Africa).",
		icon: PiConfettiBold,
	},
];

const HowItWorks = () => {
	return (
		<div className="mt-24 flex flex-col gap-8">
			<div>
				<TypographyH1 className="lg:text-4xl">How It Works</TypographyH1>
				<TypographyMuted>
					Empowering you to give unforgettable experiences with ease and confidence.
				</TypographyMuted>
			</div>

			<div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-8">
				{steps.map((step, index) => (
					<InvertedCornerMask
						className="h-full bg-green-700/10"
						cornerContent={
							<div className="p-3">
								<div className="flex items-center justify-center gap-4 rounded-full bg-green-700/10 p-4">
									<step.icon fontSize="22" />
								</div>
							</div>
						}
						cornersRadius={20}
						invertedCorners={{
							tl: { inverted: true, corners: [20, 20, 20] },
						}}
						key={index}
					>
						<div className="flex flex-col items-start gap-2 px-10 py-24 pb-12">
							<TypographyH3>{step.title}</TypographyH3>

							<TypographyP>{step.description}</TypographyP>
						</div>
					</InvertedCornerMask>
				))}
			</div>
		</div>
	);
};

export default HowItWorks;
