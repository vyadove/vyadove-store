/** @type {import('next').NextConfig} */
// const isDev = process.env.NODE_ENV === "development";
// const rewrites = isDev
//     ? {
//           rewrites: [
//               {
//                   source: "/api/:path*",
//                   destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`,
//               },
//           ],
//       }
//     : undefined;
const nextConfig = {
    output: "export",
    transpilePackages: ["@arco-design/web-react"],

    // async rewrites() {
    //     return [
    //         {
    //             source: "/api/:path*",
    //             destination: `http://localhost:3000/:path*`,
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
