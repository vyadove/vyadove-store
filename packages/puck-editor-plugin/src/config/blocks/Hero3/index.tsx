import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type Hero3Props = {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    backgroundImage: string;
    overlayOpacity: number;
};

export const Hero3: ComponentConfig<Hero3Props> = {
    label: "Hero 3 - Centered with Background",
    fields: {
        title: {
            type: "text",
            label: "Title",
            contentEditable: true,
        },
        subtitle: {
            type: "textarea",
            label: "Subtitle",
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
        overlayOpacity: {
            type: "number",
            label: "Overlay Opacity (0-1)",
            min: 0,
            max: 1,
        },
    },
    defaultProps: {
        title: "The next generation website builder",
        subtitle:
            "Powerful and easy to use drag and drop website builder for blogs,\npresentation or ecommerce stores.",
        primaryButtonText: "Free Download",
        primaryButtonHref: "https://www.vvveb.com",
        secondaryButtonText: "Live Demo",
        secondaryButtonHref: "https://www.vvveb.com",
        backgroundImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        overlayOpacity: 0.7,
    },
    render: ({
        title,
        subtitle,
        primaryButtonText,
        primaryButtonHref,
        secondaryButtonText,
        secondaryButtonHref,
        backgroundImage,
        overlayOpacity,
        puck,
    }) => {
        return (
            <header className={styles.hero3}>
                <div
                    className={styles.backgroundContainer}
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div
                    className={styles.overlay}
                    style={{ opacity: overlayOpacity }}
                />

                <div className={styles.container}>
                    <div
                        className={`${styles.row} ${styles.alignItemsCenter} ${styles.justifyContentCenter} ${styles.textCenter}`}
                    >
                        <div className={styles.colLg12}>
                            <h1
                                className={`${styles.heading} ${styles.textWhite} ${styles.mb3}`}
                            >
                                {title}
                            </h1>
                            <h3 className={styles.textWhite}>
                                {typeof subtitle === "string"
                                    ? subtitle
                                          .split("\n")
                                          .map((line, index) => (
                                              <React.Fragment key={index}>
                                                  {line}
                                                  {index <
                                                      subtitle.split("\n")
                                                          .length -
                                                          1 && <br />}
                                              </React.Fragment>
                                          ))
                                    : null}
                            </h3>

                            <div className={styles.buttons}>
                                <a
                                    href={
                                        puck?.isEditing
                                            ? "#"
                                            : primaryButtonHref
                                    }
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.textWhite} ${styles.me4}`}
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
                                    className={`${styles.btn} ${styles.btnWhite} ${styles.textWhite}`}
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
                        height="250"
                        fill="white"
                        preserveAspectRatio="none"
                        className={styles.separatorSvg}
                    >
                        <path
                            d="M0,185l125-26,33,17,58-12s54,19,55,19,50-11,50-11l56,6,60-8,63,15v15H0Z"
                            transform="translate(0 -159)"
                        />
                    </svg>
                </div>
            </header>
        );
    },
};
