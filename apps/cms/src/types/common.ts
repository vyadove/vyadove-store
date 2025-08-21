import type { Block, Field, CollectionConfig } from "payload";

export interface BaseBlock extends Block {
    slug: string;
    fields: Field[];
}

export interface PageCollectionConfig extends CollectionConfig {
    slug: string;
    labels: {
        singular: string;
        plural: string;
    };
}

export interface MediaRelationField {
    name: string;
    type: "upload";
    relationTo: "media";
    hasMany?: boolean;
    required?: boolean;
}

export interface TextFieldConfig {
    name: string;
    type: "text";
    label?: string;
    required?: boolean;
}

export interface RichTextFieldConfig {
    name: string;
    type: "richText";
    required?: boolean;
}

export interface BlocksFieldConfig {
    name: string;
    type: "blocks";
    blocks: Block[];
    maxRows?: number;
    required?: boolean;
}