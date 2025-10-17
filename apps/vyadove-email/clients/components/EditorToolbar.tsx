import React from "react";
import { Button, Space } from "@arco-design/web-react";
import { EditorToolbarProps } from "../types";

/**
 * Toolbar component with template selection and save functionality
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    onOpenTemplateModal,
    onSaveTemplate,
    hasUnsavedChanges,
    theme,
}) => (
    <Space
        align="end"
        style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "end",
            padding: 16,
            background: theme === "dark" ? "var(--color-bg-2)" : "white",
        }}
    >
        <Button type="outline" onClick={onOpenTemplateModal} size="large">
            Choose Template
        </Button>
        <Button
            type="primary"
            onClick={onSaveTemplate}
            size="large"
            disabled={!hasUnsavedChanges}
        >
            Save Template
        </Button>
    </Space>
);
