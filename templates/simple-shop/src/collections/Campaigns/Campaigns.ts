import { CollectionConfig } from "payload";
import { sendCampaignEmail } from "./hooks/send-campaign-email";
import { groups } from "../groups";
import { openEmailEndpoint } from "./endpoints/open-email";
import { admins } from "@/access/roles";

export const Campaigns: CollectionConfig = {
    slug: "campaigns",
    admin: {
        group: groups.campaigns,
        useAsTitle: "name",
    },
    access: {
        read: admins,
        update: admins,
        delete: admins,
        create: admins,
    },
    endpoints: [openEmailEndpoint],
    hooks: {
        afterChange: [sendCampaignEmail],
        afterRead: [
            async ({ doc, req }) => {
                if (
                    doc.emailTemplate &&
                    typeof doc.emailTemplate !== "object"
                ) {
                    const emailTemplateDoc = await req.payload.findByID({
                        collection: "email-templates",
                        id: doc.emailTemplate,
                        depth: 1,
                        req,
                    });
                    doc.emailTemplate = emailTemplateDoc;
                }

                if (doc.recipients && Array.isArray(doc.recipients)) {
                    const recipientsDocs = await Promise.all(
                        doc.recipients.map(async (userId: number) => {
                            if (typeof userId !== "object") {
                                return await req.payload.findByID({
                                    collection: "users",
                                    id: userId,
                                    depth: 1,
                                    req,
                                });
                            }
                            return userId;
                        })
                    );
                    doc.recipients = recipientsDocs;
                }

                return doc;
            },
        ],
    },
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "name",
                    type: "text",
                    required: true,
                },
                {
                    name: "type",
                    type: "select",
                    required: true,
                    options: [
                        { label: "Email", value: "email" },
                        { label: "SMS", value: "sms" },
                    ],
                    defaultValue: "email",
                },
            ],
        },

        {
            name: "status",
            type: "select",
            defaultValue: "draft",
            options: [
                { label: "Draft", value: "draft" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Sent", value: "sent" },
                { label: "Paused", value: "paused" },
            ],
            admin: { position: "sidebar" },
        },
        {
            name: "subject",
            type: "text",
            admin: {
                condition: (data) => data?.type === "email",
            },
        },
        {
            name: "emailTemplate",
            type: "relationship",
            relationTo: "email-templates",
            admin: {
                position: "sidebar",
                condition: (data) => data?.type === "email",
            },
        },
        {
            type: "group",
            name: "profile",
            admin: {
                position: "sidebar",
            },
            fields: [
                {
                    name: "from",
                    type: "text",
                },
                {
                    name: "replyTo",
                    type: "text",
                },
            ],
        },
        {
            name: "templateData",
            type: "json",
            admin: {
                description:
                    "Optional variables for template rendering. Here admin keys that you can use: name, picture, user, issuerName, scope, sub.",
            },
        },
        // TODO: uncomment when jobs are ready
        // {
        //     type: "row",
        //     fields: [
        //         {
        //             name: "startDate",
        //             type: "date",
        //             admin: { date: { pickerAppearance: "dayAndTime" } },
        //         },
        //         {
        //             name: "endDate",
        //             type: "date",
        //             admin: { date: { pickerAppearance: "dayAndTime" } },
        //         },
        //     ],
        // },
        {
            name: "recipients",
            type: "relationship",
            relationTo: "users",
            hasMany: true,
            admin: {
                description: "Select the users who will receive this campaign.",
            },
        },
        {
            name: "metrics",
            type: "group",
            admin: { readOnly: true },
            fields: [
                {
                    type: "row",
                    fields: [
                        { name: "sent", type: "number", defaultValue: 0 },
                        { name: "opened", type: "number", defaultValue: 0 },
                        { name: "clicked", type: "number", defaultValue: 0 },
                    ],
                },
            ],
        },
    ],
};
