import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type MenuItem = {
    label: string;
    href: string;
    hasDropdown?: boolean;
};

export type NavBarProps = {
    logo: string;
    logoText: string;
    menuItems: MenuItem[];
    showSearch: boolean;
    showUserAccount: boolean;
    showCart: boolean;
    backgroundColor: string;
    textColor: string;
};

export const NavBar: ComponentConfig<NavBarProps> = {
    label: "Navigation Bar",
    fields: {
        logo: {
            type: "text",
            label: "Logo URL",
        },
        logoText: {
            type: "text",
            label: "Logo Text",
        },
        menuItems: {
            type: "array",
            label: "Menu Items",
            arrayFields: {
                label: {
                    type: "text",
                    label: "Menu Label",
                },
                href: {
                    type: "text",
                    label: "Link URL",
                },
                hasDropdown: {
                    type: "radio",
                    label: "Has Dropdown",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
            },
        },
        showSearch: {
            type: "radio",
            label: "Show Search",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showUserAccount: {
            type: "radio",
            label: "Show User Account",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showCart: {
            type: "radio",
            label: "Show Cart",
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
        logo: "",
        logoText: "web",
        menuItems: [
            { label: "Mega menu", href: "#", hasDropdown: true },
            { label: "Blog", href: "#", hasDropdown: true },
            { label: "Contact", href: "#", hasDropdown: false },
            { label: "About us", href: "#", hasDropdown: false },
        ],
        showSearch: true,
        showUserAccount: true,
        showCart: true,
        backgroundColor: "#ffffff",
        textColor: "#333333",
    },
    render: ({
        logo,
        logoText,
        menuItems,
        showSearch,
        showUserAccount,
        showCart,
        backgroundColor,
        textColor,
        puck,
    }) => {
        return (
            <nav
                className={styles.navbar}
                style={{
                    backgroundColor,
                    color: textColor,
                }}
            >
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        <div className={styles.logo}>
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={logoText}
                                    className={styles.logoImage}
                                />
                            ) : (
                                <span className={styles.logoText}>
                                    {logoText}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.centerSection}>
                        <ul className={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <li key={index} className={styles.menuItem}>
                                    <a
                                        href={puck?.isEditing ? "#" : item.href}
                                        className={styles.menuLink}
                                        tabIndex={
                                            puck?.isEditing ? -1 : undefined
                                        }
                                    >
                                        {item.label}
                                        {item.hasDropdown && (
                                            <span
                                                className={styles.dropdownIcon}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.rightSection}>
                        {showSearch && (
                            <button
                                className={styles.iconButton}
                                aria-label="Search"
                            >
                                🔍
                            </button>
                        )}
                        {showUserAccount && (
                            <button
                                className={styles.iconButton}
                                aria-label="User Account"
                            >
                                👤
                            </button>
                        )}
                        {showCart && (
                            <button
                                className={styles.iconButton}
                                aria-label="Shopping Cart"
                            >
                                🛒
                            </button>
                        )}
                    </div>

                    <button
                        className={styles.mobileMenuButton}
                        aria-label="Mobile Menu"
                    >
                        ☰
                    </button>
                </div>
            </nav>
        );
    },
};
