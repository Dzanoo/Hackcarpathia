import type { NextConfig } from "next";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["172.16.16.6", "10.109.139.180"],
};

module.exports = nextConfig;
