import type { NextConfig } from "next";
const path = require('path');
const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {

  //output: "export",  // Uncomment the following line only for building purposes. By default, this line should remain commented out.
  trailingSlash: false,
  //basePath: isProd ? "/tailwind/app-router/mamix-ts/preview" : undefined,
  //assetPrefix: isProd ? "/tailwind/app-router/mamix-ts/preview" : undefined,
  //images: {
  //  loader: "imgix",
  //  path: "/",
  //},
  typescript: {
    ignoreBuildErrors: true,
  },
   eslint: {
    ignoreDuringBuilds: true, // Build sırasında ESLint hatalarını yok say
  },
  images: {
    unoptimized: true,
      path: "/",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'public/assets/scss')],
    silenceDeprecations: ['legacy-js-api'],
    quietDeps: true,
  },
  reactStrictMode: false,

    webpack(config, { isServer }) {
    // Webpack cache'i devre dışı bırakıyoruz
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
