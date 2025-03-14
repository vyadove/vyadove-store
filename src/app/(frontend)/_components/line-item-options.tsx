import { Text } from "@medusajs/ui";

type LineItemOptionsProps = {
    variant:
        | {
              options?: { option: string; value: string }[];
              title?: string;
          }
        | undefined;
    "data-testid"?: string;
    "data-value"?: any;
};

const LineItemOptions = ({
    variant,
    "data-testid": dataTestid,
    "data-value": dataValue,
}: LineItemOptionsProps) => {
	const formattedOptions = variant?.options
        ?.map(({ value }) => value)
        .join(" / ");
    return (
        <div
            data-testid={dataTestid}
            data-value={dataValue}
            className="text-ui-fg-subtle w-full"
        >
            <Text
                data-testid={dataTestid}
                data-value={dataValue}
                className="text-ui-fg-subtle w-full"
            >
                Variants: {formattedOptions}
            </Text>
        </div>
    );
};

export default LineItemOptions;
