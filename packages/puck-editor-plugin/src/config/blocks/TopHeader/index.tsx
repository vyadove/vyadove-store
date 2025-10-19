import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type TopHeaderProps = {
    phone: string;
    email: string;
    showLanguageSelector: boolean;
    showCurrencySelector: boolean;
    backgroundColor: string;
    textColor: string;
};

export const TopHeader: ComponentConfig<TopHeaderProps> = {
    label: "Top Header",
    fields: {
        phone: {
            type: "text",
            label: "Phone Number",
        },
        email: {
            type: "text",
            label: "Email Address",
        },
        showLanguageSelector: {
            type: "radio",
            label: "Show Language Selector",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showCurrencySelector: {
            type: "radio",
            label: "Show Currency Selector",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        backgroundColor: {
            type: "text",
            label: "Background Color",
        },
        textColor: {
            type: "text",
            label: "Text Color",
        },
    },
    defaultProps: {
        phone: "+55 (111) 123 777",
        email: "contact@mysite.com",
        showLanguageSelector: true,
        showCurrencySelector: true,
        backgroundColor: "#f8f9fa",
        textColor: "#333333",
    },
    render: ({
        phone,
        email,
        showLanguageSelector,
        showCurrencySelector,
        backgroundColor,
        textColor,
    }) => {
        return (
            <div
                className={styles.topHeader}
                style={{
                    backgroundColor,
                    color: textColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        {phone && (
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📞</span>
                                <span>{phone}</span>
                            </div>
                        )}
                        {email && (
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>✉️</span>
                                <span>{email}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.rightSection}>
                        {showCurrencySelector && (
                            <div className={styles.selector}>
                                <span>USD</span>
                                <span className={styles.chevron}>▼</span>
                            </div>
                        )}
                        {showLanguageSelector && (
                            <div className={styles.selector}>
                                <span>English</span>
                                <span className={styles.chevron}>▼</span>
                            </div>
                        )}
                        <div className={styles.settings}>
                            <span className={styles.icon}>⚙️</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};
