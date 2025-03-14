import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "next.medusajs.com",
            "medusa-server-testing.s3.us-east-1.amazonaws.com",
            "cf.cjdropshipping.com",
            "cbu01.alicdn.com",
            "oss-cf.cjdropshipping.com",
        ],
    },
};

export default withPayload(nextConfig);
