/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Skeleton } from "@arco-design/web-react";
import { EmailEditor, EmailEditorProvider } from "easy-email-editor";
import { StandardLayout } from "easy-email-extensions";

// Styles
import "easy-email-editor/lib/style.css";
import "easy-email-extensions/lib/style.css";
import "@arco-themes/react-easy-email-theme/css/arco.css";
import "./editor.css";

// Local imports
import { EDITOR_CATEGORIES, EDITOR_CONFIG } from "./constants";
import { EditorToolbar, TemplateSelectionModal } from "./components";
import { useEmailEditor } from "./hooks";
import { checkForTemplateChanges } from "./utils";

/**
 * Main Email Editor Application Component
 *
 * Features:
 * - Template loading and saving
 * - Template selection modal
 * - Real-time change detection
 * - Responsive design
 * - Error handling
 */
export default function EmailEditorApp() {
    const {
        currentTemplate,
        hasUnsavedChanges,
        isTemplateModalVisible,
        isSmallScreen,
        handleTemplateSelection,
        openTemplateModal,
        closeTemplateModal,
        handleTemplateSave,
        theme,
    } = useEmailEditor();

    console.log("Editor app rendered with template:", currentTemplate);

    // Early return if template is not loaded
    if (!currentTemplate) {
        return <Skeleton />;
    }

    return (
        <EmailEditorProvider
            data={currentTemplate}
            height={EDITOR_CONFIG.height}
            autoComplete={EDITOR_CONFIG.autoComplete}
            dashed={EDITOR_CONFIG.dashed}
            onSubmit={handleTemplateSave}
        >
            {({ values }, { submit }) => {
                // Update unsaved changes state based on current values
                const hasChanges = checkForTemplateChanges(
                    values,
                    currentTemplate
                );

                return (
                    <>
                        <EditorToolbar
                            theme={theme}
                            onOpenTemplateModal={openTemplateModal}
                            onSaveTemplate={submit}
                            hasUnsavedChanges={hasChanges}
                        />

                        <TemplateSelectionModal
                            visible={isTemplateModalVisible}
                            onCancel={closeTemplateModal}
                            onSelectTemplate={handleTemplateSelection}
                        />

                        <StandardLayout
                            compact={!isSmallScreen}
                            showSourceCode={true}
                            categories={EDITOR_CATEGORIES}
                        >
                            <EmailEditor />
                        </StandardLayout>
                    </>
                );
            }}
        </EmailEditorProvider>
    );
}
