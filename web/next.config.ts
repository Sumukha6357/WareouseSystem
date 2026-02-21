import type { NextConfig } from "next";

const backendBaseUrl = process.env.BACKEND_BASE_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/:path*`,
      },
      {
        source: "/login",
        destination: `${backendBaseUrl}/login`,
      },
      {
        source: "/logout",
        destination: `${backendBaseUrl}/logout`,
      },
      {
        source: "/ws/:path*",
        destination: `${backendBaseUrl}/ws/:path*`,
      }
    ];
  },
};

export default nextConfig;
