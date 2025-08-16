import { IEmailTemplate } from "easy-email-editor";

// Template data structure
export interface TemplateData {
    id: string;
    name: string;
    thumbnail: string;
    template: {
        content: any;
        thumbnail?: string;
    };
}

// URL parameters interface
export interface UrlParams {
    identifier: string | null;
    token: string | null;
    theme: string | null;
}

// Component props interfaces
export interface EditorToolbarProps {
    onOpenTemplateModal: () => void;
    onSaveTemplate: () => void;
    hasUnsavedChanges: boolean;
    theme: string;
}

export interface TemplateSelectionModalProps {
    visible: boolean;
    onCancel: () => void;
    onSelectTemplate: (template: TemplateData) => void;
}

export interface TemplateCardProps {
    template: TemplateData;
    onSelect: () => void;
}

// Hook return types
export interface UseEmailEditorReturn {
    currentTemplate: IEmailTemplate | null;
    hasUnsavedChanges: boolean;
    isTemplateModalVisible: boolean;
    isSmallScreen: boolean;
    handleTemplateSelection: (template: TemplateData) => void;
    openTemplateModal: () => void;
    closeTemplateModal: () => void;
    handleTemplateSave: (values: IEmailTemplate) => Promise<void>;
    theme: string;
}

// Export commonly used types from easy-email
export type { IEmailTemplate } from "easy-email-editor";
