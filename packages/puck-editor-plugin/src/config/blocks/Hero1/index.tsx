import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type Hero1Props = {
    mainTitle: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    disclaimerText: string;
    backgroundColor: string;
};

export const Hero1: ComponentConfig<Hero1Props> = {
    label: "Hero 1 - Simple CTA",
    fields: {
        mainTitle: {
            type: "textarea",
            label: "Main Title",
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
        disclaimerText: {
            type: "text",
            label: "Disclaimer Text",
        },
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
    },
    defaultProps: {
        mainTitle: "Open Source CMS\nReinvented",
        subtitle:
            "Powerful and easy to use drag and drop builder for blogs, websites or ecommerce stores.",
        primaryButtonText: "⚡ Free download ›",
        primaryButtonHref: "/download.php",
        secondaryButtonText: "Live demo →",
        secondaryButtonHref: "//demo.vvveb.com",
        disclaimerText: "* Note: Early Alpha Preview",
        backgroundColor: "#f8f9fa",
    },
    render: ({
        mainTitle,
        subtitle,
        primaryButtonText,
        primaryButtonHref,
        secondaryButtonText,
        secondaryButtonHref,
        disclaimerText,
        backgroundColor,
        puck,
    }) => {
        return (
            <header className={styles.hero1} style={{ backgroundColor }}>
                <div className={styles.heading}>
                    <h1>{mainTitle}</h1>

                    <h2>{subtitle}</h2>

                    <div className={styles.btns}>
                        <a
                            className={`${styles.btn} ${styles.btnLg} ${styles.btnPrimary}`}
                            href={puck?.isEditing ? "#" : primaryButtonHref}
                            role="button"
                            tabIndex={puck?.isEditing ? -1 : undefined}
                        >
                            {primaryButtonText}
                        </a>

                        <div className={styles.navItemDropdown}>
                            <a
                                className={`${styles.btn} ${styles.btnLg} ${styles.btnOutlinePrimary} ${styles.navLink}`}
                                href={
                                    puck?.isEditing ? "#" : secondaryButtonHref
                                }
                                role="button"
                                tabIndex={puck?.isEditing ? -1 : undefined}
                            >
                                {secondaryButtonText}
                            </a>
                        </div>
                    </div>

                    {disclaimerText && (
                        <i className={styles.textMuted}>
                            <small>{disclaimerText}</small>
                        </i>
                    )}
                </div>
            </header>
        );
    },
};
