import type { Metadata } from "next";

import "./globals.css";

import type React from "react";

export const metadata: Metadata = {
    description: "A blank template using Payload in a Next.js app.",
    title: "Payload Blank Template",
};

export default function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props;

    return (
        <html data-mode="light" lang="en">
            <body>
                <main className="relative">{children}</main>
            </body>
        </html>
    );
}
