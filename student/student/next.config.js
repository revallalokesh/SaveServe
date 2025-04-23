/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT || 3000
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 