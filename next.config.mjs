/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fakestoreapi.com', // Single hostname string
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos', // Single hostname string
        },
        {
            protocol: 'https',
            hostname: 'images.pexels.com', // Single hostname string
          },
      ],
    },
  };
  
  export default nextConfig;
  