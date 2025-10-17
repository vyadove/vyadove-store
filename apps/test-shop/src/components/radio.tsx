const Radio = ({
    checked,
    "data-testid": dataTestId,
}: {
    checked: boolean;
    "data-testid"?: string;
}) => {
    return (
        <>
            <button
                aria-checked="true"
                className="group relative flex h-5 w-5 items-center justify-center outline-none"
                data-state={checked ? "checked" : "unchecked"}
                data-testid={dataTestId || "radio-button"}
                role="radio"
                type="button"
            >
                <div className="shadow-borders-base group-hover:shadow-borders-strong-with-shadow bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive group-focus:!shadow-borders-interactive-with-focus group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base flex h-[14px] w-[14px] items-center justify-center rounded-full transition-all">
                    {checked && (
                        <span
                            className="group flex items-center justify-center"
                            data-state={checked ? "checked" : "unchecked"}
                        >
                            <div className="bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled rounded-full group-disabled:shadow-none h-1.5 w-1.5"></div>
                        </span>
                    )}
                </div>
            </button>
        </>
    );
};

export default Radio;
