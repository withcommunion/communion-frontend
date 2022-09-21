/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['communion-nft.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
