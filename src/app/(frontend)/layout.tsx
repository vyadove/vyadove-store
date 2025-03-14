import type React from "react";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
        <html lang="en" data-mode="light">
            <body>
                <main className="relative">{children}</main>
            </body>
        </html>
    );
}
