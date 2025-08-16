import { useState, useEffect, useMemo } from "react";
import { useWindowSize } from "react-use";
import { Message } from "@arco-design/web-react";
import { PayloadSDK } from "@shopnex/payload-sdk";
import { IEmailTemplate, TemplateData, UseEmailEditorReturn } from "../types";
import { DEFAULT_TEMPLATE, SMALL_SCREEN_BREAKPOINT } from "../constants";
import {
    createPayloadSDK,
    getUrlParams,
    checkForTemplateChanges,
    createEmailTemplate,
    generateTemplateHtml,
} from "../utils";

/**
 * Custom hook for email editor state and operations
 */
export const useEmailEditor = (): UseEmailEditorReturn => {
    // State
    const [currentTemplate, setCurrentTemplate] =
        useState<IEmailTemplate | null>();
    const [initialTemplate, setInitialTemplate] =
        useState<IEmailTemplate | null>();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);

    // URL parameters and SDK
    const { identifier, token, theme } = getUrlParams();
    const payloadSdk = useMemo(() => createPayloadSDK(token!), [token]);
    const { width: screenWidth } = useWindowSize();
    const isSmallScreen = screenWidth < SMALL_SCREEN_BREAKPOINT;

    // Template loading functions
    const loadNewTemplate = () => {
        setCurrentTemplate(DEFAULT_TEMPLATE);
        setInitialTemplate(DEFAULT_TEMPLATE);
    };

    const loadExistingTemplate = async (templateId: number) => {
        try {
            const result = await payloadSdk.find({
                collection: "email-templates",
                where: { id: { equals: templateId } },
            });

            if (result?.docs?.[0]?.json) {
                const template = result.docs[0].json;
                setCurrentTemplate(template);
                setInitialTemplate(template);
            } else {
                loadNewTemplate();
            }
        } catch (error) {
            console.error("Error loading template:", error);
            loadNewTemplate();
        }
    };

    // Template operations
    const applyTemplateSelection = (emailTemplate: IEmailTemplate) => {
        setCurrentTemplate(emailTemplate);
        setHasUnsavedChanges(true);
    };

    const detectTemplateChanges = (currentValues: IEmailTemplate): boolean => {
        return checkForTemplateChanges(currentValues, initialTemplate || null);
    };

    // Template selection handlers
    const handleTemplateSelection = (templateData: TemplateData) => {
        try {
            const emailTemplate = createEmailTemplate(templateData);
            applyTemplateSelection(emailTemplate);
            setIsTemplateModalVisible(false);
            Message.success(
                `Template "${templateData.name}" loaded successfully!`
            );
        } catch (error) {
            console.error("Error loading template:", error);
            Message.error(
                `Failed to load template: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    };

    // Modal handlers
    const openTemplateModal = () => setIsTemplateModalVisible(true);
    const closeTemplateModal = () => setIsTemplateModalVisible(false);

    // Save operations
    const createNewTemplate = async (values: IEmailTemplate) => {
        Message.loading("Creating template...");
        const result = await payloadSdk.create({
            collection: "email-templates",
            data: {
                json: values,
                html: { html: generateTemplateHtml(values.content) },
                name: values.subject || "Email Template",
            },
        });
        console.log("Template created:", result);
        Message.success("Template created successfully!");
    };

    const updateExistingTemplate = async (
        templateId: number,
        values: IEmailTemplate
    ) => {
        Message.loading("Updating template...");
        const result = await payloadSdk.update(
            {
                collection: "email-templates",
                id: templateId,
                data: {
                    json: values,
                    html: { html: generateTemplateHtml(values.content) },
                    name: values.subject || "Email Template",
                },
            },
            { credentials: "include" }
        );
        console.log("Template updated:", result);
        Message.success("Template updated successfully!");
    };

    const handleTemplateSave = async (
        values: IEmailTemplate
    ): Promise<void> => {
        try {
            if (identifier === "create") {
                await createNewTemplate(values);
            } else if (identifier && !isNaN(Number(identifier))) {
                await updateExistingTemplate(Number(identifier), values);
            } else {
                console.error("Invalid identifier:", identifier);
                Message.error(
                    "Failed to save template due to invalid identifier."
                );
                return;
            }
            console.log("Template saved successfully!");
        } catch (error) {
            console.error("Error saving template:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            Message.error("Error saving template: " + errorMessage);
        }
    };

    // Apply theme from URL parameter
    useEffect(() => {
        if (theme === "dark") {
            document.body.setAttribute("arco-theme", "dark");
        } else {
            document.body.removeAttribute("arco-theme");
        }
    }, [theme]);

    // Initialize template based on URL identifier
    useEffect(() => {
        if (identifier === "create") {
            loadNewTemplate();
        } else if (identifier && !isNaN(Number(identifier))) {
            loadExistingTemplate(Number(identifier));
        }
    }, [identifier]); // Remove payloadSdk dependency to avoid useCallback complexity

    return {
        currentTemplate: currentTemplate!,
        hasUnsavedChanges,
        isTemplateModalVisible,
        isSmallScreen,
        handleTemplateSelection,
        openTemplateModal,
        closeTemplateModal,
        handleTemplateSave,
        theme: theme!,
    };
};
