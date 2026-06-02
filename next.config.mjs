/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://habit-tracker-t0o0.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
