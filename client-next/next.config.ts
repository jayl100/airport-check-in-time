import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: [],
    output: 'standalone', // Render 호환을 위한 설정
  };

  module.exports = nextConfig;
