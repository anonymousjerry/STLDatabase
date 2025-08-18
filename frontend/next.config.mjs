/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
          // {
          //   protocol: 'https',
          //   hostname: 'media.printables.com',
          //   port: "",
          //   pathname: "/**"
          // },
          {
            protocol: 'https',
            hostname: 'img.3ddatabase.com',
            port: "",
            pathname: '/**'
          },
        ],
      },
};

export default nextConfig;
