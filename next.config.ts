import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "magentalab.mycafe24.com",
      },
      {
        protocol: "https",
        hostname: "magentalab.mycafe24.com",
      },
    ],
  },
};

export default nextConfig;
