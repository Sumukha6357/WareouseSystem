import type { NextConfig } from "next";

const backendBaseUrl = process.env.BACKEND_BASE_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
      {
        source: "/login",
        destination: `${backendBaseUrl}/api/login`,
      },
      {
        source: "/logout",
        destination: `${backendBaseUrl}/api/logout`,
      },
      {
        source: "/ws/:path*",
        destination: `${backendBaseUrl}/api/ws/:path*`,
      }
    ];
  },
};

export default nextConfig;
