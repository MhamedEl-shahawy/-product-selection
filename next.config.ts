/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ignore ts issue at build time
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/your-cloud-name/**",
      },
    ],
  },
};

module.exports = nextConfig;
