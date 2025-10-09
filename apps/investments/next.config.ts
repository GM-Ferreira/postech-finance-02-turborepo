import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";

    return [
      {
        source: "/home/:path*",
        destination: `${homeUrl}/:path*`,
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
