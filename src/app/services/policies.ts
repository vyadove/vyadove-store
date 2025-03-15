import type { BasePayload } from "payload";

const policiesList = [
    {
        title: "Privacy Policy",
        handle: "privacy-policy",
    },
    {
        title: "Terms of Service",
        handle: "terms-of-service",
    },
    {
        title: "Shipping Policy",
        handle: "shipping-policy",
    },
    {
        title: "Returns Policy",
        handle: "returns-policy",
    },
];

const createIfNotExists = async (payload: BasePayload, policy: any) => {
    const count = await payload.count({
        collection: "policies",
        where: {
            handle: {
                equals: policy.handle,
            },
        },
    });

    if (count.totalDocs === 0) {
        await payload.create({
            collection: "policies",
            data: policy,
        });
    }
};

export const populatePolicies = async (payload: BasePayload) => {
    for (const policy of policiesList) {
        await createIfNotExists(payload, policy);
    }
};
