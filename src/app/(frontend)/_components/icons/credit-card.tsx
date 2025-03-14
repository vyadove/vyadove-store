import type React from "react";

import type { IconProps } from "../../_types/icon";

const CreditCard: React.FC<IconProps> = ({
    size = "20",
    color = "currentColor",
    ...attributes
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
        >
            <title>Credit Card</title>
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2.163 7.294h16.674m-16.674.641h16.674M4.729 12.113h5.075M4.73 14.348h2.565m-3.207 2.565h12.826a1.924 1.924 0 0 0 1.924-1.924V6.011a1.924 1.924 0 0 0-1.924-1.924H4.087a1.924 1.924 0 0 0-1.924 1.924v8.978a1.924 1.924 0 0 0 1.924 1.924Z"
            />
        </svg>
    );
};

export default CreditCard;
