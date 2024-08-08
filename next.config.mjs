/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utmost-tortoise-88.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
