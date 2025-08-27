import React from "react";
import { ComponentConfig } from "@measured/puck";
import styles from "./styles.module.css";

export type Hero5Props = {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    videoUrl: string;
    backgroundImage: string;
};

export const Hero5: ComponentConfig<Hero5Props> = {
    label: "Hero 5 - Split with Play Button",
    fields: {
        title: {
            type: "text",
            label: "Title",
            contentEditable: true,
        },
        description: {
            type: "textarea",
            label: "Description",
            contentEditable: true,
        },
        buttonText: {
            type: "text",
            label: "Button Text",
        },
        buttonHref: {
            type: "text",
            label: "Button Link",
        },
        videoUrl: {
            type: "text",
            label: "Video URL",
        },
        backgroundImage: {
            type: "text",
            label: "Background Image URL",
        },
    },
    defaultProps: {
        title: "The next generation website builder.",
        description: "Powerful and easy to use drag and drop website builder for blogs, presentation or ecommerce stores.",
        buttonText: "Download Now",
        buttonHref: "https://www.vvveb.com",
        videoUrl: "https://www.youtube.com/watch?v=3xsP3u-CVO4",
        backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
    },
    render: ({ title, description, buttonText, buttonHref, videoUrl, backgroundImage, puck }) => {
        return (
            <header 
                className={`${styles.hero5} ${styles.pt5} ${styles.pb5} ${styles.mt0} ${styles.alignItemsCenter} ${styles.dFlex} ${styles.overlay}`}
                style={{ 
                    minHeight: '100vh',
                    backgroundSize: 'cover',
                    backgroundImage: `url('${backgroundImage}')`
                }}
            >
                <div className={styles.container} style={{ zIndex: 2 }}>
                    <div className={`${styles.row} ${styles.alignItemsCenter} ${styles.dFlex} ${styles.justifyContentBetween}`}>
                        <div className={`${styles.col12} ${styles.colMd6} ${styles.pb5} ${styles.order2} ${styles.orderSm2}`}>
                            <h1 className={`${styles.textWhite} ${styles.fontWeightBold} ${styles.mb3} ${styles.mt5} ${styles.display3}`}>
                                {title}
                            </h1>
                            <p className={`${styles.lead} ${styles.textWhite}`}>{description}</p>
                            <div className={`${styles.dFlex} ${styles.mt3} ${styles.mb1}`}>
                                <a 
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg} ${styles.mtMd3}`}
                                    href={puck?.isEditing ? "#" : buttonHref}
                                    role="button"
                                    tabIndex={puck?.isEditing ? -1 : undefined}
                                >
                                    {buttonText}
                                </a>
                            </div>
                        </div>
                        <div className={`${styles.col12} ${styles.colMd6} ${styles.orderSm1} ${styles.orderMd2}`}>
                            <div className={`${styles.iconWrap} ${styles.textPrimary} ${styles.dFlex} ${styles.justifyContentMdCenter} ${styles.my3}`}>
                                <button 
                                    className={`${styles.icon} ${styles.dFlex} ${styles.border0} ${styles.alignItemsCenter} ${styles.justifyContentCenter} ${styles.bgWhite} ${styles.textDark} ${styles.shadowLg} ${styles.roundedCircle}`}
                                    style={{ width: '70px', height: '70px' }}
                                    onClick={() => {
                                        if (!puck?.isEditing && videoUrl) {
                                            window.open(videoUrl, '_blank');
                                        }
                                    }}
                                >
                                    <i className={`${styles.playIcon} ${styles.ms1}`}>▶</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.separatorBottom}>
                    <svg viewBox="0 0 500 41" width="100%" preserveAspectRatio="none" className={styles.separatorSvg}>
                        <path d="M0,185l125-26,33,17,58-12s54,19,55,19,50-11,50-11l56,6,60-8,63,15v15H0Z" transform="translate(0 -159)" fill="white" />
                    </svg>
                </div>
            </header>
        );
    },
};