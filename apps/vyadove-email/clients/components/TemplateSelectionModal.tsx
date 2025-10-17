import React from "react";
import { Modal, Grid } from "@arco-design/web-react";
import { TemplateSelectionModalProps } from "../types";
import { AVAILABLE_TEMPLATES, TEMPLATE_MODAL_CONFIG } from "../constants";
import { TemplateCard } from "./TemplateCard";

/**
 * Modal component for template selection with grid layout
 */
export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
    visible,
    onCancel,
    onSelectTemplate,
}) => (
    <Modal
        title={TEMPLATE_MODAL_CONFIG.title}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        style={{ 
            width: TEMPLATE_MODAL_CONFIG.width, 
            maxWidth: TEMPLATE_MODAL_CONFIG.maxWidth 
        }}
    >
        <div
            style={{
                maxHeight: "70vh",
                overflow: "auto",
                padding: "20px 0",
            }}
        >
            <Grid.Row gutter={[16, 16]}>
                {AVAILABLE_TEMPLATES.map((template) => (
                    <Grid.Col key={template.id} xs={12} sm={8} md={6} lg={4} xl={4}>
                        <TemplateCard
                            template={template}
                            onSelect={() => onSelectTemplate(template)}
                        />
                    </Grid.Col>
                ))}
            </Grid.Row>
        </div>
    </Modal>
);