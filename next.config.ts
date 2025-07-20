import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // ← ✅ THIS enables .out/ static export
  trailingSlash: true,

  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
