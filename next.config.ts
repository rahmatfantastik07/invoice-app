/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // aman untuk vercel + base64 image
  },
};

module.exports = nextConfig;