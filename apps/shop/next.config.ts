import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "next.medusajs.com",
            "medusa-server-testing.s3.us-east-1.amazonaws.com",
            "cf.cjdropshipping.com",
            "cbu01.alicdn.com",
            "oss-cf.cjdropshipping.com",
            "pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev",
            "images.unsplash.com",
            "localhost",
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
