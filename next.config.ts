import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "***" }],
    qualities: [75, 90, 95, 100],
  },
  
  // Proxy API requests to Express backend
  // This allows cookies to work since all requests appear to come from localhost:3000
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
