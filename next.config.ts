import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "myanimelist.cdn-dena.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "myanimelist.net",
        pathname: "/images/**",
      },
    ],
  },

  // Turbopack is the default bundler in Next.js 16.
  // No extra config needed — it just works.

  // React Compiler disabled - requires babel-plugin-react-compiler
  // reactCompiler: true,
};

export default nextConfig;
