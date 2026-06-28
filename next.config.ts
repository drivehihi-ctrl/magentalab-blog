import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "magentalab.mycafe24.com",
      },
      {
        protocol: "https",
        hostname: "magentalab.mycafe24.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

