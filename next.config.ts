import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists in the home dir).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
