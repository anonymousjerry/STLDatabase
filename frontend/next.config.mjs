/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
        ],
        domains: ["media.printables.com"]
      },
      experimental: {
        images: {
          timeout: 10000, // 10 seconds
        },
      },
};

export default nextConfig;
