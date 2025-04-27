"use client";
import builder, { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import DefaultErrorPage from "next/error";

interface BuilderPageProps {
    content: any;
}

export function RenderBuilderContent({ content }: BuilderPageProps) {
    builder.init("954fa25aa9f845c0ad6a82b2b52c6abd");
    const isPreviewing = useIsPreviewing();

    if (content || isPreviewing) {
        return <BuilderComponent content={content} model="page" />;
    }

    return <DefaultErrorPage statusCode={404} />;
}
