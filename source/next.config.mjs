/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  async rewrites() {
    return [
    {
        "source": "/saiyam-jenny.invitationmedia.in/:path*",
        "destination": "/_mirror/saiyam-jenny.invitationmedia.in/:path*"
    },
    {
        "source": "/fonts.googleapis.com/:path*",
        "destination": "/_mirror/fonts.googleapis.com/:path*"
    },
    {
        "source": "/fonts.gstatic.com/:path*",
        "destination": "/_mirror/fonts.gstatic.com/:path*"
    },
    {
        "source": "/_api_replay/:path*",
        "destination": "/_mirror/_api_replay/:path*"
    },
    {
        "source": "/_ws_replay/:path*",
        "destination": "/_mirror/_ws_replay/:path*"
    },
    {
        "source": "/_shim/:path*",
        "destination": "/_mirror/_shim/:path*"
    }
];
  },
};
export default nextConfig;
