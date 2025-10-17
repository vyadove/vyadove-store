// @ts-ignore
import { BlockManager, BasicType, AdvancedType } from "easy-email-core";
import { ExtensionProps } from "easy-email-extensions";
import { IEmailTemplate } from "easy-email-editor";
import { TemplateData } from "../types";

// Template imports
import learningAdventureTemplate from "../data/template1.json";
import easterJoyTemplate from "../data/template2.json";
import blackFridayTemplate from "../data/template3.json";
import futureIsNowTemplate from "../data/template4.json";
import cyberMondayTemplate from "../data/template5.json";
import christmasSalesTemplate from "../data/template6.json";
import springCollectionTemplate from "../data/template7.json";
import gameOnTemplate from "../data/template8.json";

// Default template structure
export const DEFAULT_TEMPLATE: IEmailTemplate = {
    subject: "New Email Template",
    subTitle: "",
    content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
};

// Editor block categories configuration
export const EDITOR_CATEGORIES: ExtensionProps["categories"] = [
    {
        label: "Content",
        active: true,
        blocks: [
            { type: AdvancedType.TEXT },
            { type: AdvancedType.IMAGE },
            { type: AdvancedType.BUTTON },
            { type: AdvancedType.SOCIAL },
            { type: AdvancedType.DIVIDER },
            { type: AdvancedType.SPACER },
            { type: AdvancedType.HERO },
            { type: BasicType.TABLE },
        ],
    },
    {
        label: "Layout",
        active: true,
        blocks: [
            { type: AdvancedType.SECTION },
            { type: AdvancedType.COLUMN },
            { type: AdvancedType.GROUP },
            { type: AdvancedType.WRAPPER },
            {
                title: "2 columns",
                type: "bar",
                payload: [
                    ["50%", "50%"],
                    ["33%", "67%"],
                    ["67%", "33%"],
                    ["25%", "75%"],
                    ["75%", "25%"],
                ],
            },
            {
                title: "3 columns",
                type: "bar",
                payload: [
                    ["33.33%", "33.33%", "33.33%"],
                    ["25%", "25%", "50%"],
                    ["50%", "25%", "25%"],
                ],
            },
            {
                title: "4 columns",
                type: "bar",
                payload: [["25%", "25%", "25%", "25%"]],
            },
        ],
    },
    {
        label: "Interactive",
        active: false,
        blocks: [
            { type: AdvancedType.ACCORDION },
            { type: AdvancedType.CAROUSEL },
            { type: AdvancedType.NAVBAR },
        ],
    },
    {
        label: "Structure & Raw",
        active: false,
        blocks: [
            { type: BasicType.RAW },
            { type: BasicType.TEMPLATE },
            { type: BasicType.PAGE },
        ],
    },
    {
        label: "Hidden",
        active: false,
        blocks: [
            {
                type: AdvancedType.IMAGE,
                payload: {
                    attributes: {
                        src: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/open-email/{{campaign_id}}`,
                        width: "1px",
                        height: "1px",
                        padding: "0",
                        border: "0",
                        alt: "",
                        style: "display:block; max-height:1px; max-width:1px; opacity:0;",
                    },
                },
                title: "Open Tracker",
            },
        ],
    },
];

// Available templates configuration
export const AVAILABLE_TEMPLATES: TemplateData[] = [
    {
        id: "template1",
        name: "Learning Adventure",
        thumbnail: learningAdventureTemplate.thumbnail,
        template: learningAdventureTemplate,
    },
    {
        id: "template2",
        name: "Easter Joy",
        thumbnail: easterJoyTemplate.thumbnail,
        template: easterJoyTemplate,
    },
    {
        id: "template3",
        name: "Black Friday",
        thumbnail: blackFridayTemplate.thumbnail,
        template: blackFridayTemplate,
    },
    {
        id: "template4",
        name: "Future Is Now",
        thumbnail: futureIsNowTemplate.thumbnail,
        template: futureIsNowTemplate,
    },
    {
        id: "template5",
        name: "Cyber Monday",
        thumbnail: cyberMondayTemplate.thumbnail,
        template: cyberMondayTemplate,
    },
    {
        id: "template6",
        name: "Christmas Sales",
        thumbnail: christmasSalesTemplate.thumbnail,
        template: christmasSalesTemplate,
    },
    {
        id: "template7",
        name: "Spring Collection",
        thumbnail: springCollectionTemplate.thumbnail,
        template: springCollectionTemplate,
    },
    {
        id: "template8",
        name: "Game On",
        thumbnail: gameOnTemplate.thumbnail,
        template: gameOnTemplate,
    },
];

// Responsive breakpoint for small screens
export const SMALL_SCREEN_BREAKPOINT = 1400;

// Modal configuration
export const TEMPLATE_MODAL_CONFIG = {
    width: "80%",
    maxWidth: "1200px",
    title: "Choose a Template",
};

// Editor configuration
export const EDITOR_CONFIG = {
    height: "calc(100vh - 75px)",
    autoComplete: true,
    dashed: false,
};
