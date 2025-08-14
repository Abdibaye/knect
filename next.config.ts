import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  images: {
    domains: [
      "lh3.googleusercontent.com",
      "knect.t3.storage.dev",
      "t3.storage.dev", // <-- add this line
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "knect.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;