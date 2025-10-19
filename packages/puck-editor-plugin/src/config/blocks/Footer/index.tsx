import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type FooterLink = {
    text: string;
    href: string;
};

export type FooterProps = {
    leftLinks: FooterLink[];
    copyrightYear: string;
    copyrightText: string;
    poweredByText: string;
    poweredByLink: string;
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    dividerColor: string;
};

export const Footer: ComponentConfig<FooterProps> = {
    label: "Footer",
    fields: {
        leftLinks: {
            type: "array",
            label: "Left Links",
            arrayFields: {
                text: {
                    type: "text",
                    label: "Link Text",
                },
                href: {
                    type: "text",
                    label: "Link URL",
                },
            },
        },
        copyrightYear: {
            type: "text",
            label: "Copyright Year",
        },
        copyrightText: {
            type: "text",
            label: "Copyright Text",
        },
        poweredByText: {
            type: "text",
            label: "Powered By Text",
        },
        poweredByLink: {
            type: "text",
            label: "Powered By Link",
        },
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
        linkColor: {
            type: "text",
            label: "Link Color",
        },
        dividerColor: {
            type: "text",
            label: "Divider Color",
        },
    },
    defaultProps: {
        leftLinks: [
            { text: "Terms and conditions", href: "/terms" },
            { text: "Privacy Policy", href: "/privacy" },
        ],
        copyrightYear: "2023",
        copyrightText: "Vvveb",
        poweredByText: "Powered by Vvveb",
        poweredByLink: "https://vvveb.com",
        backgroundColor: "#f8f9fa",
        textColor: "#6c757d",
        linkColor: "#007bff",
        dividerColor: "#dee2e6",
    },
    render: ({
        leftLinks,
        copyrightYear,
        copyrightText,
        poweredByText,
        poweredByLink,
        backgroundColor,
        textColor,
        linkColor,
        dividerColor,
        puck,
    }) => {
        return (
            <footer
                className={styles.footer}
                style={{
                    backgroundColor,
                    color: textColor,
                    borderTopColor: dividerColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        {/* Left Links */}
                        <div className={styles.leftSection}>
                            {leftLinks && leftLinks.length > 0 && (
                                <div className={styles.links}>
                                    {leftLinks.map((link, index) => (
                                        <React.Fragment key={index}>
                                            <a
                                                href={
                                                    puck?.isEditing
                                                        ? "#"
                                                        : link.href
                                                }
                                                className={styles.link}
                                                style={{ color: linkColor }}
                                                tabIndex={
                                                    puck?.isEditing
                                                        ? -1
                                                        : undefined
                                                }
                                            >
                                                {link.text}
                                            </a>
                                            {index < leftLinks.length - 1 && (
                                                <span
                                                    className={styles.separator}
                                                    style={{ color: textColor }}
                                                >
                                                    |
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className={styles.rightSection}>
                            <div className={styles.copyrightAndPowered}>
                                {/* Copyright */}
                                <span className={styles.copyright}>
                                    © {copyrightYear} {copyrightText}.
                                </span>

                                {/* Powered By */}
                                <a
                                    href={puck?.isEditing ? "#" : poweredByLink}
                                    className={styles.poweredBy}
                                    style={{ color: linkColor }}
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {poweredByText}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    },
};
