import React from "react";
import "./ThemeList.scss";
import "./ThemeList.scss";
import Image from "next/image";
import { CopyableInput } from "./CopyableInput";
import { ServerProps } from "payload";

const themes = [
    {
        id: 1,
        name: "Next.js",
        dateAdded: "Added by Shopnex",
        version: "15.3.0",
        availableUpdate: false,
        preview: "/custom-storefront.png",
    },
];

const ThemeList = ({ user }: ServerProps) => {
    const command = `npx create-shopnex-app my-store --only-storefront -e NEXT_PUBLIC_SERVER_URL=https://app.shopnex.ai`;

    return (
        <div className="theme-list">
            {themes.map((theme) => (
                <div className="theme-card" key={theme.id}>
                    <Image
                        src={theme.preview}
                        alt={theme.name}
                        className="theme-preview"
                        width={500}
                        height={500}
                    />
                    <div className="theme-info">
                        <h2>{theme.name}</h2>
                        <p className="date">{theme.dateAdded}</p>
                    </div>
                    <CopyableInput
                        value={command}
                        className="theme-actions"
                        copyLabel="Copy install command"
                    />
                </div>
            ))}
        </div>
    );
};

export default ThemeList;
