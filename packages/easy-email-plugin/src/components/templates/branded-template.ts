export const brandedTemplate = {
    subject: "{{store_name}} - Your Email Subject",
    subTitle: "Branded template with dynamic branding",
    content: {
        type: "page",
        data: {
            value: {
                breakpoint: "480px",
                headAttributes: "",
                "font-size": "15px",
                "line-height": "1.6",
                headStyles: [],
                fonts: [],
                responsive: true,
                "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
                "text-color": "#333333",
                "content-background-color": "#ffffff",
            },
        },
        attributes: {
            "background-color": "#f4f4f4",
            width: "600px",
        },
        children: [
            {
                type: "wrapper",
                data: { value: {} },
                attributes: {
                    padding: "20px 0",
                    "background-color": "#f4f4f4",
                },
                children: [
                    // Header with Logo
                    {
                        type: "section",
                        data: { value: { noWrap: false } },
                        attributes: {
                            padding: "20px 20px",
                            "background-color": "#ffffff",
                            "border-radius": "8px 8px 0 0",
                        },
                        children: [
                            {
                                type: "column",
                                data: { value: {} },
                                attributes: { padding: "0", width: "100%" },
                                children: [
                                    {
                                        type: "image",
                                        data: { value: {} },
                                        attributes: {
                                            src: "{{logo_url}}",
                                            alt: "{{store_name}}",
                                            height: "auto",
                                            width: "150px",
                                            padding: "0",
                                            align: "center",
                                        },
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    // Main Content Section
                    {
                        type: "section",
                        data: { value: { noWrap: false } },
                        attributes: {
                            padding: "30px 40px",
                            "background-color": "#ffffff",
                        },
                        children: [
                            {
                                type: "column",
                                data: { value: {} },
                                attributes: { padding: "0", width: "100%" },
                                children: [
                                    {
                                        type: "text",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "0 0 20px 0",
                                            align: "left",
                                            "font-size": "24px",
                                            "font-weight": "bold",
                                            color: "{{primary_color}}",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content:
                                                            "Hello {{user_name}},",
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        type: "text",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "0 0 20px 0",
                                            align: "left",
                                            "font-size": "15px",
                                            color: "#333333",
                                            "line-height": "1.8",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content:
                                                            "Your email content goes here. Edit this template to add your message.",
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        type: "button",
                                        data: { value: {} },
                                        attributes: {
                                            href: "#",
                                            padding: "20px 0",
                                            align: "center",
                                            "background-color":
                                                "{{primary_color}}",
                                            color: "#ffffff",
                                            "font-size": "16px",
                                            "font-weight": "bold",
                                            "border-radius": "6px",
                                            "inner-padding": "14px 30px",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content:
                                                            "Call to Action",
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    // Footer Section
                    {
                        type: "section",
                        data: { value: { noWrap: false } },
                        attributes: {
                            padding: "20px 20px",
                            "background-color": "#fafafa",
                            "border-radius": "0 0 8px 8px",
                        },
                        children: [
                            {
                                type: "column",
                                data: { value: {} },
                                attributes: { padding: "0", width: "100%" },
                                children: [
                                    // Social Links
                                    {
                                        type: "social",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "10px 0",
                                            align: "center",
                                            mode: "horizontal",
                                            "icon-size": "24px",
                                        },
                                        children: [
                                            {
                                                type: "social-element",
                                                data: { value: {} },
                                                attributes: {
                                                    src: "https://cdn.shopnex.ai/shopnex-assets/email-icons/facebook.png",
                                                    href: "{{facebook_url}}",
                                                    "icon-size": "24px",
                                                    padding: "0 8px",
                                                },
                                                children: [],
                                            },
                                            {
                                                type: "social-element",
                                                data: { value: {} },
                                                attributes: {
                                                    src: "https://cdn.shopnex.ai/shopnex-assets/email-icons/instagram.png",
                                                    href: "{{instagram_url}}",
                                                    "icon-size": "24px",
                                                    padding: "0 8px",
                                                },
                                                children: [],
                                            },
                                            {
                                                type: "social-element",
                                                data: { value: {} },
                                                attributes: {
                                                    src: "https://cdn.shopnex.ai/shopnex-assets/email-icons/twitter.png",
                                                    href: "{{twitter_url}}",
                                                    "icon-size": "24px",
                                                    padding: "0 8px",
                                                },
                                                children: [],
                                            },
                                        ],
                                    },
                                    // Address
                                    {
                                        type: "text",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "10px 0 5px 0",
                                            align: "center",
                                            "font-size": "12px",
                                            color: "{{accent_color}}",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content: "{{address}}",
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                    // Footer Text
                                    {
                                        type: "text",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "5px 0",
                                            align: "center",
                                            "font-size": "12px",
                                            color: "{{accent_color}}",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content:
                                                            "{{footer_text}}",
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                    // Unsubscribe Link
                                    {
                                        type: "text",
                                        data: { value: {} },
                                        attributes: {
                                            padding: "10px 0 0 0",
                                            align: "center",
                                            "font-size": "11px",
                                            color: "#999999",
                                        },
                                        children: [
                                            {
                                                type: "text",
                                                data: {
                                                    value: {
                                                        content:
                                                            '<a href="{{unsubscribe_url}}" style="color: #999999; text-decoration: underline;">Unsubscribe</a>',
                                                    },
                                                },
                                                attributes: {},
                                                children: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
