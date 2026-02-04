import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*",
      },
      {
        source: "/login",
        destination: "http://localhost:8080/login",
      },
      {
        source: "/logout",
        destination: "http://localhost:8080/logout",
      },
      {
        source: "/ws/:path*",
        destination: "http://localhost:8080/ws/:path*",
      }
    ];
  },
};

export default nextConfig;
