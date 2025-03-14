import { clx } from "@medusajs/ui";
import type React from "react";

type OptionSelectProps = {
	optionName: string;
	optionValue: string[];
	updateOption: (option: string, value: string) => void;
	options: string;
	title: string;
	disabled?: boolean;
	"data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
	optionName,
	optionValue,
	options,
	updateOption,
	title,
	"data-testid": dataTestId,
	disabled,
}) => {
	return (
		<div className="flex flex-col gap-y-3">
			<span className="text-sm">Select {title}</span>
			<div
				className="flex flex-wrap justify-between gap-2"
				data-testid={dataTestId}
			>
				{optionValue.map((value: string) => (
					<button
						type="button"
						key={value}
						onClick={() => updateOption(optionName, value)}
						className={clx(
							"border border-ui-border-base bg-ui-bg-subtle text-small-regular rounded p-2 flex-1",
							{
								"border-ui-border-interactive": options === value,
								"hover:shadow-elevation-card-rest transition-shadow duration-150":
									options !== value,
							},
						)}
						disabled={disabled}
						data-testid="option-button"
					>
						{value}
					</button>
				))}
			</div>
		</div>
	);
};

export default OptionSelect;
