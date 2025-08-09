"use client";

import { Button, FieldLabel, TextareaInput, useField } from "@payloadcms/ui";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./Tiptap.scss";
import { CodeIcon, ImageIcon, LinkIcon } from "lucide-react";
import { TextField } from "payload";
import { useState } from "react";
import pretty from "pretty";

const Tiptap = ({ field }: any) => {
    const { value, setValue } = useField<TextField>({ path: field.name });
    const [isHtmlPreview, setIsHtmlPreview] = useState(false);
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML());
        },
    });

    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt("Enter URL");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL");
        if (url) {
            // @ts-ignore
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="tiptap-container">
            <FieldLabel label={field.label} />
            <div className="tiptap-editor">
                {/* Toolbar */}
                <div className="tiptap-toolbar">
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        className={editor.isActive("bold") ? "is-active" : ""}
                    >
                        <b>B</b>
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        className={editor.isActive("italic") ? "is-active" : ""}
                    >
                        <i>I</i>
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        className={
                            editor.isActive("underline") ? "is-active" : ""
                        }
                    >
                        U
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        className={
                            editor.isActive("heading", { level: 2 })
                                ? "is-active"
                                : ""
                        }
                    >
                        H2
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className={
                            editor.isActive("bulletList") ? "is-active" : ""
                        }
                    >
                        • List
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        className={
                            editor.isActive("orderedList") ? "is-active" : ""
                        }
                    >
                        1. List
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={setLink}
                        className={editor.isActive("link") ? "is-active" : ""}
                    >
                        <LinkIcon size={16} />
                    </Button>
                    <Button buttonStyle="pill" onClick={addImage}>
                        <ImageIcon size={16} />
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        className={
                            editor.isActive("blockquote") ? "is-active" : ""
                        }
                    >
                        &quot;
                    </Button>
                    <Button
                        buttonStyle="pill"
                        onClick={() => setIsHtmlPreview((prev) => !prev)}
                        className={editor.isActive("code") ? "is-active" : ""}
                    >
                        <CodeIcon size={16} />
                    </Button>
                </div>

                {/* Editor */}
                {isHtmlPreview ? (
                    <TextareaInput
                        className="textarea-input"
                        path={field.name}
                        onChange={setValue}
                        value={pretty(value as unknown as string, {
                            ocd: true,
                        })}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>
        </div>
    );
};

export default Tiptap;
