import { cn } from "@/utils";
import { Eye } from "@medusajs/icons";
import { EyeOff } from "lucide-react";
import * as React from "react";

import { Label } from "./label";

type InputProps = {
    errors?: Record<string, unknown>;
    error?: string;
    label: string;
    name: string;
    ref?: React.Ref<HTMLInputElement>;
    topLabel?: string;
    touched?: Record<string, unknown>;
} & Omit<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    "placeholder"
>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { name, type, className, label, required, topLabel, error, ...props },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [showPassword, setShowPassword] = React.useState(false);
        const [inputType, setInputType] = React.useState(type);

        React.useEffect(() => {
            if (type === "password" && showPassword) {
                setInputType("text");
            }
            if (type === "password" && !showPassword) {
                setInputType("password");
            }
        }, [type, showPassword]);

        React.useImperativeHandle(ref, () => inputRef.current!);

        return (
            <div className="flex flex-col w-full">
                {topLabel && (
                    <Label className="mb-2 txt-compact-medium-plus">
                        {topLabel}
                    </Label>
                )}
                <div className="flex relative z-0 w-full txt-compact-medium">
                    <input
                        className={cn(
                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent px-4 pt-4 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            className
                        )}
                        data-slot="input"
                        id={name}
                        name={name}
                        placeholder=" "
                        required={required}
                        type={inputType}
                        {...props}
                        ref={(instance) => {
                            inputRef.current = instance;
                            if (typeof ref === "function") {
                                ref(instance);
                            } else if (ref) {
                                ref.current = instance;
                            }
                        }}
                    />

                    <label
                        className="pointer-events-none flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 z-1 origin-0 text-ui-fg-subtle"
                        htmlFor={name}
                    >
                        {label}
                        {required && (
                            <span className="pointer-events-auto text-rose-500">
                                *
                            </span>
                        )}
                    </label>
                    {type === "password" && (
                        <button
                            className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-ui-fg-base absolute right-0 top-3"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                        >
                            {showPassword ? <Eye /> : <EyeOff />}
                        </button>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input"; // Required for dev-friendly name in React dev tools

export { Input };
