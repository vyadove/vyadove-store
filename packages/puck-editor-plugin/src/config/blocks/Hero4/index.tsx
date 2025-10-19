import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type Hero4Props = {
    title: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    backgroundImage: string;
};

export const Hero4: ComponentConfig<Hero4Props> = {
    label: "Hero 4 - Minimal Centered",
    fields: {
        title: {
            type: "text",
            label: "Title",
            contentEditable: true,
        },
        primaryButtonText: {
            type: "text",
            label: "Primary Button Text",
        },
        primaryButtonHref: {
            type: "text",
            label: "Primary Button Link",
        },
        secondaryButtonText: {
            type: "text",
            label: "Secondary Button Text",
        },
        secondaryButtonHref: {
            type: "text",
            label: "Secondary Button Link",
        },
        backgroundImage: {
            type: "text",
            label: "Background Image URL",
        },
    },
    defaultProps: {
        title: "The next generation website builder",
        primaryButtonText: "Free Download",
        primaryButtonHref: "https://www.vvveb.com",
        secondaryButtonText: "Live demo",
        secondaryButtonHref: "https://www.vvveb.com",
        backgroundImage:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    render: ({
        title,
        primaryButtonText,
        primaryButtonHref,
        secondaryButtonText,
        secondaryButtonHref,
        backgroundImage,
        puck,
    }) => {
        return (
            <header className={`${styles.hero4} ${styles.overlay}`}>
                <div
                    className={styles.backgroundContainer}
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />

                <div className={styles.container}>
                    <div
                        className={`${styles.row} ${styles.alignItemsCenter} ${styles.justifyContentCenter} ${styles.textCenter}`}
                    >
                        <div className={styles.colLg8}>
                            <h1
                                className={`${styles.heading} ${styles.textWhite} ${styles.mb3}`}
                            >
                                {title}
                            </h1>
                            <div className={styles.buttons}>
                                <a
                                    href={
                                        puck?.isEditing
                                            ? "#"
                                            : primaryButtonHref
                                    }
                                    className={`${styles.btn} ${styles.btnOutlineLight} ${styles.me4}`}
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {primaryButtonText}
                                </a>
                                <a
                                    href={
                                        puck?.isEditing
                                            ? "#"
                                            : secondaryButtonHref
                                    }
                                    className={`${styles.btn} ${styles.textWhite} ${styles.me4}`}
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {secondaryButtonText}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.separatorBottom}>
                    <svg
                        viewBox="0 0 500 41"
                        width="100%"
                        preserveAspectRatio="none"
                        className={styles.separatorSvg}
                    >
                        <path
                            d="M0,185l125-26,33,17,58-12s54,19,55,19,50-11,50-11l56,6,60-8,63,15v15H0Z"
                            transform="translate(0 -159)"
                            fill="white"
                        />
                    </svg>
                </div>
            </header>
        );
    },
};
