import { useImperativeHandle, useMemo, useRef } from "react";

import type { NativeSelectProps } from "../native-select";

import NativeSelect from "../native-select";

const CountrySelect = ({
    defaultValue,
    placeholder = "Country",
    ref,
    region,
    ...props
}: { ref?: React.RefObject<HTMLSelectElement | null> } & {
    region?: any;
} & NativeSelectProps) => {
    const innerRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
        ref,
        () => innerRef.current
    );

    const countryOptions = useMemo(() => {
        if (!region) {
            return [];
        }

        return region.countries?.map((country: any) => ({
            label: country.label,
            value: country.value,
        }));
    }, [region]);

    return (
        <NativeSelect
            defaultValue={defaultValue}
            placeholder={placeholder}
            ref={innerRef}
            {...props}
        >
            {countryOptions?.map(({ label, value }: any, index: number) => (
                <option key={index} value={value}>
                    {label}
                </option>
            ))}
        </NativeSelect>
    );
};

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
