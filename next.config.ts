import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  images: {
    // Posters are requested at quality={100}; Next 16 silently falls back to 75
    // for any quality not listed here.
    qualities: [75, 100],
  },
};

export default nextConfig;
