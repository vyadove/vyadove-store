import {
    JSXConvertersFunction,
    RichText,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import Link from "next/link";

type StyledRichTextProps = {
    data?: SerializedEditorState | null;
    properties?: {
        [key: string]: string | number;
    }
};

const createJSXConverters =
    (
        properties: StyledRichTextProps["properties"]
    ): JSXConvertersFunction<DefaultNodeTypes> =>
    ({ defaultConverters }) => ({
        ...defaultConverters,
        paragraph: ({ node, nodesToJSX }) => {
            let children = nodesToJSX({ nodes: node.children });

            if (properties) {
                children = children.map((child) => {
                    if (typeof child === "string") {
                        return Object.entries(properties).reduce(
                            (updatedChild, [key, value]) =>
                                updatedChild.replace(
                                    new RegExp(`{{${key}}}`, "g"),
                                    value.toString()
                                ),
                            child
                        );
                    }
                    return child;
                });
            }

            return <p>{children.length ? children : <br />}</p>;
        },
        link: ({ node, nodesToJSX }) => {
            if (node.fields?.linkType === 'custom') {
                return (
                    <Link
                        href={`${node.fields.url}`}
                        className="hover:underline"
                    >
                        {nodesToJSX({ nodes: node.children })}
                    </Link>
                );
            }
        },
    });

export const StyledRichText = ({ data, properties }: StyledRichTextProps) => {
    if (!data) {
        return null;
    }

    return (
        <RichText data={data} converters={createJSXConverters(properties)} />
    );
};
