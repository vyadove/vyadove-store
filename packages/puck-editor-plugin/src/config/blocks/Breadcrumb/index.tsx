import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type BreadcrumbItem = {
    text: string;
    url?: string;
    isActive?: boolean;
};

export type BreadcrumbProps = {
    items: BreadcrumbItem[];
    textSize: "small" | "normal" | "large";
    textColor: string;
    showSeparator: boolean;
    separatorIcon: string;
};

export const Breadcrumb: ComponentConfig<BreadcrumbProps> = {
    label: "Breadcrumb",
    fields: {
        items: {
            type: "array",
            label: "Breadcrumb Items",
            arrayFields: {
                text: {
                    type: "text",
                    label: "Text",
                },
                url: {
                    type: "text",
                    label: "URL (leave empty for active item)",
                },
                isActive: {
                    type: "radio",
                    label: "Is Active Item",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
            },
        },
        textSize: {
            type: "select",
            label: "Text Size",
            options: [
                { label: "Small", value: "small" },
                { label: "Normal", value: "normal" },
                { label: "Large", value: "large" },
            ],
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
        showSeparator: {
            type: "radio",
            label: "Show Separator",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        separatorIcon: {
            type: "text",
            label: "Separator Icon",
        },
    },
    defaultProps: {
        items: [
            { text: "Home", url: "/" },
            { text: "Library", url: "/library" },
            { text: "Data", isActive: true },
        ],
        textSize: "small",
        textColor: "#6c757d",
        showSeparator: true,
        separatorIcon: "/",
    },
    render: ({ items, textSize, textColor, showSeparator, separatorIcon, puck }) => {
        const getSizeClass = (size: string) => {
            const sizeMap = {
                small: styles.textSmall,
                normal: styles.textNormal,
                large: styles.textLarge,
            };
            return sizeMap[size as keyof typeof sizeMap] || styles.textSmall;
        };

        return (
            <nav 
                aria-label="breadcrumb"
                className={`${styles.breadcrumbNav} ${getSizeClass(textSize)}`}
                style={{ color: textColor }}
            >
                <ol className={styles.breadcrumb}>
                    {items && items.length > 0 && items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        const isActive = item.isActive || isLast;
                        
                        return (
                            <li 
                                key={index}
                                className={`${styles.breadcrumbItem} ${isActive ? styles.active : ''}`}
                                {...(isActive ? { 'aria-current': 'page' } : {})}
                            >
                                {item.url && !isActive ? (
                                    <a 
                                        href={puck?.isEditing ? "#" : item.url}
                                        className={styles.breadcrumbLink}
                                        tabIndex={puck?.isEditing ? -1 : undefined}
                                    >
                                        {item.text}
                                    </a>
                                ) : (
                                    <span className={styles.breadcrumbText}>
                                        {item.text}
                                    </span>
                                )}
                                
                                {!isLast && showSeparator && (
                                    <span 
                                        className={styles.separator}
                                        aria-hidden="true"
                                    >
                                        {separatorIcon}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    },
};