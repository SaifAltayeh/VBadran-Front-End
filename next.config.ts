import type { NextConfig } from "next";

const panel = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:3011";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: `${panel}/admin`, permanent: false },
      { source: "/admin/:path*", destination: `${panel}/admin/:path*`, permanent: false },
    ];
  },
};

export default nextConfig;
