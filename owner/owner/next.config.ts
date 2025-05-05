import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://save-serve-server.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
