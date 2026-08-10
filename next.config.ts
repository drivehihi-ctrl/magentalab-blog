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
        source: "/en/posts/pet_food_laws_nfe_calculator-en",
        destination: "/en/posts/cat_struvite_oxalate_stones-en",
        permanent: true,
      },
      {
        source: "/patella",
        destination: "/patella-diagnoser",
        permanent: true,
      },
      {
        source: "/Petcareexpenses",
        destination: "/petcare-expenses-calculator",
        permanent: true,
      },
      {
        source: "/FIC",
        destination: "/fic-diagnoser",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

