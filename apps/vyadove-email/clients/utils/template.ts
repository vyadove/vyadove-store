import { JsonToMjml } from "easy-email-core";
import mjml from "mjml-browser";
import { IEmailTemplate, TemplateData } from "../types";

/**
 * Checks if template has unsaved changes
 * @param current - Current template values
 * @param initial - Initial template state
 * @returns True if changes detected
 */
export const checkForTemplateChanges = (
    current: IEmailTemplate,
    initial: IEmailTemplate | null
): boolean => {
    if (!initial) return false;
    return JSON.stringify(current) !== JSON.stringify(initial);
};

/**
 * Creates an IEmailTemplate from TemplateData
 * @param templateData - Template data to convert
 * @returns Formatted email template
 */
export const createEmailTemplate = (templateData: TemplateData): IEmailTemplate => {
    return {
        subject: templateData.name,
        subTitle: "Easy Email Template",
        content: templateData.template.content,
    };
};

/**
 * Generates HTML from email template content
 * @param templateContent - Template content to convert
 * @returns HTML string
 */
export const generateTemplateHtml = (templateContent: any): string => {
    const xml = JsonToMjml({
        data: templateContent,
        context: templateContent,
        mode: "production",
    });
    return mjml(xml).html;
};