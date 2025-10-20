import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "next.medusajs.com",
            "plus.unsplash.com",
            "medusa-server-testing.s3.us-east-1.amazonaws.com",
            "cf.cjdropshipping.com",
            "cbu01.alicdn.com",
            "oss-cf.cjdropshipping.com",
            "pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev",
            "localhost",
        ],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = [
                ...(config.externals || []),
                "bufferutil",
                "utf-8-validate",
            ];
        }
        return config;
    },
};

export default withPayload(nextConfig);
