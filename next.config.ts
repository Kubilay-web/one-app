import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // `output` ile ilgili ayar, yalnızca statik dışa aktarma yapılırken kullanılmalıdır.
  // output: "export", // Bu satır sadece build işlemi için gerekli. Yayınlama sırasında aktif edilmelidir.

  trailingSlash: false,

  // Base path ve assetPrefix ayarları, prod ortamında aktif edilebilir.
  // basePath: isProd ? "/tailwind/app-router/mamix-ts/preview" : undefined,
  // assetPrefix: isProd ? "/tailwind/app-router/mamix-ts/preview" : undefined,

  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını build sırasında görmezden gel
  },

  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını build sırasında görmezden gel
  },

  // images: {
  //   unoptimized: true, // Resimlerin optimize edilmemesi gerektiğini belirtiyor
  //   path: "/",
  // },

  sassOptions: {
    includePaths: [path.join(__dirname, "public/assets/scss")], // Sass dosyalarını dahil etme
    silenceDeprecations: ["legacy-js-api"], // Eski API uyarılarını susturma
    quietDeps: true, // Bağımlılık uyarılarını susturma
  },

  reactStrictMode: false, // React Strict Mode'u devre dışı bırak

  webpack(config, { isServer }) {
    if (!isServer) {
      config.cache = false; // Webpack cache'i devre dışı bırak
    }
    return config;
  },

  rewrites: async () => {
    return [
      {
        source: "/social/hashtag/:tag",
        destination: "/social/search?q=%23:tag", // Hashtag yönlendirmesi
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sb52wuzhjx.ufs.sh",
        pathname: `/f/*`,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
