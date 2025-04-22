import { CollectionConfig } from "payload";
import { groups } from "./groups";

export const Locations: CollectionConfig = {
    slug: "locations",
    admin: {
        group: groups.settings,
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            label: "Location Name",
            type: "text",
            required: true,
        },
        {
            name: "address",
            label: "Address",
            type: "textarea",
            required: true,
        },
        {
            name: "coordinates",
            label: "Coordinates",
            type: "point",
        },
        {
            name: "contactPhone",
            label: "Contact Phone",
            type: "text",
        },
        {
            name: "hours",
            label: "Opening Hours",
            type: "textarea",
            admin: {
                description: "e.g., Mon-Fri: 9am - 6pm",
            },
        },
        {
            name: "enabled",
            label: "Enabled",
            type: "checkbox",
            defaultValue: true,
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "isPickupLocation",
            label: "Available for Pickup?",
            type: "checkbox",
            defaultValue: false,
            admin: {
                position: "sidebar",
            },
        },
    ],
};
