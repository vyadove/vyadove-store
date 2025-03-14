type TextNode = {
    detail: number;
    format: number;
    mode: string;
    style: string;
    text: string;
    type: "text";
    version: number;
};

type ImageNode = {
    type: "image";
    version: number;
    src: string;
    alt: string;
};

type Paragraph = {
    children: (TextNode | ImageNode)[];
    direction: string;
    format: string;
    indent: number;
    type: "paragraph";
    version: number;
    textFormat: number;
    textStyle: string;
};

type JsonStructure = {
    root: {
        children: Paragraph[];
        direction: string;
        format: string;
        indent: number;
        type: "root";
        version: number;
    };
};

export function convertHtmlToJson(html: string): JsonStructure {
    return {
        root: {
            children: [
                {
                    children: [
                        {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: html,
                            type: "text",
                            version: 1,
                        },
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                    textFormat: 0,
                    textStyle: "",
                },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
        },
    };
}
