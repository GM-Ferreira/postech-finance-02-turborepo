import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const cardsInternalUrl =
      process.env.NODE_ENV === "production"
        ? "https://bytebank-cards.vercel.app"
        : "http://localhost:3001";

    return [
      {
        source: "/cards/:path*",
        destination: `${cardsInternalUrl}/cards/:path*`,
      },
      {
        source: "/cards",
        destination: `${cardsInternalUrl}/cards`,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
