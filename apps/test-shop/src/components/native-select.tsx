import type { SelectHTMLAttributes } from "react";

import { ChevronUpDown } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

export type NativeSelectProps = {
    errors?: Record<string, unknown>;
    placeholder?: string;
    touched?: Record<string, unknown>;
} & SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = ({
    children,
    className,
    defaultValue,
    placeholder = "Select...",
    ref,
    ...props
}: { ref?: React.RefObject<HTMLSelectElement | null> } & NativeSelectProps) => {
    const innerRef = useRef<HTMLSelectElement>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
        ref,
        () => innerRef.current
    );

    useEffect(() => {
        if (innerRef.current && innerRef.current.value === "") {
            setIsPlaceholder(true);
        } else {
            setIsPlaceholder(false);
        }
    }, [innerRef.current?.value]);

    return (
        <div>
            <div
                className={clx(
                    "relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md hover:bg-ui-bg-field-hover",
                    className,
                    {
                        "text-ui-fg-muted": isPlaceholder,
                    }
                )}
                onBlur={() => innerRef.current?.blur()}
                onFocus={() => innerRef.current?.focus()}
            >
                <select
                    defaultValue={defaultValue}
                    ref={innerRef}
                    {...props}
                    className="appearance-none flex-1 bg-transparent border-none px-4 py-2.5 transition-colors duration-150 outline-none "
                >
                    <option disabled value="">
                        {placeholder}
                    </option>
                    {children}
                </select>
                <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none ">
                    <ChevronUpDown />
                </span>
            </div>
        </div>
    );
};

NativeSelect.displayName = "NativeSelect";

export default NativeSelect;
