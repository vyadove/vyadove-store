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
			{ hostname: "images.unsplash.com" },
			{ hostname: "plus.unsplash.com" },
			{ hostname: "d1wqzb5bdbcre6.cloudfront.net" },
			{ hostname: "*.blob.vercel-storage.com" },
		],
		// formats: ["image/avif", "image/webp"],
	},
	transpilePackages: ["commerce-kit"],
	experimental: {
		esmExternals: true,
		scrollRestoration: true,
		ppr: false,
		reactCompiler: true,
		inlineCss: true,
	},
};

export default nextConfig;
