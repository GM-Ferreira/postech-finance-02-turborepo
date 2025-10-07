import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const investmentsInternalUrl =
      process.env.NODE_ENV === "production"
        ? "https://bytebank-investments.vercel.app"
        : "http://localhost:3001";

    return [
      {
        source: "/investments/:path*",
        destination: `${investmentsInternalUrl}/investments/:path*`,
      },
      {
        source: "/investments",
        destination: `${investmentsInternalUrl}/investments`,
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
  transpilePackages: ["@repo/api", "@repo/ui"],
};

export default nextConfig;
