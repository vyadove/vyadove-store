"use client";

import React, { useState } from "react";
import { Button, TextInput } from "@payloadcms/ui";
import { Copy, Check } from "lucide-react";
import "./CopyableInput.scss";

interface CopyableInputProps {
    value: string;
    className?: string;
    copyLabel?: string;
}

export const CopyableInput: React.FC<CopyableInputProps> = ({
    value,
    className,
    copyLabel = "Copy",
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={`copyable-input ${className || ""}`}>
            <TextInput value={value} readOnly path="copyableInput" />
            <Button
                buttonStyle="secondary"
                className="copy-button"
                onClick={handleCopy}
                aria-label={copyLabel}
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
        </div>
    );
};
