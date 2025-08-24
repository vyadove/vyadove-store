import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "next.medusajs.com",
            },
            {
                protocol: "https",
                hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "cf.cjdropshipping.com",
            },
            {
                protocol: "https",
                hostname: "cbu01.alicdn.com",
            },
            {
                protocol: "https",
                hostname: "oss-cf.cjdropshipping.com",
            },
            {
                protocol: "https",
                hostname: "pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "cdn.shopnex.ai",
                pathname: "/**",
            },
        ],
        unoptimized: true,
    },
    // skipTrailingSlashRedirect: true,
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
