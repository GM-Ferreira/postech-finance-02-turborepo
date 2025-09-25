import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/cards',
  async rewrites() {
    return [
      {
        source: '/home/:path*',
        destination: 'http://localhost:3000/:path*',
      },
      {
        source: '/investments/:path*',
        destination: 'http://localhost:3000/investments/:path*',
      },
    ]
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
