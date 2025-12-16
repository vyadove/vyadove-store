import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // eslint: {
  // 	ignoreDuringBuilds: true,
  // },
  // output: process.env.DOCKER ? "standalone" : undefined,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      { hostname: "files.stripe.com" },
      { hostname: "localhost" },
      { hostname: "admin.vyadove.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "d1wqzb5bdbcre6.cloudfront.net" },
      { hostname: "*.blob.vercel-storage.com" },
      { hostname: "cf.cjdropshipping.com" },
      { hostname: "cbu01.alicdn.com" },
      { hostname: "oss-cf.cjdropshipping.com" },
      { hostname: "pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev" },
    ],
  },
  transpilePackages: ["commerce-kit"],
  experimental: {
    esmExternals: true,
    scrollRestoration: true,
    ppr: false,
    reactCompiler: true,
    inlineCss: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/revalidate/:path*",
        destination: "/api/revalidate/:path*",
      },
      { source: "/api/revalidate", destination: "/api/revalidate" },
      { source: "/api/og/:path*", destination: "/api/og/:path*" },
      { source: "/api/og", destination: "/api/og" },

      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*`,
        // destination: `http://localhost:3000/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
