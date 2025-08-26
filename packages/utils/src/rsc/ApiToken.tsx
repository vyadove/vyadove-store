"use client";

import React from "react";
import { PasswordField } from "@payloadcms/ui";

interface ApiTokenProps {
    path: string;
    field: any;
}

export function ApiToken({ path, field }: ApiTokenProps) {
    return (
        <PasswordField
            autoComplete="new-password"
            field={field}
            indexPath=""
            parentPath=""
            parentSchemaPath=""
            path={path}
            schemaPath="password"
        />
    );
}
