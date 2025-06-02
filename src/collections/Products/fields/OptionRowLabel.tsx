import type { RowLabelProps } from "@payloadcms/ui";
import type { ArrayFieldServerProps } from "payload";

const OptionRowLabel = (props: ArrayFieldServerProps & RowLabelProps) => {
    if (!props.siblingData.options) {
        return null;
    }
    const optionValue = props.siblingData.options.map(
        (option: any) => option.value
    );
    return <p>{optionValue.join(" / ")}</p>;
};

export default OptionRowLabel;
