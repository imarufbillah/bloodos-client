import type { NextConfig } from "next";

const rawBackendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

// Normalize: remove trailing slashes and trailing /api to avoid duplicate /api/api
const cleanUrl = rawBackendUrl.replace(/\/+$/, "");
const BACKEND_URL = cleanUrl.endsWith("/api")
  ? cleanUrl.slice(0, -4)
  : cleanUrl;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "***" }],
    qualities: [75, 90, 95, 100],
  },

  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
