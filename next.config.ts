import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",        // ← ✅ THIS enables .out/ static export
  trailingSlash: true
};

export default nextConfig;
